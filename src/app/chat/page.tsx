"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Volume2, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hoi! Hoe gaat het vandaag? Ben je klaar om wat Nederlands te oefenen?" }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  // Speech Recognition setup
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = "nl-NL";
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          handleSend(transcript);
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setError("Microfoon toegang geweigerd. Controleer je instellingen.");
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        setError("Je browser ondersteunt geen spraakherkenning. Probeer Chrome.");
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
      // Don't cancel! We want sentences to queue naturally for a 'live' feel
      // window.speechSynthesis.cancel(); 
      
      const textToSpeak = text.split('\n\n')[0].replace(/[*#]/g, ''); // Clean markdown
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Try to find a high-quality Dutch voice
      const voices = window.speechSynthesis.getVoices();
      const nlVoice = voices.find(v => v.lang.startsWith('nl') && v.name.includes('Google')) || 
                      voices.find(v => v.lang.startsWith('nl'));
      
      if (nlVoice) utterance.voice = nlVoice;
      
      utterance.lang = "nl-NL";
      utterance.rate = 0.9; 
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textOverride?: string) => {
    const content = textOverride || input;
    if (!content.trim()) return;

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
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      
      // Initialize assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let sentenceBuffer = "";

      while (true) {
        const { done, value } = await (reader?.read() as any);
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantContent += chunk;
        sentenceBuffer += chunk;

        // Play voice as sentences finish
        if (/[.!?]\s/.test(sentenceBuffer)) {
          const sentences = sentenceBuffer.split(/(?<=[.!?])\s/);
          const completeSentence = sentences[0];
          speak(completeSentence);
          sentenceBuffer = sentences.slice(1).join(" ");
        }

        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1].content = assistantContent;
          return newMsgs;
        });
      }

      // Speak remaining buffer
      if (sentenceBuffer.trim()) {
        speak(sentenceBuffer);
      }

    } catch (error: any) {
      console.error("Error calling chat API:", error);
      setError(error.message.includes("429") ? "De AI is even te druk. Wacht 60 seconden." : "Er is iets misgegaan.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      setIsListening(true);
      setError(null);
      recognition?.start();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Chat Tutor</h2>
          <p className="mt-1 text-slate-500">Spreek Nederlands met Gemini (B1 Niveau)</p>
        </div>
        <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
          Live Voice Active
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto p-6 space-y-6"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-4",
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                m.role === "user" ? "bg-slate-100" : "bg-orange-50"
              )}>
                {m.role === "user" ? <User className="h-5 w-5 text-slate-600" /> : <Bot className="h-5 w-5 text-orange-500" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "user" 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none"
              )}>
                {m.content.split('\n\n').map((para, idx) => (
                  <p key={idx} className={idx > 0 ? "mt-3 pt-3 border-t border-slate-200 text-slate-500 italic text-xs" : ""}>
                    {para}
                  </p>
                ))}
                {m.role === "assistant" && (
                  <button 
                    onClick={() => speak(m.content)}
                    className="mt-2 text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-slate-400"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm italic">Gemini is aan het nadenken...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={toggleListening}
          className={cn(
            "p-4 rounded-xl transition-all duration-300",
            isListening 
              ? "bg-red-500 text-white animate-pulse" 
              : "bg-orange-50 text-orange-600 hover:bg-orange-100"
          )}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Typ hier je bericht of gebruik de microfoon..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
