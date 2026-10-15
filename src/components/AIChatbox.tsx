import React, { useState, useEffect, useRef } from 'react';
import { Language, UserAccount } from '../types/tourism';
import { AIChatService, ChatMessage } from '../services/aiChatService';
import { 
  MessageCircle, Send, X, Bot, User, Sparkles, 
  RotateCcw, Compass, MapPin, Minimize2, Maximize2, ShieldCheck, Check
} from 'lucide-react';

interface AIChatboxProps {
  language: Language;
  currentUser: UserAccount | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export const AIChatbox: React.FC<AIChatboxProps> = ({
  language,
  currentUser,
  isOpen,
  onToggle,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tn_stories_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: language === 'ta'
          ? 'வணக்கம்! நான் உங்கள் **டிஎன் ஸ்டோரீஸ் சுற்றுலா உதவியாளர்**. தமிழ்நாட்டின் ஆன்மீக தலங்கள், மலைவாசஸ்தலங்கள், கீழடி தொல்லியல் தளம் மற்றும் பயண வழிகாட்டுதல்கள் குறித்து நீங்கள் கேட்கலாம்.'
          : 'Vanakkam! I am your **TN Stories Travel Guide**. Ask me about Tamil Nadu temples, darshan timings, dress codes, Keezhadi excavations, weather safety, or our 10% first-trip discount!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local_expert'
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem('tn_stories_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const reply = await AIChatService.sendMessage(text, language, messages);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having a temporary connection issue. Please feel free to ask again or check our destination catalog.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialWelcome: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: language === 'ta'
        ? 'உரையாடல் அழிக்கப்பட்டது. புதிய கேள்விகளைக் கேட்கலாம்!'
        : 'Chat cleared. How can I assist your Tamil Nadu travels now?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialWelcome]);
    localStorage.removeItem('tn_stories_chat_history');
  };

  const sampleQuestions = language === 'ta' ? [
    'மதுரை மீனாட்சி அம்மன் ஆலயம் தரிசன நேரம்?',
    'வால்பாறை வானிலை ரெட் அலர்ட் விவரம்?',
    'கீழடி அகழ்வாராய்ச்சி அருங்காட்சியகம் பற்றி கூறுங்கள்',
    'முதல் பயண 10% தள்ளுபடி பெறுவது எப்படி?'
  ] : [
    'Madurai Meenakshi Darshan & Dress Code',
    'Is Valparai safe right now? (Weather Alert)',
    'Tell me about Keezhadi Sangam Museum',
    'How do I claim 10% First Booking OFF?',
    'What is included in Free Sponsored Travel Kit?'
  ];

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          aria-label="Open TN Travel AI Chatbox"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-extrabold px-4 py-3.5 rounded-full shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-amber-300"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <span className="text-xs tracking-wide hidden sm:inline">Ask Travel AI</span>
          <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-bold">
            Chat
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isMinimized
              ? 'bottom-6 right-6 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] max-h-[85vh] h-[600px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>TN Stories Travel Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <div className="text-[10px] text-amber-300/80">
                  Tamil Nadu Tourism & Heritage Guide
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={handleClearChat}
                title="Clear conversation"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onClose}
                title="Close Chat"
                className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {/* Suggestion Chips */}
                {messages.length <= 2 && (
                  <div className="space-y-1.5 pb-2">
                    <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Suggested Questions:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sq)}
                          className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all text-left"
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] p-3 rounded-2xl space-y-1 ${
                          isUser
                            ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-xs shadow-md'
                            : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-xs shadow-md leading-relaxed whitespace-pre-wrap'
                        }`}
                      >
                        <div className="text-xs">{msg.content}</div>
                        <div
                          className={`text-[9px] text-right ${
                            isUser ? 'text-slate-800' : 'text-slate-500'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 items-center text-slate-400 text-xs">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-400 ml-1">Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-slate-950 border-t border-slate-800">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about temples, Keezhadi, Ooty, booking discount..."
                    className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 transition-all font-bold shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="text-[10px] text-slate-500 text-center mt-1.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>Exclusively answers queries for tourist places in Tamil Nadu.</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
