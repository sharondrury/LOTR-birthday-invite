import { useState, useEffect } from "react";
import config from "./config";
import "./index.scss";
import Papa from "papaparse";

// ─── Confetti ───────────────────────────────────────────────
function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 8 + 4,
    d: Math.random() * 2 + 1,
    color: ["#f0c060", "#e87bb0", "#9b72d0", "#5dd8a0", "#e87070"][
      Math.floor(Math.random() * 5)
    ],
    tilt: Math.random() * 20 - 10,
    tiltSpeed: Math.random() * 0.1 + 0.05,
    angle: 0,
  }));
  let frame = 0;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.angle += p.tiltSpeed;
      p.y += p.d + Math.sin(p.angle) * 0.5;
      p.x += Math.sin(p.angle) * 1.2;
      p.tilt = Math.sin(p.angle) * 12;
      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
      ctx.stroke();
    });
    frame++;
    if (frame < 180) requestAnimationFrame(animate);
    else document.body.removeChild(canvas);
  };
  requestAnimationFrame(animate);
}

// ─── Password Screen ─────────────────────────────────────────
function PasswordScreen({ onUnlock, onAdminUnlock }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === config.adminPassword) {
      onAdminUnlock();
    } else if (pw === config.password) {
      onUnlock();
    } else {
      setError("Wrong password. Try again!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setPw("");
    }
  };

  return (
    <div className="screen password-screen">
      <div className="stars" />
      <div className={`password-card ${shake ? "shake" : ""}`}>
        <div className="lock-icon">🔒</div>
        <h1 className="display-title">You're Invited</h1>
        <p className="password-hint">
          Enter the secret password to unlock your invite
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="pw-input"
            placeholder="Password..."
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError("");
            }}
            autoFocus
          />
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary">
            Unlock Invite ✨
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── RSVP Form Screen ────────────────────────────────────────
function RSVPScreen({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    attending: "",
    guests: "0",
    dietary: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.attending) e.attending = "Please let us know if you can make it";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div className="screen rsvp-screen">
      <div className="stars" />
      <div className="rsvp-container">
        {/* Invite Header */}
        <div className="invite-header">
          <div className="ribbon">YOU ARE CORDIALLY INVITED</div>
          <h1 className="event-title">{config.partyName}</h1>
          <p className="invite-message">{config.inviteMessage}</p>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">📅</span>
              <span className="detail-label">Date</span>
              <span className="detail-value">{config.date}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">🕖</span>
              <span className="detail-label">Time</span>
              <span className="detail-value">{config.time}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <span className="detail-label">Venue</span>
              <span className="detail-value">{config.location}</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">👗</span>
              <span className="detail-label">Dress Code</span>
              <span className="detail-value">{config.dresscode}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="form-card">
          <h2 className="form-title">RSVP by {config.rsvpDeadline}</h2>
          <form onSubmit={handleSubmit}>
            {/* Attending toggle */}
            <div className="field">
              <label>Will you be attending? *</label>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn accept ${form.attending === "yes" ? "active" : ""}`}
                  onClick={() => handleChange("attending", "yes")}
                >
                  🥂 Joyfully Accepts
                </button>
                <button
                  type="button"
                  className={`toggle-btn decline ${form.attending === "no" ? "active" : ""}`}
                  onClick={() => handleChange("attending", "no")}
                >
                  😔 Regretfully Declines
                </button>
              </div>
              {errors.attending && (
                <span className="field-error">{errors.attending}</span>
              )}
            </div>

            <div className="fields-row">
              {/* Name */}
              <div className="field">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <span className="field-error">{errors.name}</span>
                )}
              </div>

              {/* Email */}
              <div className="field">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="field-error">{errors.email}</span>
                )}
              </div>
            </div>

            <div className="fields-row">
              {/* Phone */}
              <div className="field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+44 7700 000000"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>

              {/* Guests */}
              {form.attending === "yes" && (
                <div className="field">
                  <label>Additional Guests</label>
                  <select
                    value={form.guests}
                    onChange={(e) => handleChange("guests", e.target.value)}
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n === 0 ? "Just me" : `+${n} guest${n > 1 ? "s" : ""}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Dietary */}
            {form.attending === "yes" && (
              <div className="field">
                <label>Dietary Requirements</label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Gluten-free, Nut allergy..."
                  value={form.dietary}
                  onChange={(e) => handleChange("dietary", e.target.value)}
                />
              </div>
            )}

            {/* Message */}
            <div className="field">
              <label>Message to {config.hostName}</label>
              <textarea
                placeholder={`Leave ${config.hostName} a note...`}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn-primary submit-btn"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send My RSVP 🎉"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Thank You Screen ─────────────────────────────────────────
function ThankYouScreen({ attending }) {
  return (
    <div className="screen thankyou-screen">
      <div className="stars" />
      <div className="thankyou-card">
        <div className="big-emoji">{attending === "yes" ? "🎉" : "💌"}</div>
        <h1 className="display-title">
          {attending === "yes" ? "See You There!" : "We'll Miss You!"}
        </h1>
        <p className="thankyou-msg">
          {attending === "yes"
            ? `Your RSVP is confirmed! Get ready for an unforgettable evening. We can't wait to celebrate with you!`
            : `Thanks for letting us know. We'll miss you and hope to celebrate together another time!`}
        </p>
        <div className="thankyou-details">
          <p>
            📅 {config.date} at {config.time}
          </p>
          <p>📍 {config.location}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────
function AdminPanel() {
  const hasUrl = !!(config.googleScriptUrl && config.googleScriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE");

  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(hasUrl);
  const [error, setError] = useState(hasUrl ? "" : "No Google Script URL set in config.js");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchRSVPs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${config.googleScriptUrl}?action=get`, { redirect: "follow" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRsvps(data.rows || []);
    } catch (e) {
      setError(
        `Could not load RSVPs (${e.message}). Make sure your Google Apps Script is deployed as "Anyone, even anonymous" and the URL in config.js is correct.`,
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!hasUrl) return;
    fetch(`${config.googleScriptUrl}?action=get`, { redirect: "follow" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRsvps(data.rows || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(
          `Could not load RSVPs (${e.message}). Make sure your Google Apps Script is deployed as "Anyone, even anonymous" and the URL in config.js is correct.`,
        );
        setLoading(false);
      });
  }, [hasUrl]);

  const filtered = rsvps.filter((r) => {
    const matchFilter = filter === "all" || r.attending === filter;
    const matchSearch =
      !search ||
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const attending = rsvps.filter((r) => r.attending === "yes");
  const declined = rsvps.filter((r) => r.attending === "no");
  const totalGuests = attending.reduce(
    (sum, r) => sum + parseInt(r.guests || 0, 10) + 1,
    0,
  );

  const downloadCSV = () => {
    const csv = Papa.unparse(
      filtered.map((r) => ({
        Name: r.name,
        Email: r.email,
        Phone: r.phone,
        Attending: r.attending === "yes" ? "Yes" : "No",
        "Additional Guests": r.guests,
        "Dietary Requirements": r.dietary,
        Message: r.message,
        "Submitted At": r.timestamp,
      })),
    );
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvps-${filter}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="screen admin-screen">
      <div className="admin-container">
        <div className="admin-header">
          <h1>RSVP Dashboard</h1>
          <p className="text-muted">{config.partyName}</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-num">{rsvps.length}</span>
            <span className="stat-label">Total Responses</span>
          </div>
          <div className="stat-card success">
            <span className="stat-num">{attending.length}</span>
            <span className="stat-label">Attending</span>
          </div>
          <div className="stat-card danger">
            <span className="stat-num">{declined.length}</span>
            <span className="stat-label">Declined</span>
          </div>
          <div className="stat-card gold">
            <span className="stat-num">{totalGuests}</span>
            <span className="stat-label">Total Guests</span>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-controls">
          <div className="filter-tabs">
            {["all", "yes", "no"].map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "All RSVPs"
                  : f === "yes"
                    ? "✅ Attending"
                    : "❌ Declined"}
              </button>
            ))}
          </div>
          <div className="admin-actions">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button className="btn-secondary" onClick={fetchRSVPs}>
              ↻ Refresh
            </button>
            <button className="btn-secondary" onClick={downloadCSV}>
              ⬇ Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="loading">Loading RSVPs...</div>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No RSVPs found</div>
        ) : (
          <div className="table-wrap">
            <table className="rsvp-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Guests</th>
                  <th>Dietary</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i}>
                    <td className="name-cell">{r.name}</td>
                    <td>
                      <span
                        className={`badge ${r.attending === "yes" ? "badge-success" : "badge-danger"}`}
                      >
                        {r.attending === "yes" ? "Attending" : "Declined"}
                      </span>
                    </td>
                    <td>{r.email}</td>
                    <td>{r.phone || "—"}</td>
                    <td>
                      {r.attending === "yes"
                        ? parseInt(r.guests || 0) + 1
                        : "—"}
                    </td>
                    <td>{r.dietary || "—"}</td>
                    <td className="message-cell">{r.message || "—"}</td>
                    <td className="date-cell">
                      {r.timestamp
                        ? new Date(r.timestamp).toLocaleDateString("en-GB")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="admin-footer">
          Showing {filtered.length} of {rsvps.length} responses
          {filter !== "all" &&
            ` • Filtered by: ${filter === "yes" ? "Attending" : "Declined"}`}
        </p>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("password"); // password | rsvp | thankyou | admin
  const [attendingStatus, setAttendingStatus] = useState("");

  const handleUnlock = () => setScreen("rsvp");
  const handleAdminUnlock = () => setScreen("admin");

  const handleSubmit = async (form) => {
    setAttendingStatus(form.attending);

    // Submit to Google Sheets
    if (
      config.googleScriptUrl &&
      config.googleScriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
    ) {
      try {
        await fetch(config.googleScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "add",
            ...form,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.warn("Could not submit to Google Sheets:", e);
      }
    } else {
      console.log("RSVP (no Google Script configured):", form);
    }

    if (form.attending === "yes") launchConfetti();
    setScreen("thankyou");
  };

  return (
    <>
      {screen === "password" && (
        <PasswordScreen
          onUnlock={handleUnlock}
          onAdminUnlock={handleAdminUnlock}
        />
      )}
      {screen === "rsvp" && <RSVPScreen onSubmit={handleSubmit} />}
      {screen === "thankyou" && <ThankYouScreen attending={attendingStatus} />}
      {screen === "admin" && <AdminPanel />}
    </>
  );
}
