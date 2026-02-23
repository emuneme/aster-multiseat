import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerStore } from '../../../store/customerStore';
import { useCustomerAuthStore } from '../../../store/customerAuthStore';
import { useNotificationStore } from '../../../store/notificationStore';
import { UserPlus, Mail, Phone, Building2, Landmark, ShieldCheck, CheckCircle2, Upload, Image as ImageIcon } from 'lucide-react';

const PortalRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        nuit: ''
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const { addCustomer, customers } = useCustomerStore();
    const { customerLogin } = useCustomerAuthStore();
    const { addNotification } = useNotificationStore();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validação básica
        if (customers.some(c => c.email.toLowerCase() === formData.email.toLowerCase())) {
            setError('Este e-mail já está registado no nosso sistema.');
            setLoading(false);
            return;
        }

        try {
            await addCustomer({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                nuit: formData.nuit
            }, logoFile || undefined);

            // Refetch para garantir que temos o cliente na lista DB mais recente
            await useCustomerStore.getState().fetchCustomers();

            // Trigger Admin Notification (Non-blocking)
            try {
                addNotification({
                    type: 'new_customer',
                    title: 'Novo Cliente Registado',
                    message: `${formData.name} associado à empresa ${formData.company || 'N/A'}.`
                });
            } catch (notifErr) {
                console.error("Non-fatal error sending notification:", notifErr);
            }

            setIsSuccess(true);

            // Auto login após 2 segundos 
            setTimeout(() => {
                const updatedList = useCustomerStore.getState().customers;
                const loginResult = customerLogin(formData.email, formData.phone || formData.nuit, updatedList);
                if (loginResult.success) {
                    navigate('/portal');
                } else {
                    navigate('/portal/login');
                }
            }, 2000);

        } catch (err) {
            setError('Ocorreu um erro ao criar a sua conta. Por favor, tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6 font-sans">
                <div className="text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Conta Criada!</h1>
                    <p className="text-gray-500 mb-8">Bem-vindo à ASTER. Estamos a preparar o seu dashboard...</p>
                    <div className="loading loading-spinner loading-lg text-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 flex flex-col justify-center items-center p-6 font-sans">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-200">
                        <UserPlus className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Registo de Cliente</h1>
                    <p className="text-gray-500 mt-2">Crie a sua conta para gerir os seus serviços ASTER.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Avatar/Logo Upload */}
                        <div className="col-span-1 md:col-span-2 flex flex-col items-center mb-6">
                            <div className="relative group cursor-pointer">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-xl ${logoPreview ? 'bg-white' : 'bg-blue-50'} transition-all group-hover:scale-105`}>
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Logótipo" className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 text-blue-300" />
                                    )}
                                </div>
                                <label htmlFor="logo-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                                    <Upload className="w-4 h-4" />
                                </label>
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <span className="text-xs text-gray-400 mt-3 font-medium uppercase tracking-wider">Logótipo / Foto de Perfil (Opcional)</span>
                        </div>

                        <div className="form-control md:col-span-2">
                            <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest">Nome Completo</label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Ex: João Silva"
                                    className="input input-bordered w-full pl-12 h-14 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all border-gray-100 bg-gray-50/50"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="cliente@email.com"
                                    className="input input-bordered w-full pl-12 h-14 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all border-gray-100 bg-gray-50/50"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="+258 8..."
                                    className="input input-bordered w-full pl-12 h-14 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all border-gray-100 bg-gray-50/50"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest">Empresa (Opcional)</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    name="company"
                                    type="text"
                                    placeholder="Nome da sua empresa"
                                    className="input input-bordered w-full pl-12 h-14 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all border-gray-100 bg-gray-50/50"
                                    value={formData.company}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest">NUIT (Opcional)</label>
                            <div className="relative">
                                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                <input
                                    name="nuit"
                                    type="text"
                                    placeholder="Número de Identificação Fiscal"
                                    className="input input-bordered w-full pl-12 h-14 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all border-gray-100 bg-gray-50/50"
                                    value={formData.nuit}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="md:col-span-2 bg-red-50/80 backdrop-blur-md text-red-700 p-6 rounded-3xl text-sm font-medium border border-red-200 shadow-xl shadow-red-100 flex items-center gap-4 animate-shake transition-all overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                <div className="shrink-0 bg-white p-1 rounded-2xl shadow-sm border border-red-100 z-10">
                                    <img src="/logo.jpg" alt="Aster Logo" className="w-12 h-12 rounded-xl object-contain mix-blend-multiply" />
                                </div>
                                <div className="flex flex-col z-10">
                                    <span className="font-black text-red-800 text-base mb-0.5 tracking-tight uppercase text-xs">Atenção</span>
                                    <span className="whitespace-pre-wrap text-red-600 leading-relaxed text-[15px]">{error}</span>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn bg-blue-600 hover:bg-blue-700 text-white border-none w-full h-14 rounded-2xl shadow-xl shadow-blue-100 gap-3 text-lg font-bold"
                            >
                                {loading ? <span className="loading loading-spinner"></span> : <><UserPlus className="w-5 h-5" /> Criar a Minha Conta</>}
                            </button>

                            <p className="text-center mt-6 text-gray-500 font-medium">
                                Já tem conta?{' '}
                                <Link to="/portal/login" className="text-blue-600 hover:underline font-bold">
                                    Inicie sessão aqui
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="text-center mt-12">
                    <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors inline-flex items-center gap-2 font-medium">
                        Aster.co.mz
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PortalRegister;
