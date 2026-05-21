"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Contraseña incorrecta.");
        setPassword("");
        inputRef.current?.focus();
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* Decorative top bar — Colombian flag colors matching the dashboard */}
      <div className="login-flag-bar">
        <div className="flag-yellow" />
        <div className="flag-blue" />
        <div className="flag-red" />
      </div>

      {/* Background pattern */}
      <div className="login-bg-pattern" />

      {/* Centered layout */}
      <div className="login-center">

        {/* Card */}
        <div className="login-card">

          {/* Header strip */}
          <div className="login-card-header">
            <Image
              src="/Logo-Actores-Electorales.png"
              alt="Actores Electorales 2026"
              width={200}
              height={40}
              priority
              className="login-logo"
            />
            <div className="login-divider-v" />
            <div className="login-brand-text">
              <span className="login-brand-label">Plataforma de</span>
              <span className="login-brand-name">Estrategia Digital</span>
            </div>
          </div>

          {/* Body */}
          <div className="login-card-body">
            <div className="login-lock-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="login-title">Acceso restringido</h1>
            <p className="login-subtitle">
              Ingresa tu contraseña para acceder al panel de control
            </p>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="login-field">
                <label htmlFor="password" className="login-label">
                  Contraseña de acceso
                </label>
                <div className="login-input-wrap">
                  <div className="login-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`login-input ${error ? "login-input--error" : ""}`}
                    placeholder="••••••••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>

                {error && (
                  <div className="login-error" role="alert">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="login-btn"
                disabled={loading || !password}
              >
                {loading ? (
                  <span className="login-spinner" />
                ) : (
                  <>
                    <span>Ingresar al panel</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="login-card-footer">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Plataforma restringida · Solo acceso autorizado · NO CODE MKT
          </div>
        </div>

        {/* Bottom label */}
        <p className="login-bottom-label">
          © 2026 Actores Electorales · Colombia
        </p>
      </div>

      <style jsx>{`
        /* ─── Root ─── */
        .login-root {
          min-height: 100vh;
          background-color: #f8fafc;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(0,56,147,0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(206,17,38,0.03) 0%, transparent 50%);
          display: flex;
          flex-direction: column;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* ─── Flag bar (top) ─── */
        .login-flag-bar {
          display: flex;
          height: 4px;
          width: 100%;
          flex-shrink: 0;
        }
        .flag-yellow { flex: 2; background: #fcd116; }
        .flag-blue   { flex: 1; background: #003893; }
        .flag-red    { flex: 1; background: #ce1126; }

        /* ─── BG pattern ─── */
        .login-bg-pattern {
          position: absolute;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(0,56,147,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,56,147,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ─── Center wrapper ─── */
        .login-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        /* ─── Card ─── */
        .login-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.06),
            0 32px 64px rgba(0,56,147,0.06);
          overflow: hidden;
          animation: cardIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ─── Card header ─── */
        .login-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
        }
        .login-logo {
          height: 32px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }
        .login-divider-v {
          width: 1px;
          height: 32px;
          background: #e2e8f0;
          flex-shrink: 0;
        }
        .login-brand-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .login-brand-label {
          font-size: 10px;
          font-weight: 500;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .login-brand-name {
          font-size: 13px;
          font-weight: 800;
          color: #003893;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ─── Card body ─── */
        .login-card-body {
          padding: 2rem 2rem 1.5rem;
        }

        /* Lock icon badge */
        .login-lock-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #003893 0%, #1d4ed8 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 14px rgba(0,56,147,0.3);
        }

        .login-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.375rem;
          letter-spacing: -0.02em;
        }
        .login-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 1.75rem;
          line-height: 1.5;
        }

        /* ─── Form ─── */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .login-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
        }
        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input-icon {
          position: absolute;
          left: 0.875rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          pointer-events: none;
          z-index: 1;
        }
        .login-input {
          width: 100%;
          padding: 0.75rem 2.75rem 0.75rem 2.75rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9375rem;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          font-family: inherit;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #cbd5e1; }
        .login-input:focus {
          border-color: #003893;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0,56,147,0.1);
        }
        .login-input--error {
          border-color: #ce1126 !important;
          box-shadow: 0 0 0 3px rgba(206,17,38,0.08) !important;
        }

        /* Eye toggle */
        .login-eye {
          position: absolute;
          right: 0.875rem;
          color: #94a3b8;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
          transition: color 0.15s;
          z-index: 1;
        }
        .login-eye:hover { color: #003893; }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: #ce1126;
          font-weight: 500;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25%      { transform: translateX(-5px); }
          75%      { transform: translateX(5px); }
        }

        /* ─── Button ─── */
        .login-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8125rem 1.5rem;
          background: #003893;
          color: white;
          font-size: 0.9375rem;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(0,56,147,0.25);
          font-family: inherit;
          margin-top: 0.25rem;
          letter-spacing: 0.01em;
        }
        .login-btn:hover:not(:disabled) {
          background: #00277a;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,56,147,0.35);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(0,56,147,0.2);
        }
        .login-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* Spinner */
        .login-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ─── Card footer ─── */
        .login-card-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.875rem 2rem;
          border-top: 1px solid #f1f5f9;
          background: #f8fafc;
          font-size: 0.7rem;
          color: #94a3b8;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        /* ─── Bottom label ─── */
        .login-bottom-label {
          margin-top: 1.5rem;
          font-size: 0.75rem;
          color: #cbd5e1;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
