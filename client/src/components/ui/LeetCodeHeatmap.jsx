/**
 * LeetCodeHeatmap — pixel-perfect LeetCode-style contribution grid
 *
 * Props:
 *   submissionCalendar  — JSON string or object  { "epochSeconds": count, … }
 *   totalActiveDays     — number (optional, from API)
 *   loading             — boolean
 */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

// ── helpers ─────────────────────────────────────────────────────────────────

/** epoch seconds → 'YYYY-MM-DD' in local time */
const epochToDate = (epoch) => {
  const d = new Date(epoch * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** submission count → intensity level 0-4 */
const getLevel = (n) => {
  if (!n) return 0;
  if (n === 1) return 1;
  if (n <= 3) return 2;
  if (n <= 6) return 3;
  return 4;
};

// LeetCode green colour scale (dark-mode)
const LEVEL_STYLE = {
  0: { bg: '#161b22', border: '#21262d' },   // empty  — GitHub-style dark
  1: { bg: '#0e4429', border: '#196130' },   // light green
  2: { bg: '#196830', border: '#26a641' },   // mid green
  3: { bg: '#26a641', border: '#39d353' },   // bright green
  4: { bg: '#39d353', border: '#56e06b' },   // max green
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['', 'Mon', '', 'Wed', '', 'Fri', ''];  // only label odd rows

// ── build 53-week grid ──────────────────────────────────────────────────────
function buildGrid(map) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // go back 52 full weeks, then snap to Sunday
  const start = new Date(today);
  start.setDate(today.getDate() - 52 * 7);
  start.setDate(start.getDate() - start.getDay()); // snap to Sunday

  const weeks = [];
  const cur = new Date(start);

  while (cur <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (cur > today) {
        week.push(null);
      } else {
        const y = cur.getFullYear();
        const mo = String(cur.getMonth() + 1).padStart(2, '0');
        const da = String(cur.getDate()).padStart(2, '0');
        const key = `${y}-${mo}-${da}`;
        week.push({
          date: key,
          count: map[key] || 0,
          level: getLevel(map[key] || 0),
          month: cur.getMonth(),
          dom: cur.getDate(),
        });
      }
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// ── single cell ─────────────────────────────────────────────────────────────
function Cell({ cell, size }) {
  const [tip, setTip] = useState(false);
  if (!cell) return <div style={{ width: size, height: size }} />;

  const { bg, border } = LEVEL_STYLE[cell.level];

  return (
    <div
      style={{ width: size, height: size, position: 'relative' }}
      onMouseEnter={() => setTip(true)}
      onMouseLeave={() => setTip(false)}
    >
      <motion.div
        style={{
          width: '100%', height: '100%',
          borderRadius: 3,
          backgroundColor: bg,
          border: `1px solid ${border}`,
          cursor: 'pointer',
        }}
        whileHover={{ scale: 1.4, zIndex: 20 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      />

      {/* Tooltip */}
      {tip && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 8,
            zIndex: 50,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{
            background: 'rgba(13,17,23,0.97)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 12,
            color: '#e6edf3',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}>
            {cell.count > 0
              ? <><span style={{ color: '#39d353', fontWeight: 700 }}>{cell.count}</span>{' '}submission{cell.count !== 1 ? 's' : ''} · </>
              : 'No submissions · '
            }
            <span style={{ color: 'rgba(255,255,255,0.45)' }}>{cell.date}</span>
          </div>
          {/* caret */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid rgba(255,255,255,0.15)',
          }} />
        </div>
      )}
    </div>
  );
}

// ── main ────────────────────────────────────────────────────────────────────
export default function LeetCodeHeatmap({ submissionCalendar, totalActiveDays, loading }) {
  const CELL = 13;
  const GAP = 3;

  // parse submission calendar
  const map = useMemo(() => {
    if (!submissionCalendar) return {};
    try {
      const raw = typeof submissionCalendar === 'string'
        ? JSON.parse(submissionCalendar)
        : submissionCalendar;
      const out = {};
      Object.entries(raw).forEach(([k, v]) => {
        // key may be epoch-seconds string
        const key = String(k).length === 10 ? epochToDate(Number(k)) : k;
        out[key] = (out[key] || 0) + v;
      });
      return out;
    } catch { return {}; }
  }, [submissionCalendar]);

  const weeks = useMemo(() => buildGrid(map), [map]);

  // month labels — one per column where month changes
  const monthLabels = useMemo(() => {
    const out = [];
    let last = -1;
    weeks.forEach((week, wi) => {
      const first = week.find(Boolean);
      if (first && first.month !== last) {
        out.push({ wi, label: MONTHS[first.month] });
        last = first.month;
      }
    });
    return out;
  }, [weeks]);

  // streak (consecutive days up to today)
  const streak = useMemo(() => {
    let s = 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (s <= 365) {
      const y = d.getFullYear();
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${mo}-${da}`;
      if (!map[key]) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  }, [map]);

  const yearTotal = useMemo(() =>
    Object.values(map).reduce((a, b) => a + b, 0), [map]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-48 bg-white/10 rounded" />
        <div className="h-32 bg-white/5 rounded-xl" />
      </div>
    );
  }

  const colWidth = CELL + GAP;

  return (
    <div>
      {/* ── summary row ── */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-1.5">
          <span className="text-xl font-black text-white">
            {totalActiveDays ?? yearTotal}
          </span>
          <span className="text-white/40 text-sm">submissions in the last year</span>
        </div>

        {streak > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400">
            🔥 {streak}-day streak
          </span>
        )}

        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/20 text-green-400">
          ✅ {yearTotal} total submissions
        </span>
      </div>

      {/* ── scrollable grid ── */}
      <div className="overflow-x-auto select-none" style={{ paddingBottom: 4 }}>
        <div style={{ display: 'inline-block', minWidth: 'max-content' }}>

          {/* month labels row */}
          <div style={{ display: 'flex', paddingLeft: 28, marginBottom: 4 }}>
            {weeks.map((_, wi) => {
              const lbl = monthLabels.find(m => m.wi === wi);
              return (
                <div
                  key={wi}
                  style={{
                    width: colWidth,
                    flexShrink: 0,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.35)',
                    fontFamily: 'monospace',
                    overflow: 'visible',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {lbl ? lbl.label : ''}
                </div>
              );
            })}
          </div>

          {/* day-labels + grid */}
          <div style={{ display: 'flex' }}>
            {/* day-of-week column */}
            <div style={{ width: 26, marginRight: 2, flexShrink: 0 }}>
              {DAYS_SHORT.map((label, i) => (
                <div
                  key={i}
                  style={{
                    height: CELL,
                    marginBottom: GAP,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.28)',
                    lineHeight: `${CELL}px`,
                    textAlign: 'right',
                    paddingRight: 4,
                    fontFamily: 'monospace',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* week columns */}
            <div style={{ display: 'flex', gap: GAP }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                  {week.map((cell, di) => (
                    <Cell key={di} cell={cell} size={CELL} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── legend ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Less</span>
        {[0, 1, 2, 3, 4].map(l => (
          <div
            key={l}
            style={{
              width: 13, height: 13,
              borderRadius: 3,
              backgroundColor: LEVEL_STYLE[l].bg,
              border: `1px solid ${LEVEL_STYLE[l].border}`,
            }}
          />
        ))}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>More</span>
      </div>
    </div>
  );
}
