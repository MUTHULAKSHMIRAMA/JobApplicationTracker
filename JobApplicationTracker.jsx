import { useState } from "react";

const COMPANIES = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Zoho", "Infosys", "Swiggy", "Freshworks", "Flipkart", "TCS", "Wipro", "HCL"];
const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract", "Remote"];
const STATUSES = ["Applied", "Pending", "Interview", "Offer", "Rejected"];

const initialApps = [
  { id: 1, company: "Amazon", role: "Backend Developer", status: "Rejected", jobType: "Full-time", date: "2025-05-22", notes: "Will reapply next round", resume: "Resume_v1.pdf", rejectionReason: "Low experience" },
  { id: 2, company: "Google", role: "SDE Intern", status: "Offer", jobType: "Internship", date: "2025-06-03", notes: "Selected!!", resume: "Resume2.pdf", rejectionReason: "" },
];

const statusColors = {
  Applied: { bg: "#dbeafe", color: "#1e40af" },
  Pending: { bg: "#fef9c3", color: "#854d0e" },
  Interview: { bg: "#dcfce7", color: "#166534" },
  Offer: { bg: "#fef3c7", color: "#92400e" },
  Rejected: { bg: "#fee2e2", color: "#991b1b" },
};

const jobTypeColors = {
  "Full-time": { bg: "#dbeafe", color: "#1d4ed8" },
  "Part-time": { bg: "#ede9fe", color: "#6d28d9" },
  Internship: { bg: "#d1fae5", color: "#065f46" },
  Contract: { bg: "#fce7f3", color: "#9d174d" },
  Remote: { bg: "#f0fdf4", color: "#166534" },
};

function Badge({ label, colors }) {
  return (
    <span style={{
      background: colors.bg, color: colors.color,
      fontSize: 11, fontWeight: 600, padding: "2px 10px",
      borderRadius: 20, display: "inline-block",
    }}>{label}</span>
  );
}

function CompanyLogo({ name }) {
  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 6,
      background: color + "22", border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 700, color, flexShrink: 0,
    }}>{name[0]}</div>
  );
}

function Toast({ msg, onClose }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: "#1f2937", color: "#fff", borderRadius: 8,
      padding: "10px 18px", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
      {msg}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, width: 520, maxWidth: "95vw",
        maxHeight: "90vh", overflowY: "auto", padding: "28px 28px 24px",
        position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 20, cursor: "pointer",
            color: "#6b7280", lineHeight: 1, padding: "0 4px",
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AppForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    company: "", role: "", jobType: "Full-time", status: "Applied",
    date: new Date().toISOString().split("T")[0], resume: "", notes: "", rejectionReason: "",
  });
  const [suggestions, setSuggestions] = useState([]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleCompany = (v) => {
    set("company", v);
    setSuggestions(v.length > 0 ? COMPANIES.filter(c => c.toLowerCase().includes(v.toLowerCase())).slice(0, 4) : []);
  };

  const label = (text, req) => (
    <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 4 }}>
      {text}{req && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
  );

  const input = (props) => (
    <input {...props} style={{
      width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb",
      borderRadius: 6, fontSize: 13, color: "#111827", outline: "none",
      boxSizing: "border-box", background: "#fff",
      ...props.style,
    }} />
  );

  const select = (props, options) => (
    <select {...props} style={{
      width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb",
      borderRadius: 6, fontSize: 13, color: "#111827", outline: "none",
      background: "#fff", boxSizing: "border-box", ...props.style,
    }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          {label("Company Name", true)}
          <div style={{ position: "relative" }}>
            {input({ value: form.company, onChange: e => handleCompany(e.target.value), placeholder: "e.g. Google" })}
            {suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, background: "#1f2937",
                borderRadius: 6, zIndex: 10, overflow: "hidden", marginTop: 2,
              }}>
                {suggestions.map(s => (
                  <div key={s} onClick={() => { set("company", s); setSuggestions([]); }}
                    style={{ padding: "8px 12px", color: "#fff", fontSize: 13, cursor: "pointer" }}
                    onMouseEnter={e => e.target.style.background = "#374151"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >{s}</div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          {label("Job Title", true)}
          {input({ value: form.role, onChange: e => set("role", e.target.value), placeholder: "e.g. SDE Intern" })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          {label("Job Type")}
          {select({ value: form.jobType, onChange: e => set("jobType", e.target.value) }, JOB_TYPES)}
        </div>
        <div>
          {label("Status")}
          {select({ value: form.status, onChange: e => set("status", e.target.value) }, STATUSES)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          {label("Application Date")}
          {input({ type: "date", value: form.date, onChange: e => set("date", e.target.value) })}
        </div>
        <div>
          {label("Resume Used")}
          {input({ value: form.resume, onChange: e => set("resume", e.target.value), placeholder: "e.g. Resume_v2.pdf" })}
        </div>
      </div>

      {form.status === "Rejected" && (
        <div style={{ marginBottom: 16 }}>
          {label("Rejection Reason")}
          {input({ value: form.rejectionReason || "", onChange: e => set("rejectionReason", e.target.value), placeholder: "e.g. Low experience" })}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        {label("Notes")}
        <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
          placeholder="Any additional notes about this application..."
          style={{
            width: "100%", padding: "8px 12px", border: "1.5px solid #e5e7eb",
            borderRadius: 6, fontSize: 13, color: "#111827", outline: "none",
            resize: "vertical", minHeight: 72, boxSizing: "border-box", fontFamily: "inherit",
          }} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={{
          padding: "8px 18px", borderRadius: 6, border: "1.5px solid #e5e7eb",
          background: "#fff", fontSize: 13, cursor: "pointer", color: "#374151",
        }}>Cancel</button>
        <button onClick={() => onSave(form)} style={{
          padding: "8px 18px", borderRadius: 6, border: "none",
          background: "#111827", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 500,
        }}>
          {initial ? "Update Application" : "Add Application"}
        </button>
      </div>
    </div>
  );
}

function SignIn({ onSignIn, onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (!email || !password) { setErr("Please fill all fields"); return; }
    onSignIn({ email, name: email.split("@")[0] });
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#e8edf5",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#f9fafb", borderRadius: 16, padding: "36px 32px",
        width: 380, boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Welcome Back</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 28px" }}>Sign in to your job tracker account</p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#111827", display: "block", marginBottom: 6 }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
            style={{
              width: "100%", padding: "10px 14px", border: "1.5px solid #111827",
              borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff",
            }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#111827", display: "block", marginBottom: 6 }}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password"
            style={{
              width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb",
              borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff",
            }} />
        </div>
        {err && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{err}</p>}
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "12px", background: "#111827", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: "pointer", marginBottom: 16,
        }}>Sign In</button>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", margin: 0 }}>
          Don't have an account?{" "}
          <span onClick={onSignUp} style={{ color: "#111827", fontWeight: 500, cursor: "pointer" }}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

function SignUp({ onSignUp, onSignIn }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setErr("Please fill all fields"); return;
    }
    onSignUp({ email: form.email, name: form.firstName + " " + form.lastName });
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#e8edf5",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#f9fafb", borderRadius: 16, padding: "36px 32px",
        width: 380, boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Get Started</h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: "0 0 24px" }}>Create your job tracker account</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#111827", display: "block", marginBottom: 6 }}>First Name</label>
            <input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="John" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#111827", display: "block", marginBottom: 6 }}>Last Name</label>
            <input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Alex" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#111827", display: "block", marginBottom: 6 }}>Email</label>
          <input value={form.email} onChange={e => set("email", e.target.value)} type="email" placeholder="alex@gmail.com" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#111827", display: "block", marginBottom: 6 }}>Password</label>
          <input value={form.password} onChange={e => set("password", e.target.value)} type="password" style={{ ...inputStyle, border: "1.5px solid #111827" }} />
        </div>
        {err && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 12 }}>{err}</p>}
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "12px", background: "#111827", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: "pointer", marginBottom: 16,
        }}>Create Account</button>
        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", margin: 0 }}>
          Already have an account?{" "}
          <span onClick={onSignIn} style={{ color: "#111827", fontWeight: 500, cursor: "pointer" }}>Sign in</span>
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, count, icon, iconColor }) {
  const icons = {
    total: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    pending: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    interview: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    rejected: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  };
  return (
    <div style={{
      flex: 1, background: "#fff", border: "1px solid #f3f4f6", borderRadius: 10,
      padding: "16px 20px", display: "flex", flexDirection: "column", gap: 4,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{label}</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>{count}</p>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: iconColor + "15", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icons[icon]}
        </div>
      </div>
    </div>
  );
}

function AppCard({ app, onEdit, onDelete }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #f3f4f6", borderRadius: 10,
      padding: "16px 18px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <CompanyLogo name={app.company} />
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>{app.company}</p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 8px" }}>{app.role}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <Badge label={app.status} colors={statusColors[app.status] || { bg: "#f3f4f6", color: "#374151" }} />
              <Badge label={app.jobType} colors={jobTypeColors[app.jobType] || { bg: "#f3f4f6", color: "#374151" }} />
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {new Date(app.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onEdit(app)} style={{
            background: "none", border: "1px solid #e5e7eb", borderRadius: 6,
            padding: "5px 8px", cursor: "pointer", color: "#6b7280",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button onClick={() => onDelete(app.id)} style={{
            background: "none", border: "1px solid #e5e7eb", borderRadius: 6,
            padding: "5px 8px", cursor: "pointer", color: "#ef4444",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      </div>
      {app.status === "Rejected" && app.rejectionReason && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f9fafb" }}>
          <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 500, margin: "0 0 2px" }}>Rejection Reason:</p>
          <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{app.rejectionReason}</p>
        </div>
      )}
      {(app.notes || app.resume) && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f9fafb" }}>
          {app.notes && (
            <>
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, margin: "0 0 2px" }}>Notes:</p>
              <p style={{ fontSize: 13, color: "#374151", margin: "0 0 6px" }}>{app.notes}</p>
            </>
          )}
          {app.resume && (
            <>
              <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 500, margin: "0 0 2px" }}>Resume Used:</p>
              <p style={{ fontSize: 13, color: "#374151", margin: 0 }}>{app.resume}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("signin"); // signin | signup | dashboard
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState(initialApps);
  const [showAdd, setShowAdd] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [toast, setToast] = useState(null);
  const [nextId, setNextId] = useState(10);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSignIn = (u) => { setUser(u); setPage("dashboard"); };
  const handleSignUp = (u) => { setUser(u); setPage("dashboard"); };
  const handleSignOut = () => { setUser(null); setPage("signin"); };

  const handleAdd = (form) => {
    setApps(a => [...a, { ...form, id: nextId }]);
    setNextId(n => n + 1);
    setShowAdd(false);
    showToast("Job application added successfully");
  };

  const handleEdit = (form) => {
    setApps(a => a.map(x => x.id === form.id ? form : x));
    setEditApp(null);
    showToast("Job application updated successfully");
  };

  const handleDelete = (id) => {
    setApps(a => a.filter(x => x.id !== id));
    showToast("Application removed");
  };

  const counts = {
    total: apps.length,
    pending: apps.filter(a => a.status === "Applied" || a.status === "Pending").length,
    interview: apps.filter(a => a.status === "Interview").length,
    rejected: apps.filter(a => a.status === "Rejected").length,
  };

  if (page === "signin") return <SignIn onSignIn={handleSignIn} onSignUp={() => setPage("signup")} />;
  if (page === "signup") return <SignUp onSignUp={handleSignUp} onSignIn={() => setPage("signin")} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #f3f4f6",
        padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: 0 }}>Job Application Tracker</h1>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>
            Welcome back, {user?.name?.split(" ")[0] || "John"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setShowAdd(true)} style={{
            background: "#111827", color: "#fff", border: "none",
            borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 500,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Application
          </button>
          <button onClick={handleSignOut} style={{
            background: "#fff", color: "#374151", border: "1px solid #e5e7eb",
            borderRadius: 8, padding: "9px 14px", fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "28px 20px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
          <StatCard label="Total Applications" count={counts.total} icon="total" iconColor="#3b82f6" />
          <StatCard label="Pending" count={counts.pending} icon="pending" iconColor="#f59e0b" />
          <StatCard label="Interviews" count={counts.interview} icon="interview" iconColor="#10b981" />
          <StatCard label="Rejected" count={counts.rejected} icon="rejected" iconColor="#ef4444" />
        </div>

        {/* Applications list */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: "#111827", margin: 0 }}>Recent Applications</h2>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>{apps.length} total applications</span>
        </div>

        {apps.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 10, padding: "48px 20px",
            textAlign: "center", border: "1px solid #f3f4f6",
          }}>
            <p style={{ color: "#9ca3af", fontSize: 15, margin: 0 }}>No applications yet. Add your first one!</p>
          </div>
        ) : (
          apps.map(app => (
            <AppCard key={app.id} app={app}
              onEdit={a => setEditApp(a)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal title="Add New Application" onClose={() => setShowAdd(false)}>
          <AppForm onSave={handleAdd} onClose={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editApp && (
        <Modal title="Edit Application" onClose={() => setEditApp(null)}>
          <AppForm initial={editApp} onSave={handleEdit} onClose={() => setEditApp(null)} />
        </Modal>
      )}

      {toast && <Toast msg={toast} />}
    </div>
  );
}
