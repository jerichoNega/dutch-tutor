"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Volume2, User, Bot, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/ProgressContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const { progress } = useProgress();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hoi ${progress.settings.userName}! Ik ben Lars, je Nederlandse tutor. Waar wil je het vandaag over hebben?` }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContinuous, setIsContinuous] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = "nl-NL";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleSend(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setError("Microfoon toegang geweigerd.");
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setError("Browser niet ondersteund.");
      }
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (typeof window !== "undefined") {
      const textToSpeak = text.replace(/[*#]/g, '');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const voices = window.speechSynthesis.getVoices();
      const nlVoice = voices.find(v => v.lang.startsWith('nl') && v.name.includes('Google')) || 
                      voices.find(v => v.lang.startsWith('nl'));
      
      if (nlVoice) utterance.voice = nlVoice;
      utterance.lang = "nl-NL";
      utterance.rate = 0.95;

      utterance.onstart = () => {
        // Stop listening while AI speaks to avoid feedback
        recognitionRef.current?.stop();
      };

      utterance.onend = () => {
        // Re-enable mic if in continuous mode
        if (isContinuous) {
          startListening();
        }
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    window.speechSynthesis.cancel(); // Interrupt current speech
    setIsListening(true);
    setError(null);
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.warn("Recognition already started");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      startListening();
    }
  };

  const handleSend = async (textOverride?: string) => {
    const content = textOverride || input;
    if (!content.trim()) return;

    // Safety check for context
    if (!progress || !progress.settings) {
      console.warn("Settings not loaded yet, using defaults");
    }

    setError(null);
    const newMessage: Message = { role: "user", content };
    const updatedMessages = [...messagesRef.current, newMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: updatedMessages,
          settings: progress?.settings || { userName: "Student", difficulty: "B1", aiPersonality: "friendly" }
        }),
      });

      if (!response.ok) throw new Error("Busy");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      let sentenceBuffer = "";

      while (true) {
        const { done, value } = await (reader?.read() as any);
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantContent += chunk;
        sentenceBuffer += chunk;

        if (/[.!?]\s/.test(sentenceBuffer)) {
          const sentences = sentenceBuffer.split(/(?<=[.!?])\s/);
          speak(sentences[0]);
          sentenceBuffer = sentences.slice(1).join(" ");
        }

        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content = assistantContent;
          return newMsgs;
        });
      }

      if (sentenceBuffer.trim()) speak(sentenceBuffer);

    } catch (error: any) {
      setError("De AI is momenteel druk. Probeer het over een minuutje weer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            Lars <Sparkles className="h-5 w-5 text-orange-500 fill-orange-500" />
          </h2>
          <p className="text-slate-500">Jouw persoonlijke Nederlandse tutor</p>
        </div>
        <button
          onClick={() => setIsContinuous(!isContinuous)}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold transition-all border",
            isContinuous 
              ? "bg-orange-500 text-white border-orange-500 shadow-md" 
              : "bg-white text-slate-400 border-slate-200"
          )}
        >
          {isContinuous ? "MODUS: LIVE GESPREK" : "MODUS: HANDMATIG"}
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-y-auto p-8 space-y-8"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "flex items-start gap-4",
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                m.role === "user" ? "bg-slate-100" : "bg-orange-500"
              )}>
                {m.role === "user" ? <User className="h-5 w-5 text-slate-600" /> : <Bot className="h-5 w-5 text-white" />}
              </div>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-5 py-3 text-sm font-medium leading-relaxed",
                m.role === "user" 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none shadow-sm"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mx-auto px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
          {error}
        </div>
      )}

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xl">
          <button
            onClick={toggleListening}
            className={cn(
              "p-5 rounded-2xl transition-all duration-500 shadow-lg",
              isListening 
                ? "bg-red-500 text-white scale-110 shadow-red-200" 
                : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200"
            )}
          >
            {isListening ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={isContinuous ? "Ik luister..." : "Typ hier of druk op de microfoon..."}
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 text-lg outline-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-4 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-20 transition-all shadow-lg shadow-slate-200"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {isContinuous && (
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-tighter animate-pulse">
          Live gesprek aan • Lars luistert als hij klaar is met praten
        </p>
      )}
    </div>
  );
}
