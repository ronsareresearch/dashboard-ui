"use client";

import { useEffect, useState, useRef } from "react";
import {
  ArrowUp,
  ChevronDown,
  Mic,
  Plus,
  Bot,
  MessageCircleIcon,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cleanAiText } from "@/app/utils/cleanAiText/cleanAiText";

export default function AiModel() {
  const [selectedModel, setSelectedModel] = useState("Gemini");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showPromo, setShowPromo] = useState(true);
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const messagesEndRef = useRef(null);

  const models = ["Gemini", "Perplexity"];

  useEffect(() => {
    const saved = localStorage.getItem("ai-chat");
    const savedModel = localStorage.getItem("selected-model");

    if (saved) setMessages(JSON.parse(saved));
    if (savedModel) setSelectedModel(savedModel);
  }, []);

  useEffect(() => {
    localStorage.setItem("ai-chat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("selected-model", selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (showPromo) setShowPromo(false);

    // Show loading indicator
    const loadingMsg = { role: "ai", text: selectedModel + " is typing...", model: selectedModel, loading: true };
    setMessages((prev) => [...prev, loadingMsg]);
    setLoading(true);

    try {
      let url = selectedModel === "Perplexity"
        ? "http://localhost:4000/perplexity"
        : "http://localhost:4000/gemini";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg.text }),
      });

      const data = await res.json();
      let aiText = data.text || data.error || "Something went wrong.";
      aiText = cleanAiText(aiText);

      // Replace loading message with actual AI response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.loading ? { role: "ai", text: aiText, model: selectedModel } : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.loading ? { role: "ai", text: "Server error.", model: selectedModel } : msg
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[30%] h-full py-4 pr-4 bg-gray-100 backdrop-blur-xl rounded-br-3xl flex flex-col">
      <div className="bg-white h-full rounded-2xl flex flex-col overflow-hidden">
        <div className="flex flex-col justify-between h-full bg-gray-800 text-white rounded-xl overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-600 rounded-full px-4 py-2 text-sm"
                >
                  <Bot size={24} className="text-white/70" />
                  {selectedModel} <ChevronDown className="ml-2" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-48 bg-gray-900 text-white border border-gray-700 shadow-xl rounded-xl"
                align="start"
              >
                <div className="flex flex-col space-y-1">
                  {models.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-2 text-left rounded-md text-sm hover:bg-gray-700 transition ${
                        selectedModel === model ? "bg-gray-700" : ""
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <button className="text-gray-400 hover:text-white text-xl px-2 cursor-pointer">
              <MessageCircleIcon size={24} className="text-white/70" />
            </button>
          </div>

          {/* Welcome screen */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="bg-gray-700 p-4 rounded-full shadow-md">
                <Bot size={42} className="text-white/70" />
              </div>
              <h2 className="text-2xl font-semibold mt-4 text-white">
                Where should we begin?
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Ask anything and I’ll help you out, Sanjay.
              </p>
            </div>
          )}

          {/* Chat messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] p-3 rounded-xl text-sm flex flex-col ${
                    msg.role === "user"
                      ? "bg-gray-600 self-end ml-auto"
                      : "bg-gray-700 self-start mr-auto"
                  }`}
                >
                  {msg.role === "ai" && msg.model && (
                    <span className="text-[10px] text-gray-300 mb-1">
                      {msg.model} response
                    </span>
                  )}
                  <span>{msg.text}</span>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* auto-scroll anchor */}
            </div>
          )}

          {/* Promo Box */}
          {showPromo && (
            <div className="px-4 pb-4">
              <div className="relative bg-[#111] rounded-3xl p-4 border border-[#222] flex flex-col gap-1">
                <button
                  onClick={() => setShowPromo(false)}
                  className="absolute top-2 right-2 p-1 text-gray-300 hover:text-white"
                >
                  <X size={16} />
                </button>

                <p className="text-base font-semibold text-yellow-400">
                  ⚠️ Warning
                </p>
                <p className="text-xs text-gray-300">
                  Do not share sensitive personal information in this chat. AI responses may not be fully secure.
                </p>
                <button
                  className="w-full mt-2 py-2 bg-white text-black text-sm rounded-full font-semibold"
                  onClick={() => setShowPromo(false)}
                >
                  Got it
                </button>
              </div>
            </div>
          )}

          {/* Input bar */}
          <div className="px-4 pb-4">
            <div className="bg-[#111] rounded-full px-4 py-3 flex items-center gap-3">
              <button className="text-black rounded-full p-2 text-xl bg-white/20">
                <Plus />
              </button>
              <input
                type="text"
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="text-white/80 rounded-full p-2 text-xl bg-white/20">
                <Mic />
              </button>
              <button
                onClick={sendMessage}
                className="text-black rounded-full p-2 text-xl bg-white/20"
              >
                <ArrowUp />
              </button>
            </div>
          </div>

          <span className="w-full text-center text-sm px-16 pb-4 text-white/50">
            This AI may make mistakes. Please double-check important information.
          </span>
        </div>
      </div>
    </div>
  );
}
