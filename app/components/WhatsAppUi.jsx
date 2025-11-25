"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FileText, User2 } from "lucide-react";
import { API_BASE_URL, WS_URL } from "../constant/constant";

// const API_BASE_URL = "http://localhost:4000";
// const API_BASE_URL = "https://chatapi.ronsare.site";
// const WS_URL = "ws://localhost:4000/messages/ws";
// const WS_URL = "wss://chatapi.ronsare.site/messages/ws";

export default function WhatsAppUi() {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    console.log('messages', messages)
    const messagesEndRef = useRef(null);
    const wsRef = useRef(null);
    const activeUserRef = useRef(null);

    const filteredUsers = users.filter((u) =>
        u.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/messages/users`, {
                withCredentials: true,
            });
            setUsers(res.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchChat = async (sender) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_BASE_URL}/messages/${sender}`,

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

    // WebSocket connection for real-time updates
    useEffect(() => {
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        let reconnectTimeout = null;

        const connectWebSocket = () => {
            try {
                const ws = new WebSocket(WS_URL);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log("✅ WebSocket connected");
                    setWsConnected(true);
                    reconnectAttempts = 0;
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        if (data.type === "new_message") {
                            const newMessage = data.message;
                            console.log("📨 Received new message via WebSocket:", newMessage);

                            // Update users list if it's a new sender (incoming message)
                            if (newMessage.direction === "in" && newMessage.sender && newMessage.sender !== "system") {
                                setUsers((prev) => {
                                    if (!prev.includes(newMessage.sender)) {
                                        console.log("➕ Adding new user to list:", newMessage.sender);
                                        return [...prev, newMessage.sender];
                                    }
                                    return prev;
                                });
                            }

                            // Get current activeUser from ref
                            const currentActiveUser = activeUserRef.current;

                            // Check if message is for the active user
                            const isForActiveUser =
                                currentActiveUser &&
                                (newMessage.sender === currentActiveUser || newMessage.receiver === currentActiveUser);

                            if (isForActiveUser) {
                                console.log("✅ Message is for active user, adding to chat");
                                setMessages((prev) => {
                                    // Check if message already exists (avoid duplicates)
                                    // Check by message_id, id, or a combination of sender+receiver+text_body+timestamp
                                    const exists = prev.some((m) => {
                                        if (m.message_id && newMessage.message_id) {
                                            return m.message_id === newMessage.message_id;
                                        }
                                        if (m.id && newMessage.id && !m.id.toString().startsWith("temp-")) {
                                            return m.id === newMessage.id;
                                        }
                                        // Fallback: check by content and sender/receiver
                                        return (
                                            m.sender === newMessage.sender &&
                                            m.receiver === newMessage.receiver &&
                                            m.text_body === newMessage.text_body &&
                                            Math.abs((m.timestamp || 0) - (newMessage.created_at ? new Date(newMessage.created_at).getTime() : Date.now())) < 5000
                                        );
                                    });

                                    if (exists) {
                                        console.log("⚠️ Message already exists, skipping");
                                        return prev;
                                    }

                                    const formattedMessage = {
                                        ...newMessage,
                                        direction: newMessage.direction === "in" ? "incoming" : "outgoing",
                                        timestamp: newMessage.created_at
                                            ? new Date(newMessage.created_at).getTime()
                                            : Date.now(),
                                        // Ensure we have an id for React key
                                        id: newMessage.id || newMessage.message_id || `msg-${Date.now()}-${Math.random()}`,
                                    };

                                    console.log("➕ Adding message to chat:", formattedMessage);
                                    return [...prev, formattedMessage];
                                });
                            } else {
                                console.log(`ℹ️ Message is not for active user (active: ${currentActiveUser}, sender: ${newMessage.sender}, receiver: ${newMessage.receiver}), skipping UI update`);
                            }
                        } else if (data.type === "connection") {
                            // Connection confirmation
                            console.log("✅", data.message);
                        } else if (data.type === "pong") {
                            // Keep-alive response
                            console.log("WebSocket keep-alive");
                        }
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                    }
                };

                ws.onerror = (error) => {
                    console.error("❌ WebSocket error:", error);
                    setWsConnected(false);
                };

                ws.onclose = () => {
                    console.log("❌ WebSocket disconnected");
                    setWsConnected(false);

                    // Attempt to reconnect
                    if (reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff, max 30s
                        console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
                        reconnectTimeout = setTimeout(connectWebSocket, delay);
                    } else {
                        console.error("Max reconnection attempts reached");
                    }
                };
            } catch (error) {
                console.error("Error creating WebSocket:", error);
                setWsConnected(false);
            }
        };

        connectWebSocket();

        // Send periodic ping to keep connection alive (every 30 seconds)
        const pingInterval = setInterval(() => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                try {
                    wsRef.current.send(JSON.stringify({ type: "ping" }));
                } catch (error) {
                    console.error("Error sending ping:", error);
                }
            }
        }, 30000);

        return () => {
            clearInterval(pingInterval);
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []); // Only connect once on mount

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

        // Optimistically add message to UI
        const localMsg = {
            id: `temp-${Date.now()}`,
            sender: "system",
            receiver: activeUser,
            text_body: messageText,
            direction: "outgoing",
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, localMsg]);

        try {
            await axios.post(`${API_BASE_URL}/messages/send`, {
                receiver: activeUser,
                message: messageText,
            },
                {
                    withCredentials: true,
                });
            // The WebSocket will receive the actual message from the server
            // and update the UI, so we can remove the temp message
            setMessages((prev) => prev.filter((m) => m.id !== localMsg.id));
        } catch (error) {
            console.error("Error sending message:", error);
            // Remove optimistic message on error
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
        <div className="flex w-full h-screen bg-gray-50 text-gray-900">

            {/* LEFT SIDEBAR */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                {/* Header */}
                <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
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
                    {filteredUsers.map((u) => (
                        <div
                            key={u}
                            onClick={() => fetchChat(u)}
                            className={`px-4 py-3 cursor-pointer border-b border-gray-100 transition-all flex items-center gap-3
            ${activeUser === u ? "bg-green-50" : "hover:bg-gray-100"}`}
                        >
                            {/* User Avatar */}
                            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center shadow-sm">
                                <User2 size={20} className="text-green-700" />
                            </div>

                            {/* User Info */}
                            <div className="flex flex-col">
                                <p className="font-semibold text-gray-800">{u}</p>
                                <p className="text-sm text-gray-500">Tap to view chat</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* RIGHT CHAT AREA */}
            <div className="flex-1 flex flex-col bg-gray-50">

                {/* Chat Header */}
                {activeUser ? (
                    <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
                        <p className="font-semibold text-lg text-gray-800">{activeUser}</p>
                    </div>
                ) : (
                    <div className="p-6 text-gray-600 border-b bg-white">
                        Select a user to start chatting
                    </div>
                )}

             {/* Messages Section */}
<div className="flex-1 p-6 overflow-y-auto bg-gray-100">
    {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading...</div>
    ) : (
        <>
            {messages.map((m) => (
                <div
                    key={m.id}
                    className={`flex mb-3 ${
                        m.direction === "incoming" ? "justify-start" : "justify-end"
                    }`}
                >
                    <div
                        className={`
                            max-w-[80%] md:max-w-[60%] 
                            px-4 py-2 rounded-2xl shadow-sm border break-words whitespace-pre-wrap 
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
                            <p className="text-gray-800 break-words whitespace-pre-wrap">
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
                    <div className="p-4 bg-white border-t border-gray-200 flex gap-2 shadow-sm">
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

    );
}
