import { useState, useCallback } from "react";

// ─── Single accent: Deep Green ──────────────────────────────────────────────
const ACCENT = {
  primary: "#4a8d5f",
  primaryHover: "#55a06c",
  onPrimary: "#ffffff",
  primaryFaint: "rgba(74,141,95,0.10)",
  primaryMuted: "rgba(74,141,95,0.22)",
  primaryGlass: "rgba(74,141,95,0.12)",
};

// ─── Themes — lighter dark mode, frosted glass tokens ───────────────────────
// 60% dominant bg | 30% secondary/text | 10% accent
const THEMES = {
  dark: {
    // 60% — lifted from pure black to a softer charcoal
    bg: "#212121",
    // 30% — cards, elevated surfaces, text
    bgSecondary: "#282828",
    bgTertiary: "#303030",
    bgElevated: "#353535",
    // Glass surfaces
    glassBg: "rgba(50,50,50,0.55)",
    glassBorder: "rgba(255,255,255,0.08)",
    glassHighlight: "rgba(255,255,255,0.04)",
    // Text — all pass WCAG AA on #212125
    text: "#eeeeee", // 13.8:1
    textSecondary: "#c4c4c4", // 9.5:1
    textTertiary: "#8e8e8e", // 5.2:1
    // Borders & UI
    border: "#3c3c3c",
    borderSubtle: "#303030",
    pillBg: "rgba(255,255,255,0.06)",
    pillText: "#b0b0b0",
    // Semantic
    success: "#4a8d5f",
    danger: "#e05555",
  },
  light: {
    bg: "#f5f5f5",
    bgSecondary: "#ffffff",
    bgTertiary: "#ededed",
    bgElevated: "#ffffff",
    glassBg: "rgba(255,255,255,0.60)",
    glassBorder: "rgba(0,0,0,0.06)",
    glassHighlight: "rgba(255,255,255,0.80)",
    text: "#1a1a1a",
    textSecondary: "#4a4a4a",
    textTertiary: "#7a7a7a",
    border: "#dcdcdc",
    borderSubtle: "#e8e8e8",
    pillBg: "rgba(0,0,0,0.04)",
    pillText: "#5a5a5a",
    success: "#4a8d5f",
    danger: "#d44",
  },
};

// ─── Shared Styles ──────────────────────────────────────────────────────────
const glassCard = (theme) => ({
  background: theme.glassBg,
  backdropFilter: "blur(20px) saturate(1.4)",
  WebkitBackdropFilter: "blur(20px) saturate(1.4)",
  border: `1px solid ${theme.glassBorder}`,
  borderRadius: 20,
});

const glassCardSubtle = (theme) => ({
  background: theme.glassBg,
  backdropFilter: "blur(12px) saturate(1.2)",
  WebkitBackdropFilter: "blur(12px) saturate(1.2)",
  border: `1px solid ${theme.glassBorder}`,
  borderRadius: 16,
});

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const I = ({ children, size = 20, label }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    role={label ? "img" : "presentation"}
    aria-label={label}
    aria-hidden={!label}
    style={{ flexShrink: 0 }}
  >
    {children}
  </svg>
);
const s = (color, w = "2") => ({
  stroke: color,
  strokeWidth: w,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

const Icons = {
  Plus: ({ size = 20, color = "currentColor" }) => (
    <I size={size}>
      <line x1="12" y1="5" x2="12" y2="19" {...s(color, "2.5")} />
      <line x1="5" y1="12" x2="19" y2="12" {...s(color, "2.5")} />
    </I>
  ),
  Check: ({ size = 16, color = "currentColor" }) => (
    <I size={size}>
      <polyline points="20 6 9 17 4 12" {...s(color, "3")} />
    </I>
  ),
  Sun: ({ size = 18, color = "currentColor" }) => (
    <I size={size} label="Light mode">
      <circle cx="12" cy="12" r="5" {...s(color)} />
      <g {...s(color)}>
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </I>
  ),
  Moon: ({ size = 18, color = "currentColor" }) => (
    <I size={size} label="Dark mode">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...s(color)} />
    </I>
  ),
  ChevRight: ({ size = 16, color = "currentColor" }) => (
    <I size={size}>
      <polyline points="9 18 15 12 9 6" {...s(color)} />
    </I>
  ),
  Target: ({ size = 20, color = "currentColor" }) => (
    <I size={size}>
      <circle cx="12" cy="12" r="10" {...s(color)} />
      <circle cx="12" cy="12" r="6" {...s(color)} />
      <circle cx="12" cy="12" r="2" {...s(color)} />
    </I>
  ),
  Calendar: ({ size = 22, color = "currentColor" }) => (
    <I size={size}>
      <rect x="3" y="4" width="18" height="18" rx="2" {...s(color)} />
      <line x1="16" y1="2" x2="16" y2="6" {...s(color)} />
      <line x1="8" y1="2" x2="8" y2="6" {...s(color)} />
      <line x1="3" y1="10" x2="21" y2="10" {...s(color)} />
    </I>
  ),
  Inbox: ({ size = 22, color = "currentColor" }) => (
    <I size={size}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" {...s(color)} />
      <path
        d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"
        {...s(color)}
      />
    </I>
  ),
  Hash: ({ size = 22, color = "currentColor" }) => (
    <I size={size}>
      <line x1="4" y1="9" x2="20" y2="9" {...s(color)} />
      <line x1="4" y1="15" x2="20" y2="15" {...s(color)} />
      <line x1="10" y1="3" x2="8" y2="21" {...s(color)} />
      <line x1="16" y1="3" x2="14" y2="21" {...s(color)} />
    </I>
  ),
  Fire: ({ size = 14, color = "currentColor" }) => (
    <I size={size}>
      <path
        d="M12 23c-4.97 0-8-3.58-8-7.5 0-3.07 2.17-5.66 3.5-7.13.37-.4 1.02-.12 1 .42-.07 1.53.36 3.1 1.25 4.36.12.17.37.13.42-.07.35-1.4 1.32-3.55 3.33-5.58.28-.28.75-.12.8.28.18 1.45.76 3.2 2.2 4.48.2.18.5.05.52-.2.1-1.2-.08-2.75-.75-4.31-.15-.36.2-.72.57-.55C19.6 9.2 22 12.36 22 15.5c0 3.92-3.03 7.5-8 7.5h-2z"
        fill={color}
      />
    </I>
  ),
  Repeat: ({ size = 14, color = "currentColor" }) => (
    <I size={size}>
      <polyline points="17 1 21 5 17 9" {...s(color)} />
      <path d="M3 11V9a4 4 0 014-4h14" {...s(color)} />
      <polyline points="7 23 3 19 7 15" {...s(color)} />
      <path d="M21 13v2a4 4 0 01-4 4H3" {...s(color)} />
    </I>
  ),
  Clock: ({ size = 14, color = "currentColor" }) => (
    <I size={size}>
      <circle cx="12" cy="12" r="10" {...s(color)} />
      <polyline points="12 6 12 12 16 14" {...s(color)} />
    </I>
  ),
};

// ─── Data ───────────────────────────────────────────────────────────────────
const GOALS_INIT = [
  {
    id: 1,
    title: "Read 20 pages",
    cat: "Learning",
    done: true,
    streak: 12,
    today: true,
  },
  {
    id: 2,
    title: "Morning meditation -- 10 min",
    cat: "Wellness",
    done: true,
    streak: 5,
    today: true,
  },
  {
    id: 3,
    title: "Write 500 words",
    cat: "Creative",
    done: false,
    streak: 8,
    today: true,
  },
  {
    id: 4,
    title: "30 min walk outside",
    cat: "Fitness",
    done: false,
    streak: 3,
    today: true,
  },
  {
    id: 5,
    title: "Review budget spreadsheet",
    cat: "Finance",
    done: false,
    streak: 0,
    today: true,
  },
  {
    id: 6,
    title: "Practice guitar scales",
    cat: "Creative",
    done: false,
    streak: 15,
    today: false,
  },
  {
    id: 7,
    title: "Drink 8 glasses of water",
    cat: "Wellness",
    done: false,
    streak: 22,
    today: true,
  },
];
const HABITS_INIT = [
  {
    id: 1,
    title: "Meditate",
    freq: "Daily",
    streak: 5,
    week: [1, 1, 1, 1, 1, 0, 0],
  },
  {
    id: 2,
    title: "Read",
    freq: "Daily",
    streak: 12,
    week: [1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 3,
    title: "Exercise",
    freq: "3x/week",
    streak: 3,
    week: [1, 0, 1, 0, 1, 0, 0],
  },
  {
    id: 4,
    title: "Journal",
    freq: "Daily",
    streak: 0,
    week: [1, 1, 0, 1, 0, 0, 0],
  },
  {
    id: 5,
    title: "No sugar",
    freq: "Daily",
    streak: 8,
    week: [1, 1, 1, 1, 1, 1, 1],
  },
];
const LONG_GOALS = [
  {
    id: 1,
    title: "Run a half marathon",
    pct: 65,
    target: "13.1 mi",
    current: "8.5 mi",
    deadline: "Mar 15",
  },
  {
    id: 2,
    title: "Read 24 books this year",
    pct: 25,
    target: "24 books",
    current: "6 books",
    deadline: "Dec 31",
  },
  {
    id: 3,
    title: "Save $5,000",
    pct: 42,
    target: "$5,000",
    current: "$2,100",
    deadline: "Jun 30",
  },
  {
    id: 4,
    title: "Learn conversational Spanish",
    pct: 18,
    target: "B1 level",
    current: "A2 level",
    deadline: "Sep 1",
  },
];
const CATS = ["All", "Wellness", "Learning", "Creative", "Fitness", "Finance"];
const WKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const PLAN = [
  { day: "Today", date: "Feb 7", tasks: 6, done: 2 },
  { day: "Tomorrow", date: "Feb 8", tasks: 4, done: 0 },
  { day: "Sunday", date: "Feb 9", tasks: 3, done: 0 },
  { day: "Monday", date: "Feb 10", tasks: 5, done: 0 },
  { day: "Tuesday", date: "Feb 11", tasks: 2, done: 0 },
];

// ─── Components ─────────────────────────────────────────────────────────────

function StatusBar({ t }) {
  return (
    <div
      aria-hidden="true"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 28px 0",
        fontSize: 14,
        fontWeight: 600,
        color: t.text,
        flexShrink: 0,
      }}
    >
      <span>9:41</span>
      <div
        style={{
          width: 17,
          height: 11,
          border: `1.5px solid ${t.textSecondary}`,
          borderRadius: 2.5,
          display: "flex",
          alignItems: "center",
          padding: "0 1.5px",
        }}
      >
        <div
          style={{
            width: "65%",
            height: 7,
            background: t.textSecondary,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}

function BottomNav({ t, tab, setTab }) {
  const tabs = [
    { key: "today", Ic: Icons.Inbox, label: "Today" },
    { key: "plan", Ic: Icons.Calendar, label: "Plan" },
    { key: "habits", Ic: Icons.Hash, label: "Habits" },
    { key: "goals", Ic: Icons.Target, label: "Goals" },
  ];
  return (
    <nav
      role="tablist"
      aria-label="Main navigation"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        ...glassCard(t),
        borderRadius: 0,
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none",
        padding: "6px 0 28px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {tabs.map((item) => {
        const active = item.key === tab;
        return (
          <button
            key={item.key}
            role="tab"
            aria-selected={active}
            aria-label={item.label}
            onClick={() => setTab(item.key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              minWidth: 52,
              background: "none",
              border: "none",
              outline: "none",
              padding: 4,
              color: active ? ACCENT.primary : t.textTertiary,
              transition: "color 0.2s",
            }}
          >
            <item.Ic size={22} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function ProgressBar({ value, max, t, label }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      style={{
        height: 5,
        background: t.pillBg,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: ACCENT.primary,
          borderRadius: 3,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

// ─── Screen: Today ──────────────────────────────────────────────────────────
function TodayScreen({ t, goals, toggle, cat, setCat }) {
  const filtered = cat === "All" ? goals : goals.filter((g) => g.cat === cat);
  const todayGoals = filtered.filter((g) => g.today);
  const cDone = goals.filter((g) => g.done && g.today).length;
  const cTotal = goals.filter((g) => g.today).length;

  return (
    <>
      <div style={{ padding: "4px 20px 0", flexShrink: 0 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 16,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              background: ACCENT.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icons.Target size={18} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: -0.5,
              margin: 0,
              color: t.text,
            }}
          >
            MicroGoals
          </h1>
        </div>

        {/* Progress glass card */}
        <div style={{ marginTop: 18, padding: "16px 18px", ...glassCard(t) }}>
          <p style={{ fontSize: 13, color: t.textSecondary, margin: 0 }}>
            Today's progress
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginTop: 6,
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 700, color: t.text }}>
              {cDone}
              <span
                style={{ color: t.textTertiary, fontWeight: 500, fontSize: 22 }}
              >
                /{cTotal}
              </span>
            </span>
            <span style={{ fontSize: 13, color: t.textTertiary }}>
              completed
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <ProgressBar
              value={cDone}
              max={cTotal}
              t={t}
              label={`${cDone} of ${cTotal} goals completed`}
            />
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icons.Fire size={12} color={t.textTertiary} />
            <span
              style={{ fontSize: 12, color: t.textSecondary, fontWeight: 500 }}
            >
              12-day streak
            </span>
          </div>
        </div>

        {/* Category pills */}
        <div
          role="tablist"
          aria-label="Filter by category"
          style={{
            display: "flex",
            gap: 7,
            marginTop: 16,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {CATS.map((c) => {
            const on = c === cat;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={on}
                onClick={() => setCat(c)}
                style={{
                  padding: "7px 15px",
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: on ? 600 : 400,
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  outline: "none",
                  transition: "all 0.2s",
                  background: on ? ACCENT.primary : t.pillBg,
                  color: on ? "#fff" : t.pillText,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks */}
      <div
        role="list"
        aria-label="Today's goals"
        style={{ flex: 1, overflowY: "auto", padding: "10px 20px 100px" }}
      >
        {todayGoals.map((g, i) => (
          <div
            key={g.id}
            role="listitem"
            tabIndex={0}
            onClick={() => toggle(g.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle(g.id);
              }
            }}
            aria-label={`${g.title}, ${g.done ? "completed" : "not completed"}${g.streak > 0 ? `, ${g.streak} day streak` : ""}`}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "14px 0",
              borderBottom:
                i < todayGoals.length - 1
                  ? `1px solid ${t.borderSubtle}`
                  : "none",
              cursor: "pointer",
            }}
          >
            <div
              role="checkbox"
              aria-checked={g.done}
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                flexShrink: 0,
                marginTop: 1,
                border: g.done ? "none" : `2px solid ${t.textTertiary}`,
                background: g.done ? ACCENT.primary : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              {g.done && <Icons.Check size={13} color="#fff" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: g.done ? t.textTertiary : t.text,
                  textDecoration: g.done ? "line-through" : "none",
                }}
              >
                {g.title}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 5,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: t.textTertiary,
                    background: t.pillBg,
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {g.cat}
                </span>
                {g.streak > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: t.textTertiary,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Icons.Fire size={10} color={t.textTertiary} /> {g.streak}d
                  </span>
                )}
              </div>
            </div>
            <div style={{ marginTop: 4 }} aria-hidden="true">
              <Icons.ChevRight size={14} color={t.textTertiary} />
            </div>
          </div>
        ))}

        {cat === "All" && (
          <div style={{ marginTop: 24 }}>
            <h2
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: t.textTertiary,
                textTransform: "uppercase",
                letterSpacing: 0.8,
                margin: "0 0 4px",
              }}
            >
              Upcoming
            </h2>
            {goals
              .filter((g) => !g.today)
              .map((g) => (
                <div
                  key={g.id}
                  role="listitem"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      flexShrink: 0,
                      border: `1.5px dashed ${t.textTertiary}`,
                    }}
                  />
                  <span style={{ fontSize: 14, color: t.textTertiary }}>
                    {g.title}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Screen: Plan ───────────────────────────────────────────────────────────
function PlanScreen({ t }) {
  return (
    <>
      <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: t.text }}>
          Plan
        </h1>
        <p style={{ fontSize: 14, color: t.textSecondary, margin: "2px 0 0" }}>
          Your week at a glance
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 100px" }}>
        {/* Week strip — glass card */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 8px",
            marginBottom: 20,
            ...glassCard(t),
          }}
        >
          {["3", "4", "5", "6", "7", "8", "9"].map((d, i) => {
            const isToday = d === "7";
            return (
              <div
                key={d}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  width: 36,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: t.textTertiary,
                    fontWeight: 500,
                  }}
                >
                  {WKDAYS[i]}
                </span>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: isToday ? ACCENT.primary : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? "#fff" : t.text,
                    }}
                  >
                    {d}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Day cards */}
        {PLAN.map((day, i) => (
          <div
            key={day.day}
            style={{
              padding: 16,
              marginBottom: 10,
              ...(i === 0 ? glassCard(t) : glassCardSubtle(t)),
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: t.text,
                  }}
                >
                  {day.day}
                </p>
                <p
                  style={{
                    margin: "2px 0 0",
                    fontSize: 12,
                    color: t.textTertiary,
                  }}
                >
                  {day.date}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i === 0 && day.done > 0 ? (
                  <span
                    style={{
                      fontSize: 12,
                      color: ACCENT.primary,
                      fontWeight: 600,
                    }}
                  >
                    {day.done}/{day.tasks}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: t.textTertiary }}>
                    {day.tasks} tasks
                  </span>
                )}
                <Icons.ChevRight size={14} color={t.textTertiary} />
              </div>
            </div>
            {i === 0 && (
              <div style={{ marginTop: 10 }}>
                <ProgressBar
                  value={day.done}
                  max={day.tasks}
                  t={t}
                  label="Today's plan progress"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Screen: Habits ─────────────────────────────────────────────────────────
function HabitsScreen({ t }) {
  const [habits, setHabits] = useState(HABITS_INIT);
  const toggleDay = (hid, di) => {
    setHabits((h) =>
      h.map((x) =>
        x.id === hid
          ? { ...x, week: x.week.map((v, i) => (i === di ? (v ? 0 : 1) : v)) }
          : x,
      ),
    );
  };

  return (
    <>
      <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: t.text }}>
          Habits
        </h1>
        <p style={{ fontSize: 14, color: t.textSecondary, margin: "2px 0 0" }}>
          Weekly tracker
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 100px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 6,
            paddingLeft: 0,
          }}
        >
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 0, width: 196 }}>
            {WKDAYS.map((d, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  textAlign: "center",
                  fontSize: 11,
                  color: t.textTertiary,
                  fontWeight: 500,
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {habits.map((h) => (
          <div
            key={h.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: `1px solid ${t.borderSubtle}`,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 500,
                  color: t.text,
                }}
              >
                {h.title}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: t.textTertiary,
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Icons.Repeat size={10} color={t.textTertiary} /> {h.freq}
                </span>
                {h.streak > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: t.textTertiary,
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Icons.Fire size={10} color={t.textTertiary} /> {h.streak}d
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 0 }}>
              {h.week.map((done, di) => (
                <button
                  key={di}
                  aria-label={`${h.title} ${WKDAYS[di]}, ${done ? "completed" : "not completed"}`}
                  onClick={() => toggleDay(h.id, di)}
                  style={{
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    outline: "none",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 7,
                      background: done ? ACCENT.primary : t.pillBg,
                      border: done ? "none" : `1.5px solid ${t.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {done ? <Icons.Check size={11} color="#fff" /> : null}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Summary glass card */}
        <div style={{ marginTop: 24, padding: 18, ...glassCard(t) }}>
          <p
            style={{ margin: 0, fontSize: 14, fontWeight: 600, color: t.text }}
          >
            This week
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 14,
            }}
          >
            {[
              { l: "Completion", v: "71%" },
              { l: "Best streak", v: "12d" },
              { l: "Active", v: "5" },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 22,
                    fontWeight: 700,
                    color: t.text,
                  }}
                >
                  {s.v}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 11,
                    color: t.textTertiary,
                  }}
                >
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Screen: Goals ──────────────────────────────────────────────────────────
function GoalsScreen({ t }) {
  return (
    <>
      <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: t.text }}>
          Goals
        </h1>
        <p style={{ fontSize: 14, color: t.textSecondary, margin: "2px 0 0" }}>
          Long-term objectives
        </p>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 100px" }}>
        {LONG_GOALS.map((g) => (
          <div
            key={g.id}
            style={{
              padding: 16,
              marginBottom: 12,
              cursor: "pointer",
              ...glassCard(t),
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  color: t.text,
                  flex: 1,
                }}
              >
                {g.title}
              </p>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: t.text,
                  marginLeft: 12,
                }}
              >
                {g.pct}%
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={g.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${g.title}: ${g.pct}% complete`}
              style={{
                marginTop: 12,
                height: 6,
                background: t.pillBg,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${g.pct}%`,
                  background: ACCENT.primary,
                  borderRadius: 3,
                  transition: "width 0.5s",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <span style={{ fontSize: 12, color: t.textTertiary }}>
                {g.current} of {g.target}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: t.textTertiary,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icons.Clock size={10} color={t.textTertiary} /> {g.deadline}
              </span>
            </div>
          </div>
        ))}
        <button
          aria-label="Add new goal"
          style={{
            width: "100%",
            padding: 20,
            ...glassCardSubtle(t),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            color: t.textTertiary,
            fontSize: 14,
            fontWeight: 500,
            outline: "none",
          }}
        >
          <Icons.Plus size={18} color={t.textTertiary} />
          Add a goal
        </button>
      </div>
    </>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────
export default function MicroGoals() {
  const [mode, setMode] = useState("dark");
  const [goals, setGoals] = useState(GOALS_INIT);
  const [cat, setCat] = useState("All");
  const [tab, setTab] = useState("today");

  const t = THEMES[mode];
  const toggle = useCallback(
    (id) =>
      setGoals((g) =>
        g.map((x) => (x.id === id ? { ...x, done: !x.done } : x)),
      ),
    [],
  );

  const screen = () => {
    switch (tab) {
      case "today":
        return (
          <TodayScreen
            t={t}
            goals={goals}
            toggle={toggle}
            cat={cat}
            setCat={setCat}
          />
        );
      case "plan":
        return <PlanScreen t={t} />;
      case "habits":
        return <HabitsScreen t={t} />;
      case "goals":
        return <GoalsScreen t={t} />;
      default:
        return null;
    }
  };

  // Generate dot pattern — pseudo-random hash for organic variation
  const waveDots = (() => {
    const size = 120;
    const spacing = 12;
    const isDark = mode === "dark";
    const baseColor = isDark ? "255,255,255" : "0,0,0";
    const maxOpacity = isDark ? 0.1 : 0.08;
    const minOpacity = isDark ? 0.02 : 0.015;
    // Simple deterministic hash for pseudo-random per-dot variation
    const hash = (x, y) => {
      let h = (x * 374761393 + y * 668265263 + 1274126177) | 0;
      h = Math.imul(h ^ (h >>> 13), 1103515245);
      h = h ^ (h >>> 16);
      return (h >>> 0) / 4294967295;
    };
    let circles = "";
    for (let y = 0; y < size; y += spacing) {
      for (let x = 0; x < size; x += spacing) {
        const rand = hash(x, y);
        const opacity = minOpacity + rand * (maxOpacity - minOpacity);
        const radius = 0.5 + rand * 0.4;
        circles += `<circle cx='${x + 1}' cy='${y + 1}' r='${radius.toFixed(2)}' fill='rgba(${baseColor},${opacity.toFixed(3)})'/>`;
      }
    }
    return `data:image/svg+xml,${encodeURIComponent(`<svg width='${size}' height='${size}' xmlns='http://www.w3.org/2000/svg'>${circles}</svg>`)}`;
  })();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "40px 20px",
        background: mode === "dark" ? "#161616" : "#dddddd",
        transition: "background 0.3s",
      }}
    >
      {/* Controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 13,
            color: mode === "dark" ? "#777" : "#666",
            fontWeight: 500,
          }}
        >
          Deep Green / #4a8d5f
        </span>
        <button
          onClick={() => setMode((m) => (m === "dark" ? "light" : "dark"))}
          aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 16px",
            borderRadius: 14,
            border: `1px solid ${mode === "dark" ? "#3a3a3a" : "#ccc"}`,
            background: mode === "dark" ? "#282828" : "#fff",
            color: mode === "dark" ? "#bbb" : "#555",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "sans-serif",
            outline: "none",
          }}
        >
          {mode === "dark" ? <Icons.Sun size={14} /> : <Icons.Moon size={14} />}
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Phone */}
      <div
        role="application"
        aria-label="MicroGoals app preview"
        style={{
          width: 375,
          height: 812,
          borderRadius: 44,
          overflow: "hidden",
          position: "relative",
          boxShadow:
            mode === "dark"
              ? "0 30px 90px rgba(0,0,0,0.55), 0 0 0 0.5px rgba(255,255,255,0.06)"
              : "0 25px 60px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.06)",
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: `${t.bg} url("${waveDots}")`,
          backgroundRepeat: "repeat",
          color: t.text,
          display: "flex",
          flexDirection: "column",
          transition: "background 0.3s, color 0.3s",
        }}
      >
        <StatusBar t={t} />
        {screen()}
        {/* Android-style FAB */}
        <button
          aria-label="Add new goal"
          style={{
            position: "absolute",
            bottom: 96,
            right: 20,
            width: 56,
            height: 56,
            borderRadius: 16,
            background: ACCENT.primary,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            outline: "none",
            boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <Icons.Plus size={24} color="#fff" />
        </button>
        <BottomNav t={t} tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}
