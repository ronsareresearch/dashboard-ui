"use client";

import { AI_MODEL_SERVER, EMAIL_SERVER } from "@/app/constant/constant";
import { User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function GmailInbox() {

    const [emailAccounts, setEmailAccounts] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [emails, setEmails] = useState([]);
    const [status, setStatus] = useState("Loading inbox…");
    const [expandedEmail, setExpandedEmail] = useState(null);
    const [emailDetails, setEmailDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [page, setPage] = useState(1);
    const [totalEmails, setTotalEmails] = useState(0);
    const pageSize = 10;

    const [rightPanelOpen, setRightPanelOpen] = useState(false);
    const [summaryData, setSummaryData] = useState(null);
    const [replyTemplate, setReplyTemplate] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [replyText, setReplyText] = useState("");
    console.log('emails__' , emails)
    // Load user and accounts
    const loadUserAndAccounts = async () => {
        try {
            const res = await fetch(`${EMAIL_SERVER}/me`, { credentials: "include" });

            if (res.status === 401) {
                setStatus("Not authenticated. Please login.");
                return;
            }

            const data = await res.json();
            const accounts = data.google_accounts.map((acc) => acc.email);

            setEmailAccounts(accounts);
            if (!selectedEmail && accounts.length > 0) {
                setSelectedEmail(accounts[0]);
            }
            setStatus("Inbox ready");
        } catch (err) {
            console.error(err);
            setStatus("Error loading user info");
        }
    };

    // Load emails
    const loadEmails = async (email, pageNum = 1) => {
        if (!email) return;
        setStatus("Loading inbox…");

        try {
            const res = await fetch(
                `${EMAIL_SERVER}/emails?google_account_email=${encodeURIComponent(
                    email
                )}&page=${pageNum}&page_size=${pageSize}`,
                { credentials: "include" }
            );

            const data = await res.json();
            setEmails(data.emails || []);
            setTotalEmails(data.pagination?.total || 0);
            setStatus(`Inbox loaded. Page ${pageNum}`);
        } catch (err) {
            console.error(err);
            setStatus("Failed to load inbox");
        }
    };

    useEffect(() => {
        loadUserAndAccounts();
    }, []);

    useEffect(() => {
        if (selectedEmail) {
            loadEmails(selectedEmail, page);
        }
    }, [selectedEmail, page]);

    const addEmail = () => {
        window.location.href = `${EMAIL_SERVER}/auth/google`;
    };

    // const refreshInbox = () => loadEmails(selectedEmail, page);

    // Fetch Email Details// Fetch Email Details
    const fetchEmailDetails = async (messageId) => {
        setLoadingDetails((prev) => ({ ...prev, [messageId]: true }));

        try {
            const res = await fetch(`${EMAIL_SERVER}/email/details/${messageId}`, {
                credentials: "include",
            });
            const data = await res.json();

            setEmailDetails((prev) => ({ ...prev, [messageId]: data }));
            setExpandedEmail(messageId);

            // Determine content source for AI
            let fileUrl = data.attachments?.[0]?.storage_url || null;
            let contextText = "";

            if (fileUrl) {
                // If attachment exists, we use fileUrl
                fetchAISummary(fileUrl, null); // Pass fileUrl
            } else {
                // No attachment: use email content (body or snippet)
                contextText =
                    data.body?.text ||
                    data.body?.html?.replace(/<[^>]+>/g, "") || // remove HTML tags if present
                    data.snippet ||
                    `${data.subject} from ${data.from_email}`;

                fetchAISummary(null, contextText); // Pass context text
            }

            // Open Right panel at 50%
            setRightPanelOpen(true);

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingDetails((prev) => ({ ...prev, [messageId]: false }));
        }
    };

    // Fetch AI Summary & Generate Reply
    // Accept either fileUrl OR contextText
    const fetchAISummary = async (fileUrl = null, contextText = null) => {
        setLoadingAI(true);

        try {
            let summary = "";

            if (fileUrl) {
                // 1️⃣ Call /summarize/url
                const summarizeRes = await fetch(`${AI_MODEL_SERVER}/gemini/summarize/url`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ file_url: fileUrl }),
                });
                const summarizeData = await summarizeRes.json();
                summary = summarizeData.summary;
            } else if (contextText) {
                // Use contextText directly as summary if no file
                summary = contextText;
            }

            setSummaryData(summary);

            // 2️⃣ Call /generate-response
            const responseRes = await fetch(`${AI_MODEL_SERVER}/gemini/generate-response`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    summary,
                    context: "Provide a professional email reply based on the summary",
                }),
            });
            const responseData = await responseRes.json();
            setReplyTemplate(responseData.reply_template || responseData.response || "");
            setReplyText(responseData.reply_template || responseData.response || "");


        } catch (err) {
            console.error("AI summary/final response error:", err);
            setSummaryData("Failed to generate summary.");
            setReplyTemplate("");
        } finally {
            setLoadingAI(false);
        }
    };



    const nextPage = () => {
        if (page * pageSize < totalEmails) setPage((prev) => prev + 1);
    };

    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

    async function refreshInbox(email) {
        const res = await fetch(`${EMAIL_SERVER}/email/sync-new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "API Error");
        }

        return await res.json();
    }


const wsRef = useRef(null);

    useEffect(() => {
        if (!selectedEmail) return;

        const WS_URL = `${EMAIL_SERVER.replace(/^https?/, 'wss')}/ws`;
        console.log("Connecting WS to:", WS_URL);

        wsRef.current = new WebSocket(`${WS_URL}?email=${selectedEmail}`);

        wsRef.current.onopen = () => console.log("🟢 WS Connected");
        wsRef.current.onclose = () => console.log("🔴 WS Disconnected");
        wsRef.current.onerror = (err) => console.error("⚠️ WS Error:", err);

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "inbox_update" && data.email === selectedEmail) {
                    setEmails((prev) => {
                        const existingIds = new Set(prev.map((e) => e.id));
                        const newEmails = data.messages
                            .filter((m) => !existingIds.has(m.id))
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // newest first
                        return [...newEmails, ...prev]; // prepend newest emails
                    });
                }
            } catch (err) {
                console.error("Failed to parse WS message:", err);
            }
        };

        return () => wsRef.current?.close();
    }, [selectedEmail]);



    // ---------------------------
    // UI
    // ---------------------------
    return (
        <div className="h-screen w-full flex bg-gray-800">

            {/* MAIN WRAPPER (Dynamic Split: 50% / 50%) */}
            <div className={`flex bg-white overflow-hidden w-full`}>

                {/* LEFT SIDE - Inbox (50% if rightPanelOpen else 100%) */}
                <div className={`${rightPanelOpen ? "w-[30%]" : "w-full"} h-screen flex flex-col transition-all duration-300`}>

                    {/* Header */}
                    <div className="p-6 shrink-0">
                        <h1 className="text-3xl font-bold">📨 Mail Inbox</h1>

                        <div className="flex flex-wrap space-x-2 mt-4 gap-2">
                            <select
                                className="border p-2 rounded"
                                value={selectedEmail || ""}
                                onChange={(e) => {
                                    setSelectedEmail(e.target.value);
                                    setPage(1);
                                }}
                            >
                                {emailAccounts.map((email) => (
                                    <option key={email} value={email}>
                                        {email}
                                    </option>
                                ))}
                            </select>

                            {/* <button
                                onClick={addEmail}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Add Email
                            </button> */}

                            <button
                                onClick={() => refreshInbox('freshertodayrecruiter@gmail.com')}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                                Refresh
                            </button>

                            <button
                                onClick={prevPage}
                                disabled={page === 1}
                                className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
                            >
                                Previous
                            </button>

                            <button
                                onClick={nextPage}
                                disabled={page * pageSize >= totalEmails}
                                className="px-3 py-1 bg-gray-300 text-black rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>

                        <div className="text-gray-500 mt-2">{status}</div>
                    </div>

                    {/* Email List */}
                    <div className="flex-1 overflow-y-auto py-6">
                        {emails.length === 0 && (
                            <div className="p-4 border rounded text-gray-500 bg-white">
                                No emails yet.
                            </div>
                        )}

                        {emails.map((mail) => {
                            const details = emailDetails[mail.id];
                            const isExpanded = expandedEmail === mail.id;
                            const isLoading = loadingDetails[mail.id];

                            return (
                                <div key={mail.id} className="px-6 py-4 border-t border-gray-300 bg-white">
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => fetchEmailDetails(mail.id)}
                                    >
                                        <div className="font-semibold flex items-center justify-start gap-2">
                                           <User2 /> {mail.subject || "(No Subject)"}
                                        </div>
                                        <div className="text-sm text-gray-600">{mail.from_email}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(mail.created_at).toLocaleString()}
                                        </div>
                                        <p className="text-sm mt-2">{mail.snippet}</p>

                                        {isLoading && (
                                            <div className="text-sm text-blue-500 mt-2">
                                                Loading details…
                                            </div>
                                        )}
                                    </div>

                                    {isExpanded && details && (
                                        <div className="mt-4 pt-4 border-t space-y-4">
                                            {/* Email Body */}
                                            {details.body?.html ? (
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: details.body.html }}
                                                />
                                            ) : details.body?.text ? (
                                                <div className="whitespace-pre-wrap">
                                                    {details.body.text}
                                                </div>
                                            ) : (
                                                <div className="text-gray-500">No content</div>
                                            )}

                                            {/* Attachments */}
                                            {details.attachments?.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold mb-2">📎 Attachments</h4>

                                                    <ul className="space-y-2">
                                                        {details.attachments.map((att) => (
                                                            <li
                                                                key={att.id}
                                                                className="p-2 border rounded bg-gray-50 flex justify-between items-center"
                                                            >
                                                                <div>
                                                                    <div className="font-medium">{att.filename}</div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {att.mime_type} — {(att.size / 1024).toFixed(1)} KB
                                                                    </div>
                                                                </div>

                                                                <a
                                                                    href={att.storage_url}
                                                                    target="_blank"
                                                                    className="px-3 py-1 bg-blue-600 text-white rounded"
                                                                >
                                                                    Download
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT PANEL (50% width only after clicking an email) */}
                {rightPanelOpen && (
                    <div className="w-[70%] border-l bg-white h-screen p-4 flex flex-col shadow-xl transition-all duration-300">

                        <h2 className="text-xl font-bold mb-4">AI Assistant</h2>

                        {/* Top 50%: SUMMARY */}
                        <div className="flex-1 border rounded-xl p-4 bg-gray-50 mb-2 overflow-y-auto">
                            <h3 className="font-semibold text-lg mb-2">📝 Summary</h3>

                            {loadingAI ? (
                                <div className="text-blue-500">Generating summary…</div>
                            ) : summaryData ? (
                                <p className="text-gray-700 whitespace-pre-line">{summaryData}</p>
                            ) : (
                                <p className="text-gray-400">No summary available</p>
                            )}
                        </div>

                        {/* Bottom 50%: REPLY TEMPLATE */}
                        <div className="flex-1 border rounded-xl p-4 bg-gray-50 overflow-y-auto">
                            <h3 className="font-semibold text-lg mb-2">✉️ Reply</h3>

                            {replyTemplate ? (
                                <textarea
                                    className="w-full h-full p-3 border rounded bg-white"
                                    value={replyText}               // controlled component
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                            ) : (
                                <p className="text-gray-400">No template available</p>
                            )}

                          <div className="flex items-center justify-end w-full">
                              <button className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg">
                                Send Reply
                            </button>
                          </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
