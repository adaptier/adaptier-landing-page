// HMI section — adaptier-hmi spotlight with hero AHU schematic + 4 thumbs

const { useState, useEffect, useRef } = React;

// ---------- Animated value hook ----------
function useTick(base, jitter, decimals = 1, intervalMs = 1400) {
  const [v, setV] = useState(base);
  useEffect(() => {
    const t = setInterval(() => {
      setV(base + (Math.random() - 0.5) * 2 * jitter);
    }, intervalMs);
    return () => clearInterval(t);
  }, [base, jitter, intervalMs]);
  return v.toFixed(decimals);
}

// ---------- Tag chip (e.g. AHU-01.SAT  21.4 °C) ----------
function Tag({ path, value, unit, type = 'real', size = 'sm' }) {
  const color = type === 'bool' ? (value ? '#4ec9b0' : '#e879a0') : '#4ec9b0';
  return (
    <div className={`hmi-tag ${size}`}>
      <span className="t-path">{path}</span>
      <span className="t-val" style={{ color }}>
        {value}{unit && <span className="t-unit"> {unit}</span>}
      </span>
    </div>
  );
}

// ---------- AHU SCHEMATIC ----------
function AHUSchematic() {
  const sat = useTick(21.4, 0.4);
  const rat = useTick(22.8, 0.3);
  const oat = useTick(8.6, 0.5);
  const supply = useTick(1450, 30, 0, 1700); // RPM
  const damperOA = useTick(42, 6, 0, 2000);

  return (
    <svg viewBox="0 0 900 360" className="ahu-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id="hmi-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="rgba(255,255,255,0.06)" />
        </pattern>
        <linearGradient id="duct" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3140" />
          <stop offset="100%" stopColor="#21262d" />
        </linearGradient>
      </defs>

      <rect width="900" height="360" fill="url(#hmi-grid)" />

      {/* Outdoor air → */}
      <text x="20" y="60" fill="#4a5568" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="0.14em">OUTDOOR AIR</text>
      <line x1="20" y1="100" x2="100" y2="100" stroke="#4a5568" strokeDasharray="3 3" />
      <polygon points="100,96 108,100 100,104" fill="#4a5568" />

      {/* Damper OA */}
      <g transform="translate(110,80)">
        <rect width="50" height="40" rx="2" fill="url(#duct)" stroke="rgba(255,255,255,0.12)" />
        <line x1="6" y1="6" x2="44" y2="34" stroke="#f5a623" strokeWidth="2" />
        <line x1="6" y1="20" x2="44" y2="20" stroke="rgba(245,166,35,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        <text x="25" y="58" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">OA-DMP</text>
        <text x="25" y="70" fill="#f5a623" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">{damperOA}%</text>
      </g>

      {/* Filter */}
      <g transform="translate(180,80)">
        <rect width="50" height="40" rx="2" fill="url(#duct)" stroke="rgba(255,255,255,0.12)" />
        {[8,16,24,32,40].map((x,i) => (
          <line key={i} x1={x} y1="6" x2={x} y2="34" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
        ))}
        <text x="25" y="58" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">FILTER</text>
        <text x="25" y="70" fill="#3fb950" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">OK</text>
      </g>

      {/* Heating coil */}
      <g transform="translate(250,80)">
        <rect width="60" height="40" rx="2" fill="rgba(232,121,160,0.08)" stroke="rgba(232,121,160,0.4)" />
        <path d="M 6 8 Q 12 4 18 8 T 30 8 T 42 8 T 54 8" stroke="#e879a0" strokeWidth="1.5" fill="none" />
        <path d="M 6 20 Q 12 16 18 20 T 30 20 T 42 20 T 54 20" stroke="#e879a0" strokeWidth="1.5" fill="none" />
        <path d="M 6 32 Q 12 28 18 32 T 30 32 T 42 32 T 54 32" stroke="#e879a0" strokeWidth="1.5" fill="none" />
        <text x="30" y="58" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">HEAT-COIL</text>
        <text x="30" y="70" fill="#e879a0" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">62°C</text>
      </g>

      {/* Cooling coil */}
      <g transform="translate(330,80)">
        <rect width="60" height="40" rx="2" fill="rgba(78,201,176,0.08)" stroke="rgba(78,201,176,0.4)" />
        <path d="M 6 8 Q 12 4 18 8 T 30 8 T 42 8 T 54 8" stroke="#4ec9b0" strokeWidth="1.5" fill="none" />
        <path d="M 6 20 Q 12 16 18 20 T 30 20 T 42 20 T 54 20" stroke="#4ec9b0" strokeWidth="1.5" fill="none" />
        <path d="M 6 32 Q 12 28 18 32 T 30 32 T 42 32 T 54 32" stroke="#4ec9b0" strokeWidth="1.5" fill="none" />
        <text x="30" y="58" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">COOL-COIL</text>
        <text x="30" y="70" fill="#4ec9b0" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">12°C</text>
      </g>

      {/* Supply Fan */}
      <g transform="translate(410,80)">
        <rect width="60" height="40" rx="2" fill="url(#duct)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="30" cy="20" r="13" stroke="rgba(245,166,35,0.5)" strokeWidth="1" fill="rgba(245,166,35,0.06)" />
        <g style={{ transformOrigin: '30px 20px', animation: 'fanSpin 1.8s linear infinite' }}>
          <line x1="30" y1="9" x2="30" y2="31" stroke="#f5a623" strokeWidth="1.5" />
          <line x1="19" y1="20" x2="41" y2="20" stroke="#f5a623" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="38" y2="28" stroke="#f5a623" strokeWidth="1.5" />
          <line x1="38" y1="12" x2="22" y2="28" stroke="#f5a623" strokeWidth="1.5" />
        </g>
        <text x="30" y="58" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">SUPPLY-FAN</text>
        <text x="30" y="70" fill="#f5a623" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">{supply} RPM</text>
      </g>

      {/* SAT sensor */}
      <g transform="translate(490,80)">
        <rect width="40" height="40" rx="2" fill="url(#duct)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="20" cy="20" r="6" fill="none" stroke="#4ec9b0" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="20" y2="26" stroke="#4ec9b0" strokeWidth="1.5" />
        <text x="20" y="58" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">SAT</text>
        <text x="20" y="70" fill="#4ec9b0" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">{sat}°C</text>
      </g>

      {/* Supply duct → zones */}
      <line x1="530" y1="100" x2="640" y2="100" stroke="#4a5568" strokeDasharray="3 3" />
      <polygon points="640,96 648,100 640,104" fill="#4a5568" />
      <text x="660" y="104" fill="#cdd6e0" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.06em">→ ZONES (8)</text>

      {/* Return air ← */}
      <text x="20" y="225" fill="#4a5568" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="0.14em">RETURN AIR</text>
      <line x1="640" y1="260" x2="530" y2="260" stroke="#4a5568" strokeDasharray="3 3" />
      <polygon points="530,256 522,260 530,264" fill="#4a5568" />
      <text x="660" y="264" fill="#cdd6e0" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="0.06em">← FROM ZONES</text>

      {/* RAT sensor */}
      <g transform="translate(490,240)">
        <rect width="40" height="40" rx="2" fill="url(#duct)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="20" cy="20" r="6" fill="none" stroke="#4ec9b0" strokeWidth="1.5" />
        <line x1="20" y1="14" x2="20" y2="26" stroke="#4ec9b0" strokeWidth="1.5" />
        <text x="20" y="22" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle"></text>
        <text x="-30" y="20" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">RAT</text>
        <text x="-30" y="32" fill="#4ec9b0" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end" fontWeight="600">{rat}°C</text>
      </g>

      {/* Return Fan */}
      <g transform="translate(410,240)">
        <rect width="60" height="40" rx="2" fill="url(#duct)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="30" cy="20" r="13" stroke="rgba(245,166,35,0.5)" strokeWidth="1" fill="rgba(245,166,35,0.06)" />
        <g style={{ transformOrigin: '30px 20px', animation: 'fanSpin 2.2s linear infinite reverse' }}>
          <line x1="30" y1="9" x2="30" y2="31" stroke="#f5a623" strokeWidth="1.5" />
          <line x1="19" y1="20" x2="41" y2="20" stroke="#f5a623" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="38" y2="28" stroke="#f5a623" strokeWidth="1.5" />
          <line x1="38" y1="12" x2="22" y2="28" stroke="#f5a623" strokeWidth="1.5" />
        </g>
        <text x="30" y="22" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle"></text>
        <text x="76" y="20" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono">RET-FAN</text>
        <text x="76" y="32" fill="#f5a623" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">1280</text>
      </g>

      {/* Damper RA + EA exhaust split */}
      <g transform="translate(330,240)">
        <rect width="60" height="40" rx="2" fill="url(#duct)" stroke="rgba(255,255,255,0.12)" />
        <line x1="8" y1="32" x2="52" y2="8" stroke="#f5a623" strokeWidth="2" />
        <line x1="80" y1="20" x2="120" y2="20" stroke="#4a5568" strokeDasharray="3 3" />
        <polygon points="120,16 128,20 120,24" fill="#4a5568" />
        <text x="138" y="24" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono">EXHAUST</text>
        <text x="30" y="22" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle"></text>
        <text x="-30" y="20" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">RA-DMP</text>
        <text x="-30" y="32" fill="#f5a623" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end" fontWeight="600">58%</text>
      </g>

      {/* OAT label */}
      <text x="20" y="80" fill="#8892a4" fontSize="9" fontFamily="JetBrains Mono">OAT</text>
      <text x="20" y="92" fill="#4ec9b0" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">{oat}°C</text>

      {/* Bottom KPI strip */}
      <g transform="translate(0, 320)">
        <line x1="0" y1="0" x2="900" y2="0" stroke="rgba(255,255,255,0.08)" />
        <text x="20" y="22" fontFamily="JetBrains Mono" fontSize="10" fill="#4a5568" letterSpacing="0.14em">SETPOINT</text>
        <text x="120" y="22" fontFamily="JetBrains Mono" fontSize="11" fill="#cdd6e0" fontWeight="600">21.5°C</text>
        <text x="200" y="22" fontFamily="JetBrains Mono" fontSize="10" fill="#4a5568" letterSpacing="0.14em">MODE</text>
        <text x="270" y="22" fontFamily="JetBrains Mono" fontSize="11" fill="#f5a623" fontWeight="600">OCCUPIED · ECO</text>
        <text x="450" y="22" fontFamily="JetBrains Mono" fontSize="10" fill="#4a5568" letterSpacing="0.14em">ALARMS</text>
        <text x="540" y="22" fontFamily="JetBrains Mono" fontSize="11" fill="#3fb950" fontWeight="600">● 0 ACTIVE</text>
        <text x="660" y="22" fontFamily="JetBrains Mono" fontSize="10" fill="#4a5568" letterSpacing="0.14em">CYCLE</text>
        <text x="730" y="22" fontFamily="JetBrains Mono" fontSize="11" fill="#cdd6e0" fontWeight="600">12ms · 100Hz</text>
      </g>

      <style>{`
        @keyframes fanSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}

// ---------- BUILDING OVERVIEW THUMB ----------
function BuildingThumb() {
  const zones = [
    { name: 'Z1', t: 21.4, sp: 21.5, ok: true },
    { name: 'Z2', t: 22.1, sp: 21.5, ok: true },
    { name: 'Z3', t: 23.6, sp: 21.5, ok: false },
    { name: 'Z4', t: 21.0, sp: 21.5, ok: true },
    { name: 'Z5', t: 20.8, sp: 21.5, ok: true },
    { name: 'Z6', t: 22.4, sp: 21.5, ok: true },
  ];
  return (
    <div className="thumb-body" style={{ padding: 14 }}>
      <div className="thumb-grid-3">
        {zones.map(z => (
          <div key={z.name} className="zone-cell" style={{
            borderColor: z.ok ? 'rgba(78,201,176,0.25)' : 'rgba(245,166,35,0.4)',
            background: z.ok ? 'rgba(78,201,176,0.05)' : 'rgba(245,166,35,0.06)',
          }}>
            <div className="zc-name">{z.name}</div>
            <div className="zc-t" style={{ color: z.ok ? '#4ec9b0' : '#f5a623' }}>{z.t.toFixed(1)}°</div>
            <div className="zc-sp">sp {z.sp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- ENERGY KPI THUMB ----------
function EnergyThumb() {
  const bars = [42, 58, 71, 65, 80, 92, 78, 64, 55, 70, 88, 95, 82, 70];
  const max = Math.max(...bars);
  return (
    <div className="thumb-body" style={{ padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5568', letterSpacing: '0.14em', textTransform: 'uppercase' }}>kWh · Today</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, color: '#cdd6e0', fontWeight: 600 }}>1,284<span style={{ color: '#4a5568', fontSize: 11, marginLeft: 4 }}>kWh</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#3fb950', fontWeight: 600 }}>↓ 8.4%</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5568' }}>vs avg</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
        {bars.map((v, i) => (
          <div key={i} style={{
            flex: 1,
            height: `${(v/max)*100}%`,
            background: i === bars.length - 2 ? '#f5a623' : 'rgba(78,201,176,0.5)',
            borderRadius: '1px 1px 0 0',
          }}/>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5568' }}>
        <span>00:00</span><span>12:00</span><span>now</span>
      </div>
    </div>
  );
}

// ---------- SCHEDULES THUMB ----------
function SchedulesThumb() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  // 24 hour blocks per day; 1 = occupied, 0 = unoccupied, 2 = setback
  const grid = [
    [0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0],
    [0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0],
    [0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0],
    [0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0],
    [0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];
  const colors = ['#1d2127', '#4ec9b0', '#f5a623'];
  return (
    <div className="thumb-body" style={{ padding: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr', rowGap: 4, columnGap: 6 }}>
        {days.map((d, i) => (
          <React.Fragment key={d}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8892a4', alignSelf: 'center' }}>{d}</div>
            <div style={{ display: 'flex', gap: 1 }}>
              {grid[i].map((v, j) => (
                <div key={j} style={{ flex: 1, height: 10, background: colors[v], borderRadius: 1, opacity: v === 0 ? 0.5 : 1 }}/>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12, fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8892a4' }}>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, background: '#4ec9b0', marginRight: 4, borderRadius: 1 }}/>Occupied</span>
        <span><span style={{ display: 'inline-block', width: 8, height: 8, background: '#f5a623', marginRight: 4, borderRadius: 1 }}/>Setback</span>
      </div>
    </div>
  );
}

// ---------- ALARMS THUMB ----------
function AlarmsThumb() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => p + 1), 1200);
    return () => clearInterval(t);
  }, []);
  const alarms = [
    { sev: 'high', code: 'AHU-03 / FILTER_DP', t: '21:34:08', ack: false },
    { sev: 'med', code: 'Z3 / TEMP_HIGH', t: '21:30:12', ack: false },
    { sev: 'low', code: 'CHL-1 / RUN_HOURS', t: '20:55:41', ack: true },
    { sev: 'low', code: 'BMS / NTP_DRIFT', t: '20:12:03', ack: true },
  ];
  const sevColor = { high: '#f85149', med: '#f5a623', low: '#8892a4' };
  return (
    <div className="thumb-body" style={{ padding: 0 }}>
      {alarms.map((a, i) => (
        <div key={i} style={{
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'JetBrains Mono',
          fontSize: 11,
          opacity: a.ack ? 0.55 : 1,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: sevColor[a.sev],
            boxShadow: !a.ack && a.sev === 'high' ? `0 0 ${6 + (pulse % 2) * 8}px ${sevColor[a.sev]}` : `0 0 6px ${sevColor[a.sev]}`,
            transition: 'box-shadow 600ms ease',
            flexShrink: 0,
          }}/>
          <span style={{ color: '#4a5568', fontSize: 10 }}>{a.t}</span>
          <span style={{ color: a.ack ? '#8892a4' : '#cdd6e0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.code}</span>
          {a.ack
            ? <span style={{ color: '#4a5568', fontSize: 9, letterSpacing: '0.1em' }}>ACK</span>
            : <span style={{ color: '#f5a623', fontSize: 9, letterSpacing: '0.1em' }}>NEW</span>}
        </div>
      ))}
    </div>
  );
}

// ---------- HMI SECTION ----------
function HMISection() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'AHU-01 · Overview' },
    { id: 'heating', label: 'Heating Loop' },
    { id: 'cooling', label: 'Cooling Loop' },
    { id: 'trends', label: 'Trends' },
  ];

  return (
    <section className="hmi" data-screen-label="HMI">
      <div className="container">
        <div className="hmi-head">
          <span className="label">
            <span className="dot"></span>
            adaptier-hmi · operator console
          </span>
          <h2>The control room, <span className="teal">in the browser.</span></h2>
          <p>
            Process schematics, dashboards, schedules, alarms, and historian — all driven by the same NATS streams the PLC publishes to. Operators see live values; engineers tweak setpoints; supervisors get alerts. One UI, one source of truth.
          </p>
        </div>

        {/* Hero dashboard */}
        <div className="hmi-hero panel-card">
          <div className="panel-chrome">
            <span className="dots"><i></i><i></i><i></i></span>
            <span className="title">adaptier-hmi · plant.ahu-01 · live</span>
            <span className="right">
              <span className="pill"><span className="status-dot"></span> 247 tags</span>
              <span className="pill amber">● OCCUPIED</span>
            </span>
          </div>
          <div className="hmi-tabs">
            {tabs.map(t => (
              <div
                key={t.id}
                className={`hmi-tab ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </div>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a5568' }}>
              <span>21:34:12</span>
              <span style={{ color: '#3fb950' }}>● LIVE</span>
            </div>
          </div>
          <div className="hmi-canvas">
            <AHUSchematic />
          </div>
        </div>

        {/* Thumbnail row */}
        <div className="hmi-thumbs">
          <div className="hmi-thumb panel-card">
            <div className="panel-chrome thumb-chrome">
              <span className="title">building · zones</span>
              <span className="right"><span className="pill muted">6/8</span></span>
            </div>
            <BuildingThumb />
          </div>
          <div className="hmi-thumb panel-card">
            <div className="panel-chrome thumb-chrome">
              <span className="title">energy · KPI</span>
              <span className="right"><span className="pill muted">24h</span></span>
            </div>
            <EnergyThumb />
          </div>
          <div className="hmi-thumb panel-card">
            <div className="panel-chrome thumb-chrome">
              <span className="title">schedules · plant</span>
              <span className="right"><span className="pill muted">7d</span></span>
            </div>
            <SchedulesThumb />
          </div>
          <div className="hmi-thumb panel-card">
            <div className="panel-chrome thumb-chrome">
              <span className="title">alarms · live</span>
              <span className="right"><span className="pill" style={{ color: '#f85149', borderColor: 'rgba(248,81,73,0.3)', background: 'rgba(248,81,73,0.08)' }}>● 2 NEW</span></span>
            </div>
            <AlarmsThumb />
          </div>
        </div>
      </div>
    </section>
  );
}

window.HMISection = HMISection;
