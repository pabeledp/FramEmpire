import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck, ExternalLink, Clock } from 'lucide-react';
import knowledge from '../../data/knowledge.json';

const KNOWLEDGE_BASE = {
  workingHours: { startHour: 10, endHour: 22, formatted: '10:00 AM to 10:00 PM (GMT+6)' },
  escalation: { 
    person: knowledge.agency.humanSupport.name, 
    phone: knowledge.agency.humanSupport.phone, 
    email: knowledge.agency.humanSupport.email, 
    whatsappUrl: knowledge.agency.humanSupport.whatsapp 
  }
};

function checkIsWithinWorkingHours() {
  try {
    const now = new Date();
    const bdTimeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', hourCycle: 'h23' });
    const bdHour = parseInt(bdTimeStr, 10);
    return bdHour >= 10 && bdHour < 22;
  } catch (err) {
    const localHour = new Date().getHours();
    return localHour >= 10 && localHour < 22;
  }
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [unreadBadge, setUnreadBadge] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: 'agent',
      text: `Hello! 👋 Nabila here from FramEmpire Studio.\n\nHow can I help you with your project today? / বলুন কিভাবে সাহায্য করতে পারি? (English / বাংলা / Banglish)`,
      time: 'Just now'
    }
  ]);

  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('fe_chat_user_name') || '';
    } catch (e) { return ''; }
  });

  const [userContact, setUserContact] = useState(() => {
    try {
      return localStorage.getItem('fe_chat_user_contact') || '';
    } catch (e) { return ''; }
  });

  const [threadId, setThreadId] = useState(() => {
    try {
      return localStorage.getItem('fe_chat_thread_id') || '';
    } catch (e) { return ''; }
  });

  const [sessionId] = useState(() => {
    try {
      let saved = localStorage.getItem('fe_chat_session_id');
      if (!saved) {
        saved = 'ID-' + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem('fe_chat_session_id', saved);
      }
      return saved;
    } catch (e) {
      return 'ID-' + Math.floor(1000 + Math.random() * 9000);
    }
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatHistory, isOpen, isTyping]);

  // Real-time background polling for Telegram Topic Human Support replies
  useEffect(() => {
    let intervalId = null;
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwp0iTjxYeJMktukdeqWkzZuMxolf-91_hGGZ0Cml-d5RoXLDoWReEChTsbpSBfwHZD/exec';

    if (isOpen) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({ action: 'check_reply', session_id: sessionId, thread_id: threadId })
          });
          const data = await res.json();
          if (data && data.hasReply && data.reply) {
            setChatHistory(prev => [
              ...prev,
              {
                id: Date.now(),
                sender: 'agent',
                senderType: 'Support Agent',
                text: data.reply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
        } catch (err) {}
      }, 2500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, threadId]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setUnreadBadge(false);
  };

  // Real-time API Fetch from Google Apps Script Web App Endpoint
  const processMessageSubmission = async (userText) => {
    if (!userText.trim()) return;

    const trimmedText = userText.trim();

    // Check if user text looks like a name (1-2 words, no punctuation/common words)
    let currentLocalName = userName;
    if (!currentLocalName && trimmedText.split(' ').length <= 2 && trimmedText.length <= 25 && !/hi|hello|hey|price|cost|rate|how|what|need|want|help|edit|design/i.test(trimmedText)) {
      currentLocalName = trimmedText.trim();
      setUserName(currentLocalName);
      try { localStorage.setItem('fe_chat_user_name', currentLocalName); } catch(e){}
    }

    // 1. Render User Message Bubble
    const userMsgObj = {
      id: Date.now(),
      sender: 'user',
      text: trimmedText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsgObj]);
    setMessage('');
    setIsTyping(true);

    // 2. Dispatch email copy to team.framempire@gmail.com
    try {
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '5642e1ed-ed24-4f81-9b16-e41ceb325257',
          subject: '⚡ Live Chat Inquiry - FramEmpire',
          from_name: 'Nabila Live Chat',
          to_email: 'team.framempire@gmail.com',
          message: `Client Message:\n"${trimmedText}"\nUser Name: ${currentLocalName || 'Website Visitor'}`
        })
      }).catch(() => {});
    } catch (err) {}

    // 3. Real-Time Fetch from Google Apps Script Web App Backend Endpoint
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwp0iTjxYeJMktukdeqWkzZuMxolf-91_hGGZ0Cml-d5RoXLDoWReEChTsbpSBfwHZD/exec';
    let aiResponseText = '';
    let responseSender = '';

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          session_id: sessionId,
          thread_id: threadId,
          name: currentLocalName || 'Website Visitor',
          contact: userContact || 'Not Specified',
          project: trimmedText
        })
      });

      const data = await response.json();
      if (data) {
        if (data.reply) aiResponseText = data.reply;
        if (data.sender) responseSender = data.sender;
        if (data.thread_id && String(data.thread_id) !== String(threadId)) {
          setThreadId(String(data.thread_id));
          try { localStorage.setItem('fe_chat_thread_id', String(data.thread_id)); } catch(e){}
        }
        if (data.userName && data.userName !== 'Website Visitor') {
          setUserName(data.userName);
          try { localStorage.setItem('fe_chat_user_name', data.userName); } catch(e){}
        }
        if (data.userContact && data.userContact !== 'Not Specified') {
          setUserContact(data.userContact);
          try { localStorage.setItem('fe_chat_user_contact', data.userContact); } catch(e){}
        }
      }
    } catch (gasErr) {
      console.warn('Fetch Apps Script error, trying /api/chat fallback:', gasErr);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Website Visitor',
            contact: 'Live Chat Widget',
            project: trimmedText,
            message: trimmedText,
            history: chatHistory
          })
        });

        const data = await response.json();
        if (data && (data.reply || data.text)) {
          aiResponseText = data.reply || data.text;
          if (data.sender) responseSender = data.sender;
        }
      } catch (err) {
        console.warn('Fetch /api/chat error:', err);
      }
    }

    // Fallback message if endpoint network error occurs
    if (!aiResponseText) {
      const isOnline = checkIsWithinWorkingHours();
      if (/[অ-হা-ঢ়]/.test(trimmedText) || trimmedText.toLowerCase().includes('bangla')) {
        aiResponseText = `ধন্যবাদ মেসেজ দেওয়ার জন্য! 🚀 ফ্রেমএম্পায়ার স্টুডিওতে আমরা ভিডিও এডিটিং, ৩D মোশন গ্রাফিক্স, ব্র্যান্ডিং এবং নেক্সট.জেএস/রিয়্যাক্ট ওয়েব ডেভেলপমেন্টের কাজ করে থাকি।\n\nসরাসরি কথা বলতে আমার সাথে যোগাযোগ করতে পারেন: ${KNOWLEDGE_BASE.escalation.phone}`;
      } else {
        aiResponseText = `Hello! 🚀 I'm Nabila from FramEmpire Studio. We specialize in high-impact Video Editing, 3D Motion Graphics, Graphic Design, and React/Next.js Web Architecture.\n\n${isOnline ? 'How can I assist you with your project today?' : 'Our team is currently offline (10 AM - 10 PM GMT+6). Please leave your project details!'} Direct WhatsApp: ${KNOWLEDGE_BASE.escalation.phone}`;
      }
    }

    setIsTyping(false);

    const agentReplyObj = {
      id: Date.now() + 1,
      sender: 'agent',
      senderType: responseSender || 'AI Support',
      text: aiResponseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, agentReplyObj]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    processMessageSubmission(message);
  };

  const openExecutiveWhatsApp = () => {
    const text = encodeURIComponent('Hi Nabila! I reached out via FramEmpire website and would like to discuss a project.');
    window.open(`${KNOWLEDGE_BASE.escalation.whatsappUrl}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto select-none">
      
      {/* 100% In-Website Live Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[390px] bg-[#090d1a] border border-cyan-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(0,243,255,0.2)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          
          {/* Live Chat Header */}
          <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-[#070913] p-3.5 sm:p-4 flex items-center justify-between border-b border-cyan-500/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/nabila_profile.png"
                  alt="Nabila - FramEmpire Executive Director"
                  className="w-10 h-10 rounded-full border-2 border-cyan-400 object-cover shadow-md shrink-0"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm font-['Creato_Display'] flex items-center gap-1.5">
                  <span>Nabila</span>
                  <CheckCheck className="w-4 h-4 text-cyan-400" />
                </h4>
                <p className="text-[11px] text-cyan-300/90 font-medium">Executive Director • Client Support</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close Live Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Operational Hours Ribbon */}
          <div className="bg-[#050814] px-3 py-1.5 border-b border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>10:00 AM – 10:00 PM (GMT+6)</span>
            </span>
            <span className="flex items-center gap-1.5 font-bold">
              {checkIsWithinWorkingHours() ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  </span>
                  <span className="text-emerald-400 tracking-wider text-[10px]">OPEN NOW</span>
                </>
              ) : (
                <span className="text-amber-400">🌙 OFFLINE (Leave Msg)</span>
              )}
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="p-4 space-y-3 bg-[#060814]/95 text-xs h-[310px] overflow-y-auto custom-scrollbar">
            
            {/* Render In-Web Chat Messages */}
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <img 
                    src="/nabila_profile.png" 
                    alt="Nabila" 
                    className="w-7 h-7 rounded-full border border-cyan-400 object-cover shadow-sm shrink-0" 
                  />
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[86%] space-y-1 shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none border border-cyan-400/40'
                      : 'bg-gradient-to-br from-cyan-950/90 via-slate-900 to-slate-950 text-slate-100 rounded-tl-none border border-cyan-500/30'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-75">
                    <span>{msg.time}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-cyan-200" />}
                  </div>
                </div>
              </div>
            ))}

            {/* Is Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-semibold pt-1">
                <img src="/nabila_profile.png" alt="Nabila Typing" className="w-4 h-4 rounded-full border border-cyan-400 object-cover animate-bounce" />
                <span className="animate-pulse">Nabila is generating answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* In-Web Message Input Form */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-[#090d1a] border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Nabila anything..."
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl outline-none placeholder-slate-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold p-2.5 rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all shrink-0"
              title="Send Message"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>

          {/* Executive Direct Contact Bar */}
          <div className="bg-[#050711] py-2 px-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-300">
            <div className="space-y-0.5">
              <span className="font-bold text-white block">Executive Director: Nabila</span>
              <span className="text-slate-400">{KNOWLEDGE_BASE.escalation.phone}</span>
            </div>
            <button
              type="button"
              onClick={openExecutiveWhatsApp}
              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold hover:bg-emerald-500/30 transition-colors flex items-center gap-1"
            >
              <span>WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}

      {/* Always-On-Display Floating Action Button */}
      <button
        onClick={handleOpen}
        className="relative group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 p-3.5 sm:p-4 rounded-full shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:scale-110 transition-all duration-300 border-2 border-cyan-300"
        aria-label="Open Live AI Support Chat"
        title="Open Live AI Support Chat"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-slate-950" />

        {/* Unread Message Badge Notification */}
        {unreadBadge && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
            1
          </span>
        )}

        {/* Hover Tooltip */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-slate-900 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          💬 Live Support - Nabila
        </span>
      </button>

    </div>
  );
}
