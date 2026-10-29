import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Send,
  Sparkles,
  BookOpen,
  Volume2,
  Copy,
  PlusCircle,
  Database,
  RefreshCw,
  Info,
  Shield,
  Heart,
  User,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: Array<{ id: string; title: string; references: string[] }>;
  isRAG?: boolean;
}

export const AIBibleAssistant: React.FC = () => {
  const { language, addNote, showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-01',
      sender: 'assistant',
      text:
        language === 'ne'
          ? 'नमस्ते र प्रभुमा शान्ति! म "सुसमाचार AI" हुँ। म पवित्र बाइबलका शिक्षाहरू, येशू ख्रीष्टको सुसमाचार, अनुग्रह, प्रार्थना र ख्रीष्टियन विश्वास बुझ्न तपाईंलाई सहयोग गर्न यहाँ छु। तपाईं कुनै पनि प्रश्न सोध्न सक्नुहुन्छ।'
          : 'Peace be with you! I am Good News AI. I am here to help you study the Holy Bible, understand the life and teachings of Jesus Christ, explore the Gospel of Grace, and dialogue with gentleness and respect. What would you like to explore today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useRAG, setUseRAG] = useState(true);
  const [activeTopic, setActiveTopic] = useState('general');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const samplePrompts = [
    {
      en: 'What is the Gospel of Jesus Christ in simple words?',
      ne: 'सरल शब्दमा येशू ख्रीष्टको सुसमाचार के हो?',
      topic: 'Gospel of Grace',
    },
    {
      en: 'Explain John 3:16 and what eternal life means.',
      ne: 'यूहन्ना ३:१६ र अनन्त जीवनको अर्थ व्याख्या गर्नुहोस्।',
      topic: 'Salvation & Love',
    },
    {
      en: 'What does the Bible teach about loving our neighbors and other faiths?',
      ne: 'बाइबलले छिमेकीलाई प्रेम गर्ने र अन्य धर्मलाई आदर गर्ने बारे के सिकाउँछ?',
      topic: 'Love & Respect',
    },
    {
      en: 'What is the Parable of the Prodigal Son in Luke 15?',
      ne: 'लूका १५ को हराएको छोराको दृष्टान्तको अर्थ के हो?',
      topic: 'Parables of Mercy',
    },
    {
      en: 'How can I pray when I feel anxious and burdened (Matthew 11:28)?',
      ne: 'चिन्तित र भारीले दबिँदा कसरी प्रार्थना गर्ने (मत्ती ११:२८)?',
      topic: 'Prayer & Rest',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      if (useRAG) {
        // Call RAG retrieval endpoint
        const res = await fetch('/api/gemini/rag-ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: text,
            language,
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: data.answer || 'Thank you for seeking truth. May God grant you peace.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: data.sources,
          isRAG: true,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Standard conversational dialogue endpoint
        const historyPayload = messages.slice(-6).map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: historyPayload,
            language,
            topic: activeTopic,
          }),
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRAG: false,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback response with biblical grounding
      const fallbackReply =
        language === 'ne'
          ? `येशूले भन्नुभयो: "हे सबै थाकेका र भारीले दबिएकाहरू हो, मकहाँ आओ, र म तिमीहरूलाई विश्राम दिनेछु।" (मत्ती ११:२८)\n\nपरमेश्वरको प्रेम सबैका लागि निःशुल्क छ (यूहन्ना ३:१६)। अनुग्रहद्वारा विश्वासबाट नै मुक्ति पाइन्छ (एफिसी २:८-९)।`
          : `Jesus says: "Come to me, all you who are weary and burdened, and I will give you rest." (Matthew 11:28)\n\nGod's love is unconditional (John 3:16), and salvation is a gift received by grace through faith (Ephesians 2:8-9). May His peace guide your heart today.`;

      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 2}`,
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      showToast('Offline biblical fallback provided');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Audio playback not supported');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
    utterance.lang = language === 'ne' ? 'ne-NP' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    showToast('Playing audio recitation');
  };

  const handleSaveToNotes = (text: string) => {
    addNote({
      title: 'AI Gospel Dialogue Note',
      reference: 'Biblical Dialogue',
      content: text,
      tags: ['AI Dialogue', 'Gospel Study'],
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Title & Control Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-bold font-serif-sacred shadow-sm">
            ✞
          </div>
          <div>
            <h2 className="font-serif-sacred font-bold text-lg text-slate-900">
              {language === 'ne' ? 'सुसमाचार AI बाइबल सहायक' : 'Gospel AI Bible Assistant'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'ne'
                ? 'दया, नम्रता र बाइबलीय प्रमाणमा आधारित संवाद (Gemini 3.8 Flash)'
                : 'Biblically grounded, compassionate faith dialogue powered by Gemini 3.8 Flash'}
            </p>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseRAG(!useRAG)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              useRAG
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
            title="Toggle RAG with approved theological and historical knowledge base"
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'ne' ? 'प्रमाणित स्रोत (RAG)' : 'Grounded RAG Mode'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* Respect and Non-Coercion Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-xs text-slate-600 flex items-center gap-2">
        <Shield className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          {language === 'ne'
            ? 'हाम्रो AI ले सबै धर्मको आदर गर्दछ। कुनै दबाब वा धर्म परिवर्तनको उद्देश्य छैन। बाइबलीय सन्दर्भ सहित जवाफ दिइन्छ।'
            : 'Good News AI respects all religions (Hindu, Buddhist, Muslim, Kirat, secular) with zero coercion. All Christian teaching provides biblical citations.'}
        </span>
      </div>

      {/* Chat Messages Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shrink-0 font-serif-sacred font-bold text-sm shadow-xs mt-0.5">
                ✞
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-xs'
                  : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* RAG sources metadata badge */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-200/80 mt-2 space-y-1">
                  <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
                    <Database className="w-3 h-3 text-amber-600" />
                    <span>{language === 'ne' ? 'प्रमाणित स्रोतहरू:' : 'Grounded Sources:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.map((s) => (
                      <span
                        key={s.id}
                        className="bg-amber-100 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-medium"
                      >
                        {s.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons for AI Responses */}
              {msg.sender === 'assistant' && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 text-[11px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="hover:text-amber-700 p-1 rounded-sm hover:bg-white"
                      title="Listen via Text-to-Speech"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.text)}
                      className="hover:text-amber-700 p-1 rounded-sm hover:bg-white"
                      title="Copy text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleSaveToNotes(msg.text)}
                      className="hover:text-amber-700 p-1 rounded-sm hover:bg-white flex items-center gap-1 text-[10px]"
                      title="Save response to personal study notes"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ne' ? 'नोटमा राख्नुहोस्' : 'Save Note'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center text-slate-400 text-xs py-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center animate-pulse">
              ✞
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>
                {language === 'ne'
                  ? 'धर्मशास्त्रको आधारमा जवाफ तयार हुँदैछ...'
                  : 'Good News AI is searching Scripture and formulating a peaceful answer...'}
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested Inquiries */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          {language === 'ne' ? 'सुझाव गरिएका बाइबल प्रश्नहरू' : 'Suggested Scripture Inquiries'}
        </div>
        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(language === 'ne' ? p.ne : p.en)}
              className="text-xs bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 px-3 py-1.5 rounded-lg transition-all text-left"
            >
              {language === 'ne' ? p.ne : p.en}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            language === 'ne'
              ? 'बाइबल, येशू ख्रीष्ट, वा अनुग्रह बारे प्रश्न लेख्नुहोस्...'
              : 'Ask a question about the Bible, Jesus, salvation, or prayer...'
          }
          className="w-full pl-4 pr-12 py-3.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm shadow-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="absolute right-2 p-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
