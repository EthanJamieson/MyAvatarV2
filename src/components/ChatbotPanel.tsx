import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Bot, Plus, ChevronLeft, Trash2, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";

const STORAGE_KEY = "myavatar-chat-threads";

type Msg = { role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; messages: Msg[]; updatedAt: number };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ messages }),
    });

    if (!resp.ok) {
      const body = await resp.json().catch(() => ({}));
      onError(body.error || "Something went wrong. Please try again.");
      return;
    }
    if (!resp.body) {
      onError("No response received.");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const json = line.slice(6).trim();
        if (json === "[DONE]") { streamDone = true; break; }
        try {
          const parsed = JSON.parse(json);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
    onDone();
  } catch {
    onError("Connection failed. Please try again.");
  }
}

const QUICK_REPLIES = [
  "What services do you offer?",
  "Pricing info",
  "Contact details",
  "Tell me about Custom Avatars",
];

const WELCOME_MSG: Msg = { role: "assistant", content: "Hi! 👋 I'm MyAvatar's virtual assistant. How can I help you today?" };

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createThread(): Thread {
  return { id: generateId(), title: "New conversation", messages: [WELCOME_MSG], updatedAt: Date.now() };
}

function loadThreads(): Thread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Thread[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Migrate old single-conversation format
    const oldRaw = localStorage.getItem("myavatar-chat-history");
    if (oldRaw) {
      const oldMessages = JSON.parse(oldRaw) as Msg[];
      if (Array.isArray(oldMessages) && oldMessages.length > 0) {
        const firstUserMsg = oldMessages.find(m => m.role === "user");
        const thread: Thread = {
          id: generateId(),
          title: firstUserMsg ? firstUserMsg.content.slice(0, 40) : "Previous conversation",
          messages: oldMessages,
          updatedAt: Date.now(),
        };
        localStorage.removeItem("myavatar-chat-history");
        return [thread];
      }
    }
  } catch { /* ignore */ }
  return [createThread()];
}

function saveThreads(threads: Thread[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
}

function deriveTitle(messages: Msg[]): string {
  const firstUser = messages.find(m => m.role === "user");
  if (!firstUser) return "New conversation";
  const text = firstUser.content.slice(0, 40);
  return text.length < firstUser.content.length ? text + "…" : text;
}

const ChatbotPanel = ({ onClose }: { onClose: () => void }) => {
  const [initialThreads] = useState(loadThreads);
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>(initialThreads[0].id);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(initialThreads[0].messages.length <= 1);
  const [view, setView] = useState<"chat" | "threads">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
  const messages = activeThread.messages;

  // Persist threads
  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateActiveMessages = useCallback((updater: (prev: Msg[]) => Msg[]) => {
    setThreads(prev => prev.map(t =>
      t.id === activeThreadId
        ? { ...t, messages: updater(t.messages), updatedAt: Date.now(), title: deriveTitle(updater(t.messages)) }
        : t
    ));
  }, [activeThreadId]);

  const startNewThread = useCallback(() => {
    const newThread = createThread();
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setShowQuickReplies(true);
    setView("chat");
    setInput("");
  }, []);

  const switchThread = useCallback((id: string) => {
    setActiveThreadId(id);
    const thread = threads.find(t => t.id === id);
    setShowQuickReplies(thread ? thread.messages.length <= 1 : true);
    setView("chat");
    setInput("");
  }, [threads]);

  const deleteThread = useCallback((id: string) => {
    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== id);
      if (filtered.length === 0) {
        const newThread = createThread();
        setActiveThreadId(newThread.id);
        setShowQuickReplies(true);
        return [newThread];
      }
      if (id === activeThreadId) {
        setActiveThreadId(filtered[0].id);
        setShowQuickReplies(filtered[0].messages.length <= 1);
      }
      return filtered;
    });
  }, [activeThreadId]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setInput("");
    setShowQuickReplies(false);
    const userMsg: Msg = { role: "user", content: text.trim() };
    updateActiveMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const currentMessages = [...messages, userMsg];

    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      const snapshot = assistantSoFar;
      setThreads(prev => prev.map(t => {
        if (t.id !== activeThreadId) return t;
        const msgs = [...t.messages];
        const last = msgs[msgs.length - 1];
        if (last?.role === "assistant" && msgs.length > 1 && msgs[msgs.length - 2].role === "user") {
          msgs[msgs.length - 1] = { ...last, content: snapshot };
        } else {
          msgs.push({ role: "assistant", content: snapshot });
        }
        return { ...t, messages: msgs, updatedAt: Date.now(), title: deriveTitle(msgs) };
      }));
    };

    await streamChat({
      messages: currentMessages.filter((m, i) => !(i === 0 && m.role === "assistant" && m.content === WELCOME_MSG.content)),
      onDelta: upsert,
      onDone: () => setIsLoading(false),
      onError: (msg) => {
        updateActiveMessages(prev => [...prev, { role: "assistant", content: `Sorry, ${msg}` }]);
        setIsLoading(false);
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="w-[340px] sm:w-[380px] h-[480px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          {view === "threads" ? (
            <button onClick={() => setView("chat")} className="hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <Bot className="w-5 h-5" />
          )}
          <span className="font-semibold text-sm">
            {view === "threads" ? "Conversations" : "MyAvatar Assistant"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {view === "chat" && (
            <>
              <button onClick={() => setView("threads")} className="hover:opacity-80 transition-opacity p-1" title="All conversations">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button onClick={startNewThread} className="hover:opacity-80 transition-opacity p-1" title="New conversation">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button onClick={onClose} className="hover:opacity-80 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === "threads" ? (
          /* Thread list */
          <motion.div
            key="threads"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-2">
              <button
                onClick={startNewThread}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-1"
              >
                <Plus className="w-4 h-4" />
                New conversation
              </button>
            </div>
            <div className="px-2 pb-2 space-y-0.5">
              {threads.map(t => (
                <div
                  key={t.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    t.id === activeThreadId ? "bg-accent" : "hover:bg-muted"
                  }`}
                  onClick={() => switchThread(t.id)}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.messages.length - 1} message{t.messages.length - 1 !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Chat view */
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.15 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-3 py-2 rounded-2xl rounded-bl-md text-sm">
                    <span className="animate-pulse">Typing…</span>
                  </div>
                </div>
              )}
              {showQuickReplies && !isLoading && messages.length === 1 && (
                <div className="flex flex-wrap gap-2 px-1">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 h-9 px-3 rounded-full bg-muted text-foreground text-sm border-0 outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ChatbotPanel;
