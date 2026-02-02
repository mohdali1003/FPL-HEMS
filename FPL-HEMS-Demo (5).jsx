import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Check, Bell, Zap, ChevronDown, ArrowRight, X } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   FPL HOME ENERGY MANAGEMENT SYSTEM — CEO DEMO
   
   Clean white background. FPL brand palette.
   Detailed 15-min AMI meter read visualization.
   Official FPL program names & language throughout.
   ═══════════════════════════════════════════════════════════════ */

const C = {
  bg: '#FFFFFF',
  surface: '#F7F8FA',
  card: '#F2F4F7',
  border: '#E2E6ED',
  accent: '#00529B',
  accentLight: '#009CDE',
  accentDim: '#00529B10',
  orange: '#F7941D',
  orangeDim: '#F7941D12',
  green: '#0B8A3E',
  greenDim: '#0B8A3E10',
  greenLight: '#78BE20',
  amber: '#D97706',
  amberDim: '#D9770610',
  red: '#CC2936',
  redDim: '#CC293610',
  t1: '#1A2233',
  t2: '#4A5568',
  t3: '#8896AA',
  t4: '#C3CCDA',
  white: '#FFFFFF',
};

/* ─── FPL LOGO ─── */
const FPLLogo = ({ size = 32 }) => (
  <svg width={size * 2.8} height={size} viewBox="0 0 112 40">
    <defs><linearGradient id="fpll" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F7941D"/><stop offset="100%" stopColor="#FFAF4D"/></linearGradient></defs>
    <circle cx="20" cy="20" r="18" fill="url(#fpll)"/>
    <path d="M20 6 A14 14 0 0 1 34 20" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
    <text x="20" y="25" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="800" fontFamily="Arial,sans-serif">FPL</text>
    <text x="48" y="26" fill={C.accent} fontSize="16" fontWeight="700" fontFamily="Arial,sans-serif">Energy</text>
    <text x="48" y="36" fill={C.t3} fontSize="8" fontWeight="500" fontFamily="Arial,sans-serif" letterSpacing="0.5">Manager</text>
  </svg>
);

/* ─── ENERGY METER ─── */
const EnergyMeter = ({ value = 1247, max = 2000, label = 'kWh', sublabel = 'January 2026', size = 220, accent = C.accent }) => {
  const [animated, setAnimated] = useState(0);
  const pct = Math.min(value / max, 1);
  const r = (size - 20) / 2, circ = 2 * Math.PI * r, gap = circ * 0.15, usable = circ - gap;
  const startAngle = 90 + (360 * 0.075);
  useEffect(() => { const t = setTimeout(() => setAnimated(pct), 300); return () => clearTimeout(t); }, [pct]);
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth="6" strokeDasharray={`${usable} ${gap}`} strokeLinecap="round" transform={`rotate(${startAngle} ${size/2} ${size/2})`}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={accent} strokeWidth="6" strokeDasharray={`${usable * animated} ${circ - usable * animated}`} strokeLinecap="round" transform={`rotate(${startAngle} ${size/2} ${size/2})`} style={{ transition: 'stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}/>
      </svg>
      <div className="text-center z-10">
        <span style={{ fontSize: size * 0.22, fontWeight: 700, color: C.t1, letterSpacing: '-0.03em', lineHeight: 1 }}>{value.toLocaleString()}</span>
        <div style={{ fontSize: 12, color: C.t3, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
        <div style={{ fontSize: 11, color: C.t3, marginTop: 4 }}>{sublabel}</div>
      </div>
    </div>
  );
};

/* ─── MINI GAUGE ─── */
const MiniGauge = ({ value, label, unit = '', color = C.accent, max = 100 }) => {
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnim(value / max), 200); return () => clearTimeout(t); }, [value, max]);
  const sz = 56, r = 22, circ = 2 * Math.PI * r, gap = circ * 0.2, usable = circ - gap;
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: sz, height: sz }}>
        <svg width={sz} height={sz} className="absolute">
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={C.border} strokeWidth="3" strokeDasharray={`${usable} ${gap}`} strokeLinecap="round" transform={`rotate(126 ${sz/2} ${sz/2})`}/>
          <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${usable * anim} ${circ - usable * anim}`} strokeLinecap="round" transform={`rotate(126 ${sz/2} ${sz/2})`} style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}/>
        </svg>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{value}{unit}</span>
      </div>
      <span style={{ fontSize: 10, color: C.t3, marginTop: 2, letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
    </div>
  );
};

/* ─── 15-MIN AMI METER READ CHART ─── */
const MeterReadChart = ({ color = C.accent }) => {
  const [hovered, setHovered] = useState(null);
  const [dayIdx, setDayIdx] = useState(6);
  const days = ['Mon 1/20','Tue 1/21','Wed 1/22','Thu 1/23','Fri 1/24','Sat 1/25','Sun 1/26'];
  
  const generateDay = (seed, peak) => {
    const data = [];
    for (let i = 0; i < 96; i++) {
      const hr = i / 4;
      let base = 0.3 + Math.sin((hr - 6) * Math.PI / 12) * 0.15;
      if (hr >= 13 && hr <= 18) base += peak * (1 - Math.abs(hr - 15.5) / 3.5);
      if (hr >= 6 && hr <= 9) base += 0.4 * (1 - Math.abs(hr - 7.5) / 2);
      if (hr >= 18 && hr <= 21) base += 0.5 * (1 - Math.abs(hr - 19.5) / 2);
      if (hr >= 23 || hr <= 5) base += 0.8 * (seed % 3 === 0 ? 1 : 0.3);
      base += (Math.sin(seed * 17 + i * 0.7) * 0.15);
      data.push(Math.max(0.1, base));
    }
    return data;
  };
  
  const allDays = useMemo(() => [
    generateDay(1, 1.8), generateDay(2, 2.1), generateDay(3, 1.6),
    generateDay(4, 2.3), generateDay(5, 1.9), generateDay(6, 2.5), generateDay(7, 2.2),
  ], []);
  
  const reads = allDays[dayIdx];
  const maxVal = Math.max(...reads);
  const totalKwh = (reads.reduce((s, v) => s + v, 0) * 0.25).toFixed(1);
  const peakKw = maxVal.toFixed(2);
  const chartH = 120;

  return (
    <div className="rounded-2xl p-5" style={{ background: C.white, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>AMI Meter Reads</div>
          <div style={{ fontSize: 10, color: C.t3, marginTop: 2 }}>15-Minute Interval Data · {days[dayIdx]}</div>
        </div>
        <div className="text-right">
          <div style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{totalKwh} <span style={{ fontSize: 11, fontWeight: 500, color: C.t3 }}>kWh</span></div>
          <div style={{ fontSize: 10, color: C.t3 }}>Peak: {peakKw} kW</div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 mb-4 mt-3">
        {days.map((d, i) => (
          <button key={i} onClick={() => { setDayIdx(i); setHovered(null); }}
            className="flex-1 py-1.5 rounded-lg text-center transition-colors"
            style={{ background: dayIdx === i ? C.accent : 'transparent', color: dayIdx === i ? '#fff' : C.t3, fontSize: 9, fontWeight: 600 }}>
            {d.split(' ')[0]}
          </button>
        ))}
      </div>
      
      <div className="relative" style={{ height: chartH + 28 }}>
        <div className="absolute left-0 top-0 flex flex-col justify-between" style={{ height: chartH, width: 28 }}>
          {[maxVal, maxVal * 0.5, 0].map((v, i) => (
            <span key={i} style={{ fontSize: 9, color: C.t4, lineHeight: 1 }}>{v.toFixed(1)}</span>
          ))}
        </div>
        
        <div className="absolute top-0 right-0" style={{ left: 32, height: chartH }}>
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <div key={i} className="absolute w-full" style={{ top: `${p * 100}%`, borderTop: `1px ${i === 4 ? 'solid' : 'dashed'} ${C.border}`, opacity: 0.6 }}/>
          ))}
          
          <div className="absolute top-0" style={{ left: `${(52/96)*100}%`, width: `${(24/96)*100}%`, height: '100%', background: `${C.red}08`, borderRadius: 4 }}/>
          <div className="absolute" style={{ left: `${(52/96)*100}%`, top: -2, fontSize: 8, color: C.red, fontWeight: 700, opacity: 0.8 }}>PEAK</div>
          
          <svg width="100%" height={chartH} preserveAspectRatio="none" viewBox={`0 0 ${reads.length} ${maxVal}`}
            onMouseLeave={() => setHovered(null)}>
            {reads.map((v, i) => {
              const isPeak = i >= 52 && i <= 76;
              const isHov = hovered === i;
              return (
                <rect key={i} x={i} y={maxVal - v} width={0.85} height={v}
                  fill={isHov ? C.orange : isPeak ? C.red+'90' : color}
                  opacity={isHov ? 1 : 0.75}
                  rx={0.2}
                  onMouseEnter={() => setHovered(i)}
                  style={{ cursor: 'pointer', transition: 'fill 0.1s' }}
                />
              );
            })}
          </svg>
        </div>
        
        <div className="absolute flex justify-between" style={{ left: 32, right: 0, top: chartH + 6 }}>
          {['12a','3a','6a','9a','12p','3p','6p','9p','12a'].map((t, i) => (
            <span key={i} style={{ fontSize: 8, color: C.t4, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
        
        {hovered !== null && (
          <div className="absolute pointer-events-none" style={{ left: Math.min(Math.max(32 + (hovered / 96) * 280, 60), 300), top: -8, transform: 'translateX(-50%)', background: C.t1, color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', zIndex: 10 }}>
            {`${Math.floor(hovered/4)}:${String((hovered%4)*15).padStart(2,'0')} — ${reads[hovered].toFixed(2)} kW`}
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }}/><span style={{ fontSize: 10, color: C.t3 }}>Normal</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: C.red+'90' }}/><span style={{ fontSize: 10, color: C.t3 }}>Peak (1–7 PM)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: `${C.red}08`, border: `1px solid ${C.red}25` }}/><span style={{ fontSize: 10, color: C.t3 }}>Peak Window</span></div>
      </div>
    </div>
  );
};

/* ─── SHARED ─── */
const Tap = ({ children, onClick, className = '', style = {} }) => (
  <button onClick={onClick} className={`active:scale-[.98] transition-all ${className}`} style={style}>{children}</button>
);
const Pill = ({ children, color = C.accent }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full" style={{ fontSize: 10, fontWeight: 700, color, background: `${color}12`, letterSpacing: '0.04em' }}>{children}</span>
);
const Section = ({ title, children, action, onAction }) => (
  <div className="px-6 mb-8">
    <div className="flex items-center justify-between mb-4">
      <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      {action && <Tap onClick={onAction}><span style={{ fontSize: 12, color: C.accentLight, fontWeight: 600 }}>{action}</span></Tap>}
    </div>
    {children}
  </div>
);

// ─── DATA ───
const ALERTS = [
  { id:1, p:'HIGH', title:'HVAC Running 134% Above Benchmark', sub:'847 hrs vs 632 avg · Palm Beach 3BR', sav:'$22–34/mo', color:C.red, detail:'Your system ran 847 hours this month vs. 632-hr average for similar FPL customers in Palm Beach County. This may indicate oversized equipment, duct leakage, or aging compressor.', actions:['Schedule a free FPL Home Energy Survey','Check air filter — dirty filters add 15% runtime','SEER 18 upgrade via FPL HVAC-on-Bill® from $42/mo'], program:{ name:'FPL HVAC-on-Bill®', desc:'$0 down · Added to your FPL bill · 0% APR', cta:'From $42/mo' }},
  { id:2, p:'URGENT', title:'Compressor Energy Spike Detected', sub:'62% increase vs 30-day baseline', sav:'Avoid $2K+', color:C.red, detail:'AMI data shows a sudden sustained increase in compressor cycling. This pattern often indicates refrigerant leak, failing capacitor, or compressor degradation.', actions:['Schedule HVAC inspection immediately','Check outdoor unit fan for obstructions','Review FPL SurgeShield® coverage'], program:{ name:'FPL SurgeShield®', desc:'Up to $5,000 warranty per appliance', cta:'$11.95/mo' }},
  { id:3, p:'MEDIUM', title:'Cooling an Empty Home', sub:'AC at 72°F since 8:15 AM · No occupancy', sav:'$10–25/mo', color:C.amber, detail:'Based on thermostat occupancy sensor, you appear to be away. Your AC has been cooling an empty home approximately 6 hours per day.', actions:['Raise setpoint to 78°F now','Enable Away Mode automation','Set up geofence auto-adjust'], program:{ name:'FPL On Call® Savings', desc:'Auto-adjust during FPL peak events', cta:'$5/mo credit' }},
  { id:4, p:'MEDIUM', title:'EV Charging During Peak Hours', sub:'Tesla charged 4:30–8:45 PM', sav:'$8–15/mo', color:C.amber, detail:'Your Tesla Model Y charged during FPL system peak hours. Shifting to 11 PM–6 AM reduces grid stress and prepares your account for future time-of-use options.', actions:['Accept optimized schedule: 11 PM – 6 AM','Set minimum charge 80% by 7 AM','Enable FPL EVolution® smart charging'], program:null },
  { id:5, p:'LOW', title:'Pool Pump Running at Peak', sub:'Ran 4–7 PM · Highest demand period', sav:'$12–18/mo', color:C.accentLight, detail:'Your Pentair pool pump ran during FPL\'s highest demand window. Shifting to 8 AM–12 PM aligns with solar generation on the FPL grid.', actions:['Accept: 8 AM – 12 PM schedule','Enable HEMS auto-scheduling','Reduce runtime 8 → 6 hrs'], program:null },
  { id:6, p:'HIGH', title:'Projected Bill Up 24%', sub:'$187 est. vs $151 last January', sav:'Transparency', color:C.red, detail:'Contributing factors: 3.2°F colder average → +18% HVAC runtime. New EV added ~$22/mo. Water heater also trending up.', actions:['View device-level breakdown','Enroll in FPL Budget Billing®','Review personalized savings plan'], program:{ name:'FPL Budget Billing®', desc:'Predictable monthly payments', cta:'Free' }},
  { id:7, p:'LOW', title:'Phantom Load: 480W Overnight', sub:'Baseload 1–5 AM above 400W', sav:'$5–15/mo', color:C.accentLight, detail:'Your home\'s always-on consumption costs ~$35/month. Common sources: cable boxes, gaming consoles, old garage fridge.', actions:['Review FPL Phantom Load Hunt Guide','Install smart power strip','Check garage refrigerator efficiency'], program:null },
  { id:8, p:'MEDIUM', title:'Water Heater 138% of Benchmark', sub:'92 kWh vs 67 kWh avg', sav:'$4–8/mo', color:C.amber, detail:'Your water heater consumed significantly more than the FPL benchmark. Possible: sediment buildup, thermostat above 120°F, or failing element.', actions:['Set thermostat to 120°F','Flush tank to remove sediment','Insulate exposed hot water pipes'], program:null },
];

const DEVICES = [
  { name:'Nest Thermostat', loc:'Living Room', val:'72°F', pct:23, kWh:127, saved:'$4.20', controlled:true },
  { name:'Tesla Model Y', loc:'Garage', val:'78%', pct:28, kWh:156, saved:'$8.40', controlled:true },
  { name:'Pentair Pool Pump', loc:'Pool', val:'Sched', pct:16, kWh:89, saved:'$2.10', controlled:false },
  { name:'Rheem Water Heater', loc:'Utility', val:'120°F', pct:12, kWh:67, saved:'$1.80', controlled:true },
];

// ─── ALERT DETAIL ───
const AlertDetail = ({ alert: a, onBack }) => (
  <div className="min-h-screen" style={{ background: C.bg }}>
    <div className="px-6 pt-14 pb-6">
      <Tap onClick={onBack} className="flex items-center gap-1 mb-8"><ChevronLeft size={18} color={C.t3}/><span style={{ fontSize: 13, color: C.t3 }}>Back</span></Tap>
      <Pill color={a.color}>{a.p}</Pill>
      <h1 className="mt-3" style={{ fontSize: 22, fontWeight: 700, color: C.t1, lineHeight: 1.3 }}>{a.title}</h1>
      <p className="mt-3" style={{ fontSize: 14, color: C.t2, lineHeight: 1.7 }}>{a.detail}</p>
      {a.sav !== 'Transparency' && (
        <div className="mt-5 py-3 px-4 rounded-xl" style={{ background: C.greenDim, border: `1px solid ${C.green}15` }}>
          <span style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Estimated Savings</span>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.green, marginTop: 4 }}>{a.sav}</div>
        </div>
      )}
    </div>
    <div className="px-6">
      <span style={{ fontSize: 10, color: C.accent, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>FPL Recommendations</span>
      <div className="mt-3">
        {a.actions.map((act, i) => (
          <div key={i} className="flex items-start gap-3 py-3.5" style={{ borderBottom: i < a.actions.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ width: 22, height: 22, background: C.accentDim }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>{i + 1}</span>
            </div>
            <span style={{ fontSize: 14, color: C.t2, lineHeight: 1.5 }}>{act}</span>
          </div>
        ))}
      </div>
    </div>
    {a.program && (
      <div className="px-6 mt-8 mb-8">
        <div className="p-5 rounded-2xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 10, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>FPL Program</span>
          <h3 className="mt-2" style={{ fontSize: 16, fontWeight: 700, color: C.t1 }}>{a.program.name}</h3>
          <p style={{ fontSize: 13, color: C.t3, marginTop: 4 }}>{a.program.desc}</p>
          <Tap className="mt-4 w-full py-3 rounded-xl flex items-center justify-center" style={{ background: C.accent }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Enroll · {a.program.cta}</span>
          </Tap>
        </div>
      </div>
    )}
  </div>
);

// ─── SPLASH ───
const Splash = ({ onNext }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: 'linear-gradient(170deg, #00529B 0%, #003A6E 100%)' }}>
      <div className={`text-center transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-10 flex justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <defs><linearGradient id="splash" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F7941D"/><stop offset="100%" stopColor="#FFAF4D"/></linearGradient></defs>
            <circle cx="40" cy="40" r="36" fill="url(#splash)"/>
            <path d="M40 12 A28 28 0 0 1 68 40" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.9"/>
            <text x="40" y="48" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" fontFamily="Arial,sans-serif">FPL</text>
          </svg>
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#fff' }}>Home Energy Manager</h1>
        <p className="mt-3" style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>Smart insights for every device.<br/>Powered by your FPL meter data.</p>
        <Tap onClick={onNext} className="mt-12 px-10 py-4 rounded-xl inline-flex items-center gap-2" style={{ background: C.orange }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Get Started</span>
          <ArrowRight size={18} color="#fff"/>
        </Tap>
        <div className="mt-16" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>A NextEra Energy® Company</div>
      </div>
    </div>
  );
};

// ─── ONBOARDING: CONNECT ───
const Connect = ({ onConnect, onSkip }) => (
  <div className="min-h-screen px-6 pt-16" style={{ background: C.bg }}>
    <FPLLogo size={28}/>
    <div className="mt-8" style={{ fontSize: 11, color: C.accent, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>Step 1</div>
    <h1 className="mt-3" style={{ fontSize: 26, fontWeight: 700, color: C.t1 }}>Connect your smart home</h1>
    <p className="mt-3 mb-10" style={{ fontSize: 14, color: C.t2, lineHeight: 1.7 }}>FPL pairs your connected devices with your AMI meter data to deliver personalized energy insights and savings.</p>
    <div className="mb-10">
      {['See exactly where every kWh goes — device by device','Automated optimization working behind the scenes','Earn up to $60/yr in FPL On Call® demand response credits'].map((t, i) => (
        <div key={i} className="flex items-center gap-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: C.greenDim }}><Check size={14} color={C.green}/></div>
          <span style={{ fontSize: 14, color: C.t1 }}>{t}</span>
        </div>
      ))}
    </div>
    <Tap onClick={onConnect} className="w-full py-4 rounded-xl flex items-center justify-center" style={{ background: C.accent }}>
      <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Connect Devices</span>
    </Tap>
    <Tap onClick={onSkip} className="w-full py-4 mt-2 flex items-center justify-center">
      <span style={{ fontSize: 14, color: C.t3 }}>Skip for now</span>
    </Tap>
  </div>
);

// ─── PLATFORM LOGOS ───
const PlatformLogo = ({ id, size = 28 }) => {
  const s = size;
  const logos = {
    google: (<svg width={s} height={s} viewBox="0 0 48 48"><path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/><path d="M3.2 14.1l7.1 5.2C12.2 15 17.7 11 24 11c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 14.9 2 7.2 6.8 3.2 14.1z" fill="#FF3D00"/><path d="M24 46c5.4 0 10.3-1.9 14.1-5.2l-6.5-5.5C29.5 37 26.9 38 24 38c-6 0-11.1-4-12.8-9.5l-7 5.4C7.9 41 15.4 46 24 46z" fill="#4CAF50"/><path d="M44.5 20H24v8.5h11.8c-1 3-3 5.5-5.6 7.2l6.5 5.5C42.8 35.5 46 30 46 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/></svg>),
    alexa: (<svg width={s} height={s} viewBox="0 0 48 48"><defs><linearGradient id="al" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#31C4F3"/><stop offset="100%" stopColor="#00CAFF"/></linearGradient></defs><circle cx="24" cy="24" r="20" fill="url(#al)"/><path d="M24 10c-7.7 0-14 6.3-14 14 0 4.8 2.4 9 6.1 11.5l1.5-2.6C14.8 30.8 13 27.6 13 24c0-6.1 4.9-11 11-11s11 4.9 11 11c0 3.6-1.8 6.8-4.6 8.9l1.5 2.6C35.6 33 38 28.8 38 24c0-7.7-6.3-14-14-14z" fill="#fff"/><circle cx="24" cy="24" r="4" fill="#fff"/></svg>),
    apple: (<svg width={s} height={s} viewBox="0 0 48 48"><path d="M34.5 39.8c-1.7 1.7-3.6 1.4-5.4.6-1.9-.8-3.6-.9-5.6 0-2.5 1.1-3.9.8-5.4-.6C10.4 31.7 11.3 19.4 20 19c2.1.1 3.5 1.1 4.8 1.2 1.8-.4 3.6-1.4 5.5-1.3 2.3.2 4.1 1.2 5.2 3-4.8 2.9-3.6 9.3.8 11.1-.9 2.5-2.1 4.9-3.8 6.8zM24.3 18.9c-.2-4.2 3.2-7.7 7.1-8 .6 4.7-4.3 8.2-7.1 8z" fill="#333"/></svg>),
    smartthings: (<svg width={s} height={s} viewBox="0 0 48 48"><defs><linearGradient id="st" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#15BDF2"/><stop offset="100%" stopColor="#1295D8"/></linearGradient></defs><circle cx="24" cy="24" r="20" fill="url(#st)"/><circle cx="24" cy="17" r="3.5" fill="#fff"/><circle cx="17" cy="28" r="3.5" fill="#fff"/><circle cx="31" cy="28" r="3.5" fill="#fff"/><line x1="24" y1="20.5" x2="18.5" y2="25" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="24" y1="20.5" x2="29.5" y2="25" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><line x1="20.5" y1="28" x2="27.5" y2="28" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>),
    ecobee: (<svg width={s} height={s} viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="10" fill="#008A36"/><path d="M14 24c0-5.5 4.5-10 10-10 3.3 0 6.3 1.6 8.1 4.2l-3.4 2.4C27.4 18.9 25.8 18 24 18c-3.3 0-6 2.7-6 6s2.7 6 6 6c1.8 0 3.4-.8 4.7-2l3.2 2.7C30 33.5 27.2 35 24 35c-5.8 0-10-4.5-10-11z" fill="#fff"/><circle cx="33" cy="24" r="3" fill="#fff"/></svg>),
    tesla: (<svg width={s} height={s} viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="10" fill="#CC0000"/><path d="M24 12l-10 5h3.5l6.5 19 6.5-19H34L24 12z" fill="#fff"/></svg>),
    nest: (<svg width={s} height={s} viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#00A8E0"/><circle cx="24" cy="24" r="14" fill="none" stroke="#fff" strokeWidth="3"/><circle cx="24" cy="24" r="8" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7"/><text x="24" y="28" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="sans-serif">72°</text></svg>),
    honeywell: (<svg width={s} height={s} viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" rx="10" fill="#E41F35"/><path d="M14 18h20v3H14zM14 24h20v3H14zM14 30h12v3H14z" fill="#fff"/><polygon points="38,27 32,22 32,32" fill="#fff"/></svg>),
  };
  return logos[id] || <div className="w-7 h-7 rounded-full" style={{ background: '#ccc' }}/>;
};

// ─── ONBOARDING: PLATFORMS ───
const Platforms = ({ onNext, onBack }) => {
  const [sel, setSel] = useState([]);
  const ps = [
    { id:'google', n:'Google Home' }, { id:'alexa', n:'Amazon Alexa' },
    { id:'apple', n:'Apple HomeKit' }, { id:'smartthings', n:'SmartThings' },
    { id:'ecobee', n:'ecobee' }, { id:'tesla', n:'Tesla' },
    { id:'nest', n:'Nest' }, { id:'honeywell', n:'Honeywell' },
  ];
  const tog = id => setSel(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  return (
    <div className="min-h-screen px-6 pt-14" style={{ background: C.bg }}>
      <Tap onClick={onBack} className="flex items-center gap-1 mb-8"><ChevronLeft size={18} color={C.t3}/><span style={{ fontSize: 13, color: C.t3 }}>Back</span></Tap>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>Step 2</div>
      <h1 className="mt-3 mb-2" style={{ fontSize: 26, fontWeight: 700, color: C.t1 }}>Select your platforms</h1>
      <p className="mb-8" style={{ fontSize: 13, color: C.t3 }}>Choose all that apply. You can add more anytime.</p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {ps.map(p => {
          const active = sel.includes(p.id);
          return (
            <Tap key={p.id} onClick={() => tog(p.id)} className="p-4 rounded-2xl text-left transition-all" style={{ background: active ? `${C.accent}08` : C.white, border: `2px solid ${active ? C.accent : C.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <PlatformLogo id={p.id} size={32}/>
                {active && <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.accent }}><Check size={12} color="#fff"/></div>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{p.n}</span>
            </Tap>
          );
        })}
      </div>
      <Tap onClick={onNext} className="w-full py-4 rounded-xl flex items-center justify-center" style={{ background: sel.length ? C.accent : C.card }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: sel.length ? '#fff' : C.t3 }}>
          {sel.length ? `Continue · ${sel.length} selected` : 'Continue with meter data only'}
        </span>
      </Tap>
    </div>
  );
};

// ─── ONBOARDING: DEVICES ───
const DeviceSetup = ({ onNext }) => {
  const [ctrl, setCtrl] = useState({});
  const ds = [
    { id:1, name:'Nest Thermostat', loc:'Living Room', val:'72°F' },
    { id:2, name:'Tesla Model Y', loc:'Garage', val:'78%' },
    { id:3, name:'Pentair Pool Pump', loc:'Pool', val:'Running' },
    { id:4, name:'Rheem Water Heater', loc:'Utility', val:'120°F' },
  ];
  const en = Object.values(ctrl).filter(Boolean).length;
  return (
    <div className="min-h-screen px-6 pt-14" style={{ background: C.bg }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.greenDim }}><Check size={16} color={C.green}/></div>
        <div><span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>Connected</span><span style={{ fontSize: 13, color: C.t3 }}> · 4 devices found</span></div>
      </div>
      <div style={{ fontSize: 11, color: C.accent, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>Step 3</div>
      <h1 className="mt-3 mb-2" style={{ fontSize: 26, fontWeight: 700, color: C.t1 }}>Enable FPL control</h1>
      <p className="mb-8" style={{ fontSize: 13, color: C.t3, lineHeight: 1.6 }}>Allow FPL to optimize devices during peak events and earn FPL On Call® demand response credits.</p>
      <div className="mb-6">
        {ds.map((d, i) => (
          <div key={d.id} className="flex items-center justify-between py-4" style={{ borderBottom: i < ds.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 1 }}>{d.loc} · {d.val}</div>
            </div>
            <Tap onClick={() => setCtrl(p => ({...p, [d.id]: !p[d.id]}))} className="relative" style={{ width: 44, height: 26, borderRadius: 13, background: ctrl[d.id] ? C.accent : C.card, border: `1px solid ${ctrl[d.id] ? C.accent : C.border}`, transition: 'background 0.2s' }}>
              <div className="absolute top-0.5 rounded-full bg-white transition-transform" style={{ width: 22, height: 22, left: 1, transform: ctrl[d.id] ? 'translateX(18px)' : 'translateX(0)', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}/>
            </Tap>
          </div>
        ))}
      </div>
      {en > 0 && (
        <div className="mb-6 py-3 px-4 rounded-xl" style={{ background: C.greenDim, border: `1px solid ${C.green}15` }}>
          <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>Est. FPL On Call® earnings: ${en * 15}/year</span>
        </div>
      )}
      <Tap onClick={onNext} className="w-full py-4 rounded-xl flex items-center justify-center" style={{ background: C.accent }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Start Monitoring</span>
      </Tap>
    </div>
  );
};

// ─── DASHBOARD ───
const Dashboard = ({ onAlert, onReport, onProfile }) => {
  const [loaded, setLoaded] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);
  const visAlerts = showAllAlerts ? ALERTS : ALERTS.slice(0, 3);
  const pColor = { HIGH: C.red, URGENT: C.red, MEDIUM: C.amber, LOW: C.accentLight };
  return (
    <div className={`min-h-screen pb-24 transition-opacity duration-500 ${loaded?'opacity-100':'opacity-0'}`} style={{ background: C.bg }}>
      <div className="px-6 pt-14 pb-2 flex items-center justify-between">
        <FPLLogo size={24}/>
        <div className="flex items-center gap-3">
          <Tap className="relative"><Bell size={20} color={C.t2}/><div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: C.red, fontSize: 9, color: '#fff', fontWeight: 700 }}>{ALERTS.length}</div></Tap>
          <Tap onClick={onProfile} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.accent }}><span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>JS</span></Tap>
        </div>
      </div>
      
      <div className="flex flex-col items-center py-4">
        <EnergyMeter value={1247} max={2000} label="kWh" sublabel="January 2026" size={200}/>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green }}/>
          <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>↓ 8% vs last month</span>
        </div>
      </div>
      
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between py-4 rounded-2xl px-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="text-center"><div style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>$142</div><div style={{ fontSize: 10, color: C.t3, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Est. Bill</div></div>
          <div style={{ width: 1, height: 28, background: C.border }}/>
          <div className="text-center"><div style={{ fontSize: 18, fontWeight: 700, color: C.green }}>$16.50</div><div style={{ fontSize: 10, color: C.t3, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>HEMS Saved</div></div>
          <div style={{ width: 1, height: 28, background: C.border }}/>
          <div className="text-center"><div style={{ fontSize: 18, fontWeight: 700, color: C.orange }}>$4.50</div><div style={{ fontSize: 10, color: C.t3, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>On Call®</div></div>
        </div>
      </div>
      
      <div className="px-6 mb-6">
        <div className="py-3.5 px-5 rounded-xl flex items-center gap-3" style={{ background: C.orangeDim, border: `1px solid ${C.orange}20` }}>
          <Zap size={16} color={C.orange}/>
          <div className="flex-1">
            <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>FPL Peak Event Active</span>
            <span style={{ fontSize: 12, color: C.t2 }}> · Thermostat → 75°F · +$0.50</span>
          </div>
          <Tap className="px-3 py-1.5 rounded-lg" style={{ background: C.white, border: `1px solid ${C.border}` }}><span style={{ fontSize: 11, fontWeight: 600, color: C.t2 }}>Override</span></Tap>
        </div>
      </div>
      
      <Section title="FPL Insights & Alerts" action={`${ALERTS.length} active`}>
        <div className="space-y-2">
          {visAlerts.map(a => (
            <Tap key={a.id} onClick={() => onAlert(a)} className="w-full p-4 rounded-xl text-left flex items-start gap-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: pColor[a.p] }}/>
              <div className="flex-1 min-w-0">
                <span className="truncate block" style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{a.title}</span>
                <div className="truncate" style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{a.sub}</div>
              </div>
              <span style={{ fontSize: 12, color: C.green, fontWeight: 600, flexShrink: 0 }}>{a.sav}</span>
            </Tap>
          ))}
        </div>
        {ALERTS.length > 3 && (
          <Tap onClick={() => setShowAllAlerts(!showAllAlerts)} className="w-full mt-3 flex items-center justify-center gap-1 py-2">
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{showAllAlerts ? 'Show less' : `View all ${ALERTS.length} insights`}</span>
            <ChevronDown size={14} color={C.accent} style={{ transform: showAllAlerts ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}/>
          </Tap>
        )}
      </Section>
      
      <Section title="Connected Devices" action="+ Add">
        {DEVICES.map((d, i) => (
          <Tap key={i} className="w-full flex items-center justify-between py-4 text-left" style={{ borderBottom: i < DEVICES.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.controlled ? C.green : C.t4 }}/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><span className="truncate" style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{d.name}</span><span style={{ fontSize: 12, color: C.t3 }}>{d.val}</span></div>
                <div className="flex items-center gap-3 mt-1"><span style={{ fontSize: 11, color: C.t3 }}>{d.kWh} kWh · {d.pct}%</span><span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>-{d.saved}</span></div>
              </div>
            </div>
            <ChevronRight size={16} color={C.t4}/>
          </Tap>
        ))}
      </Section>
      
      <Section title="FPL Programs">
        <div className="grid grid-cols-2 gap-2.5">
          {[{ t:'Monthly Report', s:'January 2026', click: onReport },{ t:'FPL SolarTogether®', s:'Community solar' },{ t:'FPL SurgeShield®', s:'$11.95/mo' },{ t:'FPL EVolution®', s:'Smart EV charging' }].map((p, i) => (
            <Tap key={i} onClick={p.click} className="p-4 rounded-xl text-left" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{p.t}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{p.s}</div>
            </Tap>
          ))}
        </div>
      </Section>
      
      <div className="fixed bottom-0 left-0 right-0 flex justify-around py-4 px-6" style={{ background: C.white, borderTop: `1px solid ${C.border}` }}>
        {['Home','Devices','Insights','Profile'].map((t, i) => (
          <Tap key={t} onClick={i === 3 ? onProfile : undefined} className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? C.accent : 'transparent' }}/>
            <span style={{ fontSize: 10, fontWeight: 600, color: i === 0 ? C.accent : C.t3 }}>{t}</span>
          </Tap>
        ))}
      </div>
    </div>
  );
};

// ─── REPORT ───
const Report = ({ onBack }) => {
  const bd = [
    { n:'Air Conditioning', pct:58, kWh:726, color: C.accent },
    { n:'Electric Vehicle', pct:28, kWh:156, color: C.accentLight },
    { n:'Pool Pump', pct:16, kWh:89, color: C.orange },
    { n:'Water Heater', pct:12, kWh:67, color: C.green },
    { n:'Other (Lighting, Appliances)', pct:14, kWh:78, color: C.t3 },
  ];
  return (
    <div className="min-h-screen pb-8" style={{ background: C.bg }}>
      <div className="px-6 pt-14">
        <Tap onClick={onBack} className="flex items-center gap-1 mb-8"><ChevronLeft size={18} color={C.t3}/><span style={{ fontSize: 13, color: C.t3 }}>Back to Dashboard</span></Tap>
        <FPLLogo size={22}/>
        <div className="mt-6" style={{ fontSize: 11, color: C.accent, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Energy Report</div>
        <h1 className="mt-2" style={{ fontSize: 28, fontWeight: 700, color: C.t1 }}>January 2026</h1>
        <p style={{ fontSize: 12, color: C.t3, marginTop: 4 }}>Account #4821-7390 · Palm Beach Gardens, FL</p>
      </div>
      
      <div className="flex flex-col items-center py-6">
        <EnergyMeter value={78} max={100} label="Score" sublabel="↑ 4 pts from December" size={160} accent={C.green}/>
        <span className="mt-2" style={{ fontSize: 12, color: C.t3 }}>More efficient than 72% of similar FPL homes</span>
      </div>
      
      <div className="px-6 mb-6">
        <div className="flex justify-between py-4 px-5 rounded-2xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div className="text-center"><div style={{ fontSize: 22, fontWeight: 700, color: C.t1 }}>1,247</div><div style={{ fontSize: 10, color: C.t3, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>kWh</div></div>
          <div style={{ width: 1, height: 32, background: C.border, alignSelf: 'center' }}/>
          <div className="text-center"><div style={{ fontSize: 22, fontWeight: 700, color: C.green }}>-8%</div><div style={{ fontSize: 10, color: C.t3, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>vs Dec</div></div>
          <div style={{ width: 1, height: 32, background: C.border, alignSelf: 'center' }}/>
          <div className="text-center"><div style={{ fontSize: 22, fontWeight: 700, color: C.t1 }}>$142</div><div style={{ fontSize: 10, color: C.t3, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>Est. Bill</div></div>
        </div>
      </div>
      
      <Section title="Detailed AMI Meter Reads">
        <MeterReadChart color={C.accent}/>
      </Section>
      
      <Section title="Energy Breakdown by Device">
        <div className="space-y-4">
          {bd.map((d, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }}/><span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{d.n}</span></div>
                <span style={{ fontSize: 12, color: C.t2, fontWeight: 500 }}>{d.kWh} kWh · {d.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.surface }}>
                <div className="h-full rounded-full" style={{ width: `${(d.pct / 60) * 100}%`, background: d.color, transition: 'width 1s ease' }}/>
              </div>
            </div>
          ))}
        </div>
      </Section>
      
      <Section title="What FPL HEMS Did For You">
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
          {[{ l:'Thermostat optimizations', v:'14 adjustments' },{ l:'FPL On Call® events', v:'3 participated' },{ l:'EV charging shifted', v:'12 nights' },{ l:'Pool pump rescheduled', v:'18 days' }].map((a, i) => (
            <div key={i} className="flex items-center justify-between py-3.5 px-4" style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: C.t2 }}>{a.l}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{a.v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-4 px-4" style={{ background: C.greenDim }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>Total Monthly Savings</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: C.green }}>$16.50</span>
          </div>
        </div>
      </Section>
      
      <Section title="FPL Recommendations">
        {[{ t:'Upgrade to SEER 18', d:'Save est. $287/yr · FPL HVAC-on-Bill® from $42/mo', cta:'Learn More' },{ t:'FPL SurgeShield®', d:'3 surge events near your area this month', cta:'$11.95/mo' },{ t:'FPL SolarTogether®', d:'Community solar · Earn monthly bill credits', cta:'See Estimate' }].map((r, i) => (
          <Tap key={i} className="w-full p-4 rounded-xl text-left mb-2 flex items-center justify-between" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div><div style={{ fontSize: 14, fontWeight: 600, color: C.t1 }}>{r.t}</div><div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>{r.d}</div></div>
            <span style={{ fontSize: 12, color: C.accent, fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>{r.cta}</span>
          </Tap>
        ))}
      </Section>
      
      <div className="text-center pb-4">
        <div style={{ fontSize: 10, color: C.t4 }}>Florida Power & Light Company · A NextEra Energy® Company</div>
        <div style={{ fontSize: 10, color: C.t4, marginTop: 2 }}>Account #4821-7390 · Report generated Jan 28, 2026</div>
      </div>
    </div>
  );
};

// ─── PROFILE ───
const Profile = ({ onBack }) => (
  <div className="min-h-screen pb-8" style={{ background: C.bg }}>
    <div className="px-6 pt-14">
      <Tap onClick={onBack} className="flex items-center gap-1 mb-8"><ChevronLeft size={18} color={C.t3}/><span style={{ fontSize: 13, color: C.t3 }}>Back</span></Tap>
    </div>
    <div className="px-6 mb-10 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: C.accent }}><span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>JS</span></div>
      <div><div style={{ fontSize: 20, fontWeight: 700, color: C.t1 }}>John Smith</div><div style={{ fontSize: 12, color: C.t3 }}>FPL Customer since 2018</div></div>
    </div>
    
    <Section title="FPL Account">
      {[{ l:'Account Number', v:'4821-7390-8812' },{ l:'Service Address', v:'1247 Royal Palm Way, PBG' },{ l:'Rate Schedule', v:'RS-1 Residential' },{ l:'Billing Cycle', v:'28th of each month' }].map((r, i) => (
        <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
          <span style={{ fontSize: 13, color: C.t3 }}>{r.l}</span>
          <span style={{ fontSize: 13, color: C.t1, fontWeight: 500, textAlign: 'right', maxWidth: '60%' }}>{r.v}</span>
        </div>
      ))}
    </Section>
    
    <Section title="Home Profile">
      <div className="grid grid-cols-2 gap-2.5">
        {[{ l:'Type', v:'Single Family' },{ l:'Size', v:'2,400 sq ft' },{ l:'Beds / Bath', v:'3 / 2.5' },{ l:'Year Built', v:'2016' },{ l:'HVAC', v:'SEER 14' },{ l:'Pool', v:'12,000 gal' },{ l:'Solar', v:'None' },{ l:'EV', v:'Tesla Model Y' }].map((f, i) => (
          <div key={i} className="py-3 px-4 rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 10, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{f.l}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t1, marginTop: 3 }}>{f.v}</div>
          </div>
        ))}
      </div>
    </Section>
    
    <Section title="HEMS Status">
      <div className="flex justify-around py-5 rounded-2xl mb-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <MiniGauge value={78} label="SCORE" color={C.green}/><MiniGauge value={5} max={8} label="DEVICES" color={C.accent}/><MiniGauge value={3} max={5} label="ENROLLED" color={C.orange}/>
      </div>
      {[{ l:'Google Home', v:'3 devices' },{ l:'Tesla', v:'1 vehicle' },{ l:'ecobee', v:'1 thermostat' }].map((p, i) => (
        <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
          <span style={{ fontSize: 13, color: C.t1, fontWeight: 500 }}>{p.l}</span>
          <div className="flex items-center gap-2"><span style={{ fontSize: 12, color: C.t3 }}>{p.v}</span><div className="w-2 h-2 rounded-full" style={{ background: C.green }}/></div>
        </div>
      ))}
    </Section>
    
    <Section title="FPL Programs">
      {[{ n:'FPL On Call® Savings', s:'Enrolled', c: C.green },{ n:'FPL Budget Billing®', s:'—', c: C.t4 },{ n:'FPL SurgeShield®', s:'—', c: C.t4 },{ n:'FPL SolarTogether®', s:'Eligible', c: C.amber }].map((p, i) => (
        <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
          <span style={{ fontSize: 13, color: C.t1, fontWeight: 500 }}>{p.n}</span>
          <Pill color={p.c}>{p.s}</Pill>
        </div>
      ))}
    </Section>
    
    <Section title="Settings">
      {['Notifications','Privacy & Data','Help & Support','Contact FPL'].map((t, i) => (
        <Tap key={i} className="w-full flex items-center justify-between py-3.5" style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
          <span style={{ fontSize: 13, color: C.t2 }}>{t}</span><ChevronRight size={16} color={C.t4}/>
        </Tap>
      ))}
    </Section>
    
    <div className="text-center mt-4">
      <div style={{ fontSize: 10, color: C.t4 }}>Florida Power & Light Company · A NextEra Energy® Company</div>
      <div style={{ fontSize: 10, color: C.t4, marginTop: 2 }}>FPL Home Energy Manager · Beta v2.1.0</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [alert, setAlert] = useState(null);
  const go = s => { setScreen(s); window.scrollTo?.(0, 0); };
  return (
    <div className="w-full max-w-md mx-auto min-h-screen relative overflow-x-hidden" style={{ background: C.bg, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif" }}>
      {screen === 'splash' && <Splash onNext={() => go('connect')}/>}
      {screen === 'connect' && <Connect onConnect={() => go('platforms')} onSkip={() => go('dashboard')}/>}
      {screen === 'platforms' && <Platforms onNext={() => go('devices')} onBack={() => go('connect')}/>}
      {screen === 'devices' && <DeviceSetup onNext={() => go('dashboard')}/>}
      {screen === 'dashboard' && <Dashboard onAlert={a => { setAlert(a); go('alert'); }} onReport={() => go('report')} onProfile={() => go('profile')}/>}
      {screen === 'alert' && alert && <AlertDetail alert={alert} onBack={() => go('dashboard')}/>}
      {screen === 'report' && <Report onBack={() => go('dashboard')}/>}
      {screen === 'profile' && <Profile onBack={() => go('dashboard')}/>}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-1.5 rounded-full px-2.5 py-2" style={{ background: 'rgba(0,82,155,0.06)', backdropFilter: 'blur(12px)' }}>
        {['splash','connect','platforms','devices','dashboard','report','profile'].map(s => (
          <Tap key={s} onClick={() => go(s)} className="rounded-full" style={{ width: screen === s ? 16 : 5, height: 5, background: screen === s ? C.accent : C.t4, borderRadius: 3, transition: 'all 0.3s' }} title={s}/>
        ))}
      </div>
    </div>
  );
}
