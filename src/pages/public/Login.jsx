import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simular delay de rede para efeito premium
        setTimeout(async () => {
            const result = await login(email, password);
            if (result.success) {
                navigate('/admin/dashboard');
            } else {
                setError(result.error);
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Background Abstract Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row m-4 border border-white/20">
                {/* Left Side - Visual */}
                <div className="hidden md:flex flex-col justify-center p-12 w-1/2 bg-gradient-to-br from-amber-500 to-amber-600 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                    {/* Decorative circles */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Bem-vindo de volta!</h2>
                        <p className="text-amber-50 text-lg leading-relaxed mb-8">
                            Acesse o painel administrativo para gerenciar licenças, produtos e visualizar métricas da sua loja.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-amber-100">
                            <span className="w-8 h-[1px] bg-amber-200"></span>
                            <span>ASTER Multiseat</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-center mb-10">
                        <img src="/src/assets/logo.png" alt="ASTER" className="h-16 mx-auto object-contain mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Login</h3>
                        <p className="text-gray-500 text-sm mt-2">Entre com suas credenciais para continuar</p>
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
                            <label className="text-xs font-semibold uppercase text-gray-400 tracking-wider">Senha</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-xl focus:bg-white dark:focus:bg-gray-700 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-gray-700 dark:text-white"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 text-red-500 text-sm font-medium flex items-center gap-2 animate-shake">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="checkbox checkbox-xs checkbox-primary rounded" />
                                <span className="text-gray-500">Lembrar-me</span>
                            </label>
                            <a href="#" className="text-amber-600 hover:text-amber-700 font-medium">Esqueceu a senha?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-200 dark:shadow-none transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader className="animate-spin w-5 h-5" /> : <>Entrar no Painel <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400 text-sm">
                            Não tem acesso? <a href="#" className="text-amber-600 font-medium hover:underline">Solicite aqui</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
