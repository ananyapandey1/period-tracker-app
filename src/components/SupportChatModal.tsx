import React, { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

interface Message {
  id: string
  sender: 'bot' | 'user'
  text: string
  time: string
}

const FAQ_CHIPS = [
  'Why is my period late?',
  'How do I manage severe cramps naturally?',
  'What does spotting during ovulation mean?',
]

export const SupportChatModal: React.FC = () => {
  const { isChatOpen, setIsChatOpen } = useApp()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hi Sofia! 👋 I am your Nua Cycle Assistant. How can I help you understand your period, hormones, or symptoms today?',
      time: '9:41 AM',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isChatOpen, isTyping])

  if (!isChatOpen) return null

  const generateBotReply = (userQuery: string): string => {
    const query = userQuery.toLowerCase()

    if (query.includes('late')) {
      return 'A late period can happen due to stress, hormonal shifts, changes in sleep or diet, high-intensity exercise, or an anovulatory cycle. If your period is more than 7 days late and you are sexually active, taking a home pregnancy test is a good first step!'
    }
    if (query.includes('cramps') || query.includes('pain') || query.includes('severe')) {
      return 'To manage cramps naturally: 1) Apply continuous heat (like Nua Cramp Comfort Patches) at ~40°C. 2) Drink warm ginger or chamomile tea. 3) Gently massage your lower stomach with lavender or peppermint oil. 4) Magnesium glycinate can also help relax uterine muscle contractions.'
    }
    if (query.includes('spotting') || query.includes('ovulation')) {
      return 'Mid-cycle spotting during ovulation (around days 12–16) is common! It usually happens because of the sudden dip in estrogen right after the egg is released, or minor follicle rupture. It is generally harmless if light and brief.'
    }
    if (query.includes('luteal') || query.includes('mood') || query.includes('pms')) {
      return 'During the Luteal phase (days 15-28), rising progesterone can increase body temperature, trigger bloating, and cause temporary mood swings. Hydration, complex carbs, and mild heat therapy work wonders!'
    }
    if (query.includes('pad') || query.includes('cup') || query.includes('nua') || query.includes('wash')) {
      return 'Nua offers 100% organic cotton pads, pH 4.5 intimate washes, and self-heating cramp patches designed for rash-free comfort. Check out our Shop tab to explore products tailored to your flow!'
    }

    return 'Thank you for reaching out! Your cycle health is unique. Based on your current Luteal phase, staying hydrated, getting restful sleep, and keeping warm can help soothe pre-period symptoms. Feel free to ask more specific questions!'
  }

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim()
    if (!text) return

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: timeStr,
    }

    setMessages(prev => [...prev, userMsg])
    if (!textToSend) setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const replyText = generateBotReply(text)
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 800)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(45, 24, 32, 0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
      onClick={() => setIsChatOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Nua Cycle Support Chat"
    >
      <div
        style={{
          background: '#FDF6F0',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: '88%',
          display: 'flex',
          flexDirection: 'column',
          borderTop: '1px solid #E8D0C8',
          boxShadow: '0 -12px 32px rgba(45, 24, 32, 0.25)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div style={{ padding: '12px 24px 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, background: '#E8D0C8', borderRadius: 2, margin: '0 auto 10px' }} />

          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #E8D0C8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setIsChatOpen(false)}
                aria-label="Go back"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#F7EDE8',
                  border: '1px solid #E8D0C8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: '#2D1820',
                  flexShrink: 0,
                  transition: 'background-color 0.15s ease',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D1820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>

              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e75650, #D4807A)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 16,
                  boxShadow: '0 4px 10px rgba(231,86,80,0.3)',
                  flexShrink: 0,
                }}
              >
                🌸
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 15, fontFamily: 'Fraunces, Georgia, serif', color: '#2D1820', fontWeight: 600 }}>
                  Nua Cycle Assistant
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  <span style={{ fontSize: 10, color: '#7A4F5C', fontWeight: 500 }}>Online • Instant answers</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              aria-label="Close"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#F7EDE8',
                border: '1px solid #E8D0C8',
                fontSize: 14,
                color: '#7A4F5C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map(msg => {
            const isBot = msg.sender === 'bot'
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isBot ? 'flex-start' : 'flex-end',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    background: isBot ? '#F7EDE8' : 'linear-gradient(135deg, #e75650, #c43a35)',
                    color: isBot ? '#2D1820' : 'white',
                    borderRadius: isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    padding: '12px 14px',
                    border: isBot ? '1px solid #E8D0C8' : 'none',
                    boxShadow: isBot ? 'none' : '0 4px 12px rgba(231, 86, 80, 0.25)',
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
                <span style={{ fontSize: 9, color: '#B89AA8', marginTop: 3, padding: '0 4px' }}>
                  {msg.time}
                </span>
              </div>
            )
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F7EDE8', borderRadius: 14, padding: '8px 14px', width: 'fit-content', border: '1px solid #E8D0C8' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e75650', animation: 'pulse 0.6s infinite alternate' }} />
              <span style={{ fontSize: 11, color: '#7A4F5C' }}>Assistant is typing...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick FAQ Chips */}
        <div style={{ padding: '8px 16px', background: '#FDF6F0', borderTop: '1px solid #E8D0C8', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
          {FAQ_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              style={{
                padding: '6px 12px',
                borderRadius: 16,
                background: '#F7EDE8',
                border: '1px solid #E8D0C8',
                fontSize: 11,
                fontWeight: 500,
                color: '#e75650',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              💡 {chip}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div style={{ padding: '12px 16px 20px', background: '#FDF6F0', borderTop: '1px solid #E8D0C8', flexShrink: 0 }}>
          <form
            onSubmit={e => {
              e.preventDefault()
              handleSendMessage()
            }}
            style={{ display: 'flex', gap: 8, alignItems: 'center' }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask a question about your cycle..."
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 20,
                background: '#F7EDE8',
                border: '1px solid #E8D0C8',
                fontSize: 13,
                color: '#2D1820',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: inputValue.trim() ? 'linear-gradient(135deg, #e75650, #c43a35)' : '#E8D0C8',
                color: 'white',
                border: 'none',
                cursor: inputValue.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: inputValue.trim() ? '0 4px 12px rgba(231, 86, 80, 0.3)' : 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
