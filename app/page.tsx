"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Mic, Menu, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messages: Message[];
}

export default function FarmAssist() {
  const [showSplash, setShowSplash] = useState(true);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput((prev) => prev + (prev ? " " : "") + transcript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
          console.error("[v0] Speech recognition error:", event.error);
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Hide splash screen after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // If this is first message, create a new chat
    let chatId = currentChatId;
    if (!chatId) {
      const newChatId = `chat_${Date.now()}`;
      const newChat: Chat = {
        id: newChatId,
        title: input.substring(0, 40),
        preview: "",
        timestamp: new Date(),
        messages: [userMessage],
      };

      // Keep only last 10 chats
      const updatedChats = [newChat, ...chats].slice(0, 10);
      setChats(updatedChats);
      setCurrentChatId(newChatId);
      chatId = newChatId;
    }

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language: selectedLanguage,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update chat with AI preview if it's the first message
      if (chatId) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  preview: data.message.substring(0, 60),
                  messages: [...chat.messages, userMessage, assistantMessage],
                }
              : chat,
          ),
        );
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setInput("");
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setSidebarOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceClick = () => {
    if (!recognitionRef.current) {
      console.error("[v0] Speech recognition not available");
      alert(
        "Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.",
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error("[v0] Error starting speech recognition:", error);
      }
    }
  };

  // Splash screen
  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center fade-out-animation">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop"
              alt="Farm landscape"
              className="w-96 h-64 object-cover rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#2d6a1a]">
            FarmAssist
          </h1>
          <p className="text-sm text-[#8a9a7a] font-satoshi">
            AI-powered advice for every farmer
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#6dbe3e] to-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f9f8f5] text-[#0f1a08]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static w-64 h-screen bg-[#0e1a0a] text-white flex flex-col transform transition-transform duration-300 z-40 md:z-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🌾</span>
            <h2 className="font-serif font-bold text-lg">FarmAssist</h2>
          </div>
          <p className="text-xs text-[#6dbe3e] font-mono">AI Advisor</p>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="m-4 px-4 py-2.5 bg-[#6dbe3e] text-[#0e1a0a] font-medium rounded-xl hover:bg-[#5ea639] transition-colors"
        >
          + New Chat
        </button>

        {/* Language Selector */}
        <div className="px-4 py-3 border-b border-white/10">
          <p className="text-xs text-white/50 font-mono mb-2">LANGUAGE</p>
          <div className="flex flex-wrap gap-2">
            {["English", "Yoruba", "Hausa", "Igbo", "Français", "Swahili"].map(
              (lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedLanguage === lang
                      ? "bg-[#6dbe3e] text-[#0e1a0a]"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {lang}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs text-white/50 font-mono mb-3">RECENT</p>
          {chats.length === 0 ? (
            <p className="text-xs text-white/40 italic">
              Your conversations will appear here
            </p>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all hover:bg-white/10 ${
                    currentChatId === chat.id
                      ? "bg-white/15 border-l-2 border-[#6dbe3e]"
                      : ""
                  }`}
                >
                  <p className="text-sm font-medium line-clamp-1">
                    {chat.title}
                  </p>
                  <p className="text-xs text-white/50 line-clamp-1 mt-1">
                    {chat.preview}
                  </p>
                  <p className="text-xs text-white/30 mt-1">
                    {formatTime(chat.timestamp)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6dbe3e] rounded-full flex items-center justify-center text-lg">
              👨‍🌾
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Farmer</p>
              <p className="text-xs text-white/50">Nigeria 🇳🇬</p>
            </div>
            <span className="px-2 py-1 bg-[#6dbe3e] text-[#0e1a0a] text-xs font-bold rounded">
              FREE
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 bg-[#f9f8f5] border-b border-[#e5e5e0] px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-[#2d6a1a] hover:bg-white/50 p-2 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="font-serif font-bold text-xl">
              {currentChatId
                ? chats.find((c) => c.id === currentChatId)?.title ||
                  "FarmAssist"
                : "FarmAssist"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#6dbe3e] rounded-full breathe-glow"></div>
            <span className="text-sm font-medium text-[#2d6a1a]">
              AI Online
            </span>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
          {messages.length === 0 ? (
            // Hero Screen
            <div className="max-w-4xl mx-auto">
              {/* Welcome Card */}
              <div className="mb-12 relative overflow-hidden bg-gradient-to-br from-[#2d6a1a] to-[#1e4a0e] rounded-2xl p-8 md:p-12 text-white shimmer-animation">
                <div className="absolute -top-20 -right-20 text-7xl opacity-10">
                  🌾
                </div>
                <div className="relative">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                      <p className="text-xs font-mono text-[#6dbe3e] uppercase tracking-wide mb-2">
                        Good day Farmer
                      </p>
                      <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight mb-4">
                        Your Personal Farm{" "}
                        <span className="italic text-[#6dbe3e]">Advisor</span>
                      </h2>
                      <p className="text-white/80 text-base">
                        Get expert farming advice tailored to your crops,
                        climate, and challenges.
                      </p>
                    </div>
                    <div className="flex flex-col justify-center gap-6">
                      {[
                        { label: "Farmers Supported", value: "33M+" },
                        { label: "African Countries", value: "54" },
                        { label: "Availability", value: "24/7" },
                      ].map((stat, i) => (
                        <div key={i}>
                          <p className="text-xs text-white/60 font-mono uppercase mb-1">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-serif font-bold">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Start */}
              <div className="text-center mb-8">
                <p className="text-sm font-mono text-[#8a9a7a] uppercase tracking-wide">
                  Quick Start
                </p>
                <div className="flex justify-center gap-2 mt-2">
                  <span>🌍</span>
                  <span>🌾</span>
                  <span>🗣️</span>
                </div>
              </div>

              {/* Suggestion Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  {
                    emoji: "🌱",
                    title: "Plan My Planting",
                    desc: "Get a customized planting schedule",
                  },
                  {
                    emoji: "🐛",
                    title: "Identify Pest",
                    desc: "Detect and treat crop diseases",
                  },
                  {
                    emoji: "🌦️",
                    title: "Weather Tips",
                    desc: "Get weather-based farming advice",
                  },
                  {
                    emoji: "💰",
                    title: "Market Prices",
                    desc: "Check current crop prices",
                  },
                  {
                    emoji: "🧪",
                    title: "Fertilizer Guide",
                    desc: "Learn about soil and nutrients",
                  },
                  {
                    emoji: "🏪",
                    title: "Find Supplies",
                    desc: "Locate farming supplies nearby",
                  },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(card.title);
                      setTimeout(() => textareaRef.current?.focus(), 0);
                    }}
                    className="card-hover-lift bg-white rounded-2xl p-6 border border-[#e5e5e0] hover:border-[#6dbe3e] group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{card.emoji}</span>
                      <span className="text-[#6dbe3e] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-left mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#8a9a7a] text-left">
                      {card.desc}
                    </p>
                    <div className="mt-4 pt-4 border-t border-[#e5e5e0]">
                      <p className="text-xs font-medium text-[#2d6a1a]">
                        Ask now →
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Features Badge */}
              <div className="flex flex-wrap justify-center gap-4 text-sm text-[#8a9a7a]">
                <span>🌍 Pan-African</span>
                <span>•</span>
                <span>🌾 Crop Intelligence</span>
                <span>•</span>
                <span>🗣️ Voice Support</span>
                <span>•</span>
                <span>⚡ Instant Answers</span>
              </div>
            </div>
          ) : (
            // Chat Messages
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className="spring-in">
                  {msg.role === "user" ? (
                    <div className="flex justify-end gap-3">
                      <div className="max-w-xs md:max-w-md lg:max-w-lg">
                        <div className="bg-gradient-to-r from-[#2d6a1a] to-[#1e4a0e] text-white rounded-3xl rounded-tr-lg px-6 py-3">
                          <p className="text-base">{msg.content}</p>
                        </div>
                        <p className="text-xs text-[#8a9a7a] mt-1 text-right">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-[#2d6a1a] rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-1">
                        👨‍🌾
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-[#f9f8f5] border-2 border-[#2d6a1a] rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-1">
                        🌾
                      </div>
                      <div className="max-w-xs md:max-w-md lg:max-w-lg">
                        <div className="bg-white border border-[#e5e5e0] rounded-3xl rounded-tl-lg px-6 py-3 shadow-sm">
                          <p className="text-base text-[#0f1a08]">
                            {msg.content}
                          </p>
                        </div>
                        <p className="text-xs text-[#8a9a7a] mt-1">
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#f9f8f5] border-2 border-[#2d6a1a] rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    🌾
                  </div>
                  <div className="bg-white border border-[#e5e5e0] rounded-3xl rounded-tl-lg px-6 py-3 shadow-sm">
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-0 bg-[#f9f8f5] border-t border-[#e5e5e0] px-4 md:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about farming..."
                className="flex-1 bg-white rounded-2xl px-6 py-3 border border-[#e5e5e0] focus:border-[#2d6a1a] focus:outline-none focus:ring-2 focus:ring-[#6dbe3e]/20 resize-none font-satoshi text-base placeholder-[#8a9a7a]"
                rows={1}
              />
              <button
                onClick={handleVoiceClick}
                className={`p-3 rounded-full transition-all ${
                  isRecording
                    ? "bg-[#6dbe3e] text-white animate-pulse"
                    : "text-[#8a9a7a] hover:text-[#2d6a1a]"
                }`}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                <Mic size={20} />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-gradient-to-r from-[#2d6a1a] to-[#1e4a0e] text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-[#8a9a7a] text-center mt-3 font-mono">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
