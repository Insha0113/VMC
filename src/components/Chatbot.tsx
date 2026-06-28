'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import styles from './Chatbot.module.css';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  link?: { label: string; href: string };
  time: string;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  
  const bodyRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Initialize messages on client-side mount to avoid prerendering new Date()
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "Hi, I'm Riya, VMC Assistant. You can ask me anything related to VMC!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    // Show speech bubble after 10 seconds (10000ms)
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowBubble(false);
  };

  // Close chatbot when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Do not show the support chatbot on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const addMessage = (sender: 'bot' | 'user', text: string, link?: { label: string; href: string }) => {
    const newMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      link,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const getBotResponse = (userInput: string) => {
    const text = userInput.toLowerCase();
    
    if (text.includes('book') || text.includes('appointment') || text.includes('schedule') || text.includes('reserve')) {
      return {
        text: 'You can book an appointment online with our specialists. Please click the button below to fill out the form, choose a department, doctor, and date/time slot.',
        link: { label: 'Book Appointment Now', href: '/book' }
      };
    }
    
    if (text.includes('ortho') || text.includes('bone') || text.includes('joint') || text.includes('muscle') || text.includes('fracture')) {
      return {
        text: 'Our Orthopedics department specializes in spine, joints, and bone care. We have Dr. Sarah Jenkins and Dr. Robert Carter available. Check out the Orthopedics page for details.',
        link: { label: 'Go to Orthopedics', href: '/departments/orthopedics' }
      };
    }
    
    if (text.includes('pedia') || text.includes('child') || text.includes('baby') || text.includes('kid') || text.includes('vaccin')) {
      return {
        text: 'Our Pediatrics department provides child checkups, immunizations, and general pediatric care by Dr. Michael Chen. Click below to view the department page.',
        link: { label: 'Go to Pediatrics', href: '/departments/pediatrics' }
      };
    }

    if (text.includes('ent') || text.includes('ear') || text.includes('nose') || text.includes('throat') || text.includes('hearing') || text.includes('sinus')) {
      return {
        text: 'Our ENT department treats disorders of the ear, nose, throat, and neck with our consultant Dr. Emily Watson. Click below for details.',
        link: { label: 'Go to ENT Section', href: '/departments/ent' }
      };
    }

    if (text.includes('doctor') || text.includes('dr.') || text.includes('physician') || text.includes('specialist')) {
      return {
        text: 'We have 4 dedicated consultants: Dr. Sarah Jenkins & Dr. Robert Carter (Orthopedics), Dr. Michael Chen (Pediatrics), and Dr. Emily Watson (ENT). You can view details on our departments pages.',
        link: { label: 'View Departments', href: '/departments' }
      };
    }

    if (text.includes('contact') || text.includes('phone') || text.includes('email') || text.includes('address') || text.includes('location') || text.includes('map')) {
      return {
        text: 'VMC Clinic is located at Karumalloor, Paravoor, Aluva. Phone: 9947653954, Email: vmcclinic@gmail.com. Open 24/7 for emergency care.',
        link: { label: 'Contact Us Page', href: '/contact' }
      };
    }

    if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('greetings')) {
      return {
        text: 'Hello! I am here to help you. Let me know if you want to book an appointment, view departments, find doctors, or contact support.'
      };
    }

    if (text.includes('thank') || text.includes('thanks') || text.includes('appreciate')) {
      return {
        text: 'You are very welcome! Take care. Please let me know if you have any other questions.'
      };
    }

    if (text.includes('admin') || text.includes('dashboard') || text.includes('login')) {
      return {
        text: 'Our Admin Dashboard is secure and meant for authorized medical and operations personnel to manage appointments and listings.',
        link: { label: 'Go to Admin Login', href: '/admin/login' }
      };
    }

    return {
      text: "I'm here to guide you with basic clinic information. For clinical enquiries, please call us directly at 9947653954. Use the buttons below or ask about booking, doctors, or departments!"
    };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    addMessage('user', text);
    setInputVal('');

    // Trigger typing effect
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply = getBotResponse(text);
      addMessage('bot', reply.text, reply.link);
    }, 800);
  };

  const handleQuickReply = (label: string, value: string) => {
    handleSend(value);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Speech Bubble */}
      {!isOpen && showBubble && (
        <div className={styles.speechBubble} onClick={handleOpenChat}>
          <button 
            type="button" 
            className={styles.closeBubbleBtn} 
            onClick={(e) => { 
              e.stopPropagation(); 
              setShowBubble(false); 
            }} 
            aria-label="Close message"
          >
            <X size={14} />
          </button>
          <div className={styles.speechContent}>
            <span className={styles.speechAvatar}>🙋</span>
            <p className={styles.speechText}>Hi, I'm VMC Assistant. You can ask me anything related to VMC!</p>
          </div>
        </div>
      )}

      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button 
          className={styles.bubble} 
          onClick={handleOpenChat}
          aria-label="Open Chatbot"
        >
          <div className={styles.pulse}></div>
          <MessageSquare size={26} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.window}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>
                <Bot size={20} color="white" />
              </div>
              <div>
                <h4 className={styles.title}>Riya - Medical Assistant</h4>
                <div className={styles.status}>
                  <span className={styles.statusDot}></span>
                  Online - 24/7 Guidance
                </div>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className={styles.body} ref={bodyRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.msgWrapper} ${
                  m.sender === 'bot' ? styles.msgWrapperBot : styles.msgWrapperUser
                }`}
              >
                {m.sender === 'bot' && (
                  <div className={styles.msgAvatar} aria-label="Riya Avatar">
                    🙋
                  </div>
                )}
                <div
                  className={`${styles.msg} ${
                    m.sender === 'bot' ? styles.msgBot : styles.msgUser
                  }`}
                >
                  <div>{m.text}</div>
                  {m.link && (
                    <Link href={m.link.href} className={styles.linkButton} onClick={() => setIsOpen(false)}>
                      {m.link.label}
                    </Link>
                  )}
                  <div className={styles.time}>{m.time}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className={`${styles.msgWrapper} ${styles.msgWrapperBot}`}>
                <div className={styles.msgAvatar} aria-label="Riya Avatar">
                  🙋
                </div>
                <div className={`${styles.msg} ${styles.msgBot}`} style={{ padding: '0.5rem 1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>VMC is typing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className={styles.quickReplies}>
            <button className={styles.replyChip} onClick={() => handleQuickReply('Book Appointment', 'Book appointment')}>
              📅 Book Appointment
            </button>
            <button className={styles.replyChip} onClick={() => handleQuickReply('Departments', 'Show departments')}>
              🏥 Departments
            </button>
            <button className={styles.replyChip} onClick={() => handleQuickReply('Our Doctors', 'Who are your doctors?')}>
              👨‍⚕️ Our Doctors
            </button>
            <button className={styles.replyChip} onClick={() => handleQuickReply('Contact & Hours', 'Contact and opening hours')}>
              📞 Contact & Hours
            </button>
          </div>

          {/* Text Input */}
          <form
            className={styles.footerInput}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              className={styles.input}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn} aria-label="Send Message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
