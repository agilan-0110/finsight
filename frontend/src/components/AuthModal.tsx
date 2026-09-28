import React, { useState } from "react";
import { X, Lock, Mail, User as UserIcon, Building2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { api, type User } from "../api/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User, isNewUser: boolean) => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [primaryBroker, setPrimaryBroker] = useState("zerodha");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "register") {
        if (!fullName.trim()) {
          throw new Error("Please enter your full name.");
        }
        const res = await api.register({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          primary_broker: primaryBroker,
        });
        onAuthSuccess(res.user, true);
        onClose();
      } else {
        const res = await api.login({
          email: email.trim(),
          password,
        });
        onAuthSuccess(res.user, false);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("investor@finsight.local");
    setPassword("securePassword123");
    setFullName("Rahul Sharma");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-stitch-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30 bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-on-primary font-headline font-bold text-sm shadow-sm">
              <span>F</span>
            </div>
            <div>
              <h2 className="font-headline text-base font-bold text-on-surface">
                {mode === "login" ? "Sign In to FinSight" : "Create FinSight Account"}
              </h2>
              <p className="text-xs text-on-surface-variant font-medium">
                {mode === "login"
                  ? "Access your isolated institutional portfolio"
                  : "Begin tracking & analyzing your investments"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="p-6 pb-2">
          <div className="flex rounded-xl bg-surface-container-low p-1 border border-outline-variant/30 mb-5">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "login"
                  ? "bg-surface-container-lowest text-on-surface shadow-stitch-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === "register"
                  ? "bg-surface-container-lowest text-on-surface shadow-stitch-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-error-container/60 border border-error/20 flex items-start gap-2.5 text-xs text-on-error-container font-medium animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-outline absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-outline absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-outline absolute left-3 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5">Primary Broker</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-outline absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={primaryBroker}
                    onChange={(e) => setPrimaryBroker(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all appearance-none cursor-pointer"
                  >
                    <option value="zerodha">Zerodha (Kite / Console)</option>
                    <option value="groww">Groww</option>
                    <option value="angelone">AngelOne</option>
                    <option value="upstox">Upstox</option>
                    <option value="other">Other Broker / Manual</option>
                  </select>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  You can upload statements directly from this broker to automatically import your portfolio.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dim text-on-primary font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In" : "Register & Continue"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Testing locally?</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="font-semibold text-primary hover:underline hover:text-primary-dim"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low/40 border-t border-outline-variant/30 text-center text-[11px] text-on-surface-variant font-medium">
          Multi-tenant data isolation • Zero cost local database
        </div>
      </div>
    </div>
  );
};
