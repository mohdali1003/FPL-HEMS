import React, { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from 'react';
import { ChevronRight, ChevronLeft, Check, Bell, Zap, ChevronDown, ArrowRight, X, Home, BarChart2, AlertTriangle, User, Menu, Shield, TrendingDown, TrendingUp, Wifi, Sun, Droplets, Car, Thermometer, Waves, Award, Flame, Leaf, Target, Search, Wrench, Settings, Play, Square, RotateCcw, DollarSign, MessageCircle, Send, Users, Globe, ArrowDown } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   FPL HOME ENERGY MANAGEMENT SYSTEM — CEO DEMO v15
   
   v15 Enhancements:
   ✦ Home Energy Shield activation screen
   ✦ Shield-branded status card on dashboard
   ✦ Live Demand Response event simulation
   ✦ Demo Control Panel (FAB) for presenter
   ✦ Toast notifications system
   ✦ DemoContext for global demo state
   
   Prior (v9/v14):
   ✦ Glassmorphism cards with depth + frosted glass
   ✦ Animated circular HEMS Score gauge (SVG)
   ✦ Expandable alert cards with inline actions
   ✦ Achievement badges & streaks (gamification)
   ✦ Social comparison card
   ✦ Smart AI-style proactive suggestions
   ✦ Energy flow visualization with particles
   ✦ Live real-time wattage pulse
   ✦ Dynamic gradient backgrounds based on usage state
   ✦ Time-aware personalized greetings
   ═══════════════════════════════════════════════════════════════ */

const C = {
  topBar: '#009BDE',
  fplBlue: '#009BDE',
  fplDark: '#00629B',
  bg: '#F7F8FA',
  white: '#FFFFFF',
  cardBorder: '#E8ECF0',
  divider: '#F0F2F5',
  textPrimary: '#1A2233',
  textSecondary: '#5A6578',
  textMuted: '#8F99A8',
  green: '#1B8A50',
  greenLight: '#E6F7ED',
  red: '#D32F2F',
  redLight: '#FCEAEA',
  amber: '#E8850C',
  amberLight: '#FFF4E0',
  orange: '#F7941D',
  purple: '#7C3AED',
  purpleLight: '#F3EEFF',
};

/* ═══════ DEMO CONTEXT ═══════ */
const DemoContext = createContext();

const DemoProvider = ({ children }) => {
  const [state, setState] = useState({
    drEventActive: false,
    drEventPhase: 'idle', // idle | precool | active | complete
    drEventTimer: 0,
    drEarnings: 0,
    thermostatTemp: 72,
    thermostatTarget: 72,
    animSpeed: 10,
    toasts: [],
  });
  const timerRef = useRef(null);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setState(prev => ({ ...prev, toasts: [...prev.toasts, { id, message, type }] }));
    setTimeout(() => {
      setState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) }));
    }, 3000);
  }, []);

  const startDR = useCallback(() => {
    setState(prev => ({ ...prev, drEventActive: true, drEventPhase: 'precool', drEventTimer: 0, drEarnings: 0, thermostatTemp: 72 }));
    addToast('🌡️ Pre-cooling started', 'warning');
  }, [addToast]);

  const stopDR = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState(prev => ({ ...prev, drEventActive: false, drEventPhase: 'idle', drEventTimer: 0, drEarnings: 0, thermostatTemp: 72 }));
    addToast('🔄 Demo reset', 'info');
  }, [addToast]);

  const resetDemo = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState({
      drEventActive: false,
      drEventPhase: 'idle',
      drEventTimer: 0,
      drEarnings: 0,
      thermostatTemp: 72,
      thermostatTarget: 72,
      animSpeed: 10,
      toasts: [],
    });
    addToast('🔄 Demo reset', 'info');
  }, [addToast]);

  // DR event tick engine
  useEffect(() => {
    if (!state.drEventActive || state.drEventPhase === 'idle' || state.drEventPhase === 'complete') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const interval = 1000 / (state.animSpeed / 5); // at 10x speed, ticks every 500ms
    timerRef.current = setInterval(() => {
      setState(prev => {
        const nextTimer = prev.drEventTimer + 1;

        // Phase transitions
        if (nextTimer <= 5) {
          // Pre-cool: 72 → 69
          const temp = 72 - (3 * (nextTimer / 5));
          return { ...prev, drEventTimer: nextTimer, thermostatTemp: Math.round(temp * 10) / 10 };
        } else if (nextTimer === 6 && prev.drEventPhase === 'precool') {
          // Transition to active
          setTimeout(() => addToast('⚡ Peak Event Active', 'error'), 0);
          return { ...prev, drEventPhase: 'active', drEventTimer: nextTimer, thermostatTemp: 69 };
        } else if (nextTimer <= 20) {
          // Active: 69 → 75, earnings accumulate
          const progress = (nextTimer - 5) / 15;
          const temp = 69 + (6 * progress);
          const earnings = 0.50 * progress;
          return { ...prev, drEventTimer: nextTimer, thermostatTemp: Math.round(temp * 10) / 10, drEarnings: Math.round(earnings * 100) / 100 };
        } else {
          // Complete
          clearInterval(timerRef.current);
          setTimeout(() => addToast('✅ You earned $0.50!', 'success'), 0);
          return { ...prev, drEventPhase: 'complete', drEventTimer: 20, thermostatTemp: 72, drEarnings: 0.50 };
        }
      });
    }, interval);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state.drEventActive, state.drEventPhase, state.animSpeed, addToast]);

  const setAnimSpeed = useCallback((speed) => {
    setState(prev => ({ ...prev, animSpeed: speed }));
  }, []);

  return (
    <DemoContext.Provider value={{ ...state, startDR, stopDR, resetDemo, addToast, setAnimSpeed }}>
      {children}
    </DemoContext.Provider>
  );
};

const useDemo = () => useContext(DemoContext);

/* ─── GLOBAL KEYFRAME STYLES ─── */
const GlobalStyles = () => (
  <style>{`
    @keyframes pulseGlow { 0%,100%{box-shadow:0 0 6px rgba(27,138,80,0.4)} 50%{box-shadow:0 0 14px rgba(27,138,80,0.7)} }
    @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
    @keyframes floatUp { 0%{transform:translateY(6px);opacity:0} 100%{transform:translateY(0);opacity:1} }
    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes pulseDot { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:0.4} }
    @keyframes peakPulse { 0%,100%{box-shadow:0 4px 20px rgba(0,155,222,0.25)} 50%{box-shadow:0 4px 28px rgba(0,155,222,0.45), 0 0 0 4px rgba(0,155,222,0.08)} }
    @keyframes particleFloat {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      10% { opacity: 0.8; }
      90% { opacity: 0.3; }
      100% { transform: translateY(-120px) translateX(var(--drift)); opacity: 0; }
    }
    @keyframes gaugeStroke { 0%{stroke-dasharray:0 264} }
    @keyframes badgePop { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
    @keyframes expandIn { 0%{max-height:0;opacity:0} 100%{max-height:400px;opacity:1} }
    @keyframes collapseOut { 0%{max-height:400px;opacity:1} 100%{max-height:0;opacity:0} }
    @keyframes shieldPop { 0%{transform:scale(0.3);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
    @keyframes shieldGlow { 0%,100%{box-shadow:0 0 20px rgba(0,155,222,0.3)} 50%{box-shadow:0 0 40px rgba(0,155,222,0.6), 0 0 60px rgba(0,155,222,0.2)} }
    @keyframes checkPop { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
    @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes slideUp { 0%{transform:translateY(100%)} 100%{transform:translateY(0)} }
    @keyframes slideDown { 0%{transform:translateY(0)} 100%{transform:translateY(100%)} }
    @keyframes toastIn { 0%{transform:translateY(-20px);opacity:0} 100%{transform:translateY(0);opacity:1} }
    @keyframes toastOut { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-20px);opacity:0} }
    @keyframes iconPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
    .glass-card {
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow: 0 8px 32px rgba(0,155,222,0.06), 0 2px 8px rgba(0,0,0,0.03);
    }
    .glass-dark {
      background: rgba(0,98,155,0.85);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
  `}</style>
);

/* ─── ANIMATED NUMBER ─── */
const AnimNum = ({ value, prefix = '', suffix = '', dur = 800, decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    if (isNaN(num)) { setDisplay(value); return; }
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay((num * eased).toFixed(decimals));
      if (progress < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [value, dur, decimals]);
  return <>{prefix}{display}{suffix}</>;
};

/* ─── STAGGER CHILDREN ─── */
const Stagger = ({ children, delay = 60, className = '' }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => (
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 0.4s ease ${i * delay}ms, transform 0.4s ease ${i * delay}ms`,
        }}>
          {child}
        </div>
      ))}
    </div>
  );
};

/* ─── SCREEN TRANSITION WRAPPER ─── */
const Screen = ({ children, direction = 'right' }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true))); }, []);
  const from = direction === 'right' ? 'translateX(40px)' : direction === 'left' ? 'translateX(-40px)' : 'translateY(20px)';
  return (
    <div style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'none' : from,
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      minHeight: '100vh',
    }}>
      {children}
    </div>
  );
};

/* ─── REAL FPL LOGO ─── */
const FPLLogo = ({ size = 62 }) => {
  const scale = size / 62;
  return (
    <svg width={62 * scale} height={57 * scale} viewBox="0 0 62 57" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="fla" d="M0 0h13v11.707H0z"/>
        <path id="flc" d="M0 0h13v11.707H0z"/>
        <path id="fle" d="M0 0h15v11.707H0z"/>
      </defs>
      <g fill="none" fillRule="evenodd">
        <path d="M.027 22.043A21.22 21.22 0 0 1 0 20.926C0 9.367 9.367 0 20.926 0c8.008 0 14.96 4.496 18.48 11.098l-.05.015c-.051.055-.102.106-.153.157.043.101-.125.128-.078.23h-.309c-.214.176-.402.398-.691.46-.11.052-.07.15-.078.235-.05.047-.102.102-.156.153h-.383c-.207.265-.531.382-.77.613h-.152c-.191.047-.246.297-.461.309l-.387.386h-.152c-.57.524-1.29.848-1.848 1.383-.172.043-.32.129-.46.23-.383.368-.876.602-1.235 1-.625.294-1.086.833-1.691 1.157-.258.422-.805.512-1.079.922-.097-.043-.128.12-.23.078-.156.203-.41.308-.54.539-1.773 1.113-3.276 2.582-5 3.77l-.616.617c-.098-.047-.13.12-.23.074a930.814 930.814 0 0 0-5.696 4.695c-.168.024-.027-.113-.074-.152.57-1.04 1.531-1.793 2.078-2.848a1.99 1.99 0 0 1 .46-.387c.075-.218.223-.382.384-.535.132.024.148-.113.23-.156-.043-.184.148-.293.156-.461.13-.129.258-.258.383-.387h.23c.055-.05.106-.101.157-.152v-.309c.16-.117.242-.336.46-.386.141-.098.212-.25.31-.383.128.027.148-.11.23-.152v-.157c.45-.289.765-.722 1.156-1.074a38.69 38.69 0 0 1 1.77-2.156c.32-.106.41-.469.691-.617.875-1.047 1.742-2.098 2.691-3.075.012-.125.086-.218.157-.308.218-.074.332-.293.535-.387.012-.121.086-.215.156-.309.129.028.149-.109.23-.152.07-.223.294-.336.387-.539.164.008.196-.168.305-.23.078-.36.32-.586.617-.77.067-.16.149-.309.23-.46v-.231c.051-.051.106-.106.153-.157-.102-.664-.023-1.359-.309-2-.015-.156.07-.27.157-.382-.149-.121-.102-.336-.23-.465v-.305c-.102-.14-.255-.21-.388-.309-.097-.046-.128.122-.23.079-.223.265-.512.457-.77.691-.613.402-1.199.84-1.77 1.305-.179.023-.269.234-.46.234-.668.547-1.328 1.098-2.078 1.54-.14.167-.305.308-.461.46-.102-.047-.129.121-.23.078-.278.293-.649.473-.922.766-1.66 1.265-3.286 2.566-4.926 3.851-1.024.848-2.047 1.7-3.078 2.54v-.157c.203-.156.308-.406.539-.539-.043-.148.191-.156.152-.305 1.285-1.437 2.535-2.902 3.848-4.312-.047-.098.12-.129.078-.23.344-.325.648-.684 1-1 .07-.22.293-.333.383-.536.222-.05.3-.27.465-.386.019-.192.214-.25.304-.387.13.027.149-.11.23-.152-.038-.149.196-.16.157-.31.137-.07.156-.253.308-.308a.64.64 0 0 0 .153-.308c1.094-1.14 2.07-2.387 3.156-3.54.024-.128-.066-.277.078-.382-.12-.031-.035-.2-.156-.23.027-.13-.066-.282.078-.387-.18-.23-.156-.5-.156-.77.055-.035.098-.078.078-.152-.184-.324-.023-.668-.078-1-.235-.406-.406-.828-.383-1.309-.05-.05-.102-.105-.156-.152-.465.05-.742.531-1.23.535-.692.504-1.395.988-2.153 1.387-.219.222-.488.383-.695.617-.098-.047-.13.121-.23.074-.052.05-.102.102-.153.156-.102-.046-.13.122-.23.075-.38.433-.942.636-1.31 1.078h-.155c-.336.23-.598.562-1 .695-.254.23-.543.422-.766.691-.457.153-.703.618-1.156.77-.336.336-.735.598-1.078.922-.098-.043-.13.121-.23.078l-.384.383a2.989 2.989 0 0 0-.695.46c-.856.91-1.984 1.489-2.848 2.387-.097-.043-.129.122-.23.079-.543.62-1.281 1.02-1.848 1.617-.12.008-.21.082-.305.152-.511.625-1.246 1.008-1.77 1.617-.1-.047-.132.121-.233.075-.797.855-1.778 1.5-2.614 2.308-.101-.043-.133.121-.23.078-1.164 1.121-2.399 2.153-3.664 3.145l-.192.242z" fill="#2F97DA" fillRule="nonzero"/>
        <path d="M40.95 14.719c.609 1.96.902 4.047.902 6.207 0 11.558-9.368 20.926-20.926 20.926-10.106 0-18.512-7.067-20.469-16.59l.176-.168c.133-.18.246-.282.402-.438.922-.82 1.863-1.62 2.77-2.46 2.265-1.864 4.484-3.778 6.773-5.618 2.852-2.113 5.617-4.34 8.461-6.465h.156c.262-.195.528-.386.77-.613.32-.082.492-.438.844-.46.078-.08.156-.157.23-.231.172-.043.324-.13.465-.23-.024.187-.219.245-.309.382.047.101-.12.133-.078.23-1.59 1.774-3.187 3.532-4.77 5.309.048.102-.12.133-.077.23-.739.801-1.391 1.684-2.153 2.465.04.149-.195.16-.156.309-.16.195-.363.351-.54.539.048.098-.12.129-.073.23a6.338 6.338 0 0 1-.54.536c.04.152-.195.16-.156.308-.132.07-.156.254-.304.309-.41.617-.82 1.23-1.235 1.847.016.278.102.528.235.77.043.34-.063.664-.078 1 .238.176.222.52.46.691.02.297.211.551.23.848.083.043.102.18.231.152.399-.422.899-.742 1.23-1.23.302-.117.524-.352.77-.54-.027-.128.114-.148.157-.23.097.043.129-.12.23-.078.3-.343.7-.578 1-.922.48-.304.84-.78 1.387-1 .191-.168.336-.379.539-.539.226-.183.496-.312.691-.539a3.91 3.91 0 0 0 .54-.308v-.153l.152-.152c.12.05.199-.086.308-.078.051-.04.098-.082.075-.156.183-.055.324-.18.464-.305.063-.211.313.039.383-.156-.039-.051-.078-.098-.152-.075.035-.23.32-.253.383-.464h.386l.461-.461-.078-.078c.168-.094.344-.16.54-.153.23-.129.41-.308.538-.539h.23c.137-.148.345-.215.462-.383-.051-.05-.102-.105-.153-.156.078-.074.153-.152.23-.23.087.007.184-.032.231.078.168.054.301-.102.461-.078.055-.051.106-.102.157-.157V15.5c.308-.117.445-.426.69-.613-.042-.102.122-.13.079-.23l.152-.157h.309l.152-.152c-.043-.102.125-.133.078-.23.067-.126.215-.141.309-.231.066-.172.211-.032.309-.078-.211.277-.403.566-.696.77.047.1-.12.128-.078.23-1.668 1.699-3.086 3.62-4.77 5.312.048.098-.12.129-.077.227-.399.347-.684.8-1.075 1.156.043.101-.125.129-.078.23-.394.38-.68.856-1.078 1.23-1.57 1.864-2.887 3.919-4.46 5.774v.153c-.349.449-.767.855-1 1.382l-.388.387c-.18.309-.359.617-.539.922.078.223.188.422.309.617v.617c.094.09.105.239.23.309v.152c.094.09.11.239.23.309-.01.219.169.39.157.613.09.094.106.242.23.309.731-.602 1.38-1.285 2-2 .157-.031.25-.168.383-.23.051-.223.27-.301.387-.462.367-.152.563-.53.922-.691.422-.434.91-.785 1.309-1.234.101.047.132-.121.23-.078.566-.63 1.34-1.008 1.926-1.618.098.047.129-.117.23-.074.196-.246.48-.39.692-.613.12-.012.215-.086.308-.156-.02-.075.024-.118.078-.153.098.043.13-.12.23-.078.282-.258.595-.48.849-.77.21-.042.304-.296.535-.308.125-.066.14-.215.23-.309.2.012.281-.21.465-.23.734-.61 1.488-1.195 2.309-1.692-.028-.128.109-.148.152-.23.187.047.293-.145.46-.156.11-.047.071-.145.079-.23.172-.083.3.1.461.077.121-.03.031-.199.152-.23-.05-.121.09-.195.078-.309h.618a.64.64 0 0 0 .152-.308c.074.023.117-.024.152-.074-.02-.079.024-.118.078-.157h.23c.079-.074.157-.152.235-.23v-.152c.145-.141.211-.344.383-.465h.23c0 .207-.257.152-.308.308-.02.074.023.117.078.157.164.007.195-.168.309-.231h.152l.387-.387h.23c.125-.066.137-.215.23-.308.02-.075-.023-.117-.077-.153-.075-.02-.118.024-.153.078-.078.024-.097-.007-.078-.078.031-.12.2-.03.23-.152.239-.047.454.121.692.074.14-.168.309-.308.465-.46.25-.02.433-.235.691-.231l.23-.23h.153c.113-.067.145-.239.309-.231.14-.102.21-.254.308-.387-.05-.11-.148-.07-.23-.074.242-.18.515-.031.77-.078.144-.059.007-.254.156-.309.035.055.078.098.152.078.101-.12.281-.113.383-.23-.051-.04-.098-.082-.075-.156l.153-.153c.187-.047.293.145.46.153.087-.141.177-.282.31-.383-.079-.13-.204-.063-.31-.078-.05.05-.1.101-.152.156h-.23c-.023-.078.023-.117.078-.156.148-.055.297-.102.457-.078.094-.09.242-.106.309-.23-.028.132.11.148.156.23h.152c.078-.075.157-.153.23-.23.012-.122.083-.216.157-.31h.23c.075-.074.153-.152.23-.226.075.125.204.059.306.074.035-.12.203-.031.234-.152v-.156h.305c.054-.036.101-.079.078-.153.183-.058.324-.18.46-.308h.31c.148-.09.292-.188.46-.23.11-.052.075-.15.078-.231.106-.145.258-.051.387-.078.121-.032.031-.2.152-.23h.157c.074-.079.152-.153.23-.231.082-.004.18.03.23-.078v-.153c.075.02.114-.023.153-.078.04.055.078.098.152.078.078-.078.157-.152.235-.23.082-.008.18.031.23-.078h.094l.113-.09z" fill="#2F97DA" fillRule="nonzero"/>
        <g transform="translate(21 45)">
          <clipPath id="flb"><use href="#fla"/></clipPath>
          <path fill="#2F97DA" fillRule="nonzero" clipPath="url(#flb)" d="M.004.012h12.695v3H3.543v2.386h9.078V8.32H3.465v3.313H.004z"/>
        </g>
        <g transform="translate(49 45)">
          <clipPath id="fld"><use href="#flc"/></clipPath>
          <path fill="#2F97DA" fillRule="nonzero" clipPath="url(#fld)" d="M.594.012h3.113v8.695h8.848v3H.55z"/>
        </g>
        <g transform="translate(34 45)">
          <clipPath id="flf"><use href="#fle"/></clipPath>
          <path d="M11.242.012H.797l-.02 11.695h3.387V8.32h7.465s3.152-.46 3.152-4.156c0-3.691-3.539-4.152-3.539-4.152m-.426 5.347H4.164V3.012h6.387s.922 0 1 1.078c.078 1.074-.735 1.27-.735 1.27" fill="#2F97DA" fillRule="nonzero" clipPath="url(#flf)"/>
        </g>
      </g>
    </svg>
  );
};

const FPLLogoSmall = ({ size = 28 }) => {
  const scale = size / 28;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 * scale }}>
      <svg width={24 * scale} height={22 * scale} viewBox="0 0 62 57" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="fla2" d="M0 0h13v11.707H0z"/>
          <path id="flc2" d="M0 0h13v11.707H0z"/>
          <path id="fle2" d="M0 0h15v11.707H0z"/>
        </defs>
        <g fill="none" fillRule="evenodd">
          <path d="M.027 22.043A21.22 21.22 0 0 1 0 20.926C0 9.367 9.367 0 20.926 0c8.008 0 14.96 4.496 18.48 11.098l-.05.015c-.051.055-.102.106-.153.157.043.101-.125.128-.078.23h-.309c-.214.176-.402.398-.691.46-.11.052-.07.15-.078.235-.05.047-.102.102-.156.153h-.383c-.207.265-.531.382-.77.613h-.152c-.191.047-.246.297-.461.309l-.387.386h-.152c-.57.524-1.29.848-1.848 1.383-.172.043-.32.129-.46.23-.383.368-.876.602-1.235 1-.625.294-1.086.833-1.691 1.157-.258.422-.805.512-1.079.922-.097-.043-.128.12-.23.078-.156.203-.41.308-.54.539-1.773 1.113-3.276 2.582-5 3.77l-.616.617c-.098-.047-.13.12-.23.074a930.814 930.814 0 0 0-5.696 4.695c-.168.024-.027-.113-.074-.152.57-1.04 1.531-1.793 2.078-2.848a1.99 1.99 0 0 1 .46-.387c.075-.218.223-.382.384-.535.132.024.148-.113.23-.156-.043-.184.148-.293.156-.461.13-.129.258-.258.383-.387h.23c.055-.05.106-.101.157-.152v-.309c.16-.117.242-.336.46-.386.141-.098.212-.25.31-.383.128.027.148-.11.23-.152v-.157c.45-.289.765-.722 1.156-1.074a38.69 38.69 0 0 1 1.77-2.156c.32-.106.41-.469.691-.617.875-1.047 1.742-2.098 2.691-3.075.012-.125.086-.218.157-.308.218-.074.332-.293.535-.387.012-.121.086-.215.156-.309.129.028.149-.109.23-.152.07-.223.294-.336.387-.539.164.008.196-.168.305-.23.078-.36.32-.586.617-.77.067-.16.149-.309.23-.46v-.231c.051-.051.106-.106.153-.157-.102-.664-.023-1.359-.309-2-.015-.156.07-.27.157-.382-.149-.121-.102-.336-.23-.465v-.305c-.102-.14-.255-.21-.388-.309-.097-.046-.128.122-.23.079-.223.265-.512.457-.77.691-.613.402-1.199.84-1.77 1.305-.179.023-.269.234-.46.234-.668.547-1.328 1.098-2.078 1.54-.14.167-.305.308-.461.46-.102-.047-.129.121-.23.078-.278.293-.649.473-.922.766-1.66 1.265-3.286 2.566-4.926 3.851-1.024.848-2.047 1.7-3.078 2.54v-.157c.203-.156.308-.406.539-.539-.043-.148.191-.156.152-.305 1.285-1.437 2.535-2.902 3.848-4.312-.047-.098.12-.129.078-.23.344-.325.648-.684 1-1 .07-.22.293-.333.383-.536.222-.05.3-.27.465-.386.019-.192.214-.25.304-.387.13.027.149-.11.23-.152-.038-.149.196-.16.157-.31.137-.07.156-.253.308-.308a.64.64 0 0 0 .153-.308c1.094-1.14 2.07-2.387 3.156-3.54.024-.128-.066-.277.078-.382-.12-.031-.035-.2-.156-.23.027-.13-.066-.282.078-.387-.18-.23-.156-.5-.156-.77.055-.035.098-.078.078-.152-.184-.324-.023-.668-.078-1-.235-.406-.406-.828-.383-1.309-.05-.05-.102-.105-.156-.152-.465.05-.742.531-1.23.535-.692.504-1.395.988-2.153 1.387-.219.222-.488.383-.695.617-.098-.047-.13.121-.23.074-.052.05-.102.102-.153.156-.102-.046-.13.122-.23.075-.38.433-.942.636-1.31 1.078h-.155c-.336.23-.598.562-1 .695-.254.23-.543.422-.766.691-.457.153-.703.618-1.156.77-.336.336-.735.598-1.078.922-.098-.043-.13.121-.23.078l-.384.383a2.989 2.989 0 0 0-.695.46c-.856.91-1.984 1.489-2.848 2.387-.097-.043-.129.122-.23.079-.543.62-1.281 1.02-1.848 1.617-.12.008-.21.082-.305.152-.511.625-1.246 1.008-1.77 1.617-.1-.047-.132.121-.233.075-.797.855-1.778 1.5-2.614 2.308-.101-.043-.133.121-.23.078-1.164 1.121-2.399 2.153-3.664 3.145l-.192.242z" fill="#2F97DA" fillRule="nonzero"/>
          <path d="M40.95 14.719c.609 1.96.902 4.047.902 6.207 0 11.558-9.368 20.926-20.926 20.926-10.106 0-18.512-7.067-20.469-16.59l.176-.168c.133-.18.246-.282.402-.438.922-.82 1.863-1.62 2.77-2.46 2.265-1.864 4.484-3.778 6.773-5.618 2.852-2.113 5.617-4.34 8.461-6.465h.156c.262-.195.528-.386.77-.613.32-.082.492-.438.844-.46.078-.08.156-.157.23-.231.172-.043.324-.13.465-.23-.024.187-.219.245-.309.382.047.101-.12.133-.078.23-1.59 1.774-3.187 3.532-4.77 5.309.048.102-.12.133-.077.23-.739.801-1.391 1.684-2.153 2.465.04.149-.195.16-.156.309-.16.195-.363.351-.54.539.048.098-.12.129-.073.23a6.338 6.338 0 0 1-.54.536c.04.152-.195.16-.156.308-.132.07-.156.254-.304.309-.41.617-.82 1.23-1.235 1.847.016.278.102.528.235.77.043.34-.063.664-.078 1 .238.176.222.52.46.691.02.297.211.551.23.848.083.043.102.18.231.152.399-.422.899-.742 1.23-1.23.302-.117.524-.352.77-.54-.027-.128.114-.148.157-.23.097.043.129-.12.23-.078.3-.343.7-.578 1-.922.48-.304.84-.78 1.387-1 .191-.168.336-.379.539-.539.226-.183.496-.312.691-.539a3.91 3.91 0 0 0 .54-.308v-.153l.152-.152c.12.05.199-.086.308-.078.051-.04.098-.082.075-.156.183-.055.324-.18.464-.305.063-.211.313.039.383-.156-.039-.051-.078-.098-.152-.075.035-.23.32-.253.383-.464h.386l.461-.461-.078-.078c.168-.094.344-.16.54-.153.23-.129.41-.308.538-.539h.23c.137-.148.345-.215.462-.383-.051-.05-.102-.105-.153-.156.078-.074.153-.152.23-.23.087.007.184-.032.231.078.168.054.301-.102.461-.078.055-.051.106-.102.157-.157V15.5c.308-.117.445-.426.69-.613-.042-.102.122-.13.079-.23l.152-.157h.309l.152-.152c-.043-.102.125-.133.078-.23.067-.126.215-.141.309-.231.066-.172.211-.032.309-.078-.211.277-.403.566-.696.77.047.1-.12.128-.078.23-1.668 1.699-3.086 3.62-4.77 5.312.048.098-.12.129-.077.227-.399.347-.684.8-1.075 1.156.043.101-.125.129-.078.23-.394.38-.68.856-1.078 1.23-1.57 1.864-2.887 3.919-4.46 5.774v.153c-.349.449-.767.855-1 1.382l-.388.387c-.18.309-.359.617-.539.922.078.223.188.422.309.617v.617c.094.09.105.239.23.309v.152c.094.09.11.239.23.309-.01.219.169.39.157.613.09.094.106.242.23.309.731-.602 1.38-1.285 2-2 .157-.031.25-.168.383-.23.051-.223.27-.301.387-.462.367-.152.563-.53.922-.691.422-.434.91-.785 1.309-1.234.101.047.132-.121.23-.078.566-.63 1.34-1.008 1.926-1.618.098.047.129-.117.23-.074.196-.246.48-.39.692-.613.12-.012.215-.086.308-.156-.02-.075.024-.118.078-.153.098.043.13-.12.23-.078.282-.258.595-.48.849-.77.21-.042.304-.296.535-.308.125-.066.14-.215.23-.309.2.012.281-.21.465-.23.734-.61 1.488-1.195 2.309-1.692-.028-.128.109-.148.152-.23.187.047.293-.145.46-.156.11-.047.071-.145.079-.23.172-.083.3.1.461.077.121-.03.031-.199.152-.23-.05-.121.09-.195.078-.309h.618a.64.64 0 0 0 .152-.308c.074.023.117-.024.152-.074-.02-.079.024-.118.078-.157h.23c.079-.074.157-.152.235-.23v-.152c.145-.141.211-.344.383-.465h.23c0 .207-.257.152-.308.308-.02.074.023.117.078.157.164.007.195-.168.309-.231h.152l.387-.387h.23c.125-.066.137-.215.23-.308.02-.075-.023-.117-.077-.153-.075-.02-.118.024-.153.078-.078.024-.097-.007-.078-.078.031-.12.2-.03.23-.152.239-.047.454.121.692.074.14-.168.309-.308.465-.46.25-.02.433-.235.691-.231l.23-.23h.153c.113-.067.145-.239.309-.231.14-.102.21-.254.308-.387-.05-.11-.148-.07-.23-.074.242-.18.515-.031.77-.078.144-.059.007-.254.156-.309.035.055.078.098.152.078.101-.12.281-.113.383-.23-.051-.04-.098-.082-.075-.156l.153-.153c.187-.047.293.145.46.153.087-.141.177-.282.31-.383-.079-.13-.204-.063-.31-.078-.05.05-.1.101-.152.156h-.23c-.023-.078.023-.117.078-.156.148-.055.297-.102.457-.078.094-.09.242-.106.309-.23-.028.132.11.148.156.23h.152c.078-.075.157-.153.23-.23.012-.122.083-.216.157-.31h.23c.075-.074.153-.152.23-.226.075.125.204.059.306.074.035-.12.203-.031.234-.152v-.156h.305c.054-.036.101-.079.078-.153.183-.058.324-.18.46-.308h.31c.148-.09.292-.188.46-.23.11-.052.075-.15.078-.231.106-.145.258-.051.387-.078.121-.032.031-.2.152-.23h.157c.074-.079.152-.153.23-.231.082-.004.18.03.23-.078v-.153c.075.02.114-.023.153-.078.04.055.078.098.152.078.078-.078.157-.152.235-.23.082-.008.18.031.23-.078h.094l.113-.09z" fill="#2F97DA" fillRule="nonzero"/>
          <g transform="translate(21 45)">
            <clipPath id="flb2"><use href="#fla2"/></clipPath>
            <path fill="#2F97DA" fillRule="nonzero" clipPath="url(#flb2)" d="M.004.012h12.695v3H3.543v2.386h9.078V8.32H3.465v3.313H.004z"/>
          </g>
          <g transform="translate(49 45)">
            <clipPath id="fld2"><use href="#flc2"/></clipPath>
            <path fill="#2F97DA" fillRule="nonzero" clipPath="url(#fld2)" d="M.594.012h3.113v8.695h8.848v3H.55z"/>
          </g>
          <g transform="translate(34 45)">
            <clipPath id="flf2"><use href="#fle2"/></clipPath>
            <path d="M11.242.012H.797l-.02 11.695h3.387V8.32h7.465s3.152-.46 3.152-4.156c0-3.691-3.539-4.152-3.539-4.152m-.426 5.347H4.164V3.012h6.387s.922 0 1 1.078c.078 1.074-.735 1.27-.735 1.27" fill="#2F97DA" fillRule="nonzero" clipPath="url(#flf2)"/>
          </g>
        </g>
      </svg>
      <span style={{ fontSize: 11 * scale, fontWeight: 600, color: C.textSecondary, letterSpacing: 0.3 }}>Energy Manager</span>
    </div>
  );
};

/* ─── HEADER ─── */
const FPLHeader = ({ name = "Mohammad Ali", address = "10734 STELLAR CIR", step, totalSteps }) => (
  <div style={{ position: 'sticky', top: 0, zIndex: 30 }}>
    <div style={{ height: 5, background: `linear-gradient(90deg, ${C.fplBlue}, ${C.fplDark})` }} />
    <div className="flex items-center justify-between px-5 py-3.5 glass-card" style={{ borderRadius: 0, border: 'none', borderBottom: `1px solid ${C.divider}` }}>
      <FPLLogoSmall size={28} />
      {step != null ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              width: i < step ? 20 : 8, height: 4, borderRadius: 2,
              background: i < step ? C.fplBlue : i === step ? C.fplBlue : '#D4DAE3',
              opacity: i <= step ? 1 : 0.5,
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>
      ) : (
        <div className="text-right">
          <div style={{ fontSize: 13, fontWeight: 600, color: C.fplDark }}>{name}</div>
          <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: '0.02em' }}>{address}</div>
        </div>
      )}
    </div>
  </div>
);

/* ─── BOTTOM NAV ─── */
const BottomNav = ({ active = 'Home', onNav }) => {
  const tabs = [
    { id: 'Home', icon: Home },
    { id: 'Usage', icon: BarChart2 },
    { id: 'Impact', icon: Globe },
    { id: 'Account', icon: User },
    { id: 'Menu', icon: Menu },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: 448, margin: '0 auto' }}>
      <div style={{ height: 2, background: `linear-gradient(90deg, ${C.fplBlue}, ${C.fplDark})` }} />
      <div className="flex justify-around py-2 px-2 glass-card" style={{ borderRadius: 0, border: 'none', borderTop: `1px solid rgba(0,0,0,0.04)` }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => onNav?.(t.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl"
              style={{
                background: isActive ? `${C.fplBlue}0D` : 'transparent',
                transition: 'all 0.25s ease',
              }}>
              <t.icon size={21} color={isActive ? C.fplBlue : C.textMuted} strokeWidth={isActive ? 2.3 : 1.7}
                style={{ transition: 'all 0.2s ease', transform: isActive ? 'scale(1.05)' : 'scale(1)' }} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? C.fplBlue : C.textMuted, transition: 'all 0.2s ease' }}>{t.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── SHARED COMPONENTS ─── */
const Tap = ({ children, onClick, className = '', style = {} }) => (
  <button onClick={onClick}
    className={`active:scale-[0.97] active:opacity-80 transition-all duration-150 ${className}`}
    style={style}>{children}</button>
);

const FPLButton = ({ children, onClick, variant = 'filled', className = '', disabled = false }) => {
  const s = variant === 'filled'
    ? { background: `linear-gradient(135deg, ${C.fplBlue} 0%, ${C.fplDark} 100%)`, color: '#fff', border: 'none' }
    : { background: C.white, color: C.fplBlue, border: `2px solid ${C.fplBlue}` };
  return (
    <Tap onClick={disabled ? undefined : onClick}
      className={`py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 ${className}`}
      style={{ ...s, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: disabled ? 0.5 : 1, boxShadow: variant === 'filled' ? '0 4px 16px rgba(0,155,222,0.25)' : 'none', transition: 'all 0.3s ease' }}>
      {children}
    </Tap>
  );
};

const GlassCard = ({ children, className = '', borderLeft = false, style = {}, onClick, gradient = false }) => (
  <div onClick={onClick}
    className={`rounded-2xl glass-card ${onClick ? 'cursor-pointer active:scale-[0.98] active:opacity-90' : ''} ${className}`}
    style={{
      borderLeft: borderLeft ? `4px solid ${C.fplBlue}` : undefined,
      background: gradient
        ? 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.72) 100%)'
        : undefined,
      transition: 'all 0.25s ease',
      ...style,
    }}>
    {children}
  </div>
);

const Pill = ({ children, color = C.fplBlue }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full"
    style={{ fontSize: 10, fontWeight: 700, color, background: `${color}14`, letterSpacing: '0.04em' }}>{children}</span>
);

const Section = ({ title, children, action, onAction }) => (
  <div className="px-5 mb-7">
    <div className="flex items-center justify-between mb-3">
      <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
      {action && <Tap onClick={onAction}><span style={{ fontSize: 12, color: C.fplBlue, fontWeight: 600 }}>{action}</span></Tap>}
    </div>
    {children}
  </div>
);

/* ─── CIRCULAR SCORE GAUGE ─── */
const ScoreGauge = ({ score = 78, size = 120 }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 300); }, []);
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const strokeLen = (score / 100) * circumference;
  const color = score > 80 ? C.green : score > 60 ? C.fplBlue : C.amber;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke={C.divider} strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={animate ? `${strokeLen} ${circumference}` : `0 ${circumference}`}
          style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: 28, fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>
          {animate ? <AnimNum value={score} dur={1200} /> : '0'}
        </span>
        <span style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
};

/* ─── ACHIEVEMENT BADGES ─── */
const AchievementBadge = ({ icon, title, earned, delay = 0 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 200 + delay); }, [delay]);
  return (
    <div className="text-center p-3 rounded-2xl"
      style={{
        background: earned ? 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 100%)' : '#F5F6F8',
        opacity: show ? 1 : 0,
        transform: show ? 'scale(1)' : 'scale(0.6)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: earned ? 'none' : 'grayscale(1)',
        minWidth: 80,
      }}>
      <div style={{ fontSize: 24, lineHeight: 1.2 }}>{icon}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: earned ? C.textPrimary : C.textMuted, marginTop: 4, lineHeight: 1.2 }}>{title}</div>
      {earned && <div style={{ fontSize: 9, color: C.green, marginTop: 3, fontWeight: 700 }}>✓ Earned</div>}
    </div>
  );
};

/* ─── SOCIAL COMPARISON ─── */
const ComparisonCard = () => (
  <GlassCard className="p-4" gradient style={{ background: 'linear-gradient(135deg, rgba(230,247,237,0.9) 0%, rgba(225,245,254,0.85) 100%)' }}>
    <div className="flex items-center justify-between">
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Top 15% in your area</div>
        <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 3 }}>More efficient than 2,847 nearby FPL homes</div>
      </div>
      <span style={{ fontSize: 28 }}>🏆</span>
    </div>
  </GlassCard>
);

/* ─── SMART SUGGESTION (AI Feel) ─── */
const SmartSuggestion = ({ onDismiss }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 600); }, []);
  return (
    <div className="rounded-2xl p-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(243,238,255,0.95) 0%, rgba(252,228,236,0.9) 100%)',
        border: `1px solid ${C.purple}20`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.5s ease',
      }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: C.purple }}>
          <span style={{ fontSize: 14 }}>✨</span>
        </div>
        <div className="flex-1">
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4A1D96' }}>I noticed you're usually away by now</div>
          <div style={{ fontSize: 12, color: '#6B4DAA', marginTop: 4, lineHeight: 1.5 }}>
            Your AC is still at 72°F. Adjusting to 78°F could save ~$0.85 today.
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button className="px-4 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: C.purple }}>
              Yes, save energy
            </button>
            <button onClick={onDismiss} className="px-4 py-1.5 rounded-full text-xs font-medium"
              style={{ color: C.purple }}>
              I'm home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── LIVE USAGE PULSE ─── */
const LiveUsage = ({ watts = 1247 }) => (
  <div className="flex items-center gap-2.5">
    <div style={{
      width: 8, height: 8, borderRadius: 4, background: C.green,
      animation: 'pulseDot 1.5s ease-in-out infinite',
    }} />
    <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>
      {watts.toLocaleString()}W
    </span>
    <span style={{ fontSize: 11, color: C.textMuted }}>
      {watts < 500 ? 'Low usage' : watts < 1500 ? 'Normal' : 'High 🔥'}
    </span>
  </div>
);

/* ─── ENERGY FLOW VISUALIZATION ─── */
const EnergyFlow = () => {
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      dur: 2.5 + Math.random() * 2,
      delay: Math.random() * 3,
      drift: (Math.random() - 0.5) * 40,
      size: 2 + Math.random() * 2,
    })), []);

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ height: 140, background: `linear-gradient(135deg, ${C.fplDark} 0%, #003F6B 100%)` }}>
      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            background: '#FFD54F',
            left: `${p.left}%`,
            bottom: 0,
            opacity: 0,
            '--drift': `${p.drift}px`,
            animation: `particleFloat ${p.dur}s ease-out infinite ${p.delay}s`,
          }} />
      ))}
      <div className="absolute inset-0 flex items-center px-5 z-10">
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            <AnimNum value={1247} dur={1000} />
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>kWh this month</div>
        </div>
      </div>
    </div>
  );
};

/* ─── EXPANDABLE ALERT CARD ─── */
const ExpandableAlert = ({ alert: a, onOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const pc = { HIGH: C.red, URGENT: C.red, MEDIUM: C.amber, LOW: C.fplBlue };
  const color = pc[a.p];

  return (
    <GlassCard className="mb-2.5 overflow-hidden" style={{ borderLeft: `3px solid ${color}` }}>
      <Tap onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-start gap-3 p-4">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}0C` }}>
            <a.icon size={17} color={color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Pill color={color}>{a.p}</Pill>
              {a.sav !== 'Transparency' && (
                <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>{a.sav}</span>
              )}
            </div>
            <div className="truncate" style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{a.title}</div>
            <div className="truncate" style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{a.sub}</div>
          </div>
          <div className="flex-shrink-0 mt-1"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
            <ChevronDown size={16} color={C.textMuted} />
          </div>
        </div>
      </Tap>
      <div style={{
        maxHeight: expanded ? 280 : 0,
        opacity: expanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s ease, opacity 0.3s ease',
      }}>
        <div className="px-4 pb-4">
          <p style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6, marginBottom: 12 }}>{a.detail}</p>
          <div className="flex gap-2">
            <button onClick={() => onOpen(a)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})` }}>
              View Details
            </button>
            <button className="flex-1 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: C.bg, color: C.textSecondary }}>
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

/* ─── DONUT CHART ─── */
const DonutChart = ({ data, size = 140 }) => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { setTimeout(() => setAnimate(true), 200); }, []);
  const total = data.reduce((s, d) => s + d.pct, 0);
  const r = size / 2 - 12;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.divider} strokeWidth="16" />
        {data.map((d, i) => {
          const segLength = (d.pct / total) * circumference;
          const dashArray = `${animate ? segLength - 2 : 0} ${circumference}`;
          const dashOffset = -offset;
          offset += segLength;
          return (
            <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={d.color} strokeWidth="16" strokeLinecap="butt"
              strokeDasharray={dashArray} strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          );
        })}
        <text x={size/2} y={size/2 - 6} textAnchor="middle" fill={C.textPrimary} fontSize="20" fontWeight="700" fontFamily="sans-serif">
          1,247
        </text>
        <text x={size/2} y={size/2 + 10} textAnchor="middle" fill={C.textMuted} fontSize="10" fontFamily="sans-serif">
          kWh total
        </text>
      </svg>
      <div className="flex-1 space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <div className="flex-1 flex items-center justify-between">
              <span style={{ fontSize: 12, color: C.textSecondary }}>{d.n}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.textPrimary }}>{d.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── DEVICE ICONS ─── */
const DevIcon = ({ type, size = 20 }) => {
  const map = { thermostat: Thermometer, ev: Car, pool: Waves, water: Droplets, solar: Sun };
  const Icon = map[type] || Zap;
  return <Icon size={size} color={C.fplBlue} strokeWidth={1.8} />;
};

/* ─── DATA ─── */
/* ─── Equipment Health Alerts (physical issues FPL detected) ─── */
const HEALTH_ALERTS = [
  { id:1, p:'HIGH', title:'AC Short Cycling Detected', sub:'14 on/off cycles in 2 hrs vs. 4 normal', sav:'Avoid $500+ repair', color:C.red, icon: Thermometer, detail:'FPL\'s smart meter detected your compressor cycling on and off 14 times in the last 2 hours — a normal system cycles 4–6 times. Short cycling increases wear and energy waste. This pattern often indicates a refrigerant issue, oversized unit, or electrical problem that needs professional diagnosis.', actions:['Schedule an FPL contractor to inspect your system','Review HVAC-on-Bill® options in case replacement is needed','Consider a SEER 18 upgrade — could reduce cooling costs ~15%'], program:{ name:'FPL HVAC-on-Bill®', desc:'$0 down · Added to your FPL bill · 0% APR', cta:'From $42/mo' }, contractor: true},
  { id:2, p:'HIGH', title:'Compressor Efficiency Declining', sub:'kWh per cooling-degree-day up 22% over 60 days', sav:'$8–14/mo', color:C.red, icon: TrendingDown, detail:'FPL meter data shows your AC is using 22% more energy per degree of cooling compared to its 60-day baseline. This gradual degradation pattern typically means the system needs professional servicing — it could be low refrigerant, a dirty coil, or aging components.', actions:['Schedule an FPL contractor for HVAC inspection','Compare your system to SEER 18 upgrade via HVAC-on-Bill®','Enable FPL email alerts for future efficiency changes'], program:{ name:'FPL HVAC-on-Bill®', desc:'$0 down · Added to your FPL bill · 0% APR', cta:'From $42/mo' }, contractor: true},
  { id:5, p:'MEDIUM', title:'Water Heater Draw Increasing', sub:'92 kWh this month vs. 67 kWh FPL benchmark', sav:'$3–6/mo', color:C.amber, icon: Droplets, detail:'FPL meter data shows your water heater consumed 38% above the benchmark for similar FPL homes. A gradual increase like this often means sediment buildup or a thermostat set too high. A quick inspection can prevent a more expensive failure.', actions:['Schedule an FPL contractor to inspect your water heater','Check thermostat — should be at 120°F or below','Review heat pump water heater options'], program:null, contractor: true},
  { id:7, p:'LOW', title:'Phantom Load: 480W Overnight', sub:'Baseload 1–5 AM trending up vs. 60-day avg', sav:'$3–8/mo', color:C.fplBlue, icon: Zap, detail:'FPL\'s meter data shows your overnight always-on consumption trending upward — now ~480W vs. 380W sixty days ago. Common culprits: cable boxes, gaming consoles left on, or an aging garage fridge drawing more power.', actions:['Review FPL Phantom Load Hunt Guide','Audit devices running overnight','Consider smart power strip for entertainment center'], program:null },
];

/* ─── AI Insights (behavioral optimization opportunities) ─── */
const AI_INSIGHTS = [
  { id:3, p:'MEDIUM', title:'Cooling an Empty Home', sub:'AC at 72°F since 8:15 AM · No occupancy detected', sav:'$8–12/mo', color:C.amber, icon: Home, detail:'Your Nest thermostat reports no occupancy since 8:15 AM, but your AC has been running at 72°F. FPL\'s meter data confirms cooling load during these hours. Raising to 78°F while away could save $8–12/mo based on your usage pattern.', actions:['Raise setpoint to 78°F now','Enable Away Mode automation via Nest','Enroll in FPL On Call® for automatic peak adjustments'], program:{ name:'FPL On Call® Savings', desc:'Auto-adjust during FPL peak events', cta:'$5/mo credit' }},
  { id:4, p:'MEDIUM', title:'EV Charging During Peak Hours', sub:'Tesla charged 4:30–8:45 PM yesterday', sav:'$5/mo credit', color:C.amber, icon: Car, detail:'FPL detected your Tesla Model Y charging during system peak (4–9 PM), when electricity is most expensive for FPL to generate. FPL doesn\'t have time-of-use rates today, but shifting to 11 PM–6 AM earns you FPL On Call® bill credits and reduces the fuel costs that flow through to all FPL customers.', actions:['Accept optimized schedule: 11 PM – 6 AM','Set minimum charge 80% by 7 AM via Tesla app','Enable FPL EVolution® smart charging'], program:null },
  { id:6, p:'LOW', title:'Pool Pump Running at Peak', sub:'Ran 4–7 PM · FPL peak generation window', sav:'$5/mo credit', color:C.fplBlue, icon: Waves, detail:'FPL detected your pool pump running during the highest demand window (4–7 PM). Shifting to 8 AM–12 PM aligns with solar generation on the FPL grid and earns you On Call® credits.', actions:['Accept optimized schedule: 8 AM – 12 PM','Reduce runtime 8 → 6 hrs (sufficient for most pools)','Enable FPL HEMS auto-scheduling'], program:null },
  { id:8, p:'HIGH', title:'Projected Bill Up 24%', sub:'$187 est. vs $151 last January', sav:'Transparency', color:C.red, icon: TrendingDown, detail:'FPL\'s analysis of your meter data shows three contributing factors: 3.2°F colder average this month → ~18% more HVAC runtime. New EV added ~$22/mo in charging load. Water heater trending up as noted in a separate alert.', actions:['View device-level breakdown in FPL Monthly Report','Enroll in FPL Budget Billing® for predictable payments','Review your personalized FPL savings plan'], program:{ name:'FPL Budget Billing®', desc:'Predictable monthly payments', cta:'Free' }},
];

const DEVICES = [
  { name:'Nest Thermostat', loc:'Living Room', val:'72°F', pct:23, kWh:127, saved:'$4.20', controlled:true, type:'thermostat', status:'Enrolled · DR Control' },
  { name:'Tesla Model Y', loc:'Garage', val:'78%', pct:28, kWh:156, saved:'$8.40', controlled:true, type:'ev', status:'Enrolled · DR Control' },
  { name:'Pentair Pool Pump', loc:'Pool', val:'Sched', pct:16, kWh:89, saved:'$2.10', controlled:false, type:'pool', status:'Monitored' },
  { name:'Rheem Water Heater', loc:'Utility', val:'120°F', pct:12, kWh:67, saved:'$1.80', controlled:false, type:'water', status:'Monitored' },
];

const SETUP_DEVICES = [
  {id:1,name:'Nest Thermostat',loc:'Living Room',val:'72°F', type:'thermostat'},
  {id:2,name:'Tesla Model Y',loc:'Garage',val:'78%', type:'ev'},
  {id:3,name:'Pentair Pool Pump',loc:'Pool',val:'Running', type:'pool'},
  {id:4,name:'Rheem Water Heater',loc:'Utility',val:'120°F', type:'water'}
];

/* ─── MODERN USAGE CHART ─── */
const MeterReadChart = () => {
  const [dayIdx, setDayIdx] = useState(6);
  const [touched, setTouched] = useState(null);
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dates = ['1/20','1/21','1/22','1/23','1/24','1/25','1/26'];

  // Hourly data (24 points instead of 96) — much cleaner
  const generateDay = useCallback((seed, peak) => {
    const data = [];
    for (let h = 0; h < 24; h++) {
      let base = 0.3 + Math.sin((h - 6) * Math.PI / 12) * 0.15;
      if (h >= 13 && h <= 18) base += peak * (1 - Math.abs(h - 15.5) / 3.5);
      if (h >= 6 && h <= 9) base += 0.4 * (1 - Math.abs(h - 7.5) / 2);
      if (h >= 18 && h <= 21) base += 0.5 * (1 - Math.abs(h - 19.5) / 2);
      if (h >= 23 || h <= 5) base += 0.8 * (seed % 3 === 0 ? 1 : 0.3);
      base += (Math.sin(seed * 17 + h * 0.7) * 0.12);
      data.push(Math.max(0.15, base));
    }
    return data;
  }, []);

  const allDays = useMemo(() => [1,2,3,4,5,6,7].map((s, i) => generateDay(s, [1.8,2.1,1.6,2.3,1.9,2.5,2.2][i])), [generateDay]);
  const reads = allDays[dayIdx];
  const maxVal = Math.max(...reads) * 1.1;
  const totalKwh = reads.reduce((s, v) => s + v, 0).toFixed(1);
  const peakHr = reads.indexOf(Math.max(...reads));
  const chartH = 140;
  const chartW = 300;

  // Build smooth area path
  const points = reads.map((v, i) => ({ x: (i / 23) * chartW, y: chartH - (v / maxVal) * chartH }));
  const line = points.map((p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (p.x - prev.x) * 0.4;
    const cpx2 = p.x - (p.x - prev.x) * 0.4;
    return `C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`;
  }).join(' ');
  const areaPath = `${line} L ${chartW} ${chartH} L 0 ${chartH} Z`;

  return (
    <GlassCard className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Today's Usage</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{days[dayIdx]} {dates[dayIdx]} · Hourly view</div>
        </div>
        <div className="text-right">
          <div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>{totalKwh}<span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted }}> kWh</span></div>
        </div>
      </div>

      {/* Day selector pills */}
      <div className="flex items-center gap-1 mb-4 p-1 rounded-xl" style={{ background: C.bg }}>
        {days.map((d, i) => (
          <button key={i} onClick={() => { setDayIdx(i); setTouched(null); }}
            className="flex-1 py-2 rounded-lg text-center transition-all duration-200"
            style={{
              background: dayIdx === i ? C.white : 'transparent',
              color: dayIdx === i ? C.fplBlue : C.textMuted,
              fontSize: 11, fontWeight: dayIdx === i ? 700 : 500,
              boxShadow: dayIdx === i ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
            }}>
            {d}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: chartH + 24 }}
        onMouseLeave={() => setTouched(null)} onTouchEnd={() => setTouched(null)}>
        <svg width="100%" height={chartH} viewBox={`0 0 ${chartW} ${chartH}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.fplBlue} stopOpacity="0.2" />
              <stop offset="100%" stopColor={C.fplBlue} stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((p, i) => (
            <line key={i} x1="0" y1={chartH * p} x2={chartW} y2={chartH * p}
              stroke={C.divider} strokeWidth="0.5" strokeDasharray="4 4" />
          ))}
          {/* Area fill */}
          <path d={areaPath} fill="url(#areaFill)" />
          {/* Line */}
          <path d={line} fill="none" stroke={C.fplBlue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Touch/hover targets */}
          {reads.map((v, i) => (
            <rect key={i} x={(i / 23) * chartW - chartW / 46} y={0} width={chartW / 23} height={chartH}
              fill="transparent"
              onMouseEnter={() => setTouched(i)}
              onTouchStart={() => setTouched(i)} />
          ))}
          {/* Active dot */}
          {touched !== null && (
            <>
              <line x1={points[touched].x} y1={0} x2={points[touched].x} y2={chartH}
                stroke={C.fplBlue} strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
              <circle cx={points[touched].x} cy={points[touched].y} r="5"
                fill={C.white} stroke={C.fplBlue} strokeWidth="2.5" />
            </>
          )}
        </svg>
        {/* Tooltip */}
        {touched !== null && (
          <div className="absolute pointer-events-none"
            style={{
              left: `${(touched / 23) * 100}%`,
              top: `${((chartH - (reads[touched] / maxVal) * chartH) / (chartH + 24)) * 100 - 14}%`,
              transform: 'translateX(-50%)',
            }}>
            <div className="glass-card px-3 py-1.5 rounded-lg text-center" style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textPrimary }}>{reads[touched].toFixed(1)} kW</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>{touched === 0 ? '12 AM' : touched < 12 ? `${touched} AM` : touched === 12 ? '12 PM' : `${touched - 12} PM`}</div>
            </div>
          </div>
        )}
        {/* X-axis labels */}
        <div className="absolute flex justify-between" style={{ bottom: 0, left: 0, right: 0 }}>
          {['12a','6a','12p','6p','12a'].map((t, i) => (
            <span key={i} style={{ fontSize: 10, color: C.textMuted }}>{t}</span>
          ))}
        </div>
      </div>
      {/* Summary footer */}
      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${C.divider}` }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>Peak: <span style={{ fontWeight: 700, color: C.textPrimary }}>{reads[peakHr]?.toFixed(1)} kW</span> at {peakHr > 12 ? `${peakHr-12} PM` : peakHr === 0 ? '12 AM' : `${peakHr} AM`}</span>
        <span style={{ fontSize: 11, color: C.textMuted }}>Avg: <span style={{ fontWeight: 600, color: C.textPrimary }}>{(reads.reduce((s,v) => s+v, 0) / 24).toFixed(1)} kW</span></span>
      </div>
    </GlassCard>
  );
};

/* ─── PLATFORM LOGOS ─── */
const PlatformLogo = ({ id, size = 28 }) => {
  const s = size;
  const logos = {
    google: (<svg width={s} height={s} viewBox="0 0 48 48"><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/><path d="M3.2 14.1l7.1 5.2C12.2 15 17.7 11 24 11c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 14.9 2 7.2 6.8 3.2 14.1z" fill="#FF3D00"/><path d="M24 46c5.4 0 10.3-1.9 14.1-5.2l-6.5-5.5C29.5 37 26.9 38 24 38c-6 0-11.1-4-12.8-9.5l-7 5.4C7.9 41 15.4 46 24 46z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.8c-1 3-3 5.5-5.6 7.2l6.5 5.5C42.8 35.5 46 30 46 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/></svg>),
    alexa: (<svg width={s} height={s} viewBox="0 0 48 48"><defs><linearGradient id="al9" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#31C4F3"/><stop offset="100%" stopColor="#00CAFF"/></linearGradient></defs><circle cx="24" cy="24" r="20" fill="url(#al9)"/><path d="M24 10c-7.7 0-14 6.3-14 14 0 4.8 2.4 9 6.1 11.5l1.5-2.6C14.8 30.8 13 27.6 13 24c0-6.1 4.9-11 11-11s11 4.9 11 11c0 3.6-1.8 6.8-4.6 8.9l1.5 2.6C35.6 33 38 28.8 38 24c0-7.7-6.3-14-14-14z" fill="#fff"/><circle cx="24" cy="24" r="4" fill="#fff"/></svg>),
    apple: (<svg width={s} height={s} viewBox="0 0 48 48"><path d="M34.5 39.8c-1.7 1.7-3.6 1.4-5.4.6-1.9-.8-3.6-.9-5.6 0-2.5 1.1-3.9.8-5.4-.6C10.4 31.7 11.3 19.4 20 19c2.1.1 3.5 1.1 4.8 1.2 1.8-.4 3.6-1.4 5.5-1.3 2.3.2 4.1 1.2 5.2 3-4.8 2.9-3.6 9.3.8 11.1-.9 2.5-2.1 4.9-3.8 6.8zM24.3 18.9c-.2-4.2 3.2-7.7 7.1-8 .6 4.7-4.3 8.2-7.1 8z" fill="#333"/></svg>),
    smartthings: (<svg width={s} height={s} viewBox="0 0 48 48"><defs><linearGradient id="st9" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#15BDF2"/><stop offset="100%" stopColor="#1295D8"/></linearGradient></defs><circle cx="24" cy="24" r="20" fill="url(#st9)"/><circle cx="24" cy="17" r="3.5" fill="#fff"/><circle cx="17" cy="28" r="3.5" fill="#fff"/><circle cx="31" cy="28" r="3.5" fill="#fff"/><line x1="24" y1="20.5" x2="18.5" y2="25" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="24" y1="20.5" x2="29.5" y2="25" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="20.5" y1="28" x2="27.5" y2="28" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>),
    ecobee: (<svg width={s} height={s} viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="10" fill="#008A36"/><path d="M14 24c0-5.5 4.5-10 10-10 3.3 0 6.3 1.6 8.1 4.2l-3.4 2.4C27.4 18.9 25.8 18 24 18c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.8 0 3.4-.8 4.7-2l3.2 2.7C30 33.5 27.2 35 24 35c-5.8 0-10-4.5-10-11z" fill="#fff"/><circle cx="33" cy="24" r="3" fill="#fff"/></svg>),
    tesla: (<svg width={s} height={s} viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="10" fill="#CC0000"/><path d="M24 12l-10 5h3.5l6.5 19 6.5-19H34L24 12z" fill="#fff"/></svg>),
    nest: (<svg width={s} height={s} viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#00A8E0"/><circle cx="24" cy="24" r="14" fill="none" stroke="#fff" strokeWidth="3"/><circle cx="24" cy="24" r="8" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7"/><text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="sans-serif">72°</text></svg>),
    honeywell: (<svg width={s} height={s} viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="10" fill="#E41F35"/><path d="M14 18h20v3H14zM14 24h20v3H14zM14 30h12v3H14z" fill="#fff"/><polygon points="38,27 32,22 32,32" fill="#fff"/></svg>),
  };
  return logos[id] || <div className="w-7 h-7 rounded-full" style={{ background: '#ccc' }} />;
};

/* ─── SMART GREETING ─── */
const SmartGreeting = ({ name = "Mohammad" }) => {
  const hour = new Date().getHours();
  let greeting = 'Good Morning';
  let emoji = '☀️';
  if (hour >= 12 && hour < 17) { greeting = 'Good Afternoon'; emoji = '🌤️'; }
  if (hour >= 17) { greeting = 'Good Evening'; emoji = '🌙'; }
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 300, color: C.textPrimary }}>{greeting} {emoji}</h1>
      <div className="flex items-center gap-2 mt-1.5">
        <LiveUsage watts={1247} />
      </div>
    </div>
  );
};

/* ═══════ NEW v15 COMPONENTS ═══════ */

/* ─── TOAST CONTAINER ─── */
const ToastContainer = () => {
  const { toasts } = useDemo();
  const colorMap = { info: C.fplBlue, warning: C.amber, error: C.red, success: C.green };
  return (
    <div className="fixed top-12 left-1/2 z-[100] flex flex-col items-center gap-2" style={{ transform: 'translateX(-50%)', maxWidth: 360 }}>
      {toasts.map(t => (
        <div key={t.id} className="px-4 py-2.5 rounded-full flex items-center gap-2"
          style={{
            background: colorMap[t.type] || C.fplBlue,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            animation: 'toastIn 0.3s ease forwards',
            whiteSpace: 'nowrap',
          }}>
          {t.message}
        </div>
      ))}
    </div>
  );
};

/* ─── SHIELD ACTIVATION SCREEN ─── */
const ShieldActivation = ({ onActivate, enabledDeviceIds = [] }) => {
  const [phase, setPhase] = useState(0);
  const deviceCount = enabledDeviceIds.length || SETUP_DEVICES.length;

  useEffect(() => {
    setTimeout(() => setPhase(1), 100);   // Shield visual
    setTimeout(() => setPhase(2), 600);   // Text
    setTimeout(() => setPhase(3), 1200);  // Device count + CTA
  }, []);

  return (
    <Screen direction="up">
      <div className="min-h-screen flex flex-col items-center px-8"
        style={{ background: 'linear-gradient(180deg, #E6F4FA 0%, #FFFFFF 50%, #F7F8FA 100%)', paddingTop: '28vh' }}>

        {/* Shield + Home visual */}
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.4)',
          transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg viewBox="0 0 100 110" className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 4px 20px rgba(0,155,222,0.3))' }}>
              <defs>
                <linearGradient id="shieldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={C.fplBlue} />
                  <stop offset="100%" stopColor={C.fplDark} />
                </linearGradient>
              </defs>
              <path d="M50 4 L92 22 L92 56 Q92 88 50 106 Q8 88 8 56 L8 22 Z"
                fill="url(#shieldGrad2)" opacity="0.12" stroke={C.fplBlue} strokeWidth="1.5" strokeOpacity="0.3" />
            </svg>
            <Home size={36} color={C.fplDark} strokeWidth={1.5} />
            <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${C.green}, #0d7a3e)`,
                boxShadow: '0 2px 12px rgba(27,138,80,0.4)',
                border: '3px solid white',
                animation: phase >= 1 ? 'checkPop 0.5s ease 0.3s both' : 'none',
              }}>
              <Check size={20} color="#fff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mt-8" style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease',
        }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: C.textPrimary, lineHeight: 1.25 }}>
            Your Home is Protected
          </h1>
          <p className="mt-3" style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>
            {deviceCount} device{deviceCount !== 1 ? 's' : ''} connected and optimized by FPL.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 w-full" style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.5s ease',
        }}>
          <FPLButton onClick={onActivate} className="w-full">
            GO TO MY DASHBOARD <ArrowRight size={16} />
          </FPLButton>
          <p className="text-center mt-5" style={{ fontSize: 11, color: C.textMuted }}>
            FPL Home Energy Shield · We've got your back
          </p>
        </div>
      </div>
    </Screen>
  );
};

/* ─── SHIELD STATUS CARD (replaces HEMS Status) ─── */
const ShieldStatusCard = () => {
  return (
    <GlassCard borderLeft gradient>
      {/* Header with gradient */}
      <div className="px-4 py-3 flex items-center justify-between"
        style={{
          borderBottom: `1px solid ${C.divider}`,
          background: 'linear-gradient(135deg, rgba(0,155,222,0.04) 0%, rgba(0,98,155,0.04) 100%)',
        }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})` }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>HOME ENERGY SHIELD</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div style={{ width: 7, height: 7, borderRadius: 4, background: C.green, animation: 'pulseGlow 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Active · 4 devices monitored</span>
            </div>
          </div>
        </div>
      </div>
      {/* Stats row */}
      <div className="flex items-center justify-around px-4 py-4">
        <div className="text-center">
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>This Month</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginTop: 3 }}>
            <AnimNum value={1247} /><span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted }}> kWh</span>
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: C.divider }} />
        <div className="text-center">
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Est. Bill</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginTop: 3 }}>
            $<AnimNum value={142.30} decimals={2} />
          </div>
        </div>
        <div style={{ width: 1, height: 36, background: C.divider }} />
        <div className="text-center">
          <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Alerts</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.red, marginTop: 3 }}>
            <AnimNum value={HEALTH_ALERTS.length} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

/* ─── LIVE DR BANNER ─── */
const LiveDRBanner = () => {
  const { drEventPhase, thermostatTemp, drEarnings } = useDemo();

  if (drEventPhase === 'precool') {
    return (
      <div className="p-4 rounded-2xl" style={{
        background: 'linear-gradient(135deg, #FFF4E0 0%, #FFECCC 100%)',
        border: `1px solid ${C.amber}30`,
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.amber}20` }}>
            <Thermometer size={20} color={C.amber} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Pre-Cooling Active</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 1 }}>
              Cooling to {Math.round(thermostatTemp)}°F · Earning ${drEarnings.toFixed(2)}
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: `${C.amber}15`, color: C.amber, border: `1px solid ${C.amber}30` }}>
            OVERRIDE
          </button>
        </div>
      </div>
    );
  }

  if (drEventPhase === 'active') {
    return (
      <div className="p-4 rounded-2xl" style={{
        background: 'linear-gradient(135deg, #FCEAEA 0%, #FFD6D6 100%)',
        border: `1px solid ${C.red}30`,
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${C.red}18`, animation: 'iconPulse 2s ease-in-out infinite' }}>
            <Zap size={20} color={C.red} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Peak Event Active</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: C.red, color: '#fff', fontSize: 9, animation: 'livePulse 1.5s ease-in-out infinite' }}>
                LIVE
              </span>
            </div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 1 }}>
              Thermostat at {Math.round(thermostatTemp)}°F · Earning ${drEarnings.toFixed(2)}
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: `${C.red}12`, color: C.red, border: `1px solid ${C.red}30` }}>
            OVERRIDE
          </button>
        </div>
      </div>
    );
  }

  if (drEventPhase === 'complete') {
    return (
      <div className="p-4 rounded-2xl" style={{
        background: 'linear-gradient(135deg, #E6F7ED 0%, #D4F0DC 100%)',
        border: `1px solid ${C.green}30`,
      }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.green}18` }}>
            <Check size={20} color={C.green} strokeWidth={3} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>Event Complete</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 1 }}>
              Thanks for participating! Earned <span style={{ fontWeight: 700, color: C.green }}>${drEarnings.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/* ─── DR TRIGGER CARD (idle state) ─── */
const DRTriggerCard = () => {
  const { drEventPhase, startDR } = useDemo();
  if (drEventPhase !== 'idle') return null;

  return (
    <GlassCard className="p-4 flex items-center gap-3" onClick={startDR}
      gradient style={{ cursor: 'pointer', border: `1px dashed ${C.fplBlue}40` }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${C.fplBlue}10` }}>
        <Zap size={20} color={C.fplBlue} />
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>FPL On Call® Ready</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}>Tap to simulate peak event</div>
      </div>
      <ChevronRight size={16} color={C.textMuted} />
    </GlassCard>
  );
};

/* ─── DEMO CONTROL PANEL ─── */
const DemoControlPanel = () => {
  const [open, setOpen] = useState(false);
  const { drEventPhase, drEventTimer, thermostatTemp, drEarnings, animSpeed, startDR, stopDR, resetDemo, setAnimSpeed } = useDemo();

  const phaseColors = { idle: C.fplBlue, precool: C.amber, active: C.red, complete: C.green };
  const phaseLabels = { idle: 'Ready', precool: 'Pre-Cool', active: 'Active', complete: 'Complete' };
  const progress = (drEventTimer / 20) * 100;

  return (
    <>
      {/* FAB */}
      <Tap onClick={() => setOpen(true)}
        className="fixed z-50 w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          bottom: 80,
          right: 14,
          background: `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})`,
          boxShadow: '0 2px 12px rgba(0,155,222,0.3)',
          opacity: 0.7,
        }}>
        <Settings size={16} color="#fff" />
      </Tap>

      {/* Backdrop + Panel */}
      {open && (
        <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }} />
          <div className="absolute bottom-0 left-0 right-0" style={{ maxWidth: 448, margin: '0 auto' }}
            onClick={e => e.stopPropagation()}>
            <div className="rounded-t-3xl p-5 pb-8"
              style={{
                background: C.white,
                boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
                animation: 'slideUp 0.3s ease forwards',
              }}>
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <h3 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary }}>Demo Control Panel</h3>
                <Tap onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: C.bg }}>
                  <X size={16} color={C.textMuted} />
                </Tap>
              </div>
              <p style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Orchestrate scenarios for presentation</p>

              {/* DR Event Section */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={16} color={C.fplBlue} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Demand Response Event</span>
                  </div>
                  <Pill color={phaseColors[drEventPhase]}>{phaseLabels[drEventPhase]}</Pill>
                </div>

                {/* Status display */}
                <div className="rounded-xl p-3 mb-3" style={{ background: C.bg }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: 12, color: C.textMuted }}>Thermostat: <span style={{ fontWeight: 700, color: C.textPrimary }}>{Math.round(thermostatTemp)}°F</span></span>
                    <span style={{ fontSize: 12, color: C.textMuted }}>Earnings: <span style={{ fontWeight: 700, color: C.green }}>${drEarnings.toFixed(2)}</span></span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.divider }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${phaseColors[drEventPhase]}, ${phaseColors[drEventPhase]}CC)`,
                      }} />
                  </div>
                  <div className="text-right mt-1">
                    <span style={{ fontSize: 10, color: C.textMuted }}>{Math.round(progress)}%</span>
                  </div>
                </div>

                {/* Start/Stop Button */}
                {drEventPhase === 'idle' || drEventPhase === 'complete' ? (
                  <Tap onClick={startDR}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})` }}>
                    <Play size={14} /> Start DR Event
                  </Tap>
                ) : (
                  <Tap onClick={stopDR}
                    className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    style={{ background: C.redLight, color: C.red }}>
                    <Square size={14} /> Stop Event
                  </Tap>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: C.divider, marginBottom: 20 }} />

              {/* Animation Speed */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>Animation Speed</span>
                  <Pill color={C.fplBlue}>{animSpeed}x</Pill>
                </div>
                <input type="range" min="1" max="20" value={animSpeed}
                  onChange={e => setAnimSpeed(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: C.fplBlue }}
                />
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: 10, color: C.textMuted }}>1x</span>
                  <span style={{ fontSize: 10, color: C.textMuted }}>20x</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: C.divider, marginBottom: 20 }} />

              {/* Reset */}
              <Tap onClick={() => { resetDemo(); setOpen(false); }}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                style={{ background: C.bg, color: C.textSecondary }}>
                <RotateCcw size={14} /> Reset Demo
              </Tap>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


/* ═══════ SCREENS ═══════ */

/* ─── AI TIP CARD (compact, single actionable tip) ─── */
const AITipCard = () => {
  const [tipIdx, setTipIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 400); }, []);

  const tips = [
    { tip: 'You\'re cooling an empty home ~6 hrs/day. Away temp of 78°F could save $8–12/mo.', action: 'Set Away Temp', source: 'Meter + Nest' },
    { tip: 'Tesla charges at 5 PM during peak generation. Shift to 11 PM for On Call® credits.', action: 'Optimize', source: 'Meter + Tesla' },
    { tip: 'Pool pump runs 8 hrs — similar homes run 6. Cut 2 hrs to save ~$4–6/mo.', action: 'Reduce', source: 'Meter data' },
  ];
  const t = tips[tipIdx];

  if (dismissed) return null;

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(8px)',
      transition: 'all 0.5s ease',
    }}>
      <div className="rounded-2xl p-3.5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(243,238,255,0.95) 0%, rgba(225,245,254,0.9) 100%)',
          border: `1px solid ${C.purple}15`,
        }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.fplBlue})` }}>
            <span style={{ fontSize: 12 }}>✨</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div style={{ fontSize: 10, fontWeight: 700, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Insight · {t.source}</div>
              <Tap onClick={() => setDismissed(true)}>
                <X size={13} color={C.textMuted} />
              </Tap>
            </div>
            <div style={{ fontSize: 13, color: C.textPrimary, lineHeight: 1.5, fontWeight: 500 }}>{t.tip}</div>
            <div className="flex items-center gap-2 mt-2.5">
              <button className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${C.purple}, ${C.fplBlue})` }}>
                {t.action}
              </button>
              <button onClick={() => setTipIdx((tipIdx + 1) % tips.length)}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ color: C.purple, background: `${C.purple}08` }}>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── COMMUNITY IMPACT SCREEN ─── */
const CommunityImpact = ({ onBack, onNav }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  const rateComparison = [
    { state: 'FPL (Florida)', rate: 12.1, isFPL: true },
    { state: 'National Avg', rate: 16.9, isFPL: false },
    { state: 'New York', rate: 24.3, isFPL: false },
    { state: 'California', rate: 31.2, isFPL: false },
  ];
  const maxRate = 34;

  return (
    <Screen direction="right">
      <div className={`min-h-screen pb-24 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(180deg, #E8F5E9 0%, #F7F8FA 20%, #F7F8FA 100%)' }}>
        <FPLHeader />
        <div className="px-5 pt-4">
          <Tap onClick={onBack} className="flex items-center gap-1 mb-3">
            <ChevronLeft size={18} color={C.fplBlue} /><span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 500 }}>Back</span>
          </Tap>
          <h1 style={{ fontSize: 22, fontWeight: 300, color: C.textPrimary }}>Your Impact</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4, marginBottom: 16 }}>
            When you shift energy usage, it doesn't just help you — it helps everyone.
          </p>
        </div>

        <Stagger delay={70}>
          {/* Your Personal Impact */}
          <div className="px-5 mb-5">
            <GlassCard className="p-5 overflow-hidden" gradient style={{ background: 'linear-gradient(135deg, rgba(230,247,237,0.95) 0%, rgba(225,245,254,0.9) 100%)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${C.green}, #0d7a3e)` }}>
                  <Leaf size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Contribution This Month</div>
                </div>
              </div>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.textPrimary }}>{loaded ? <AnimNum value={127} dur={1000} /> : '0'}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>kWh shifted off-peak</div>
                </div>
                <div style={{ width: 1, height: 40, background: `${C.green}25` }} />
                <div className="text-center">
                  <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>{loaded ? <AnimNum value={0.08} decimals={2} dur={1000} /> : '0'}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>tons CO₂ avoided</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Simple Explainer — How It Works */}
          <div className="px-5 mb-5">
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>How Load Shifting Helps Everyone</div>
            <GlassCard className="p-5" gradient>
              {/* Step-by-step visual story */}
              {[
                { num: '1', text: 'You shift your EV charging, pool pump, or AC to off-peak hours', icon: '🔄' },
                { num: '2', text: 'FPL generates that electricity at $32/MWh instead of $85/MWh', icon: '⚡' },
                { num: '3', text: 'Lower fuel costs flow to all 5.4M FPL customers through the fuel clause', icon: '👥' },
              ].map((step, i) => (
                <div key={i}>
                  <div className="flex items-start gap-3 py-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${C.fplBlue}10` }}>
                      <span style={{ fontSize: 15 }}>{step.icon}</span>
                    </div>
                    <div className="flex-1" style={{ fontSize: 13, color: C.textPrimary, lineHeight: 1.5, fontWeight: 500 }}>
                      {step.text}
                    </div>
                  </div>
                  {i < 2 && <div className="ml-4 w-px h-3" style={{ background: `${C.fplBlue}20` }} />}
                </div>
              ))}
            </GlassCard>
          </div>

          {/* Together Section */}
          <div className="px-5 mb-5">
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Together · 38,400 Enrolled Homes</div>
            <GlassCard className="overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-4 text-center" style={{ borderRight: `1px solid ${C.divider}` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: `${C.fplBlue}0D` }}>
                    <Zap size={16} color={C.fplBlue} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary }}>{loaded ? <AnimNum value={847} dur={1200} /> : '0'}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>MW shifted</div>
                  <div style={{ fontSize: 9, color: C.textSecondary, marginTop: 4, lineHeight: 1.3 }}>2 fewer peaker plants needed</div>
                </div>
                <div className="flex-1 p-4 text-center" style={{ borderRight: `1px solid ${C.divider}` }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: `${C.green}0D` }}>
                    <Leaf size={16} color={C.green} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.green }}>{loaded ? <AnimNum value={12.4} decimals={1} dur={1200} /> : '0'}K</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>tons CO₂</div>
                  <div style={{ fontSize: 9, color: C.textSecondary, marginTop: 4, lineHeight: 1.3 }}>2,700 cars off the road</div>
                </div>
                <div className="flex-1 p-4 text-center">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ background: `${C.purple}0D` }}>
                    <Shield size={16} color={C.purple} />
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary }}>{loaded ? <AnimNum value={34} dur={1200} /> : '0'}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>grid events</div>
                  <div style={{ fontSize: 9, color: C.textSecondary, marginTop: 4, lineHeight: 1.3 }}>Zero blackouts</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Rate Comparison — Simple bars */}
          <div className="px-5 mb-5">
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Keeping FPL Rates Among the Lowest</div>
            <GlassCard className="p-4">
              {rateComparison.map((r, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 12, fontWeight: r.isFPL ? 700 : 500, color: r.isFPL ? C.fplBlue : C.textSecondary }}>{r.state}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: r.isFPL ? C.fplBlue : C.textPrimary }}>{r.rate}¢/kWh</span>
                  </div>
                  <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: C.bg }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: loaded ? `${(r.rate / maxRate) * 100}%` : '0%',
                        background: r.isFPL
                          ? `linear-gradient(90deg, ${C.fplBlue}, ${C.fplDark})`
                          : `linear-gradient(90deg, #D4DAE3, #B8C0CC)`,
                        transitionDelay: `${i * 150}ms`,
                      }} />
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>

          {/* FPL Grid Achievement */}
          <div className="px-5 mb-5">
            <GlassCard className="p-4 overflow-hidden" borderLeft>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${C.fplBlue}0D` }}>
                  <Award size={16} color={C.fplBlue} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.fplBlue, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>FPL Grid Modernization</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.textPrimary, lineHeight: 1.5, marginBottom: 10 }}>
                FPL has invested over <span style={{ fontWeight: 700 }}>$3 billion</span> in grid hardening and smart infrastructure — including 5.4 million smart meters that power the insights you see here.
              </div>
              <div className="flex gap-2">
                {[
                  { n: '99.98%', l: 'Reliability' },
                  { n: '5.4M', l: 'Smart meters' },
                  { n: '40%', l: 'Faster restoration' },
                ].map((s, i) => (
                  <div key={i} className="flex-1 text-center py-2 rounded-lg" style={{ background: C.bg }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.fplBlue }}>{s.n}</div>
                    <div style={{ fontSize: 9, color: C.textMuted, marginTop: 1 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* What's Next */}
          <div className="px-5 mb-5">
            <GlassCard className="p-4" style={{ background: 'rgba(243,238,255,0.5)', border: `1px solid ${C.purple}15` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${C.purple}0D` }}>
                  <Target size={16} color={C.purple} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: C.purple, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Coming Soon</div>
                  <div style={{ fontSize: 12, color: C.textPrimary, marginTop: 2, lineHeight: 1.4 }}>
                    Enrolled devices will help FPL manage grid demand across thousands of homes during extreme weather — earning you additional credits.
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="text-center pb-4">
            <div style={{ fontSize: 10, color: C.textMuted }}>Florida Power & Light Company · A NextEra Energy® Company</div>
          </div>
        </Stagger>
        <BottomNav active="Impact" onNav={onNav} />
      </div>
    </Screen>
  );
};

/* ─── AI CHAT AGENT ─── */
const AIChatAgent = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi — I'm your FPL Energy Assistant. I can see your meter data, connected devices, and FPL programs. What can I help with?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const quickReplies = [
    'Why is my bill higher?',
    'Is my AC running okay?',
    'How can I save more?',
    'What\'s my grid impact?',
  ];

  const getResponse = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('bill') && (lower.includes('high') || lower.includes('why') || lower.includes('up'))) {
      return "FPL's meter data shows your projected bill is $187 — up 24% from last January. Here's what I'm seeing:\n\n🌡️ 3.2°F colder this month → HVAC runtime up ~18%\n🚗 Tesla Model Y charging added ~$22/mo\n💧 Water heater draw trending 38% above FPL benchmark\n\nQuickest win: set your AC to 78°F when away (~$8–12/mo). Want me to schedule an FPL contractor for the water heater?";
    }
    if (lower.includes('impact') || lower.includes('community') || lower.includes('grid') || lower.includes('environment')) {
      return "Here's your impact this month:\n\n🔄 You've shifted 127 kWh to off-peak hours\n🌱 That avoided 0.08 tons of CO₂\n\nAcross all 38,400 FPL Energy Shield homes, we've shifted 847 MW off peak — enough to avoid firing up 2 natural gas peaker plants. FPL doesn't have TOU rates, so this doesn't lower your per-kWh cost directly, but the cheaper generation costs flow to all 5.4M FPL customers through the fuel clause.\n\nCheck the Impact tab for the full picture!";
    }
    if (lower.includes('ac') || lower.includes('hvac') || lower.includes('air condition') || lower.includes('cool')) {
      return "FPL's meter data flagged something on your AC — short cycling. That's 14 on/off cycles in 2 hours vs. the normal 4–6.\n\nThis wastes energy and stresses your compressor. I can't diagnose the exact cause from meter data alone, but this pattern typically needs professional attention.\n\nWant me to schedule an FPL contractor? Energy Shield customers get priority scheduling. If it turns out you need a replacement, FPL HVAC-on-Bill® offers 0% APR financing from $42/mo.";
    }
    if (lower.includes('save') || lower.includes('saving') || lower.includes('reduce') || lower.includes('lower')) {
      return "Based on FPL's analysis of your home, here are your top opportunities:\n\n1. 🏠 Set Away temp to 78°F — FPL sees you cooling an empty home ~6 hrs/day → ~$8–12/mo\n2. 🏊 Reduce pool pump from 8 to 6 hrs → ~$4–6/mo\n3. 🔌 Shift Tesla charging to 11 PM → earns FPL On Call® credits ($5/mo)\n\nThe AC and pool pump hit your bill directly. The EV shift earns credits and helps keep FPL rates low for everyone. Want me to apply any of these?";
    }
    if (lower.includes('ev') || lower.includes('tesla') || lower.includes('charg')) {
      return "FPL detected your Tesla Model Y charging during peak hours (4:30–8:45 PM).\n\nFPL doesn't have time-of-use rates, so charging at night won't directly lower your per-kWh cost. But it matters to the grid — peak generation costs FPL ~$85/MWh vs. ~$32/MWh at night.\n\nWhen you shift, you earn FPL On Call® bill credits ($5/mo), and the fuel savings flow to all 5.4M FPL customers. Want me to set an optimized 11 PM schedule via FPL EVolution®?";
    }
    if (lower.includes('program') || lower.includes('enroll') || lower.includes('surge') || lower.includes('solar')) {
      return "Based on your home profile, here are the FPL programs I'd recommend:\n\n⚡ FPL On Call® — You're enrolled! Earning $5/mo credits\n🛡️ FPL SurgeShield® — 3 surge events near you this month. $11.95/mo for up to $5K coverage per appliance\n❄️ FPL HVAC-on-Bill® — Your SEER 14 is declining. A SEER 18 from $42/mo could cut cooling costs ~15%\n\nWant details on any of these?";
    }
    if (lower.includes('contractor') || lower.includes('repair') || lower.includes('inspect') || lower.includes('schedule')) {
      return "I can connect you with FPL's contractor network. Based on your alerts, I'd recommend:\n\n🔧 HVAC Inspection — FPL detected short cycling, needs professional diagnosis\n🔧 Water Heater Check — FPL meter data shows draw trending 38% above benchmark\n\nFPL Energy Shield customers get priority scheduling. Want me to book the HVAC inspection first?";
    }
    return "I have access to your FPL meter data, connected device status, and FPL program information. I can explain bill changes, flag equipment issues FPL has detected, recommend programs, or schedule a contractor. What would you like to know?";
  };

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: getResponse(msg) }]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <div className="fixed inset-0 z-[95] flex flex-col" style={{ maxWidth: 448, margin: '0 auto' }}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
        onClick={onClose} />

      <div className="absolute bottom-0 left-0 right-0 flex flex-col"
        style={{ height: '88vh', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}>
        <div className="flex-1 flex flex-col rounded-t-3xl overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #0A1628 0%, #0F2035 40%, #132B44 100%)' }}>
          
          {/* Chat Header */}
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${C.fplBlue}, ${C.purple})`, boxShadow: '0 4px 16px rgba(0,155,222,0.3)' }}>
                <Zap size={18} color="#fff" />
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full"
                  style={{ background: '#4ADE80', border: '2px solid #0A1628' }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>FPL Energy Assistant</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>Powered by your FPL meter data</div>
              </div>
            </div>
            <Tap onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.08)' }}>
              <X size={16} color="rgba(255,255,255,0.5)" />
            </Tap>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${C.fplBlue}40, ${C.purple}40)` }}>
                    <Zap size={12} color={C.fplBlue} />
                  </div>
                )}
                <div className="max-w-[82%] px-4 py-3 rounded-2xl"
                  style={{
                    background: m.role === 'user'
                      ? `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})`
                      : 'rgba(255,255,255,0.06)',
                    color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.88)',
                    fontSize: 13,
                    lineHeight: 1.65,
                    border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                    borderBottomRightRadius: m.role === 'user' ? 6 : 18,
                    borderBottomLeftRadius: m.role === 'user' ? 18 : 6,
                    whiteSpace: 'pre-line',
                    backdropFilter: m.role === 'assistant' ? 'blur(20px)' : 'none',
                  }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start items-end gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${C.fplBlue}40, ${C.purple}40)` }}>
                  <Zap size={12} color={C.fplBlue} />
                </div>
                <div className="px-4 py-3 rounded-2xl flex items-center gap-2"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)', borderBottomLeftRadius: 6 }}>
                  <div className="flex items-center gap-1">
                    {[0,1,2].map(j => (
                      <div key={j} style={{
                        width: 5, height: 5, borderRadius: 3, background: C.fplBlue,
                        animation: `pulseDot 1.2s ease-in-out infinite ${j * 0.2}s`,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>Analyzing your data...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && !typing && (
            <div className="px-4 pb-3">
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Suggested</div>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((q, i) => (
                  <button key={i} onClick={() => send(q)}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(12px)',
                    }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 flex items-center gap-2.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about your bill, devices, or programs..."
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 13,
                caretColor: C.fplBlue,
              }}
            />
            <Tap onClick={() => send()}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: input.trim()
                  ? `linear-gradient(135deg, ${C.fplBlue}, ${C.purple})`
                  : 'rgba(255,255,255,0.06)',
                transition: 'all 0.2s ease',
                boxShadow: input.trim() ? '0 4px 12px rgba(0,155,222,0.3)' : 'none',
              }}>
              <Send size={16} color={input.trim() ? '#fff' : 'rgba(255,255,255,0.2)'} />
            </Tap>
          </div>
          <div style={{ height: 8, background: 'rgba(0,0,0,0.2)' }} />
        </div>
      </div>
    </div>
  );
};

/* ─── AI CHAT FAB (floating button) ─── */
const AIChatFAB = ({ onClick }) => (
  <Tap onClick={onClick}
    className="fixed z-50 flex items-center gap-1.5 rounded-full px-3 py-2"
    style={{
      bottom: 80,
      left: 14,
      background: 'rgba(10,22,40,0.65)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    }}>
    <div className="w-6 h-6 rounded-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${C.fplBlue}, ${C.purple})` }}>
      <Zap size={11} color="#fff" />
    </div>
    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>Ask AI</span>
  </Tap>
);

const Splash = ({ onNext }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    setTimeout(() => setPhase(1), 100);
    setTimeout(() => setPhase(2), 600);
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: C.white }}>
      <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(16px)', transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div className="flex justify-center"><FPLLogo size={80} /></div>
      </div>
      <div style={{ opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.6s ease 0.2s' }}>
        <h1 className="text-center mt-5" style={{ fontSize: 26, fontWeight: 300, color: C.textPrimary, letterSpacing: '-0.01em' }}>
          Home Energy Manager
        </h1>
        <p className="text-center mt-3" style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>
          Smart insights for every device in your home.
        </p>
        <div className="flex justify-center mt-10">
          <FPLButton onClick={onNext}>GET STARTED <ChevronRight size={16} /></FPLButton>
        </div>
        <p className="text-center mt-14" style={{ fontSize: 11, color: C.textMuted }}>A NextEra Energy® Company</p>
        <p className="text-center mt-3 px-6 py-2 rounded-full" style={{ fontSize: 10, color: C.textMuted, background: '#F0F2F5', letterSpacing: '0.03em' }}>This is a demo environment</p>
      </div>
    </div>
  );
};

const ValueProp = ({ onConnect, onSkip }) => {
  const [consent, setConsent] = useState(true); // Default ON — opt-out pattern
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 100); }, []);

  return (
    <Screen direction="right">
      <div className="min-h-screen" style={{ background: C.bg }}>
        <FPLHeader step={0} totalSteps={3} />
        <div className="px-5 pt-4 pb-8">
          {/* ── Animated Shield + Home icon ── */}
          <div className="flex justify-center mb-5" style={{
            opacity: ready ? 1 : 0,
            transform: ready ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg viewBox="0 0 100 110" className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,155,222,0.25))' }}>
                <defs>
                  <linearGradient id="vpShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={C.fplBlue} />
                    <stop offset="100%" stopColor={C.fplDark} />
                  </linearGradient>
                </defs>
                <path d="M50 4 L92 22 L92 56 Q92 88 50 106 Q8 88 8 56 L8 22 Z"
                  fill="url(#vpShieldGrad)" opacity="0.12" stroke={C.fplBlue} strokeWidth="1.5" strokeOpacity="0.3" />
              </svg>
              <Home size={34} color={C.fplDark} strokeWidth={1.5} />
              <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})`,
                  boxShadow: '0 2px 12px rgba(0,155,222,0.4)',
                  border: '2.5px solid white',
                  animation: ready ? 'shieldGlow 4s ease-in-out infinite' : 'none',
                }}>
                <Shield size={16} color="#fff" strokeWidth={2.2} />
              </div>
            </div>
          </div>

          <Stagger delay={80}>
            {/* ── Value Card — Protection + Savings ── */}
            <div>
              <GlassCard className="p-5 mb-5" gradient>
                <div className="flex items-center gap-4 pb-4" style={{ borderBottom: `1px solid ${C.divider}` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${C.fplBlue}12` }}>
                    <Shield size={20} color={C.fplBlue} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Protection</div>
                    <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2, lineHeight: 1.5 }}>We spot issues early, recommend a fix, and help you connect with a trusted contractor if needed.</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${C.green}12` }}>
                    <DollarSign size={20} color={C.green} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Savings</div>
                    <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 2, lineHeight: 1.5 }}>We shift your devices to cheaper hours and earn you bill credits automatically.</div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* ── Social Proof Banner ── */}
            <div>
              <div className="flex items-center justify-center gap-2 mb-5 py-2">
                <div className="flex -space-x-2">
                  {['#4A90D9', '#2ECC71', '#E67E22', '#9B59B6'].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: c, border: '2px solid #fff', fontSize: 9, color: '#fff', fontWeight: 700, zIndex: 4 - i }}>
                      {['JR', 'KM', 'LS', 'DP'][i]}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 12, color: C.textSecondary, fontWeight: 500 }}>
                  <span style={{ fontWeight: 700, color: C.textPrimary }}>38,400+</span> FPL customers enrolled
                </span>
              </div>
            </div>

            {/* ── Permission Consent — Highlighted + Pre-checked ── */}
            <div>
              <Tap onClick={() => setConsent(!consent)}>
                <div className="flex items-start gap-3 p-4 rounded-2xl mb-2" style={{
                  background: consent
                    ? `linear-gradient(135deg, rgba(0,155,222,0.06) 0%, rgba(0,98,155,0.04) 100%)`
                    : 'rgba(255,255,255,0.7)',
                  border: `2px solid ${consent ? C.fplBlue : C.cardBorder}`,
                  boxShadow: consent ? `0 0 0 3px ${C.fplBlue}12, 0 4px 16px rgba(0,155,222,0.08)` : 'none',
                  transition: 'all 0.3s ease',
                }}>
                  <div className="flex-shrink-0 mt-0.5" style={{
                    width: 24, height: 24, borderRadius: 7,
                    background: consent ? `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})` : '#fff',
                    border: consent ? 'none' : `2px solid ${C.cardBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: consent ? '0 2px 8px rgba(0,155,222,0.3)' : 'none',
                  }}>
                    {consent && <Check size={14} color="#fff" strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: consent ? C.textPrimary : C.textSecondary, lineHeight: 1.55, transition: 'color 0.2s ease' }}>
                      I authorize FPL to monitor my connected devices to optimize energy usage, alert me to potential issues, and automatically adjust scheduling to lower-cost hours.
                    </div>
                  </div>
                </div>
              </Tap>
              {/* Trust signals */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-1.5">
                  <Shield size={11} color={C.textMuted} strokeWidth={2} />
                  <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>Your data stays with FPL</span>
                </div>
                <div style={{ width: 3, height: 3, borderRadius: 2, background: C.textMuted, opacity: 0.4 }} />
                <div className="flex items-center gap-1.5">
                  <Settings size={11} color={C.textMuted} strokeWidth={2} />
                  <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>Change anytime</span>
                </div>
              </div>
            </div>

            {/* ── CTA — Large primary, subtle skip ── */}
            <div>
              <FPLButton onClick={onConnect} className="w-full mb-4" disabled={!consent}>
                CONNECT MY DEVICES <ArrowRight size={16} />
              </FPLButton>
              <div className="text-center">
                <button onClick={onSkip}
                  style={{ fontSize: 12, color: C.textMuted, fontWeight: 400, background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer', opacity: 0.7 }}>
                  Skip — I'll set this up later
                </button>
              </div>
            </div>
          </Stagger>
        </div>
      </div>
    </Screen>
  );
};

const Platforms = ({ onNext, onBack }) => {
  const [sel, setSel] = useState([]);
  const ps = [{id:'google',n:'Google Home'},{id:'alexa',n:'Amazon Alexa'},{id:'apple',n:'Apple HomeKit'},{id:'smartthings',n:'SmartThings'},{id:'ecobee',n:'ecobee'},{id:'tesla',n:'Tesla'}];
  const tog = id => setSel(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return (
    <Screen direction="right">
      <div className="min-h-screen" style={{ background: C.bg }}>
        <FPLHeader step={1} totalSteps={3} />
        <div className="px-5 pt-5">
          <Tap onClick={onBack} className="flex items-center gap-1 mb-4">
            <ChevronLeft size={18} color={C.fplBlue} /><span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 500 }}>Back</span>
          </Tap>
          <h1 style={{ fontSize: 24, fontWeight: 300, color: C.textPrimary }}>Select Your Platforms</h1>
          <p className="mt-2 mb-6" style={{ fontSize: 13, color: C.textMuted }}>Choose all that apply. You can add more anytime.</p>
          <Stagger delay={40} className="grid grid-cols-3 gap-3 mb-6">
            {ps.map(p => {
              const a = sel.includes(p.id);
              return (
                <Tap key={p.id} onClick={() => tog(p.id)}
                  className="rounded-2xl flex flex-col items-center justify-center"
                  style={{
                    padding: '18px 10px 16px',
                    aspectRatio: '1 / 1',
                    minHeight: 110,
                    background: a ? 'rgba(0,155,222,0.04)' : 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(12px)',
                    border: `2px solid ${a ? C.fplBlue : 'rgba(232,236,240,0.8)'}`,
                    boxShadow: a ? `0 0 0 3px ${C.fplBlue}18, 0 4px 16px rgba(0,155,222,0.12)` : '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                  }}>
                  {/* Checkmark top-right */}
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    width: 20, height: 20, borderRadius: 10,
                    background: a ? C.fplBlue : C.bg,
                    border: a ? 'none' : `2px solid ${C.cardBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {a && <Check size={11} color="#fff" strokeWidth={3} />}
                  </div>
                  <PlatformLogo id={p.id} size={36} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary, marginTop: 10, textAlign: 'center', lineHeight: 1.2 }}>{p.n}</span>
                </Tap>
              );
            })}
          </Stagger>
          <FPLButton onClick={onNext} className="w-full">
            {sel.length ? `CONTINUE · ${sel.length} SELECTED` : 'CONTINUE WITH METER DATA'}
          </FPLButton>
        </div>
      </div>
    </Screen>
  );
};

const DeviceSetup = ({ onNext }) => {
  const [ctrl, setCtrl] = useState({});
  const ds = SETUP_DEVICES;
  const en = Object.values(ctrl).filter(Boolean).length;
  return (
    <Screen direction="right">
      <div className="min-h-screen" style={{ background: C.bg }}>
        <FPLHeader step={2} totalSteps={3} />
        <div className="px-5 pt-5">
          <Stagger delay={60}>
            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ background: C.greenLight, border: `1px solid ${C.green}25` }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.green }}>
                <Check size={18} color="#fff" strokeWidth={3} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Connected to Google Home</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Found {ds.length} devices</div>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>Enable Smart Control</h2>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.5 }}>Allow FPL to optimize devices automatically and earn bill credits.</p>
            </div>
            <div>
              {ds.map((d, i) => {
                const on = ctrl[d.id];
                return (
                  <GlassCard key={d.id} className="mb-2.5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${C.fplBlue}0D` }}>
                        <DevIcon type={d.type} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: C.textMuted }}>{d.loc} · {d.val}</div>
                      </div>
                      <Tap onClick={() => setCtrl(p => ({ ...p, [d.id]: !p[d.id] }))}>
                        <div style={{
                          width: 48, height: 28, borderRadius: 14,
                          background: on ? C.fplBlue : '#D4DAE3',
                          boxShadow: on ? `0 0 10px ${C.fplBlue}40` : 'inset 0 1px 3px rgba(0,0,0,0.12)',
                          position: 'relative', transition: 'all 0.3s ease',
                        }}>
                          <div style={{
                            width: 22, height: 22, borderRadius: 11, background: '#fff',
                            position: 'absolute', top: 3, left: on ? 23 : 3,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }} />
                        </div>
                      </Tap>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
            <div>
              {en > 0 && (
                <GlassCard className="mb-5 p-4" borderLeft style={{ background: 'rgba(230,247,237,0.85)' }}>
                  <div className="flex items-center gap-3">
                    <Shield size={20} color={C.green} />
                    <span style={{ fontSize: 14, color: C.green, fontWeight: 700 }}>Est. FPL On Call® bill credits: ${en * 15}/year</span>
                  </div>
                </GlassCard>
              )}
              <FPLButton onClick={() => onNext(Object.keys(ctrl).filter(k => ctrl[k]).map(Number))} className="w-full">START MONITORING</FPLButton>
            </div>
          </Stagger>
        </div>
      </div>
    </Screen>
  );
};

const AlertDetail = ({ alert: a, onBack, onNav }) => (
  <Screen direction="right">
    <div className="min-h-screen" style={{ background: C.bg }}>
      <FPLHeader />
      <div className="px-5 pt-4 pb-24">
        <Tap onClick={onBack} className="flex items-center gap-1 mb-5">
          <ChevronLeft size={18} color={C.fplBlue} /><span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 500 }}>Back</span>
        </Tap>
        <Stagger delay={60}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${a.color}12` }}>
                <a.icon size={18} color={a.color} />
              </div>
              <Pill color={a.color}>{a.p}</Pill>
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, lineHeight: 1.35 }}>{a.title}</h1>
            <p className="mt-3" style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{a.detail}</p>
          </div>
          <div>
            {a.sav !== 'Transparency' && (
              <GlassCard className="mt-5 p-4" borderLeft>
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Estimated Savings</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.green, marginTop: 4 }}>{a.sav}</div>
              </GlassCard>
            )}
          </div>
          <div className="mt-7">
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>FPL Recommendations</div>
            <GlassCard>
              {a.actions.map((act, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3.5" style={{ borderBottom: i < a.actions.length - 1 ? `1px solid ${C.divider}` : 'none' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${C.fplBlue}10` }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.fplBlue }}>{i+1}</span>
                  </div>
                  <span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.5 }}>{act}</span>
                </div>
              ))}
            </GlassCard>
          </div>
          <div>
            {a.program && (
              <GlassCard className="mt-6 p-5" borderLeft>
                <div style={{ fontSize: 10, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>FPL Program</div>
                <h3 className="mt-2" style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{a.program.name}</h3>
                <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>{a.program.desc}</p>
                <FPLButton className="mt-4 w-full">ENROLL · {a.program.cta}</FPLButton>
              </GlassCard>
            )}
            {a.contractor && (
              <GlassCard className="mt-4 p-5" style={{ background: 'linear-gradient(135deg, rgba(0,155,222,0.06) 0%, rgba(0,98,155,0.04) 100%)', border: `2px solid ${C.fplBlue}20` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${C.fplBlue}15` }}>
                    <Wrench size={18} color={C.fplBlue} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Schedule a Contractor</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}>FPL Contractor Network · Priority service</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.5, marginBottom: 12 }}>
                  Our data suggests this needs a professional inspection. FPL's contractor network offers priority scheduling for HEMS customers.
                </p>
                <FPLButton className="w-full">SCHEDULE INSPECTION</FPLButton>
              </GlassCard>
            )}
          </div>
        </Stagger>
      </div>
      <BottomNav active="Home" onNav={onNav} />
    </div>
  </Screen>
);

/* ─── DASHBOARD (Updated with Shield + DR) ─── */
const Dashboard = ({ onAlert, onReport, onProfile, onImpact, onChat }) => {
  const [loaded, setLoaded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const { drEventPhase, thermostatTemp } = useDemo();
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);

  // Dynamic devices with thermostat temp from DR context
  const dynamicDevices = DEVICES.map(d => {
    if (d.type === 'thermostat') {
      return { ...d, val: `${Math.round(thermostatTemp)}°F` };
    }
    return d;
  });

  return (
    <Screen direction="up">
      <div className={`min-h-screen pb-24 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'linear-gradient(180deg, #E3F2FD 0%, #F7F8FA 25%, #F7F8FA 100%)' }}>
        <FPLHeader />
        <div className="px-5 pt-4 pb-2">
          <SmartGreeting />
        </div>

        {/* Shield Status Card (replaces HEMS Status) */}
        <div className="px-5 mb-4">
          <ShieldStatusCard />
        </div>

        {/* AI Insight Tip */}
        <div className="px-5 mb-4">
          <AITipCard />
        </div>

        {/* DR Banner or Trigger */}
        <div className="px-5 mb-4">
          {drEventPhase !== 'idle' ? (
            <LiveDRBanner />
          ) : (
            <DRTriggerCard />
          )}
        </div>

        {/* Equipment Health (things that are wrong) */}
        <Section title="Equipment Health" action={`${HEALTH_ALERTS.length} active`}>
          <Stagger delay={40}>
            {HEALTH_ALERTS.slice(0, showAll ? HEALTH_ALERTS.length : 2).map(a => (
              <ExpandableAlert key={a.id} alert={a} onOpen={onAlert} />
            ))}
          </Stagger>
          {HEALTH_ALERTS.length > 2 && (
            <Tap onClick={() => setShowAll(!showAll)} className="w-full mt-2 flex items-center justify-center gap-1 py-2 rounded-xl"
              style={{ background: `${C.red}06` }}>
              <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>
                {showAll ? 'Show less' : `View all ${HEALTH_ALERTS.length} health alerts`}
              </span>
              <ChevronDown size={14} color={C.red}
                style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
            </Tap>
          )}
        </Section>

        {/* Usage Insights (behavioral optimization) */}
        <Section title="Usage Insights" action={`${AI_INSIGHTS.length} tips`}>
          <Stagger delay={40}>
            {AI_INSIGHTS.slice(0, showInsights ? AI_INSIGHTS.length : 2).map(a => (
              <ExpandableAlert key={a.id} alert={a} onOpen={onAlert} />
            ))}
          </Stagger>
          {AI_INSIGHTS.length > 2 && (
            <Tap onClick={() => setShowInsights(!showInsights)} className="w-full mt-2 flex items-center justify-center gap-1 py-2 rounded-xl"
              style={{ background: `${C.fplBlue}06` }}>
              <span style={{ fontSize: 12, color: C.fplBlue, fontWeight: 600 }}>
                {showInsights ? 'Show less' : `View all ${AI_INSIGHTS.length} insights`}
              </span>
              <ChevronDown size={14} color={C.fplBlue}
                style={{ transform: showInsights ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
            </Tap>
          )}
        </Section>

        {/* Connected Devices */}
        <Section title="Connected Devices" action="+ Add">
          <GlassCard>
            {dynamicDevices.map((d, i) => (
              <Tap key={i} className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                style={{ borderBottom: i < dynamicDevices.length - 1 ? `1px solid ${C.divider}` : 'none' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 relative"
                  style={{ background: `${C.fplBlue}0D` }}>
                  <DevIcon type={d.type} size={18} />
                  <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{ background: d.controlled ? C.green : C.fplBlue, border: '2px solid white' }}>
                    {d.controlled
                      ? <Check size={7} color="#fff" strokeWidth={4} />
                      : <div style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' }} />
                    }
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate" style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{d.name}</span>
                    <span style={{
                      fontSize: 12,
                      color: d.type === 'thermostat' && drEventPhase !== 'idle' ? C.amber : C.textMuted,
                      fontWeight: d.type === 'thermostat' && drEventPhase !== 'idle' ? 700 : 400,
                      transition: 'all 0.3s ease',
                    }}>{d.val}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-1.5 py-0.5 rounded text-center" style={{
                      fontSize: 9, fontWeight: 600,
                      color: d.controlled ? C.green : C.fplBlue,
                      background: d.controlled ? `${C.green}10` : `${C.fplBlue}10`,
                    }}>{d.status}</span>
                    <span style={{ fontSize: 11, color: C.textMuted }}>{d.kWh} kWh · {d.pct}%</span>
                  </div>
                </div>
                <ChevronRight size={16} color={C.textMuted} />
              </Tap>
            ))}
          </GlassCard>
        </Section>

        {/* AI Assistant Entry Point */}
        <div className="px-5 mb-5">
          <Tap onClick={onChat}>
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #0A1628 0%, #132B44 100%)',
                boxShadow: '0 4px 24px rgba(10,22,40,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
              }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.fplBlue}, ${C.purple})`, boxShadow: '0 4px 12px rgba(0,155,222,0.25)' }}>
                <Zap size={18} color="#fff" />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>FPL Energy Assistant</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>"Why is my bill up?" · "Is my AC okay?" · "Help me save"</div>
              </div>
              <ChevronRight size={18} color="rgba(255,255,255,0.3)" />
            </div>
          </Tap>
        </div>

        {/* FPL Programs — Enrolled */}
        <Section title="Your FPL Programs">
          <GlassCard className="overflow-hidden">
            {[
              {n:'FPL On Call® Savings', s:'Enrolled', credit:'$5/mo credit', c:C.green, active:true},
              {n:'FPL Budget Billing®', s:'–', c:C.textMuted, active:false},
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i < 1 ? `1px solid ${C.divider}` : 'none' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: p.active ? `${C.green}10` : C.bg }}>
                    {p.active ? <Check size={14} color={C.green} strokeWidth={3} /> : <div style={{ width: 6, height: 6, borderRadius: 3, background: C.textMuted, opacity: 0.4 }} />}
                  </div>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{p.n}</span>
                    {p.credit && <div style={{ fontSize: 11, color: C.green, fontWeight: 600, marginTop: 1 }}>{p.credit}</div>}
                  </div>
                </div>
                <Pill color={p.c}>{p.s}</Pill>
              </div>
            ))}
          </GlassCard>
        </Section>

        {/* FPL Programs — Recommended */}
        <Section title="Recommended For You">
          {[
            {n:'FPL SurgeShield®', why:'3 surge events near you this month', cta:'$11.95/mo', color: C.red, icon: Shield},
            {n:'FPL HVAC-on-Bill®', why:'Your AC efficiency is declining — upgrade from $42/mo', cta:'Learn More', color: C.fplBlue, icon: Thermometer},
            {n:'FPL SolarTogether®', why:'Community solar · Earn monthly bill credits', cta:'See Estimate', color: C.orange, icon: Sun},
            {n:'FPL EVolution®', why:'Optimize Tesla charging and earn credits', cta:'Enroll Free', color: C.fplDark, icon: Car},
          ].map((r, i) => (
            <GlassCard key={i} className="p-4 mb-2.5 flex items-center gap-3" gradient>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}0D` }}>
                <r.icon size={18} color={r.color} />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{r.n}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{r.why}</div>
              </div>
              <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: `${r.color}0D`, color: r.color }}>
                {r.cta}
              </span>
            </GlassCard>
          ))}
        </Section>

        {/* Footer */}
        <div className="text-center pb-4 mt-2">
          <div style={{ fontSize: 10, color: C.textMuted }}>Florida Power & Light Company · A NextEra Energy® Company</div>
        </div>
        <BottomNav active="Home" onNav={t => { if(t==='Account') onProfile?.(); if(t==='Usage') onReport?.(); if(t==='Impact') onImpact?.(); }} />
      </div>
    </Screen>
  );
};

/* ─── REPORT (Rebranded to Shield) ─── */
const Report = ({ onBack, onNav }) => {
  const { drEarnings, drEventPhase } = useDemo();
  const totalSavings = 16.50 + (drEventPhase === 'complete' ? drEarnings : 0);
  const bd = [
    {n:'Air Conditioning',pct:58,kWh:726,color:C.fplBlue},
    {n:'Electric Vehicle',pct:28,kWh:156,color:C.fplDark},
    {n:'Pool Pump',pct:16,kWh:89,color:C.orange},
    {n:'Water Heater',pct:12,kWh:67,color:C.green},
    {n:'Other',pct:14,kWh:78,color:C.textMuted}
  ];
  return (
    <Screen direction="right">
      <div className="min-h-screen pb-24" style={{ background: C.bg }}>
        <FPLHeader />
        <div className="px-5 pt-4">
          <Tap onClick={onBack} className="flex items-center gap-1 mb-4">
            <ChevronLeft size={18} color={C.fplBlue} /><span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 500 }}>Back to Dashboard</span>
          </Tap>
          <h1 style={{ fontSize: 20, fontWeight: 300, color: C.textPrimary }}>Monthly Energy Report</h1>
          <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>January 2026 · Account #4821-7390</p>
        </div>

        <Stagger delay={70} className="px-5 mt-6">
          {/* Shield Score - Circular Gauge */}
          <GlassCard className="p-5 mb-5" borderLeft gradient>
            <div className="flex items-center gap-5">
              <ScoreGauge score={78} size={110} />
              <div className="flex-1">
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Your Shield Score</div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: C.greenLight }}>
                    <TrendingUp size={12} color={C.green} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>+4 pts</span>
                  </div>
                </div>
                <p className="mt-2" style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>More efficient than 72% of similar FPL homes.</p>
              </div>
            </div>
          </GlassCard>

          {/* Achievement Badges */}
          <div className="mb-5">
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Achievements</div>
            <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollSnapType: 'x mandatory' }}>
              <AchievementBadge icon="🔥" title="7-Day Saver" earned={true} delay={0} />
              <AchievementBadge icon="⚡" title="Peak Pro" earned={true} delay={100} />
              <AchievementBadge icon="🌱" title="Eco Hero" earned={true} delay={200} />
              <AchievementBadge icon="🏆" title="Top 10%" earned={false} delay={300} />
              <AchievementBadge icon="❄️" title="AC Master" earned={false} delay={400} />
            </div>
          </div>

          {/* Social Comparison */}
          <div className="mb-5">
            <ComparisonCard />
          </div>

          {/* Month at a Glance */}
          <GlassCard className="mb-5 overflow-hidden" gradient>
            <div className="flex justify-between px-4 py-4">
              <div className="text-center flex-1">
                <div style={{ fontSize: 24, fontWeight: 700, color: C.textPrimary }}><AnimNum value={1247} /></div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>kWh used</div>
              </div>
              <div style={{ width: 1, background: C.divider, alignSelf: 'stretch' }} />
              <div className="text-center flex-1">
                <div style={{ fontSize: 24, fontWeight: 700, color: C.green }}>-8%</div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>vs Dec</div>
              </div>
              <div style={{ width: 1, background: C.divider, alignSelf: 'stretch' }} />
              <div className="text-center flex-1">
                <div style={{ fontSize: 24, fontWeight: 700, color: C.textPrimary }}>$<AnimNum value={142} /></div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>Est. Bill</div>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderTop: `1px solid ${C.divider}`, background: 'rgba(230,247,237,0.5)' }}>
              <TrendingDown size={14} color={C.green} />
              <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>You used 12% less than similar homes</span>
            </div>
          </GlassCard>

          {/* Donut Chart Breakdown */}
          <GlassCard className="p-5 mb-5" gradient>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Energy Breakdown</div>
            <DonutChart data={bd} />
          </GlassCard>

          {/* Daily Meter Reads */}
          <div className="mb-5">
            <MeterReadChart />
          </div>

          {/* What Shield Did */}
          <GlassCard className="mb-5 overflow-hidden" borderLeft gradient>
            <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.divider}` }}>
              <div className="flex items-center gap-2">
                <Shield size={16} color={C.fplBlue} />
                <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>What Shield Did For You</span>
              </div>
            </div>
            {[
              {l:'Thermostat optimizations',v:'14 adjustments'},
              {l:'FPL On Call® events',v:'3 participated'},
              {l:'EV charging shifted',v:'12 nights'},
              {l:'Pool pump rescheduled',v:'18 days'}
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: i < 3 ? `1px solid ${C.divider}` : 'none' }}>
                <span style={{ fontSize: 13, color: C.textSecondary }}>{a.l}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{a.v}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-4" style={{ background: 'rgba(230,247,237,0.5)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>Total Monthly Savings</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: C.green }}>$<AnimNum value={totalSavings} decimals={2} dur={1200} /></span>
            </div>
          </GlassCard>

          {/* Recommendations */}
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Personalized Recommendations
          </div>
          {[
            {t:'Upgrade to SEER 18', d:'Save est. $287/yr · FPL HVAC-on-Bill® from $42/mo', cta:'Learn More', color: C.fplBlue},
            {t:'FPL SurgeShield®', d:'3 surge events near your area this month', cta:'$11.95/mo', color: C.red},
            {t:'FPL SolarTogether®', d:'Community solar · Earn monthly bill credits', cta:'See Estimate', color: C.orange}
          ].map((r, i) => (
            <GlassCard key={i} className="p-4 mb-2.5 flex items-center gap-3" onClick={() => {}} gradient>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${r.color}0D` }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: r.color }} />
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{r.t}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{r.d}</div>
              </div>
              <span style={{ fontSize: 12, color: C.fplBlue, fontWeight: 700, flexShrink: 0 }}>{r.cta} →</span>
            </GlassCard>
          ))}

          <div className="text-center py-6">
            <div style={{ fontSize: 10, color: C.textMuted }}>Florida Power & Light Company · A NextEra Energy® Company</div>
            <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Report generated Jan 28, 2026</div>
          </div>
        </Stagger>
        <BottomNav active="Usage" onNav={onNav} />
      </div>
    </Screen>
  );
};

/* ─── PROFILE (Updated with Shield Status) ─── */
const Profile = ({ onBack, onNav }) => (
  <Screen direction="right">
    <div className="min-h-screen pb-24" style={{ background: C.bg }}>
      <FPLHeader />
      <div className="px-5 pt-4">
        <Tap onClick={onBack} className="flex items-center gap-1 mb-4">
          <ChevronLeft size={18} color={C.fplBlue} /><span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 500 }}>Back</span>
        </Tap>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: C.textPrimary }}>Account</h1>
      </div>
      <Stagger delay={50}>
        {/* Shield Status Section */}
        <Section title="Shield Status">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${C.fplBlue}, ${C.fplDark})` }}>
                <Shield size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>Home Energy Shield</div>
                <div className="flex items-center gap-2 mt-1">
                  <div style={{ width: 7, height: 7, borderRadius: 4, background: C.green, animation: 'pulseGlow 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.green }}>Active · 4 devices protected</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </Section>

        <Section title="FPL Account">
          <GlassCard>
            {[{l:'Account Number',v:'4821-7390-8812'},{l:'Service Address',v:'1247 Royal Palm Way, PBG'},{l:'Rate Schedule',v:'RS-1 Residential'},{l:'Billing Cycle',v:'28th of each month'}].map((r, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i<3?`1px solid ${C.divider}`:'none' }}>
                <span style={{ fontSize: 13, color: C.textMuted }}>{r.l}</span>
                <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{r.v}</span>
              </div>
            ))}
          </GlassCard>
        </Section>
        <Section title="Home Profile">
          <div className="grid grid-cols-2 gap-2.5">
            {[{l:'Type',v:'Single Family'},{l:'Size',v:'2,400 sq ft'},{l:'Beds / Bath',v:'3 / 2.5'},{l:'Year Built',v:'2016'},{l:'HVAC',v:'SEER 14'},{l:'Pool',v:'12,000 gal'},{l:'Solar',v:'None'},{l:'EV',v:'Tesla Model Y'}].map((f, i) => (
              <GlassCard key={i} className="py-3 px-4">
                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{f.l}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginTop: 3 }}>{f.v}</div>
              </GlassCard>
            ))}
          </div>
        </Section>
        <Section title="FPL Programs">
          <GlassCard>
            {[{n:'FPL On Call® Savings',s:'Enrolled',c:C.green},{n:'FPL Budget Billing®',s:'–',c:C.textMuted},{n:'FPL SurgeShield®',s:'–',c:C.textMuted},{n:'FPL SolarTogether®',s:'Eligible',c:C.amber}].map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i<3?`1px solid ${C.divider}`:'none' }}>
                <span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>{p.n}</span>
                <Pill color={p.c}>{p.s}</Pill>
              </div>
            ))}
          </GlassCard>
        </Section>
        <Section title="Settings">
          <GlassCard>
            {['Notifications','Privacy & Data','Help & Support','Contact FPL'].map((t, i) => (
              <Tap key={i} className="w-full flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: i<3?`1px solid ${C.divider}`:'none' }}>
                <span style={{ fontSize: 13, color: C.textSecondary }}>{t}</span>
                <ChevronRight size={16} color={C.textMuted} />
              </Tap>
            ))}
          </GlassCard>
        </Section>
        <div className="text-center mt-4 px-5">
          <div style={{ fontSize: 10, color: C.textMuted }}>Florida Power & Light Company · A NextEra Energy® Company</div>
          <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>FPL Home Energy Manager · Beta v2.1.0</div>
        </div>
      </Stagger>
      <BottomNav active="Account" onNav={onNav} />
    </div>
  </Screen>
);

/* ═══════ APP ═══════ */
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [alert, setAlert] = useState(null);
  const [enabledDeviceIds, setEnabledDeviceIds] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const go = s => { setScreen(s); window.scrollTo?.({ top: 0, behavior: 'smooth' }); };
  const nav = t => { if(t==='Home') go('dashboard'); if(t==='Usage') go('report'); if(t==='Impact') go('impact'); if(t==='Account') go('profile'); };

  return (
    <DemoProvider>
      <div className="w-full max-w-md mx-auto min-h-screen relative"
        style={{ background: C.bg, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif" }}>
        <GlobalStyles />
        <ToastContainer />

        {screen === 'splash' && <Splash onNext={() => go('value')} />}
        {screen === 'value' && <ValueProp onConnect={() => go('platforms')} onSkip={() => go('dashboard')} />}
        {screen === 'platforms' && <Platforms onNext={() => go('devices')} onBack={() => go('value')} />}
        {screen === 'devices' && <DeviceSetup onNext={(ids) => { setEnabledDeviceIds(ids); go('shield'); }} />}
        {screen === 'shield' && <ShieldActivation onActivate={() => go('dashboard')} enabledDeviceIds={enabledDeviceIds} />}
        {screen === 'dashboard' && <Dashboard onAlert={a => { setAlert(a); go('alert'); }} onReport={() => go('report')} onProfile={() => go('profile')} onImpact={() => go('impact')} onChat={() => setChatOpen(true)} />}
        {screen === 'alert' && alert && <AlertDetail alert={alert} onBack={() => go('dashboard')} onNav={nav} />}
        {screen === 'report' && <Report onBack={() => go('dashboard')} onNav={nav} />}
        {screen === 'profile' && <Profile onBack={() => go('dashboard')} onNav={nav} />}
        {screen === 'impact' && <CommunityImpact onBack={() => go('dashboard')} onNav={nav} />}

        {/* Demo Control Panel FAB + Panel (visible on dashboard, report, profile, impact) */}
        {['dashboard', 'report', 'profile', 'impact'].includes(screen) && <DemoControlPanel />}

        {/* AI Chat FAB + Chat Panel (visible on dashboard, report, profile, impact) */}
        {['dashboard', 'report', 'profile', 'impact'].includes(screen) && !chatOpen && <AIChatFAB onClick={() => setChatOpen(true)} />}
        {chatOpen && <AIChatAgent onClose={() => setChatOpen(false)} />}

        {/* Screen nav dots */}
        <div className="fixed top-2 right-2 z-50 flex items-center gap-1 rounded-full px-2 py-1.5"
          style={{ background: 'rgba(247,248,250,0.75)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {['splash','value','platforms','devices','shield','dashboard','report','profile','impact'].map(s => (
            <Tap key={s} onClick={() => go(s)} className="rounded-full"
              style={{
                width: screen === s ? 14 : 4, height: 4,
                background: screen === s ? C.fplBlue : '#C8CED6',
                borderRadius: 2, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }} title={s} />
          ))}
        </div>
      </div>
    </DemoProvider>
  );
}
