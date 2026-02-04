import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Check, Bell, Zap, ChevronDown, ArrowRight, X, Home, BarChart2, AlertTriangle, User, Menu } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   FPL HOME ENERGY MANAGEMENT SYSTEM — CEO DEMO
   
   Pixel-matched to the real FPL mobile app:
   - Blue swirl logo with "FPL" beneath
   - Teal top bar (#009BDE)
   - White background, white cards with teal-left-border
   - FPL Blue buttons, outlined secondary buttons
   - Bottom nav: white bar, thin blue line on top, 5 tabs
   - Official FPL program names throughout
   ═══════════════════════════════════════════════════════════════ */

const C = {
  topBar: '#009BDE',
  fplBlue: '#009BDE',
  fplDark: '#00629B',
  bg: '#F5F5F5',
  white: '#FFFFFF',
  cardBorder: '#E0E0E0',
  divider: '#EEEEEE',
  textPrimary: '#333333',
  textSecondary: '#666666',
  textMuted: '#999999',
  green: '#2E7D32',
  greenLight: '#E8F5E9',
  red: '#C62828',
  redLight: '#FFEBEE',
  amber: '#F57F17',
  amberLight: '#FFF8E1',
  orange: '#F7941D',
};

/* ─── REAL FPL LOGO (blue swirl) ─── */
const FPLLogo = ({ size = 40 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 60 69">
    <g transform="translate(30, 26)">
      <path d="M0,-22 C12.1,-22 22,-12.1 22,0 C22,5.5 20,10.5 16.8,14.4" fill="none" stroke={C.fplBlue} strokeWidth="5" strokeLinecap="round"/>
      <path d="M0,-22 C-8,-22 -15,-18 -19,-12" fill="none" stroke={C.fplBlue} strokeWidth="5" strokeLinecap="round"/>
      <path d="M-19,-12 C-22,-7 -22,-1 -20,4 C-17,11 -10,16 -2,16 C4,16 9,13 12,9" fill="none" stroke={C.fplBlue} strokeWidth="5" strokeLinecap="round"/>
      <path d="M12,9 C14,6 15,3 15,0 C15,-6 11,-11 5,-13" fill="none" stroke={C.fplBlue} strokeWidth="5" strokeLinecap="round"/>
      <path d="M5,-13 C1,-14 -3,-13 -6,-10 C-9,-7 -10,-2 -8,2 C-6,6 -2,8 2,8 C5,8 7,6 8,4" fill="none" stroke={C.fplBlue} strokeWidth="4" strokeLinecap="round"/>
    </g>
    <text x="30" y="63" textAnchor="middle" fill={C.fplBlue} fontSize="16" fontWeight="800" fontFamily="Arial,Helvetica,sans-serif" letterSpacing="2">FPL</text>
  </svg>
);

const FPLLogoSmall = ({ size = 28 }) => (
  <svg width={size * 1.6} height={size} viewBox="0 0 70 44">
    <g transform="translate(18, 18) scale(0.65)">
      <path d="M0,-22 C12.1,-22 22,-12.1 22,0 C22,5.5 20,10.5 16.8,14.4" fill="none" stroke={C.fplBlue} strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M0,-22 C-8,-22 -15,-18 -19,-12" fill="none" stroke={C.fplBlue} strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M-19,-12 C-22,-7 -22,-1 -20,4 C-17,11 -10,16 -2,16 C4,16 9,13 12,9" fill="none" stroke={C.fplBlue} strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M12,9 C14,6 15,3 15,0 C15,-6 11,-11 5,-13" fill="none" stroke={C.fplBlue} strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M5,-13 C1,-14 -3,-13 -6,-10 C-9,-7 -10,-2 -8,2 C-6,6 -2,8 2,8 C5,8 7,6 8,4" fill="none" stroke={C.fplBlue} strokeWidth="4.5" strokeLinecap="round"/>
    </g>
    <text x="40" y="16" fill={C.fplBlue} fontSize="11" fontWeight="800" fontFamily="Arial,Helvetica,sans-serif" letterSpacing="1.5">FPL</text>
    <text x="40" y="30" fill={C.textSecondary} fontSize="7" fontWeight="500" fontFamily="Arial,sans-serif" letterSpacing="0.3">Energy Manager</text>
  </svg>
);

/* ─── FPL TOP BAR + HEADER ─── */
const FPLHeader = ({ name = "Mohammad Ali", address = "10734 STELLAR CIR" }) => (
  <div>
    <div style={{ height: 6, background: C.topBar }} />
    <div className="flex items-center justify-between px-5 py-4" style={{ background: C.white }}>
      <FPLLogoSmall size={28} />
      <div className="text-right">
        <div style={{ fontSize: 14, fontWeight: 600, color: C.fplBlue }}>{name}</div>
        <div style={{ fontSize: 11, color: C.textMuted }}>{address}</div>
      </div>
    </div>
  </div>
);

/* ─── BOTTOM NAV ─── */
const BottomNav = ({ active = 'Home', onNav }) => {
  const tabs = [
    { id: 'Home', icon: Home },
    { id: 'Usage', icon: BarChart2 },
    { id: 'Outages', icon: AlertTriangle },
    { id: 'Account', icon: User },
    { id: 'Menu', icon: Menu },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ maxWidth: 448, margin: '0 auto' }}>
      <div style={{ height: 3, background: C.fplBlue }} />
      <div className="flex justify-around py-2 px-2" style={{ background: C.white }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          return (
            <button key={t.id} onClick={() => onNav?.(t.id)} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors" style={{ background: isActive ? `${C.fplBlue}12` : 'transparent' }}>
              <t.icon size={22} color={isActive ? C.fplBlue : C.textMuted} strokeWidth={isActive ? 2.2 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? C.fplBlue : C.textMuted }}>{t.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── SHARED ─── */
const Tap = ({ children, onClick, className = '', style = {} }) => (
  <button onClick={onClick} className={`active:scale-[.98] transition-all ${className}`} style={style}>{children}</button>
);
const FPLButton = ({ children, onClick, variant = 'filled', className = '' }) => {
  const s = variant === 'filled'
    ? { background: C.fplBlue, color: '#fff', border: `2px solid ${C.fplBlue}` }
    : { background: C.white, color: C.fplBlue, border: `2px solid ${C.fplBlue}` };
  return (
    <Tap onClick={onClick} className={`py-3.5 px-6 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center ${className}`} style={{ ...s, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {children}
    </Tap>
  );
};
const FPLCard = ({ children, className = '', borderLeft = false, style = {} }) => (
  <div className={`rounded-lg ${className}`} style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderLeft: borderLeft ? `4px solid ${C.fplBlue}` : undefined, ...style }}>
    {children}
  </div>
);
const Pill = ({ children, color = C.fplBlue }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full" style={{ fontSize: 10, fontWeight: 700, color, background: `${color}15`, letterSpacing: '0.04em' }}>{children}</span>
);
const Section = ({ title, children, action, onAction }) => (
  <div className="px-5 mb-6">
    <div className="flex items-center justify-between mb-3">
      <span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
      {action && <Tap onClick={onAction}><span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 600 }}>{action}</span></Tap>}
    </div>
    {children}
  </div>
);

/* ─── DATA ─── */
const ALERTS = [
  { id:1, p:'HIGH', title:'HVAC Running 134% Above Benchmark', sub:'847 hrs vs 632 avg · Palm Beach 3BR', sav:'$22–34/mo', color:C.red, detail:'Your system ran 847 hours this month vs. 632-hr average for similar FPL customers in Palm Beach County. This may indicate oversized equipment, duct leakage, or aging compressor.', actions:['Schedule a free FPL Home Energy Survey','Check air filter — dirty filters add 15% runtime','SEER 18 upgrade via FPL HVAC-on-Bill® from $42/mo'], program:{ name:'FPL HVAC-on-Bill®', desc:'$0 down · Added to your FPL bill · 0% APR', cta:'From $42/mo' }},
  { id:2, p:'URGENT', title:'Compressor Energy Spike Detected', sub:'62% increase vs 30-day baseline', sav:'Avoid $2K+', color:C.red, detail:'AMI data shows a sudden sustained increase in compressor cycling. This pattern often indicates refrigerant leak, failing capacitor, or compressor degradation.', actions:['Schedule HVAC inspection immediately','Check outdoor unit fan for obstructions','Review FPL SurgeShield® coverage'], program:{ name:'FPL SurgeShield®', desc:'Up to $5,000 warranty per appliance', cta:'$11.95/mo' }},
  { id:3, p:'MEDIUM', title:'Cooling an Empty Home', sub:'AC at 72°F since 8:15 AM · No occupancy', sav:'$10–25/mo', color:C.amber, detail:'Based on thermostat occupancy sensor, you appear to be away. Your AC has been cooling an empty home approximately 6 hours per day.', actions:['Raise setpoint to 78°F now','Enable Away Mode automation','Set up geofence auto-adjust'], program:{ name:'FPL On Call® Savings', desc:'Auto-adjust during FPL peak events', cta:'$5/mo credit' }},
  { id:4, p:'MEDIUM', title:'EV Charging During Peak Hours', sub:'Tesla charged 4:30–8:45 PM', sav:'$8–15/mo', color:C.amber, detail:'Your Tesla Model Y charged during FPL system peak hours. Shifting to 11 PM–6 AM reduces grid stress and prepares your account for future time-of-use options.', actions:['Accept optimized schedule: 11 PM – 6 AM','Set minimum charge 80% by 7 AM','Enable FPL EVolution® smart charging'], program:null },
  { id:5, p:'LOW', title:'Pool Pump Running at Peak', sub:'Ran 4–7 PM · Highest demand period', sav:'$12–18/mo', color:C.fplBlue, detail:'Your Pentair pool pump ran during FPL\'s highest demand window. Shifting to 8 AM–12 PM aligns with solar generation on the FPL grid.', actions:['Accept: 8 AM – 12 PM schedule','Enable HEMS auto-scheduling','Reduce runtime 8 → 6 hrs'], program:null },
  { id:6, p:'HIGH', title:'Projected Bill Up 24%', sub:'$187 est. vs $151 last January', sav:'Transparency', color:C.red, detail:'Contributing factors: 3.2°F colder average → +18% HVAC runtime. New EV added ~$22/mo. Water heater also trending up.', actions:['View device-level breakdown','Enroll in FPL Budget Billing®','Review personalized savings plan'], program:{ name:'FPL Budget Billing®', desc:'Predictable monthly payments', cta:'Free' }},
  { id:7, p:'LOW', title:'Phantom Load: 480W Overnight', sub:'Baseload 1–5 AM above 400W', sav:'$5–15/mo', color:C.fplBlue, detail:'Your home\'s always-on consumption costs ~$35/month. Common sources: cable boxes, gaming consoles, old garage fridge.', actions:['Review FPL Phantom Load Hunt Guide','Install smart power strip','Check garage refrigerator efficiency'], program:null },
  { id:8, p:'MEDIUM', title:'Water Heater 138% of Benchmark', sub:'92 kWh vs 67 kWh avg', sav:'$4–8/mo', color:C.amber, detail:'Your water heater consumed significantly more than the FPL benchmark. Possible: sediment buildup, thermostat above 120°F, or failing element.', actions:['Set thermostat to 120°F','Flush tank to remove sediment','Insulate exposed hot water pipes'], program:null },
];

const DEVICES = [
  { name:'Nest Thermostat', loc:'Living Room', val:'72°F', pct:23, kWh:127, saved:'$4.20', controlled:true },
  { name:'Tesla Model Y', loc:'Garage', val:'78%', pct:28, kWh:156, saved:'$8.40', controlled:true },
  { name:'Pentair Pool Pump', loc:'Pool', val:'Sched', pct:16, kWh:89, saved:'$2.10', controlled:false },
  { name:'Rheem Water Heater', loc:'Utility', val:'120°F', pct:12, kWh:67, saved:'$1.80', controlled:true },
];

/* ─── AMI CHART ─── */
const MeterReadChart = () => {
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
  const allDays = useMemo(() => [generateDay(1,1.8),generateDay(2,2.1),generateDay(3,1.6),generateDay(4,2.3),generateDay(5,1.9),generateDay(6,2.5),generateDay(7,2.2)], []);
  const reads = allDays[dayIdx];
  const maxVal = Math.max(...reads);
  const totalKwh = (reads.reduce((s, v) => s + v, 0) * 0.25).toFixed(1);
  const peakKw = maxVal.toFixed(2);
  const chartH = 120;
  return (
    <FPLCard className="p-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>AMI Meter Reads</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>15-Minute Interval · {days[dayIdx]}</div>
        </div>
        <div className="text-right">
          <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{totalKwh} <span style={{ fontSize: 11, fontWeight: 500, color: C.textMuted }}>kWh</span></div>
          <div style={{ fontSize: 10, color: C.textMuted }}>Peak: {peakKw} kW</div>
        </div>
      </div>
      <div className="flex items-center gap-1 mb-4 mt-3">
        {days.map((d, i) => (
          <button key={i} onClick={() => { setDayIdx(i); setHovered(null); }} className="flex-1 py-1.5 rounded text-center transition-colors" style={{ background: dayIdx === i ? C.fplBlue : 'transparent', color: dayIdx === i ? '#fff' : C.textMuted, fontSize: 9, fontWeight: 600 }}>
            {d.split(' ')[0]}
          </button>
        ))}
      </div>
      <div className="relative" style={{ height: chartH + 28 }}>
        <div className="absolute left-0 top-0 flex flex-col justify-between" style={{ height: chartH, width: 28 }}>
          {[maxVal, maxVal * 0.5, 0].map((v, i) => (<span key={i} style={{ fontSize: 9, color: C.textMuted, lineHeight: 1 }}>{v.toFixed(1)}</span>))}
        </div>
        <div className="absolute top-0 right-0" style={{ left: 32, height: chartH }}>
          {[0,0.25,0.5,0.75,1].map((p, i) => (<div key={i} className="absolute w-full" style={{ top: `${p*100}%`, borderTop: `1px ${i===4?'solid':'dashed'} ${C.divider}` }}/>))}
          <div className="absolute top-0" style={{ left: `${(52/96)*100}%`, width: `${(24/96)*100}%`, height: '100%', background: `${C.red}08`, borderRadius: 4 }}/>
          <div className="absolute" style={{ left: `${(52/96)*100}%`, top: -2, fontSize: 8, color: C.red, fontWeight: 700 }}>PEAK</div>
          <svg width="100%" height={chartH} preserveAspectRatio="none" viewBox={`0 0 ${reads.length} ${maxVal}`} onMouseLeave={() => setHovered(null)}>
            {reads.map((v, i) => {
              const isPeak = i >= 52 && i <= 76;
              const isHov = hovered === i;
              return (<rect key={i} x={i} y={maxVal - v} width={0.85} height={v} fill={isHov ? C.orange : isPeak ? C.red+'90' : C.fplBlue} opacity={isHov ? 1 : 0.75} rx={0.2} onMouseEnter={() => setHovered(i)} style={{ cursor: 'pointer', transition: 'fill 0.1s' }}/>);
            })}
          </svg>
        </div>
        <div className="absolute flex justify-between" style={{ left: 32, right: 0, top: chartH + 6 }}>
          {['12a','3a','6a','9a','12p','3p','6p','9p','12a'].map((t, i) => (<span key={i} style={{ fontSize: 8, color: C.textMuted, fontWeight: 500 }}>{t}</span>))}
        </div>
        {hovered !== null && (
          <div className="absolute pointer-events-none" style={{ left: Math.min(Math.max(32 + (hovered / 96) * 280, 60), 300), top: -8, transform: 'translateX(-50%)', background: C.textPrimary, color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, whiteSpace: 'nowrap', zIndex: 10 }}>
            {`${Math.floor(hovered/4)}:${String((hovered%4)*15).padStart(2,'0')} — ${reads[hovered].toFixed(2)} kW`}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: `1px solid ${C.divider}` }}>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: C.fplBlue }}/><span style={{ fontSize: 10, color: C.textMuted }}>Normal</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: C.red+'90' }}/><span style={{ fontSize: 10, color: C.textMuted }}>Peak (1–7 PM)</span></div>
      </div>
    </FPLCard>
  );
};

/* ─── PLATFORM LOGOS ─── */
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

/* ═══════ SCREENS ═══════ */

const Splash = ({ onNext }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8" style={{ background: C.white }}>
      <div className={`text-center transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="mb-6 flex justify-center"><FPLLogo size={56} /></div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: C.textPrimary, marginTop: 16 }}>Home Energy Manager</h1>
        <p className="mt-3" style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6 }}>Smart insights for every device.<br/>Powered by your FPL meter data.</p>
        <FPLButton onClick={onNext} className="mt-10 mx-auto">GET STARTED</FPLButton>
        <p className="mt-16" style={{ fontSize: 11, color: C.textMuted }}>A NextEra Energy® Company</p>
      </div>
    </div>
  );
};

const Connect = ({ onConnect, onSkip }) => (
  <div className="min-h-screen" style={{ background: C.bg }}>
    <FPLHeader />
    <div className="px-5 pt-6">
      <h1 style={{ fontSize: 24, fontWeight: 300, color: C.textPrimary }}>Connect Your Smart Home</h1>
      <p className="mt-3 mb-6" style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>FPL pairs your connected devices with your AMI meter data to deliver personalized energy insights and savings.</p>
      <FPLCard className="p-5 mb-6" borderLeft>
        {['See exactly where every kWh goes — device by device','Automated optimization working behind the scenes','Earn up to $60/yr in FPL On Call® demand response credits'].map((t, i) => (
          <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < 2 ? `1px solid ${C.divider}` : 'none' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: C.greenLight }}><Check size={14} color={C.green}/></div>
            <span style={{ fontSize: 14, color: C.textPrimary, lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </FPLCard>
      <FPLButton onClick={onConnect} className="w-full mb-3">CONNECT DEVICES</FPLButton>
      <FPLButton onClick={onSkip} variant="outline" className="w-full">SKIP FOR NOW</FPLButton>
    </div>
  </div>
);

const Platforms = ({ onNext, onBack }) => {
  const [sel, setSel] = useState([]);
  const ps = [{id:'google',n:'Google Home'},{id:'alexa',n:'Amazon Alexa'},{id:'apple',n:'Apple HomeKit'},{id:'smartthings',n:'SmartThings'},{id:'ecobee',n:'ecobee'},{id:'tesla',n:'Tesla'},{id:'nest',n:'Nest'},{id:'honeywell',n:'Honeywell'}];
  const tog = id => setSel(p => p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <FPLHeader />
      <div className="px-5 pt-6">
        <Tap onClick={onBack} className="flex items-center gap-1 mb-4"><ChevronLeft size={18} color={C.fplBlue}/><span style={{ fontSize: 13, color: C.fplBlue }}>Back</span></Tap>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: C.textPrimary }}>Select Your Platforms</h1>
        <p className="mt-2 mb-6" style={{ fontSize: 13, color: C.textMuted }}>Choose all that apply. You can add more anytime.</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {ps.map(p => {
            const a = sel.includes(p.id);
            return (<Tap key={p.id} onClick={() => tog(p.id)} className="p-4 rounded-lg text-left" style={{ background: C.white, border: `2px solid ${a?C.fplBlue:C.cardBorder}` }}>
              <div className="flex items-center justify-between mb-3"><PlatformLogo id={p.id} size={32}/>{a&&<div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: C.fplBlue }}><Check size={12} color="#fff"/></div>}</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{p.n}</span>
            </Tap>);
          })}
        </div>
        <FPLButton onClick={onNext} className="w-full">{sel.length?`CONTINUE · ${sel.length} SELECTED`:'CONTINUE WITH METER DATA'}</FPLButton>
      </div>
    </div>
  );
};

const DeviceSetup = ({ onNext }) => {
  const [ctrl, setCtrl] = useState({});
  const ds = [{id:1,name:'Nest Thermostat',loc:'Living Room',val:'72°F'},{id:2,name:'Tesla Model Y',loc:'Garage',val:'78%'},{id:3,name:'Pentair Pool Pump',loc:'Pool',val:'Running'},{id:4,name:'Rheem Water Heater',loc:'Utility',val:'120°F'}];
  const en = Object.values(ctrl).filter(Boolean).length;
  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      <FPLHeader />
      <div className="px-5 pt-6">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-lg" style={{ background: C.greenLight, border: `1px solid ${C.green}30` }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.green }}><Check size={16} color="#fff"/></div>
          <div><span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>Connected</span><span style={{ fontSize: 14, color: C.textSecondary }}> · 4 devices found</span></div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: C.textPrimary }}>Enable FPL Control</h1>
        <p className="mt-2 mb-6" style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>Allow FPL to optimize devices during peak events and earn FPL On Call® demand response credits.</p>
        <FPLCard className="mb-6">
          {ds.map((d, i) => (
            <div key={d.id} className="flex items-center justify-between px-4 py-4" style={{ borderBottom: i < ds.length - 1 ? `1px solid ${C.divider}` : 'none' }}>
              <div><div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{d.name}</div><div style={{ fontSize: 12, color: C.textMuted, marginTop: 1 }}>{d.loc} · {d.val}</div></div>
              <Tap onClick={() => setCtrl(p => ({...p,[d.id]:!p[d.id]}))} className="relative" style={{ width: 44, height: 26, borderRadius: 13, background: ctrl[d.id]?C.fplBlue:'#ddd', transition: 'background 0.2s' }}>
                <div className="absolute top-0.5 rounded-full bg-white transition-transform" style={{ width: 22, height: 22, left: 1, transform: ctrl[d.id]?'translateX(18px)':'translateX(0)', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
              </Tap>
            </div>
          ))}
        </FPLCard>
        {en > 0 && <FPLCard className="mb-6 p-4" borderLeft><span style={{ fontSize: 14, color: C.green, fontWeight: 700 }}>Est. FPL On Call® earnings: ${en * 15}/year</span></FPLCard>}
        <FPLButton onClick={onNext} className="w-full">START MONITORING</FPLButton>
      </div>
    </div>
  );
};

const AlertDetail = ({ alert: a, onBack }) => (
  <div className="min-h-screen" style={{ background: C.bg }}>
    <FPLHeader />
    <div className="px-5 pt-4 pb-24">
      <Tap onClick={onBack} className="flex items-center gap-1 mb-6"><ChevronLeft size={18} color={C.fplBlue}/><span style={{ fontSize: 13, color: C.fplBlue }}>Back</span></Tap>
      <Pill color={a.color}>{a.p}</Pill>
      <h1 className="mt-3" style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3 }}>{a.title}</h1>
      <p className="mt-3" style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>{a.detail}</p>
      {a.sav !== 'Transparency' && <FPLCard className="mt-5 p-4" borderLeft><div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Estimated Savings</div><div style={{ fontSize: 22, fontWeight: 700, color: C.green, marginTop: 4 }}>{a.sav}</div></FPLCard>}
      <div className="mt-8"><div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>FPL Recommendations</div>
        <FPLCard>{a.actions.map((act, i) => (<div key={i} className="flex items-start gap-3 px-4 py-3.5" style={{ borderBottom: i < a.actions.length - 1 ? `1px solid ${C.divider}` : 'none' }}><div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${C.fplBlue}15` }}><span style={{ fontSize: 11, fontWeight: 700, color: C.fplBlue }}>{i+1}</span></div><span style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.5 }}>{act}</span></div>))}</FPLCard>
      </div>
      {a.program && <div className="mt-6"><FPLCard className="p-5" borderLeft><div style={{ fontSize: 11, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>FPL Program</div><h3 className="mt-2" style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{a.program.name}</h3><p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>{a.program.desc}</p><FPLButton className="mt-4 w-full">ENROLL · {a.program.cta}</FPLButton></FPLCard></div>}
    </div>
    <BottomNav active="Home" />
  </div>
);

const Dashboard = ({ onAlert, onReport, onProfile }) => {
  const [loaded, setLoaded] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 50); }, []);
  const vis = showAll ? ALERTS : ALERTS.slice(0, 3);
  const pc = { HIGH:C.red, URGENT:C.red, MEDIUM:C.amber, LOW:C.fplBlue };
  return (
    <div className={`min-h-screen pb-24 transition-opacity duration-500 ${loaded?'opacity-100':'opacity-0'}`} style={{ background: C.bg }}>
      <FPLHeader />
      <div className="px-5 pt-4 pb-2"><h1 style={{ fontSize: 26, fontWeight: 300, color: C.textPrimary }}>Good Morning</h1></div>
      <div className="px-5 mb-4">
        <FPLCard borderLeft className="p-0">
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.divider}` }}>
            <div><div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>HEMS Status</div><div style={{ fontSize: 13, fontWeight: 600, color: C.green, marginTop: 2 }}>Active · 4 devices monitored</div></div>
            <span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 600 }}>View All</span>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-center flex-1"><div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>This Month</div><div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginTop: 4 }}>1,247<span style={{ fontSize: 12, fontWeight: 400, color: C.textMuted }}> kWh</span></div></div>
            <div style={{ width: 1, height: 36, background: C.divider }} />
            <div className="text-center flex-1"><div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>Est. Bill</div><div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, marginTop: 4 }}>$142.30</div></div>
            <div style={{ width: 1, height: 36, background: C.divider }} />
            <div className="text-center flex-1"><div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.03em', fontWeight: 600 }}>Savings</div><div style={{ fontSize: 22, fontWeight: 700, color: C.green, marginTop: 4 }}>$16.50</div></div>
          </div>
        </FPLCard>
      </div>
      <div className="px-5 mb-6">
        <FPLCard className="p-4 flex items-center gap-3" style={{ background: `${C.fplBlue}08`, borderColor: C.fplBlue }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.fplBlue }}><Zap size={18} color="#fff"/></div>
          <div className="flex-1"><div style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>FPL Peak Event Active</div><div style={{ fontSize: 12, color: C.textSecondary }}>Thermostat → 75°F · Earning $0.50</div></div>
          <FPLButton variant="outline" className="!py-2 !px-3 !text-xs">OVERRIDE</FPLButton>
        </FPLCard>
      </div>
      <Section title="Insights & Alerts" action={`${ALERTS.length} active`}>
        {vis.map(a => (<Tap key={a.id} onClick={() => onAlert(a)} className="w-full mb-2 text-left"><FPLCard className="p-4 flex items-start gap-3"><div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: pc[a.p] }}/><div className="flex-1 min-w-0"><div className="truncate" style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{a.title}</div><div className="truncate" style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{a.sub}</div></div><span style={{ fontSize: 12, color: C.green, fontWeight: 700, flexShrink: 0 }}>{a.sav}</span></FPLCard></Tap>))}
        {ALERTS.length > 3 && <Tap onClick={() => setShowAll(!showAll)} className="w-full mt-2 flex items-center justify-center gap-1 py-2"><span style={{ fontSize: 13, color: C.fplBlue, fontWeight: 600 }}>{showAll ? 'Show less' : `View all ${ALERTS.length} insights`}</span><ChevronDown size={14} color={C.fplBlue} style={{ transform: showAll?'rotate(180deg)':'none', transition: 'transform 0.2s' }}/></Tap>}
      </Section>
      <Section title="Connected Devices" action="+ Add">
        <FPLCard>{DEVICES.map((d, i) => (<Tap key={i} className="w-full flex items-center justify-between px-4 py-3.5 text-left" style={{ borderBottom: i < DEVICES.length-1?`1px solid ${C.divider}`:'none' }}><div className="flex items-center gap-3 flex-1 min-w-0"><div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.controlled?C.green:C.textMuted }}/><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="truncate" style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{d.name}</span><span style={{ fontSize: 12, color: C.textMuted }}>{d.val}</span></div><div className="flex items-center gap-3 mt-1"><span style={{ fontSize: 11, color: C.textMuted }}>{d.kWh} kWh · {d.pct}%</span><span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Saved {d.saved}</span></div></div></div><ChevronRight size={16} color={C.textMuted}/></Tap>))}</FPLCard>
      </Section>
      <Section title="FPL Programs">
        <div className="grid grid-cols-2 gap-3">
          {[{t:'Monthly Report',s:'January 2026',click:onReport},{t:'FPL SolarTogether®',s:'Community solar'},{t:'FPL SurgeShield®',s:'$11.95/mo'},{t:'FPL EVolution®',s:'Smart EV charging'}].map((p, i) => (<Tap key={i} onClick={p.click}><FPLCard className="p-4"><div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{p.t}</div><div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{p.s}</div></FPLCard></Tap>))}
        </div>
      </Section>
      <div className="px-5 mb-6 text-center"><span style={{ fontSize: 14, color: C.fplBlue, fontWeight: 600 }}>Sign up for FPL Budget Billing</span></div>
      <div className="px-5 mb-8"><FPLCard className="p-5"><div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>EV charger installation<br/>in progress</div><p className="mt-2" style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5 }}>Stay up-to-date on the FPL EVolution Home install progress with the tracker</p><span className="inline-block mt-3" style={{ fontSize: 13, color: C.fplBlue, fontWeight: 600 }}>View Tracker →</span></FPLCard></div>
      <div className="text-center pb-4"><div style={{ fontSize: 10, color: C.textMuted }}>Florida Power & Light Company · A NextEra Energy® Company</div></div>
      <BottomNav active="Home" onNav={t => { if (t==='Account') onProfile?.(); }} />
    </div>
  );
};

const Report = ({ onBack }) => {
  const bd = [{n:'Air Conditioning',pct:58,kWh:726,color:C.fplBlue},{n:'Electric Vehicle',pct:28,kWh:156,color:C.fplDark},{n:'Pool Pump',pct:16,kWh:89,color:C.orange},{n:'Water Heater',pct:12,kWh:67,color:C.green},{n:'Other (Lighting, Appliances)',pct:14,kWh:78,color:C.textMuted}];
  return (
    <div className="min-h-screen pb-24" style={{ background: C.bg }}>
      <FPLHeader />
      <div className="px-5 pt-4">
        <Tap onClick={onBack} className="flex items-center gap-1 mb-4"><ChevronLeft size={18} color={C.fplBlue}/><span style={{ fontSize: 13, color: C.fplBlue }}>Back to Dashboard</span></Tap>
        <h1 style={{ fontSize: 24, fontWeight: 300, color: C.textPrimary }}>Monthly Energy Report</h1>
        <p style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>January 2026 · Account #4821-7390</p>
      </div>
      <div className="px-5 mt-6 mb-6">
        <FPLCard className="p-5" borderLeft>
          <div className="flex items-center justify-between mb-3">
            <div><div style={{ fontSize: 11, color: C.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>Your HEMS Score</div><div className="flex items-baseline gap-2 mt-1"><span style={{ fontSize: 36, fontWeight: 700, color: C.textPrimary }}>78</span><span style={{ fontSize: 14, color: C.textMuted }}>/100</span></div></div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full" style={{ background: C.greenLight }}><span style={{ fontSize: 12, fontWeight: 700, color: C.green }}>↑ 4 pts</span></div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: C.divider }}><div className="h-full rounded-full" style={{ width: '78%', background: C.fplBlue, transition: 'width 1s ease' }}/></div>
          <p className="mt-2" style={{ fontSize: 12, color: C.textMuted }}>More efficient than 72% of similar FPL homes.</p>
        </FPLCard>
      </div>
      <div className="px-5 mb-6">
        <FPLCard>
          <div className="flex justify-between px-4 py-4">
            <div className="text-center flex-1"><div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>1,247</div><div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>kWh used</div></div>
            <div style={{ width: 1, background: C.divider, alignSelf: 'stretch' }}/>
            <div className="text-center flex-1"><div style={{ fontSize: 22, fontWeight: 700, color: C.green }}>-8%</div><div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>vs Dec</div></div>
            <div style={{ width: 1, background: C.divider, alignSelf: 'stretch' }}/>
            <div className="text-center flex-1"><div style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary }}>$142</div><div style={{ fontSize: 10, color: C.textMuted, marginTop: 2, textTransform: 'uppercase', fontWeight: 600 }}>Est. Bill</div></div>
          </div>
          <div className="px-4 py-3" style={{ borderTop: `1px solid ${C.divider}`, background: C.greenLight }}><span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>You used 12% less than similar homes</span></div>
        </FPLCard>
      </div>
      <Section title="Detailed AMI Meter Reads"><MeterReadChart /></Section>
      <Section title="Energy Breakdown by Device">
        <FPLCard className="p-4">{bd.map((d, i) => (<div key={i} className={i<bd.length-1?'mb-4':''}><div className="flex items-center justify-between mb-1.5"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ background: d.color }}/><span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{d.n}</span></div><span style={{ fontSize: 12, color: C.textSecondary }}>{d.kWh} kWh · {d.pct}%</span></div><div className="w-full h-2 rounded-full overflow-hidden" style={{ background: C.divider }}><div className="h-full rounded-full" style={{ width: `${(d.pct/60)*100}%`, background: d.color, transition: 'width 1s ease' }}/></div></div>))}</FPLCard>
      </Section>
      <Section title="What FPL HEMS Did For You">
        <FPLCard borderLeft>
          {[{l:'Thermostat optimizations',v:'14 adjustments'},{l:'FPL On Call® events',v:'3 participated'},{l:'EV charging shifted',v:'12 nights'},{l:'Pool pump rescheduled',v:'18 days'}].map((a, i) => (<div key={i} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i<3?`1px solid ${C.divider}`:'none' }}><span style={{ fontSize: 13, color: C.textSecondary }}>{a.l}</span><span style={{ fontSize: 13, fontWeight: 700, color: C.textPrimary }}>{a.v}</span></div>))}
          <div className="flex items-center justify-between px-4 py-4" style={{ background: C.greenLight }}><span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>Total Monthly Savings</span><span style={{ fontSize: 22, fontWeight: 700, color: C.green }}>$16.50</span></div>
        </FPLCard>
      </Section>
      <Section title="Personalized Recommendations">
        {[{t:'Upgrade to SEER 18',d:'Save est. $287/yr · FPL HVAC-on-Bill® from $42/mo',cta:'Learn More'},{t:'FPL SurgeShield®',d:'3 surge events near your area this month',cta:'$11.95/mo'},{t:'FPL SolarTogether®',d:'Community solar · Earn monthly bill credits',cta:'See Estimate'}].map((r, i) => (<Tap key={i} className="w-full mb-2 text-left"><FPLCard className="p-4 flex items-center justify-between"><div><div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{r.t}</div><div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{r.d}</div></div><span style={{ fontSize: 12, color: C.fplBlue, fontWeight: 700, flexShrink: 0, marginLeft: 12 }}>{r.cta} →</span></FPLCard></Tap>))}
      </Section>
      <div className="text-center pb-4"><div style={{ fontSize: 10, color: C.textMuted }}>Florida Power & Light Company · A NextEra Energy® Company</div><div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>Report generated Jan 28, 2026</div></div>
      <BottomNav active="Usage" />
    </div>
  );
};

const Profile = ({ onBack }) => (
  <div className="min-h-screen pb-24" style={{ background: C.bg }}>
    <FPLHeader />
    <div className="px-5 pt-4">
      <Tap onClick={onBack} className="flex items-center gap-1 mb-4"><ChevronLeft size={18} color={C.fplBlue}/><span style={{ fontSize: 13, color: C.fplBlue }}>Back</span></Tap>
      <h1 style={{ fontSize: 24, fontWeight: 300, color: C.textPrimary }}>Account</h1>
    </div>
    <Section title="FPL Account">
      <FPLCard>{[{l:'Account Number',v:'4821-7390-8812'},{l:'Service Address',v:'1247 Royal Palm Way, PBG'},{l:'Rate Schedule',v:'RS-1 Residential'},{l:'Billing Cycle',v:'28th of each month'}].map((r, i) => (<div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i<3?`1px solid ${C.divider}`:'none' }}><span style={{ fontSize: 13, color: C.textMuted }}>{r.l}</span><span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 500, textAlign: 'right', maxWidth: '55%' }}>{r.v}</span></div>))}</FPLCard>
    </Section>
    <Section title="Home Profile">
      <div className="grid grid-cols-2 gap-2.5">
        {[{l:'Type',v:'Single Family'},{l:'Size',v:'2,400 sq ft'},{l:'Beds / Bath',v:'3 / 2.5'},{l:'Year Built',v:'2016'},{l:'HVAC',v:'SEER 14'},{l:'Pool',v:'12,000 gal'},{l:'Solar',v:'None'},{l:'EV',v:'Tesla Model Y'}].map((f, i) => (<FPLCard key={i} className="py-3 px-4"><div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{f.l}</div><div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginTop: 3 }}>{f.v}</div></FPLCard>))}
      </div>
    </Section>
    <Section title="FPL Programs">
      <FPLCard>{[{n:'FPL On Call® Savings',s:'Enrolled',c:C.green},{n:'FPL Budget Billing®',s:'–',c:C.textMuted},{n:'FPL SurgeShield®',s:'–',c:C.textMuted},{n:'FPL SolarTogether®',s:'Eligible',c:C.amber}].map((p, i) => (<div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i<3?`1px solid ${C.divider}`:'none' }}><span style={{ fontSize: 13, color: C.textPrimary, fontWeight: 500 }}>{p.n}</span><Pill color={p.c}>{p.s}</Pill></div>))}</FPLCard>
    </Section>
    <Section title="Settings">
      <FPLCard>{['Notifications','Privacy & Data','Help & Support','Contact FPL'].map((t, i) => (<Tap key={i} className="w-full flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i<3?`1px solid ${C.divider}`:'none' }}><span style={{ fontSize: 13, color: C.textSecondary }}>{t}</span><ChevronRight size={16} color={C.textMuted}/></Tap>))}</FPLCard>
    </Section>
    <div className="text-center mt-4"><div style={{ fontSize: 10, color: C.textMuted }}>Florida Power & Light Company · A NextEra Energy® Company</div><div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>FPL Home Energy Manager · Beta v2.1.0</div></div>
    <BottomNav active="Account" />
  </div>
);

/* ═══════ APP ═══════ */
export default function App() {
  const [screen, setScreen] = useState('splash');
  const [alert, setAlert] = useState(null);
  const go = s => { setScreen(s); window.scrollTo?.(0, 0); };
  return (
    <div className="w-full max-w-md mx-auto min-h-screen relative overflow-x-hidden" style={{ background: C.bg, fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif" }}>
      {screen === 'splash' && <Splash onNext={() => go('connect')}/>}
      {screen === 'connect' && <Connect onConnect={() => go('platforms')} onSkip={() => go('dashboard')}/>}
      {screen === 'platforms' && <Platforms onNext={() => go('devices')} onBack={() => go('connect')}/>}
      {screen === 'devices' && <DeviceSetup onNext={() => go('dashboard')}/>}
      {screen === 'dashboard' && <Dashboard onAlert={a => { setAlert(a); go('alert'); }} onReport={() => go('report')} onProfile={() => go('profile')}/>}
      {screen === 'alert' && alert && <AlertDetail alert={alert} onBack={() => go('dashboard')}/>}
      {screen === 'report' && <Report onBack={() => go('dashboard')}/>}
      {screen === 'profile' && <Profile onBack={() => go('dashboard')}/>}
      <div className="fixed top-1.5 right-3 z-50 flex items-center gap-1.5 rounded-full px-2.5 py-2" style={{ background: 'rgba(0,155,222,0.08)', backdropFilter: 'blur(12px)' }}>
        {['splash','connect','platforms','devices','dashboard','report','profile'].map(s => (
          <Tap key={s} onClick={() => go(s)} className="rounded-full" style={{ width: screen===s?16:5, height: 5, background: screen===s?C.fplBlue:C.textMuted, borderRadius: 3, transition: 'all 0.3s' }} title={s}/>
        ))}
      </div>
    </div>
  );
}
