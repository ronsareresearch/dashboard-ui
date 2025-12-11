"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FileText, User2 } from "lucide-react";
import { WHATSAPP_SERVER  , WS_URL} from "@/app/constant/constant";

//
export default function WhatsAppUi() {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);
    const activeUserRef = useRef(null);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const filteredUsers = users.filter((u) =>
        u.toLowerCase().includes(searchTerm.toLowerCase())
    );

 const fetchUsers = async () => {
    try {
        const res = await axios.get(`${WHATSAPP_SERVER}/messages/users`, {
            withCredentials: true,
        });

        setUsers(res.data.users);
    } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
    } finally {
        setLoadingUsers(false); // hide skeleton after load
    }
};



    const fetchChat = async (sender) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${WHATSAPP_SERVER}/messages/${sender}`,

                {
                    withCredentials: true,
                }
            );

            const fixed = res.data.messages.map((m) => ({
                ...m,
                direction: m.direction === "in" ? "incoming" : "outgoing",
                timestamp: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
            }));
            setMessages(fixed);
            setActiveUser(sender);
            activeUserRef.current = sender;
        } catch (error) {
            console.error("Error fetching chat:", error);
        } finally {
            setIsLoading(false);
        }
    };

useEffect(() => {
    if (!activeUser) return;

    const WS_URL = `${WHATSAPP_SERVER.replace(/^https?/, 'wss')}/messages/ws`;
    console.log("Connecting WS to:", WS_URL);

    wsRef.current = new WebSocket(`${WS_URL}?user=${activeUser}`);

    wsRef.current.onopen = () => {
        console.log("🟢 WS Connected");
        setWsConnected(true);
    };

    wsRef.current.onclose = () => {
        console.log("🔴 WS Disconnected");
        setWsConnected(false);
    };

    wsRef.current.onerror = (err) => {
        console.error("⚠️ WS Error:", err);
        setWsConnected(false);
    };

    wsRef.current.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            if (data.type === "new_message") {
                const msg = data.message;

                const formattedMessage = {
                    ...msg,
                    direction: msg.direction === "in" ? "incoming" : "outgoing",
                    timestamp: msg.created_at ? new Date(msg.created_at).getTime() : Date.now(),
                    id: msg.id || msg.message_id || `msg-${Date.now()}-${Math.random()}`,
                    message_type: msg.message_type || "text",
                    text_body: msg.text_body || "",
                };

                if (formattedMessage.sender === activeUser || formattedMessage.receiver === activeUser) {
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === formattedMessage.id)) return prev;
                        return [...prev, formattedMessage];
                    });
                }

                if (msg.direction === "in" && msg.sender && msg.sender !== "system") {
                    setUsers((prev) => (prev.includes(msg.sender) ? prev : [...prev, msg.sender]));
                }
            } else if (data.type === "connection") {
                console.log("✅", data.message);
            } else if (data.type === "pong") {
                console.log("WebSocket keep-alive");
            }
        } catch (err) {
            console.error("Failed to parse WS message:", err);
        }
    };

    // Cleanup on unmount or activeUser change
    return () => {
        wsRef.current?.close();
        setWsConnected(false);
    };
}, [activeUser]);




    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Keep activeUserRef in sync with activeUser state
    useEffect(() => {
        activeUserRef.current = activeUser;
    }, [activeUser]);

const sendMessage = async () => {
    if (!input.trim() || !activeUser) return;

    const messageText = input.trim();
    setInput("");

    // Optimistic message
    const localMsg = {
        id: `temp-${Date.now()}`,
        sender: "system",
        receiver: activeUser,
        text_body: messageText,
        direction: "outgoing",
        timestamp: Date.now(), // milliseconds
        message_type: "text",
    };

    setMessages((prev) => [...prev, localMsg]);

    try {
        const res = await axios.post(
            `${WHATSAPP_SERVER}/messages/send`,
            { receiver: activeUser, message: messageText },
            { withCredentials: true }
        );

        const serverMsg = res.data.message || {};

        // Normalize timestamp: created_at → milliseconds
        const normalizedMsg = {
            ...serverMsg,
            direction: serverMsg.direction === "in" ? "incoming" : "outgoing",
            timestamp: serverMsg.created_at
                ? new Date(serverMsg.created_at).getTime()
                : Date.now(),
            id: serverMsg.id || serverMsg.message_id || `msg-${Date.now()}-${Math.random()}`,
            message_type: serverMsg.message_type || "text",
            text_body: serverMsg.text_body || messageText,
        };

        // Replace optimistic message with normalized server message
        setMessages((prev) =>
            prev.map((m) => (m.id === localMsg.id ? normalizedMsg : m))
        );
    } catch (error) {
        console.error("Error sending message:", error);
        // Remove optimistic message if sending fails
        setMessages((prev) => prev.filter((m) => m.id !== localMsg.id));
        alert("Failed to send message. Please try again.");
    }
};




    const formatTime = (ts) => {
        if (!ts) return "";

        const date = new Date(ts);

        // Convert UTC → IST manually (add 5 hours 30 minutes)
        const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));

        return istDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="flex w-full h-screen bg-gray-800 p-2  text-gray-900">
            <div className="flex w-full ">

                {/* LEFT SIDEBAR */}
                <div className="w-96 bg-white rounded-l-2xl  border-r border-gray-200 flex flex-col shadow-sm">
                    {/* Header */}
                    <div className="p-4 bg-white rounded-t-2xl border-b border-gray-200 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-800">WhatsApp</h1>

                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2.5 h-2.5 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`}
                            />
                            <span className="text-sm text-gray-500">
                                {wsConnected ? "Live" : "Offline"}
                            </span>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="p-3 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* User List */}
                    <div className="flex-1 overflow-y-auto">
                        {loadingUsers ? (
                            // Skeleton loader for the list
                            Array.from({ length: 6 }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 animate-pulse"
                                >
                                    {/* Avatar skeleton */}
                                    <div className="w-10 h-10 bg-gray-300 rounded-full" />

                                    {/* Text skeleton */}
                                    <div className="flex flex-col flex-1 gap-2">
                                        <div className="h-4 bg-gray-300 rounded w-3/4" />
                                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Actual user list
                            filteredUsers.map((u) => (
                                <div
                                    key={u}
                                    onClick={() => fetchChat(u)}
                                    className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all flex items-center gap-3
              ${activeUser === u ? "bg-green-50" : "hover:bg-gray-100"}
            `}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center shadow-sm">
                                        <User2 size={20} className="text-green-700" />
                                    </div>

                                    {/* User Info */}
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-gray-800">{u}</p>
                                        <p className="text-sm text-gray-500">Tap to view chat</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                </div>

                {/* RIGHT CHAT AREA */}
                <div className="flex-1 flex flex-col bg-gray-50 rounded-2xl">

                    {/* Chat Header */}
                    {activeUser ? (
                        <div className="p-4 border-b border-gray-200 bg-white shadow-sm  rounded-tr-2xl">
                            <p className="font-semibold text-lg text-gray-800">{activeUser}</p>
                        </div>
                    ) : (
                        <div className="p-4 text-gray-600 border-b bg-white text-lg rounded-tr-2xl">
                            Select a user to start chatting
                        </div>
                    )}

                    {/* Messages Section */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gray-100  rounded-r-2xl">
                        {isLoading ? (
                            <div className="text-center py-4 text-gray-500">Loading...</div>
                        ) : messages.length === 0 ? (
                            // Empty state similar to WhatsApp
                            <div className="h-full w-full flex flex-col items-center justify-center flex-1 text-center py-20 text-gray-400 bg-gray-100">
                                <img
                                    src="/whatsapp-chat/whatsapp-chat.jpeg"
                                    alt="No messages"
                                    className="h-40 mb-4 opacity-40 mix-blend-multiply"
                                />
                                <p className="text-lg font-semibold">No messages yet</p>
                                <p className="text-sm mt-1">Send a message to start the conversation</p>
                            </div>

                        ) : (
                            <>
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`flex mb-3 ${m.direction === "incoming" ? "justify-start" : "justify-end"}`}
                                    >
                                        <div
                                            className={`
            max-w-[80%] md:max-w-[60%] 
            px-4 py-2 rounded-2xl shadow-sm border wrap-break-words whitespace-pre-wrap 
            ${m.direction === "incoming"
                                                    ? "bg-white border-gray-200"
                                                    : "bg-green-100 border-green-300"
                                                }
          `}
                                        >
                                            {/* DOCUMENT MESSAGE */}
                                            {m.message_type === "document" ? (
                                                <a
                                                    href={m.drive_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-blue-600 underline break-all"
                                                >
                                                    <FileText size={18} />
                                                    <span>{m.text_body || "Open Document"}</span>
                                                </a>
                                            ) : (
                                                <p className="text-gray-800 wrap-break-words whitespace-pre-wrap">
                                                    {m.text_body || "[media]"}
                                                </p>
                                            )}

                                            <p className="text-xs text-gray-500 mt-1 text-right">
                                                {formatTime(m.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div ref={messagesEndRef} />
                            </>
                        )}

                    </div>


                    {/* Input Bar */}
                    {activeUser && (
                        <div className="p-4 bg-white border-t border-gray-200 flex gap-2 shadow-sm rounded-br-2xl">
                            <input
                                className="flex-1 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-400"
                                placeholder="Type a message…"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-green-500 text-white px-5 py-2 rounded-lg shadow hover:bg-green-600 transition"
                            >
                                Send
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}