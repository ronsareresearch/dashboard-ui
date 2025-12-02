"use client";

import { useEffect, useState, useRef } from "react";

export default function GmailInbox() {
  // ✅ FIX 1: Correct naming (this is BACKEND, not frontend)
  const BACKEND_URL = "https://zzsn3hdk-4001.inc1.devtunnels.ms";
  const API_BASE = `${BACKEND_URL}/api/v1`;

  const [emailAccounts, setEmailAccounts] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [status, setStatus] = useState("Loading inbox…");
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [emailDetails, setEmailDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const wsRef = useRef(null);

  const loadAccounts = async () => {
    try {
      const res = await fetch(`${API_BASE}/accounts`, {
        credentials: "include",
      });
      const data = await res.json();
      setEmailAccounts(data.accounts || []);
      if (!selectedEmail && data.accounts?.length > 0) {
        setSelectedEmail(data.accounts[0]);
      }
    } catch (err) {
      console.error("Failed to load accounts:", err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addedEmail = params.get("added_email");
    if (addedEmail) {
      setEmailAccounts((prev) =>
        prev.includes(addedEmail) ? prev : [...prev, addedEmail]
      );
      setSelectedEmail(addedEmail);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    if (!selectedEmail) return;
    let reconnectTimeout;

    const loadInbox = async () => {
      setStatus("Loading inbox…");
      setEmails([]);
      setExpandedEmail(null);
      setEmailDetails({});

      try {
        // ✅ FIX 2: credentials included
        const res = await fetch(
          `${API_BASE}/inbox?email=${encodeURIComponent(selectedEmail)}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setEmails(data.messages || []);
        setStatus("Inbox loaded. Listening for new emails…");
      } catch (err) {
        console.error(err);
        setStatus("Failed to load inbox");
      }
    };

    const connectWS = () => {
      if (wsRef.current) wsRef.current.close();

      const WS_BASE = API_BASE.replace("http", "ws");
      wsRef.current = new WebSocket(
        `${WS_BASE}/ws?email=${encodeURIComponent(selectedEmail)}`
      );

      wsRef.current.onopen = () =>
        setStatus("✅ Connected. Waiting for new emails…");
wsRef.current.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log("🔌 WS Received:", data);  // DEBUG

    if (data.type === "inbox_update" && data.email === selectedEmail) {
      console.log("📨 Processing inbox_update for", selectedEmail);
      
      setEmails((prev) => {
        const existingIds = new Set(prev.map((e) => e.id));
        const newMessages = data.messages.filter((m) => !existingIds.has(m.id));
        
        console.log("📊 WS Update stats:", {
          totalReceived: data.messages.length,
          newMessages: newMessages.length,
          existing: prev.length
        });
        
        if (newMessages.length === 0) {
          console.log("ℹ️ No new messages to add");
          return prev;
        }
        
        const updatedEmails = [...newMessages, ...prev];
        console.log("✅ Added", newMessages.length, "new emails. Total:", updatedEmails.length);
        return updatedEmails;
      });

      setStatus(`📩 ${data.messages.length} new email(s) received`);
    }
  } catch (e) {
    console.error("❌ WS parse error:", e);
  }
};


      wsRef.current.onclose = () => {
        reconnectTimeout = setTimeout(connectWS, 3000);
      };
    };

    loadInbox();
    connectWS();

    return () => {
      if (wsRef.current) wsRef.current.close();
      clearTimeout(reconnectTimeout);
    };
  }, [selectedEmail]);

  const addEmail = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  // ✅ FIX 3: credentials added
  const fetchEmailDetails = async (messageId) => {
    if (emailDetails[messageId]) {
      setExpandedEmail(expandedEmail === messageId ? null : messageId);
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [messageId]: true }));

    try {
      const res = await fetch(
        `${API_BASE}/email/${messageId}?email=${encodeURIComponent(
          selectedEmail
        )}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setEmailDetails((prev) => ({ ...prev, [messageId]: data }));
      setExpandedEmail(messageId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const refreshInbox = () => setSelectedEmail((prev) => prev);

  const getFileIcon = (mimeType) => {
    if (!mimeType) return "📎";
    if (mimeType.startsWith("image/")) return "🖼️";
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word")) return "📝";
    if (mimeType.includes("excel")) return "📊";
    if (mimeType.includes("zip")) return "📦";
    return "📎";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024)
      return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // ✅ FIX 4: Attachment download with credentials flag
  const downloadAttachment = (messageId, attachmentId, filename) => {
    const url = `${API_BASE}/email/${messageId}/attachment/${attachmentId}?email=${encodeURIComponent(
      selectedEmail
    )}&withCredentials=true`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "attachment";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="h-screen w-full flex bg-gray-800 p-2">
      <div className="rounded-3xl flex flex-col w-full bg-white overflow-hidden">
        <div className="p-6 shrink-0">
          <h1 className="text-3xl font-bold">📨 Gmail Inbox</h1>

          <div className="flex space-x-4 items-center mt-4">
            <select
              className="border p-2 rounded"
              value={selectedEmail || ""}
              onChange={(e) => setSelectedEmail(e.target.value)}
            >
              {emailAccounts.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>

            <button
              onClick={addEmail}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add Email
            </button>

            <button
              onClick={refreshInbox}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Refresh
            </button>
          </div>

          <div className="text-gray-500 mt-2">{status}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
              <div key={mail.id} className="p-4 border rounded shadow bg-white">
                <div
                  className="cursor-pointer"
                  onClick={() => fetchEmailDetails(mail.id)}
                >
                  <div className="font-semibold">
                    {mail.subject || "(No Subject)"}
                  </div>
                  <div className="text-sm text-gray-600">{mail.from}</div>
                  <div className="text-xs text-gray-400">{mail.date}</div>
                  <p className="text-sm mt-2">{mail.snippet}</p>

                  {isLoading && (
                    <div className="text-sm text-blue-500 mt-2">
                      Loading details…
                    </div>
                  )}
                </div>

                {isExpanded && details && (
                  <div className="mt-4 pt-4 border-t">
                    {details.body?.html ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: details.body.html,
                        }}
                      />
                    ) : details.body?.text ? (
                      <div className="whitespace-pre-wrap">
                        {details.body.text}
                      </div>
                    ) : (
                      <div className="text-gray-500">No content</div>
                    )}

                    {details.attachments?.length > 0 && (
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">
                          📎 Attachments ({details.attachments.length})
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {details.attachments.map((att) => (
                            <div
                              key={att.attachmentId}
                              className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                              onClick={() =>
                                downloadAttachment(
                                  mail.id,
                                  att.attachmentId,
                                  att.filename
                                )
                              }
                            >
                              <div className="flex items-start space-x-2">
                                <span className="text-2xl">
                                  {getFileIcon(att.mimeType)}
                                </span>
                                <div>
                                  <div className="font-medium truncate">
                                    {att.filename}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {att.mimeType}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {formatFileSize(att.size)}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 text-xs text-blue-600">
                                Click to download →
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
