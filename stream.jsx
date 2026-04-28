// Live debug stream — generates animated rows that scroll up and fade.
// Used in the hero overlay and the showcase panel.

const STREAM_PATHS = [
  { path: 'elm-1.V_L1', unit: 'V', base: 229.3, jitter: 1.4, type: 'REAL' },
  { path: 'elm-1.V_L2', unit: 'V', base: 229.6, jitter: 1.2, type: 'REAL' },
  { path: 'elm-1.V_L3', unit: 'V', base: 229.8, jitter: 1.5, type: 'REAL' },
  { path: 'elm-1.I_L1', unit: 'A', base: 12.4, jitter: 0.8, type: 'REAL' },
  { path: 'elm-1.I_L2', unit: 'A', base: 11.9, jitter: 0.7, type: 'REAL' },
  { path: 'elm-1.P_total', unit: 'kW', base: 8.21, jitter: 0.4, type: 'REAL' },
  { path: 'elm-1.f', unit: 'Hz', base: 50.02, jitter: 0.04, type: 'REAL' },
  { path: 'mb-2.flow', unit: 'm³/h', base: 4.12, jitter: 0.3, type: 'REAL' },
  { path: 'mb-2.temp_in', unit: '°C', base: 71.4, jitter: 0.6, type: 'REAL' },
  { path: 'mb-2.temp_out', unit: '°C', base: 42.8, jitter: 0.5, type: 'REAL' },
  { path: 'bms.zone3.setpoint', unit: '°C', base: 21.5, jitter: 0.05, type: 'REAL' },
  { path: 'bms.zone3.occupied', unit: '', base: 1, jitter: 0, type: 'BOOL' },
  { path: 'pump-7.running', unit: '', base: 1, jitter: 0, type: 'BOOL' },
  { path: 'pump-7.fault', unit: '', base: 0, jitter: 0, type: 'BOOL' },
];

function fmtTime(d) {
  const pad = (n, w = 2) => String(n).padStart(w, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())},${pad(d.getMilliseconds(), 3)}`;
}

function genRow(seed) {
  const spec = STREAM_PATHS[Math.floor(Math.random() * STREAM_PATHS.length)];
  let v;
  if (spec.type === 'BOOL') {
    v = spec.base ? 'TRUE' : 'FALSE';
  } else {
    const noise = (Math.random() - 0.5) * 2 * spec.jitter;
    v = (spec.base + noise).toFixed(spec.unit === 'Hz' ? 3 : 2);
  }
  return {
    id: seed,
    time: fmtTime(new Date()),
    path: spec.path,
    value: v,
    unit: spec.unit,
    type: spec.type,
  };
}

function LiveStream({ rowCount = 8, intervalMs = 350, dense = false }) {
  const [rows, setRows] = React.useState(() => {
    const init = [];
    for (let i = 0; i < rowCount; i++) init.push(genRow(`init-${i}`));
    return init;
  });
  const seedRef = React.useRef(0);

  React.useEffect(() => {
    const t = setInterval(() => {
      seedRef.current += 1;
      setRows(prev => {
        const next = [genRow(`r-${seedRef.current}`), ...prev];
        return next.slice(0, rowCount);
      });
    }, intervalMs);
    return () => clearInterval(t);
  }, [rowCount, intervalMs]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      padding: dense ? '6px 10px' : '10px 14px',
      gap: 0,
    }}>
      {rows.map((r, i) => {
        const opacity = Math.max(0.15, 1 - (i / rowCount) * 0.85);
        return (
          <div key={r.id} style={{
            display: 'grid',
            gridTemplateColumns: dense ? '88px 1fr auto' : '120px 1fr auto',
            gap: dense ? 8 : 14,
            alignItems: 'baseline',
            padding: dense ? '2px 0' : '3px 0',
            opacity,
            transition: 'opacity 200ms ease',
            animation: i === 0 ? 'streamIn 220ms ease' : 'none',
            fontSize: dense ? 10.5 : 12.5,
            fontFamily: "'JetBrains Mono', monospace",
            borderBottom: dense ? 'none' : '1px solid rgba(255,255,255,0.03)',
          }}>
            <span style={{ color: '#4a5568' }}>{r.time}</span>
            <span style={{ color: '#8892a4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.path}
            </span>
            <span style={{
              color: r.type === 'BOOL' ? (r.value === 'TRUE' ? '#4ec9b0' : '#e879a0') : '#4ec9b0',
              fontWeight: 500,
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}>
              {r.value}{r.unit && <span style={{ color: '#4a5568', marginLeft: 4 }}>{r.unit}</span>}
            </span>
          </div>
        );
      })}
      <style>{`
        @keyframes streamIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

window.LiveStream = LiveStream;
