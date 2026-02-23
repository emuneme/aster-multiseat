import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuthStore } from '../../../store/customerAuthStore';
import { useCustomerStore } from '../../../store/customerStore';
import { LogIn, ShieldCheck, Mail, Phone, ArrowRight } from 'lucide-react';

const PortalLogin = () => {
    const [email, setEmail] = useState('');
    const [credential, setCredential] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { customerLogin } = useCustomerAuthStore();
    const { customers, fetchCustomers } = useCustomerStore();

    useEffect(() => {
        // Garantir que a lista de clientes atualizada está carregada para validação de login
        fetchCustomers();
    }, [fetchCustomers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Pequeno delay para UX
        setTimeout(() => {
            const result = customerLogin(email, credential, customers);
            if (result.success) {
                navigate('/portal');
            } else {
                setError(result.error || 'Erro ao entrar.');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Background Abstract Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row m-4 border border-white/20">
                {/* Left Side - Visual */}
                <div className="hidden md:flex flex-col justify-center p-12 w-1/2 bg-gradient-to-br from-amber-500 to-amber-600 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    {/* Decorative circles */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Bem-vindo ao Portal!</h2>
                        <p className="text-amber-50 text-lg leading-relaxed mb-8">
                            Acesse a sua área de cliente exclusiva para abrir chamados de suporte técnico, gerir contratos e visualizar seu histórico com a ASTER.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-amber-100">
                            <span className="w-8 h-[1px] bg-amber-200"></span>
                            <span>Suporte Técnico Exclusivo</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center mb-10">
                        <img src="/logo.webp" alt="ASTER" className="h-16 mx-auto object-contain mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Portal do Cliente</h3>
                        <p className="text-gray-500 text-sm mt-2">Valide as suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Email Corporativo</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-700 dark:text-white"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Telefone ou NUIT</label>
                                <span className="text-[10px] uppercase text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full">PIN de Acesso</span>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-700 dark:text-white"
                                    placeholder="A sua credencial de acesso"
                                    value={credential}
                                    onChange={(e) => setCredential(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 text-red-500 text-sm font-medium flex items-center gap-2 animate-shake">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200 dark:shadow-none transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <span className="loading loading-spinner"></span> : <><LogIn className="w-5 h-5" /> Entrar no Portal</>}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col items-center gap-3">
                        <p className="text-gray-500 text-sm">
                            Novo Cliente? <Link to="/portal/register" className="text-amber-600 font-medium hover:underline inline-flex items-center gap-1">Registe-se na ASTER <ArrowRight className="w-4 h-4" /></Link>
                        </p>
                        <div className="flex justify-center gap-4 text-gray-400 text-xs mt-2">
                            <Link to="/" className="hover:text-amber-500 transition-colors">Voltar ao Site</Link>
                            <span>&bull;</span>
                            <a href="mailto:suporte@aster.co.mz" className="hover:text-amber-500 transition-colors">Precisas de ajuda?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalLogin;
