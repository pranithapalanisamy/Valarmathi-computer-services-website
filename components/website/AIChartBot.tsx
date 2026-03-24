import { useState, useRef, useEffect, CSSProperties } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  MessageCircle, Send, X, Sparkles,
  RefreshCw, ChevronRight, BarChart as BarChartIcon, Bot, User
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'radar';

interface ChartData {
  type: ChartType;
  title: string;
  description: string;
  data: any[];
  dataKeys: string[];
  colors: string[];
  xKey?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  chart?: ChartData;
  timestamp: Date;
  suggestions?: string[];
}

// ─── Colour Palette ───────────────────────────────────────────────────────────

const PALETTE = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#a78bfa', '#fb923c'];

// ─── Static chart database ────────────────────────────────────────────────────

const chartDatabase: Record<string, ChartData> = {
  pricing: {
    type: 'bar',
    title: 'Service Pricing Overview (INR)',
    description: 'Estimated cost range for common repair services.',
    data: [
      { service: 'Diagnosis', min: 300, max: 500 },
      { service: 'Virus Removal', min: 1500, max: 3000 },
      { service: 'Screen Replace', min: 1500, max: 8000 },
      { service: 'RAM Upgrade', min: 800, max: 2000 },
      { service: 'SSD Install', min: 1200, max: 2500 },
      { service: 'Data Recovery', min: 3000, max: 10000 },
      { service: 'WiFi Setup', min: 400, max: 1500 },
      { service: 'OS Install', min: 300, max: 800 },
    ],
    dataKeys: ['min', 'max'],
    colors: [PALETTE[0], PALETTE[2]],
    xKey: 'service',
  },
  amc: {
    type: 'bar',
    title: 'AMC Plan Comparison',
    description: 'Annual Maintenance Contract plans at a glance.',
    data: [
      { plan: 'Basic', visits: 2, devices: 1 },
      { plan: 'Pro', visits: 4, devices: 3 },
      { plan: 'Enterprise', visits: 12, devices: 10 },
    ],
    dataKeys: ['visits', 'devices'],
    colors: [PALETTE[0], PALETTE[4]],
    xKey: 'plan',
  },
  satisfaction: {
    type: 'area',
    title: 'Customer Satisfaction Trend (%)',
    description: 'Monthly customer satisfaction scores over the past year.',
    data: [
      { month: 'Jan', score: 92 }, { month: 'Feb', score: 94 },
      { month: 'Mar', score: 91 }, { month: 'Apr', score: 96 },
      { month: 'May', score: 95 }, { month: 'Jun', score: 97 },
      { month: 'Jul', score: 98 }, { month: 'Aug', score: 96 },
      { month: 'Sep', score: 99 }, { month: 'Oct', score: 98 },
      { month: 'Nov', score: 97 }, { month: 'Dec', score: 99 },
    ],
    dataKeys: ['score'],
    colors: [PALETTE[2]],
    xKey: 'month',
  },
  repairs: {
    type: 'line',
    title: 'Monthly Repairs Completed',
    description: 'Number of repair jobs completed each month.',
    data: [
      { month: 'Jan', repairs: 145 }, { month: 'Feb', repairs: 162 },
      { month: 'Mar', repairs: 178 }, { month: 'Apr', repairs: 195 },
      { month: 'May', repairs: 210 }, { month: 'Jun', repairs: 233 },
      { month: 'Jul', repairs: 248 }, { month: 'Aug', repairs: 267 },
      { month: 'Sep', repairs: 281 }, { month: 'Oct', repairs: 295 },
      { month: 'Nov', repairs: 312 }, { month: 'Dec', repairs: 340 },
    ],
    dataKeys: ['repairs'],
    colors: [PALETTE[0]],
    xKey: 'month',
  },
  issueTypes: {
    type: 'pie',
    title: 'Common Issue Distribution',
    description: 'Breakdown of most frequently reported computer issues.',
    data: [
      { name: 'Performance', value: 28 },
      { name: 'Virus/Malware', value: 22 },
      { name: 'Hardware Fail', value: 18 },
      { name: 'Network', value: 14 },
      { name: 'Data Recovery', value: 10 },
      { name: 'Software', value: 8 },
    ],
    dataKeys: ['value'],
    colors: PALETTE,
    xKey: 'name',
  },
  responseTime: {
    type: 'area',
    title: 'Average Response Time (hrs)',
    description: 'How quickly our technicians respond to new requests.',
    data: [
      { month: 'Jan', hours: 3.2 }, { month: 'Feb', hours: 2.8 },
      { month: 'Mar', hours: 2.5 }, { month: 'Apr', hours: 2.1 },
      { month: 'May', hours: 1.9 }, { month: 'Jun', hours: 1.7 },
      { month: 'Jul', hours: 1.5 }, { month: 'Aug', hours: 1.4 },
      { month: 'Sep', hours: 1.3 }, { month: 'Oct', hours: 1.2 },
      { month: 'Nov', hours: 1.1 }, { month: 'Dec', hours: 1.0 },
    ],
    dataKeys: ['hours'],
    colors: [PALETTE[4]],
    xKey: 'month',
  },
  serviceAreas: {
    type: 'bar',
    title: 'Service Requests by City',
    description: 'Distribution of service requests across Tamil Nadu.',
    data: [
      { city: 'Chennai', requests: 420 },
      { city: 'Coimbatore', requests: 310 },
      { city: 'Madurai', requests: 275 },
      { city: 'Salem', requests: 198 },
      { city: 'Trichy', requests: 185 },
      { city: 'Erode', requests: 142 },
    ],
    dataKeys: ['requests'],
    colors: [PALETTE[0]],
    xKey: 'city',
  },
  skills: {
    type: 'radar',
    title: 'Technician Skill Ratings',
    description: 'Average skill rating of our certified technicians (out of 10).',
    data: [
      { skill: 'Hardware', rating: 9.5 },
      { skill: 'Software', rating: 9.2 },
      { skill: 'Networking', rating: 8.8 },
      { skill: 'Security', rating: 9.0 },
      { skill: 'Data Recovery', rating: 8.6 },
      { skill: 'Customer Svc', rating: 9.7 },
    ],
    dataKeys: ['rating'],
    colors: [PALETTE[0]],
    xKey: 'skill',
  },
};

// ─── Real-time AI API integration (Mock for demonstration) ────────────────────────────

async function callAI_API(query: string, conversationHistory: Array<{role: string, content: string}>): Promise<string> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // For demonstration, use intelligent rule-based responses
  // In production, replace with actual AI API call
  return generateIntelligentResponse(query);
}

function generateIntelligentResponse(query: string): string {
  const msg = query.toLowerCase();
  
  // Greeting patterns
  if (msg.match(/hello|hi|hey|greetings|good morning|good afternoon/)) {
    return "Hello! Welcome to Valarmathi Computers. I'm here to help you with our computer services, repairs, and any technical questions you might have. How can I assist you today?";
  }
  
  // Pricing inquiries
  if (msg.match(/price|cost|how much|charge|fee|rate/)) {
    return "Our pricing varies by service type:\n\n💻 Basic Diagnosis: ₹300-500\n🔧 Virus Removal: ₹1,500-3,000\n📱 Screen Replacement: ₹1,500-8,000\n💾 Data Recovery: ₹3,000-10,000\n🌐 Network Setup: ₹400-1,500\n⚡ RAM Upgrade: ₹800-2,000\n\nFor exact pricing, I can provide a detailed quote based on your specific issue. What device problem are you experiencing?";
  }
  
  // Service inquiries
  if (msg.match(/service|repair|fix|what you do|offer/)) {
    return "Valarmathi Computers offers comprehensive computer services:\n\n🔧 **Hardware Services**: Motherboard repair, screen replacement, RAM/SSD upgrades\n💿 **Software Services**: OS installation, driver updates, virus removal\n🌐 **Network Services**: WiFi setup, troubleshooting, configuration\n💾 **Data Services**: Recovery, backup solutions, migration\n📅 **Maintenance**: Annual contracts, on-site support\n\nWe service all major brands: HP, Dell, Lenovo, Apple, ASUS, Acer. What specific service do you need?";
  }
  
  // Booking inquiries
  if (msg.match(/book|appointment|schedule|when can you|how to book/)) {
    return "Booking a service is easy! Here are your options:\n\n📞 **Call Us**: +91 98765 43210\n📧 **Email**: valarmathicomputer@gmail.com\n🌐 **Website**: Use our booking form\n🏠 **Visit**: Kolathupalayam, Perundurai, Erode\n\n⏰ **Response Time**: Under 2 hours during business hours\n📅 **Hours**: Mon-Sat 9AM-7PM\n\nWhat service would you like to book? I can help you get started right away!";
  }
  
  // Emergency/urgent inquiries
  if (msg.match(/emergency|urgent|asap|immediate|broken|crashed/)) {
    return "🚨 **Emergency Support Available**\n\nFor urgent issues, call us immediately at +91 98765 43210. We offer:\n\n⚡ Priority service for critical problems\n🚗 Emergency on-site support (when available)\n📞 24/7 phone support for urgent inquiries\n\nWhat's the emergency? Is it a business-critical system or personal device?";
  }
  
  // Technical support questions
  if (msg.match(/slow|freezing|crashing|virus|malware|not turning on/)) {
    return "I can help troubleshoot that! Common solutions:\n\n🐌 **Slow Performance**: Often needs cleanup, RAM upgrade, or SSD\n🔄 **Freezing/Crashing**: Could be overheating, software conflicts, or hardware issues\n🦠 **Virus/Malware**: Requires professional removal and system security setup\n⚡ **Not Turning On**: Could be power supply, motherboard, or other hardware failure\n\nFor proper diagnosis, our technicians can run comprehensive tests. Would you like to schedule a diagnostic service?";
  }
  
  // Contact/location inquiries
  if (msg.match(/contact|phone|email|address|location|where are you/)) {
    return "📍 **Contact Information**\n\n📞 **Phone**: +91 98765 43210\n📧 **Email**: valarmathicomputer@gmail.com\n🏠 **Address**: Kolathupalayam, Perundurai, Erode - 638455\n⏰ **Hours**: Mon-Sat 9AM-7PM\n\nYou can also request a free quote through our website. Need directions or want to schedule a visit?";
  }
  
  // Time/hours inquiries
  if (msg.match(/hours|time|when are you open|close/)) {
    return "⏰ **Business Hours**: Mon-Sat 9AM-7PM\n\n📞 **Phone Support**: Available during business hours\n🚨 **Emergency**: Call anytime for urgent issues\n⚡ **Response Time**: Under 2 hours during business hours\n\nNeed service outside regular hours? Call us - we may be able to accommodate urgent requests!";
  }
  
  // Brand/device inquiries
  if (msg.match(/brand|dell|hp|lenovo|apple|mac|asus|acer/)) {
    return "We service all major computer brands and devices:\n\n💻 **Laptops**: Dell, HP, Lenovo, Apple MacBook, ASUS, Acer\n🖥️ **Desktops**: All major manufacturers and custom builds\n📱 **Tablets**: iPad, Android tablets\n📱 **Phones**: Basic software issues\n\nOur technicians are certified across all platforms. What brand and model are you having issues with?";
  }
  
  // Data recovery inquiries
  if (msg.match(/data recovery|lost files|deleted|backup/)) {
    return "💾 **Data Recovery Services**\n\nWe can recover data from:\n• Failed hard drives (HDD/SSD)\n• Corrupted storage devices\n• Accidentally deleted files\n• Formatted drives\n• Virus-damaged systems\n\n🔒 **Success Rate**: 85-95% depending on damage\n⏱️ **Timeline**: 1-3 days for most cases\n💰 **Pricing**: ₹3,000-10,000 based on complexity\n\nStop using the device immediately to prevent data overwrite. Can you describe what happened to your data?";
  }
  
  // Default intelligent response
  return `Thank you for your question about "${query}". As the AI assistant for Valarmathi Computers, I'm here to help with computer services, repairs, technical support, and booking appointments.\n\nI can assist with:\n• Service information and pricing\n• Booking appointments\n• Technical troubleshooting\n• Emergency support\n• Contact information\n• And much more!\n\nCould you provide more details about what you'd like to know? I'm here to help!`;
}

function resolveChartKey(query: string): string | null {
  const q = query.toLowerCase();
  if (q.match(/price|cost|pric|charge|fee|rate/)) return 'pricing';
  if (q.match(/amc|annual|maintenance|plan|contract/)) return 'amc';
  if (q.match(/satisf|rating|happy|review|feedback/)) return 'satisfaction';
  if (q.match(/repair|job|complet|fix|monthly repair/)) return 'repairs';
  if (q.match(/issue|problem|type|distribut|common/)) return 'issueTypes';
  if (q.match(/response|time|quick|fast|speed/)) return 'responseTime';
  if (q.match(/area|city|locat|region|where/)) return 'serviceAreas';
  if (q.match(/skill|tech|expert|engineer|staff/)) return 'skills';
  return null;
}

const SUGGESTIONS = [
  'Show pricing chart',
  'Monthly repairs trend',
  'Issue type distribution',
  'AMC plan comparison',
  'Customer satisfaction',
  'Response time trend',
  'Service areas',
  'Technician skills',
  'Book a service',
  'Contact information',
  'Working hours',
  'What services do you offer?',
  'How much does it cost?',
  'Emergency support',
];

// ─── Chart renderer ───────────────────────────────────────────────────────────

function ChartRenderer({ chart }: { chart: ChartData }) {
  const { type, data, dataKeys, colors, xKey } = chart;
  const commonProps = { data, margin: { top: 5, right: 8, left: -10, bottom: 5 } };
  const ttStyle: CSSProperties = { fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' };

  return (
    <div style={{ width: '100%', height: 195 }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} />
            <Tooltip contentStyle={ttStyle} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {dataKeys.map((key, i) => (
              <Bar key={key} dataKey={key} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        ) : type === 'line' ? (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} />
            <Tooltip contentStyle={ttStyle} />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {dataKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key}
                stroke={colors[i % colors.length]} strokeWidth={2}
                dot={{ r: 3 }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        ) : type === 'area' ? (
          <AreaChart {...commonProps}>
            <defs>
              {dataKeys.map((key, i) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} />
            <Tooltip contentStyle={ttStyle} />
            {dataKeys.map((key, i) => (
              <Area key={key} type="monotone" dataKey={key}
                stroke={colors[i % colors.length]} strokeWidth={2}
                fill={`url(#grad-${key})`} />
            ))}
          </AreaChart>
        ) : type === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey={dataKeys[0]} nameKey={xKey}
              cx="50%" cy="50%" outerRadius={72}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}>
              {data.map((_e: any, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={ttStyle} />
          </PieChart>
        ) : (
          /* radar */
          <RadarChart cx="50%" cy="50%" outerRadius={72} data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey={xKey} tick={{ fontSize: 9, fill: '#6b7280' }} />
            {dataKeys.map((key, i) => (
              <Radar key={key} name={key} dataKey={key}
                stroke={colors[i % colors.length]}
                fill={colors[i % colors.length]} fillOpacity={0.25} />
            ))}
            <Tooltip contentStyle={ttStyle} />
          </RadarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Dot bounce animation via keyframe injected once ─────────────────────────

function useInjectTypingCSS() {
  useEffect(() => {
    const id = 'chart-bot-typing-css';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      @keyframes cb-bounce {
        0%,80%,100%{transform:translateY(0)}
        40%{transform:translateY(-6px)}
      }
      .cb-dot{animation:cb-bounce 1.2s infinite ease-in-out;}
      .cb-dot:nth-child(2){animation-delay:.15s;}
      .cb-dot:nth-child(3){animation-delay:.3s;}
      @keyframes cb-fadein {
        from{opacity:0;transform:translateY(10px)}
        to{opacity:1;transform:translateY(0)}
      }
      .cb-msg{animation:cb-fadein .28s ease both;}
      @keyframes cb-slideup {
        from{opacity:0;transform:scale(0.88) translateY(20px)}
        to{opacity:1;transform:scale(1) translateY(0)}
      }
      .cb-window{animation:cb-slideup .25s cubic-bezier(.34,1.56,.64,1) both;}
      @keyframes cb-pulse-ring {
        0%{box-shadow:0 0 0 0 rgba(99,102,241,.5)}
        70%{box-shadow:0 0 0 10px rgba(99,102,241,0)}
        100%{box-shadow:0 0 0 0 rgba(99,102,241,0)}
      }
      .cb-fab{animation:cb-pulse-ring 2.5s infinite;}
      .cb-pill:hover{background:#ede9fe !important;}
      .cb-sugg:hover{background:#ddd6fe !important;}
    `;
    document.head.appendChild(style);
  }, []);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AIChartBot() {
  useInjectTypingCSS();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  const buildReply = async (query: string): Promise<Omit<Message, 'id' | 'timestamp'>> => {
    const chartKey = resolveChartKey(query);
    
    // Check if user wants a chart
    if (chartKey) {
      const chart = chartDatabase[chartKey];
      return {
        sender: 'bot',
        text: chart.description,
        chart,
        suggestions: SUGGESTIONS.filter(
          s => !s.toLowerCase().includes(query.split(' ')[0].toLowerCase())
        ).slice(0, 3),
      };
    }
    
    // For other queries, use real AI API
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      const aiResponse = await callAI_API(query, conversationHistory);
      
      return {
        sender: 'bot',
        text: aiResponse,
        suggestions: SUGGESTIONS.slice(0, 4)
      };
    } catch (error) {
      // Fallback response if AI fails
      return {
        sender: 'bot',
        text: generateIntelligentResponse(query),
        suggestions: SUGGESTIONS.slice(0, 4)
      };
    }
  };

  const handleSend = async (text?: string) => {
    const query = (text ?? inputValue).trim();
    if (!query || isTyping) return;
    setInputValue('');

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 400));

    try {
      const reply = await buildReply(query);
      setMessages(prev => [...prev, { ...reply, id: (Date.now() + 1).toString(), timestamp: new Date() }]);
    } catch (error) {
      // Error fallback
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I'm having trouble connecting right now. Please try again or call us at +91 98765 43210 for immediate assistance.",
        timestamp: new Date(),
        suggestions: ['Show pricing chart', 'Contact info', 'Book service']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // ── reusable inline styles ──
  const bubbleBase: CSSProperties = {
    padding: '10px 12px',
    fontSize: 13,
    lineHeight: 1.55,
    whiteSpace: 'pre-line',
    boxShadow: '0 2px 6px rgba(0,0,0,.07)',
  };

  return (
    <>
      {/* ── Floating button ── */}
      <button
        className="cb-fab"
        onClick={() => setIsOpen(o => !o)}
        aria-label="Toggle Chart Bot"
        style={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#6366f1,#a21caf)',
          border: '3px solid white',
          boxShadow: '0 6px 18px rgba(99,102,241,.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999998,
          transition: 'transform .2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <MessageCircle size={24} color="white" />
      </button>

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          className="cb-window"
          style={{
            position: 'fixed',
            bottom: 90,
            right: 20,
            width: 370,
            maxHeight: 600,
            background: 'white',
            border: '2px solid #ede9fe',
            borderRadius: 16,
            boxShadow: '0 24px 50px rgba(99,102,241,.18)',
            zIndex: 999997,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,#6366f1,#a21caf)',
            color: 'white',
            padding: '13px 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                background: 'rgba(255,255,255,.2)', borderRadius: 8,
                padding: 6, display: 'flex',
              }}>
                <MessageCircle size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>AI Assistant</p>
                <p style={{ margin: 0, fontSize: 11, opacity: .85 }}>Ask me anything about our services</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setMessages([])} title="Clear chat" style={{
                background: 'rgba(255,255,255,.15)', border: 'none',
                borderRadius: 6, padding: 5, cursor: 'pointer', display: 'flex',
              }}>
                <RefreshCw size={14} color="white" />
              </button>
              <button onClick={() => setIsOpen(false)} style={{
                background: 'rgba(255,255,255,.15)', border: 'none',
                borderRadius: 6, padding: 5, cursor: 'pointer', display: 'flex',
              }}>
                <X size={14} color="white" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 14,
            display: 'flex', flexDirection: 'column', gap: 12,
            background: '#fafaff',
          }}>
            {/* Empty state */}
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#6366f1,#a21caf)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <Sparkles size={22} color="white" />
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 5px', color: '#1f2937' }}>
                  Welcome to AI Assistant!
                </p>
                <p style={{ color: '#6b7280', fontSize: 12, margin: '0 0 16px', lineHeight: 1.5 }}>
                  I'm your real-time AI assistant for Valarmathi Computers. Ask me anything about our services, pricing, technical support, or request charts and data insights!
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                  {SUGGESTIONS.slice(0, 8).map(s => (
                    <button key={s} onClick={() => handleSend(s)} className="cb-pill"
                      style={{
                        background: 'white', border: '1.5px solid #c4b5fd',
                        borderRadius: 20, padding: '5px 11px', fontSize: 11,
                        color: '#6366f1', cursor: 'pointer', fontWeight: 600,
                        transition: 'background .15s',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map(msg => (
              <div key={msg.id} className="cb-msg" style={{
                display: 'flex',
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start', gap: 8,
              }}>
                {/* Avatar */}
                <div style={{
                  width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  background: msg.sender === 'bot'
                    ? 'linear-gradient(135deg,#6366f1,#a21caf)'
                    : '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.sender === 'bot'
                    ? <Bot size={14} color="white" />
                    : <User size={14} color="#6b7280" />}
                </div>

                <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* Text bubble */}
                  <div style={{
                    ...bubbleBase,
                    borderRadius: msg.sender === 'user'
                      ? '16px 4px 16px 16px'
                      : '4px 16px 16px 16px',
                    background: msg.sender === 'user'
                      ? 'linear-gradient(135deg,#6366f1,#a21caf)'
                      : 'white',
                    color: msg.sender === 'user' ? 'white' : '#1f2937',
                    border: msg.sender === 'bot' ? '1.5px solid #ede9fe' : 'none',
                  }}>
                    {msg.text}
                  </div>

                  {/* Chart card */}
                  {msg.chart && (
                    <div style={{
                      background: 'white', border: '1.5px solid #ede9fe',
                      borderRadius: 12, padding: 12,
                      boxShadow: '0 2px 12px rgba(99,102,241,.1)',
                    }}>
                      <p style={{
                        margin: '0 0 8px', fontWeight: 700, fontSize: 12,
                        color: '#6366f1', display: 'flex', alignItems: 'center', gap: 5,
                      }}>
                        <MessageCircle size={13} /> {msg.chart.title}
                      </p>
                      <ChartRenderer chart={msg.chart} />
                    </div>
                  )}

                  {/* Follow-up suggestions */}
                  {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {msg.suggestions.map(s => (
                        <button key={s} onClick={() => handleSend(s)} className="cb-sugg"
                          style={{
                            background: '#ede9fe', border: 'none', borderRadius: 20,
                            padding: '4px 10px', fontSize: 10, color: '#6366f1',
                            cursor: 'pointer', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 3,
                            transition: 'background .15s',
                          }}>
                          <ChevronRight size={10} /> {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <span style={{
                    fontSize: 10, color: '#9ca3af',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}>
                    {fmt(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#6366f1,#a21caf)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MessageCircle size={14} color="white" />
                </div>
                <div style={{
                  background: 'white', border: '1.5px solid #ede9fe',
                  borderRadius: '4px 16px 16px 16px', padding: '10px 14px',
                  display: 'flex', gap: 4, alignItems: 'center',
                }}>
                  <div className="cb-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa' }} />
                  <div className="cb-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa' }} />
                  <div className="cb-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '11px 13px', borderTop: '1.5px solid #ede9fe',
            background: 'white', flexShrink: 0,
          }}>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'center',
              background: '#faf5ff', border: '1.5px solid #c4b5fd',
              borderRadius: 12, padding: '6px 6px 6px 12px',
            }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask for a chart, e.g. show pricing"
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: 13, outline: 'none', color: '#1f2937',
                }}
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !inputValue.trim()}
                style={{
                  background: inputValue.trim()
                    ? 'linear-gradient(135deg,#6366f1,#a21caf)'
                    : '#e5e7eb',
                  border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background .2s',
                  opacity: isTyping ? 0.6 : 1,
                }}
              >
                <Send size={15} color={inputValue.trim() ? 'white' : '#9ca3af'} />
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: 10, color: '#9ca3af', margin: '6px 0 0' }}>
              Powered by Real-time AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
