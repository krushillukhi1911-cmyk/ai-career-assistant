import React, { useState } from 'react';
import { chatService } from '../services/api';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Sparkles, User, Bot, FileText } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: "Hello! I am your RAG Career Assistant. Ask me anything about your uploaded resume, missing skill gaps, project recommendations, or interview prep strategy!",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMsg: ChatMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setSending(true);

    try {
      const resp = await chatService.sendMessage(currentInput);
      const assistantMsg: ChatMessage = {
        sender: 'assistant',
        text: resp.answer,
        sources: resp.context_sources,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { sender: 'assistant', text: 'Sorry, I encountered an issue processing your query.' },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-container animate-fade-in" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <div className="page-header-card" style={{ padding: '18px 24px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={22} color="var(--primary)" /> RAG Career Assistant Chatbot
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Retrieves vector context from your uploaded resume & job postings to answer questions accurately without hallucinating.
          </p>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div
        className="glass-card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {msg.sender === 'assistant' && (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot size={20} color="#fff" />
              </div>
            )}

            <div
              style={{
                maxWidth: '88%',
                background:
                  msg.sender === 'user'
                    ? 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                border: msg.sender === 'assistant' ? '1px solid var(--bg-card-border)' : 'none',
                padding: '14px 18px',
                borderRadius: '16px',
                fontSize: '0.92rem',
                lineHeight: '1.5',
              }}
            >
              {msg.text}

              {/* RAG Context Sources Badges */}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontWeight: 600, color: '#a5b4fc', marginBottom: '4px' }}>Retrieved Context Sources:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {msg.sources.map((src, sIdx) => (
                      <div key={sIdx} style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '4px 8px', borderRadius: '4px' }}>
                        [{src.source_type.toUpperCase()}] {src.content_snippet}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={20} color="var(--text-main)" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Bot size={20} color="var(--primary)" /> Searching vector database & generating answer...
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1, padding: '14px 18px' }}
          placeholder="Ask a question (e.g. What Python skills do I have? What skills should I learn next?)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary" style={{ padding: '0 24px' }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
