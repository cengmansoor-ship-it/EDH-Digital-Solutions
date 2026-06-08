import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, AlertCircle } from "lucide-react";
import { useCreateOpenaiConversation } from "@workspace/api-client-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm the EDH Technology assistant. How can I help you today? I can tell you about our services, locations, or help you get started on your digital project.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const createConversation = useCreateOpenaiConversation();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const initConversation = async (): Promise<number | null> => {
    if (conversationId) return conversationId;
    try {
      const conv = await createConversation.mutateAsync({
        data: { title: "Website Chat" },
      });
      setConversationId(conv.id);
      return conv.id;
    } catch {
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;
    const userText = input.trim();
    setInput("");

    // Append user message, capture the index the assistant reply will occupy
    let assistantIndex = -1;
    setMessages((prev) => {
      assistantIndex = prev.length + 1; // user at prev.length, assistant at prev.length+1
      return [...prev, { role: "user", content: userText }];
    });
    setIsStreaming(true);

    const convId = await initConversation();
    if (!convId) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please try again.",
          error: true,
        },
      ]);
      setIsStreaming(false);
      return;
    }

    // Add empty assistant placeholder — track its position
    let placeholderIndex = -1;
    setMessages((prev) => {
      placeholderIndex = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });
    // Small delay so React flushes the state before we start updating it
    await new Promise((r) => setTimeout(r, 0));

    let fullText = "";

    const updateAssistant = (text: string) => {
      setMessages((prev) => {
        const updated = [...prev];
        // Find last assistant message (the placeholder we added)
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].role === "assistant") {
            updated[i] = { role: "assistant", content: text };
            break;
          }
        }
        return updated;
      });
    };

    try {
      const res = await fetch(`/api/openai/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userText }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      if (!res.body) {
        // Fallback: no stream body — show generic response
        updateAssistant(
          "I received your message. Please contact us at info@edhtechnalogy.com for detailed assistance."
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop()!;
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.content) {
                fullText += json.content;
                updateAssistant(fullText);
              }
            } catch {
              // ignore parse errors on individual SSE lines
            }
          }
        }
      }

      // Flush any remaining buffer
      if (buffer.startsWith("data: ")) {
        try {
          const json = JSON.parse(buffer.slice(6));
          if (json.content) {
            fullText += json.content;
            updateAssistant(fullText);
          }
        } catch {}
      }

      // Ensure final text is set
      if (fullText) updateAssistant(fullText);
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].role === "assistant" && updated[i].content === "") {
            updated[i] = {
              role: "assistant",
              content: "Sorry, something went wrong. Please try again.",
              error: true,
            };
            break;
          }
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        data-testid="chatbot-toggle"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_32px_rgba(0,240,255,0.65)] transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl border border-border/50"
            style={{ background: "hsl(222, 47%, 9%)" }}
          >
            {/* Header */}
            <div className="bg-primary/10 border-b border-border/50 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot size={18} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">EDH Assistant</p>
                <p className="text-xs text-primary flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
                  {isStreaming ? "Typing…" : "Online"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 flex flex-col gap-3 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                      msg.role === "assistant" ? "bg-primary/20" : "bg-secondary"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      msg.error ? (
                        <AlertCircle size={11} className="text-destructive" />
                      ) : (
                        <Bot size={12} className="text-primary" />
                      )
                    ) : (
                      <User size={12} />
                    )}
                  </div>

                  <div
                    className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : msg.error
                        ? "bg-destructive/10 text-destructive rounded-tl-sm"
                        : "bg-secondary text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.content === "" && isStreaming && i === messages.length - 1 ? (
                      <span className="flex gap-1 items-center h-4 px-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "160ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "320ms" }}
                        />
                      </span>
                    ) : (
                      msg.content || "\u00A0"
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-3 flex gap-2 items-center">
              <input
                ref={inputRef}
                data-testid="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isStreaming ? "Please wait…" : "Ask about our services…"}
                disabled={isStreaming}
                className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground disabled:opacity-50 transition-all"
              />
              <motion.button
                data-testid="chatbot-send"
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                <Send size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
