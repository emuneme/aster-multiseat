import React, { useState, useEffect } from "react";
import { X, Mail, ArrowRight, Loader, ChevronLeft } from "lucide-react";
import { insforge } from "../lib/insforge";

const FbIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const GIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const filterDigits = (val: string) => val.split("").filter((c: string) => c >= "0" && c <= "9").join("");

interface PurchaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  productName?: string;
}

const PurchaseAuthModal: React.FC<PurchaseAuthModalProps> = ({ isOpen, onClose, onAuthSuccess, productName }) => {
  const [view, setView] = useState("main");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [verifyCode, setVerifyCode] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    insforge.auth.getCurrentSession().then(({ data }) => {
      if (data && data.session && data.session.user) onAuthSuccess(data.session.user);
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setView("main"); setError(""); setForm({ name: "", email: "", password: "" }); setLoading(null); onClose();
  };

  const handleOAuth = async (provider: string) => {
    setError(""); setLoading(provider);
    try { await insforge.auth.signInWithOAuth({ provider: provider as any, redirectTo: window.location.href }); }
    catch (_) { setError("Erro ao conectar. Tente novamente."); setLoading(null); }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading("email");
    const { data, error: err } = await insforge.auth.signInWithPassword({ email: form.email, password: form.password });
    setLoading(null);
    if (err) setError("Email ou senha incorretos.");
    else if (data && data.user) { onAuthSuccess(data.user); resetAndClose(); }
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading("email");
    const { data, error: err } = await insforge.auth.signUp({ email: form.email, password: form.password, name: form.name });
    setLoading(null);
    if (err) setError(err.message || "Erro ao criar conta.");
    else if (data && data.requireEmailVerification) { setPendingEmail(form.email); setView("verify"); }
    else if (data && data.user) { onAuthSuccess(data.user); resetAndClose(); }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading("email");
    const { data, error: err } = await insforge.auth.verifyEmail({ email: pendingEmail, otp: verifyCode });
    setLoading(null);
    if (err) setError("Codigo invalido. Verifique o email.");
    else if (data && data.user) { onAuthSuccess(data.user); resetAndClose(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={resetAndClose}>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600" />
        <div className="p-8">
          <button onClick={resetAndClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
          {view === "main" && (
            <React.Fragment>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-600" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-1">Quase la!</h2>
                <p className="text-sm text-gray-500">
                  {productName ? "Para adquirir " + productName + ", precisamos identificar voce." : "Identifique-se para continuar."}
                </p>
              </div>
              <div className="space-y-3">
                <button onClick={() => handleOAuth("google")} disabled={!!loading} className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-200 hover:border-blue-400 rounded-xl font-semibold text-gray-700 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading === "google" ? <Loader className="w-5 h-5 animate-spin text-blue-500" /> : <GIcon />}
                  Continuar com Google
                </button>
                <button onClick={() => handleOAuth("facebook")} disabled={!!loading} className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: "#1877F2" }}>
                  {loading === "facebook" ? <Loader className="w-5 h-5 animate-spin" /> : <FbIcon />}
                  Continuar com Facebook
                </button>
                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">ou</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <button onClick={() => setView("email-login")} disabled={!!loading} className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border-2 border-gray-200 hover:border-gray-400 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50">
                  <Mail className="w-5 h-5 text-gray-500" /> Continuar com Email
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-6">Os seus dados sao usados exclusivamente para processar o pedido.</p>
            </React.Fragment>
          )}
          {view === "email-login" && (
            <React.Fragment>
              <button onClick={() => setView("main")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <h2 className="text-xl font-black text-gray-900 mb-6">Entrar com Email</h2>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Email</label>
                  <input type="email" required placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Senha</label>
                  <input type="password" required placeholder="Min 6 caracteres" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm" />
                </div>
                {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={loading === "email"} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                  {loading === "email" ? <Loader className="w-5 h-5 animate-spin" /> : <React.Fragment><ArrowRight className="w-4 h-4" /> Entrar</React.Fragment>}
                </button>
              </form>
              <p className="text-sm text-center text-gray-500 mt-5">Nao tem conta?{" "}<button onClick={() => { setView("email-register"); setError(""); }} className="text-blue-600 font-semibold hover:underline">Criar agora</button></p>
            </React.Fragment>
          )}
          {view === "email-register" && (
            <React.Fragment>
              <button onClick={() => setView("email-login")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"><ChevronLeft className="w-4 h-4" /> Voltar</button>
              <h2 className="text-xl font-black text-gray-900 mb-6">Criar Conta</h2>
              <form onSubmit={handleEmailRegister} className="space-y-4">
                <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Nome</label><input type="text" required placeholder="Joao da Silva" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Email</label><input type="email" required placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm" /></div>
                <div><label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Senha (min. 6)</label><input type="password" required placeholder="Min 6 caracteres" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 outline-none text-sm" /></div>
                {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={loading === "email"} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                  {loading === "email" ? <Loader className="w-5 h-5 animate-spin" /> : <React.Fragment><ArrowRight className="w-4 h-4" /> Criar Conta</React.Fragment>}
                </button>
              </form>
            </React.Fragment>
          )}
          {view === "verify" && (
            <React.Fragment>
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Mail className="w-7 h-7 text-green-600" /></div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Verifique o Email</h2>
                <p className="text-sm text-gray-500">Codigo de 6 digitos enviado para <span className="font-semibold text-gray-700">{pendingEmail}</span></p>
              </div>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <input type="text" required placeholder="000000" maxLength={6} value={verifyCode} onChange={(e) => setVerifyCode(filterDigits(e.target.value))} className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:border-blue-500 outline-none text-center text-3xl font-mono font-bold text-gray-800" />
                {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{error}</p>}
                <button type="submit" disabled={loading === "email" || verifyCode.length < 6} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                  {loading === "email" ? <Loader className="w-5 h-5 animate-spin" /> : "Confirmar e Continuar"}
                </button>
              </form>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseAuthModal;