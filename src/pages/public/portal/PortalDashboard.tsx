import { useState, useEffect, useRef } from 'react';
import { insforge } from '../../../lib/insforge';
import { useCustomerAuthStore } from '../../../store/customerAuthStore';
import { useTicketStore } from '../../../store/ticketStore';
import { useCustomerStore } from '../../../store/customerStore';
import { useOrderStore } from '../../../store/orderStore';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    FileText,
    AlertCircle,
    LogOut,
    DownloadCloud,
    MonitorPlay,
    LifeBuoy,
    Plus,
    Clock,
    CheckCircle,
    Settings,
    X,
    Eye,
    EyeOff,
    Camera
} from 'lucide-react';

const PortalDashboard = () => {
    const { customerUser, customerLogout } = useCustomerAuthStore();
    const { tickets, fetchTickets } = useTicketStore();
    const { customers, updateCustomer } = useCustomerStore();
    const { orders, fetchOrders } = useOrderStore();
    const navigate = useNavigate();

    // Tabs
    const [activeTab, setActiveTab] = useState<'tickets' | 'invoices'>('tickets');

    useEffect(() => {
        fetchTickets();
        fetchOrders();
    }, [fetchTickets, fetchOrders]);

    // Profile Edit Modal State
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '', phone: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    // Avatar state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const openProfileModal = () => {
        if (currentCustomer) {
            setProfileData({
                name: currentCustomer.name || '',
                email: currentCustomer.email || '',
                phone: currentCustomer.phone || ''
            });
        } else if (customerUser) {
            setProfileData({
                name: customerUser.name || '',
                email: customerUser.email || '',
                phone: ''
            });
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setProfileError('');
        setProfileSuccess('');
        setIsProfileModalOpen(true);
    };

    // Obter cliente da store global caso a versão do authStore esteja desatualizada (cache de LS)
    const currentCustomer = customers.find(c => c.id === customerUser?.id);
    const displayPhotoUrl = currentCustomer?.photoUrl || customerUser?.photoUrl;
    const displayName = currentCustomer?.name || customerUser?.name;
    const displayEmail = currentCustomer?.email || customerUser?.email;

    // Filtrar apenas tickets e faturas deste cliente
    const customerTickets = tickets.filter(t => t.customer.email === displayEmail);
    const customerOrders = orders.filter(o =>
        o.customer_id === (currentCustomer?.id || customerUser?.id) ||
        o.customer?.email === displayEmail
    );

    const stats = {
        total: customerTickets.length,
        open: customerTickets.filter(t => ['Novo', 'Em Análise', 'Aguardando Cliente'].includes(t.status)).length,
        invoices: customerOrders.filter(o => o.status === 'completed' || o.status === 'pending').length
    };

    const handleLogout = () => {
        customerLogout();
        navigate('/portal/login');
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'Novo': return <Clock className="w-4 h-4 text-blue-500" />;
            case 'Em Análise': return <Clock className="w-4 h-4 text-purple-500" />;
            case 'Aguardando Cliente': return <AlertCircle className="w-4 h-4 text-amber-500" />;
            case 'Resolvido': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Encerrado': return <CheckCircle className="w-4 h-4 text-slate-500" />;
            default: return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentCustomer?.id) {
            setProfileError('Sessão expirada para upload de fotografia.');
            return;
        }

        setIsUploading(true);
        setProfileError('');
        try {
            const { data: storageData, error: storageError } = await insforge.storage
                .from('customer-logos')
                .uploadAuto(file);

            if (storageError) throw storageError;

            const avatarUrl = storageData?.url;
            if (avatarUrl) {
                await updateCustomer(currentCustomer.id, { photoUrl: avatarUrl });
            }
            setProfileSuccess('Fotografia atualizada!');
            setTimeout(() => setProfileSuccess(''), 3000);
        } catch (err: any) {
            console.error('Falha no upload do avatar:', err);
            setProfileError('Não foi possível atualizar a foto.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');

        if (!currentCustomer) {
            setProfileError('Sessão expirada ou cliente não encontrado.');
            return;
        }

        // Validações básicas if trying to change password
        if (newPassword || currentPassword || confirmPassword) {
            if (newPassword.length < 6) {
                setProfileError('A nova senha deve ter no mínimo 6 caracteres.');
                return;
            }

            if (newPassword !== confirmPassword) {
                setProfileError('A nova senha e a confirmação não coincidem.');
                return;
            }

            if (currentCustomer.password !== currentPassword && currentCustomer.phone !== currentPassword && currentCustomer.nuit !== currentPassword) {
                setProfileError('A sua senha atual (ou NUIT/Telefone padrão) está incorreta.');
                return;
            }
        }

        setIsSubmittingProfile(true);
        try {
            const updates: any = {
                phone: profileData.phone
            };

            if (newPassword) {
                updates.password = newPassword;
            }

            await updateCustomer(currentCustomer.id, updates);
            setProfileSuccess('Perfil atualizado com sucesso!');

            // Limpar formulário após 2 segs e fechar modal
            setTimeout(() => {
                setIsProfileModalOpen(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setProfileSuccess('');
            }, 2500);

        } catch (error: any) {
            setProfileError(error.message || 'Ocorreu um erro ao atualizar o perfil.');
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">

            {/* Profile Edit Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-hidden">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col animate-in fade-in zoom-in-95 duration-200" style={{ maxHeight: '95vh' }}>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-blue-600" /> O Meu Perfil
                            </h2>
                            <button
                                onClick={() => setIsProfileModalOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="profileForm" onSubmit={handleProfileSubmit} className="space-y-5">
                                {profileError && (
                                    <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium flex items-start gap-2 border border-red-100">
                                        <AlertCircle className="w-5 h-5 shrink-0" /> {profileError}
                                    </div>
                                )}

                                {profileSuccess && (
                                    <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium flex items-start gap-2 border border-emerald-100">
                                        <CheckCircle className="w-5 h-5 shrink-0" /> {profileSuccess}
                                    </div>
                                )}

                                <div className="flex flex-col items-center justify-center mb-6">
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                                        {isUploading ? (
                                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50">
                                                <span className="loading loading-spinner w-8 h-8 text-blue-500"></span>
                                            </div>
                                        ) : displayPhotoUrl ? (
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                                                <img src={displayPhotoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-black text-3xl border-4 border-white shadow-md">
                                                {displayName?.charAt(0)?.toUpperCase()}
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 font-medium">Clique para alterar fotografia</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Personal Info */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Nome</label>
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-not-allowed"
                                            readOnly
                                            title="O nome só pode ser alterado pela administração"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                required
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-not-allowed"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">WhatsApp</label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-slate-100 w-full my-4"></div>

                                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-2">Alterar Senha</h3>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Senha Atual</label>
                                        <div className="relative">
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Necessária se alterar senha"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all pr-12"
                                            />
                                            <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-1">
                                                {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Nova Senha</label>
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Nova Senha"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirme a Nova Senha</label>
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirme a nova senha"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 shrink-0 flex justify-end gap-3 border-t border-slate-100 bg-slate-50/50">
                            <button
                                type="button"
                                onClick={() => setIsProfileModalOpen(false)}
                                className="px-5 py-2.5 text-slate-500 hover:bg-slate-200 font-bold rounded-xl transition-colors"
                                disabled={isSubmittingProfile}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="profileForm"
                                disabled={isSubmittingProfile || !!profileSuccess}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" /> {isSubmittingProfile ? 'A Guardar...' : 'Guardar Perfil'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navigation */}
            <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 px-6 lg:px-10 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/portal')}>
                    <img src="/logo.jpg" alt="Aster Logo" className="h-10 w-auto rounded-lg shadow-sm mix-blend-multiply transition-transform group-hover:scale-105" />
                    <span className="font-black text-2xl tracking-tighter text-slate-900 hidden sm:block">
                        Aster Portal
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    <div className="hidden md:flex flex-col items-end justify-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Bem-vindo</span>
                        <span className="text-sm font-bold text-slate-800 leading-none">{displayName}</span>
                    </div>

                    <div className="relative group">
                        {displayPhotoUrl ? (
                            <img
                                src={displayPhotoUrl}
                                alt={displayName}
                                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md bg-white shrink-0 group-hover:ring-4 ring-blue-50 transition-all"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-blue-600 font-black text-lg border-2 border-white shadow-md shrink-0 group-hover:ring-4 ring-blue-50 transition-all">
                                {displayName?.charAt(0)?.toUpperCase()}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => openProfileModal()}
                            className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl transition-colors shrink-0 tooltip tooltip-bottom font-bold"
                            data-tip="O Meu Perfil"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleLogout}
                            className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-colors shrink-0 tooltip tooltip-bottom font-bold"
                            data-tip="Sair da Conta"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full">
                {/* Page Intro */}
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6" aria-label="Ações principais">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">O seu Suporte</h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">Gerencie os seus pedidos de assistência técnica e faturas.</p>
                    </div>
                    <button
                        onClick={() => navigate('/portal/new-ticket')}
                        className="btn bg-slate-900 hover:bg-blue-600 text-white border-none h-14 px-8 rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-blue-600/30 gap-3 text-lg font-bold transition-all hover:-translate-y-1"
                    >
                        <Plus className="w-6 h-6 text-blue-400 group-hover:text-white" /> Novo Chamado
                    </button>
                </section>

                {/* Stats Grid */}
                <section aria-label="Estatísticas" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <article className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 transition-colors group-hover:bg-blue-50/50"></div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Total de Pedidos</p>
                        <p className="text-5xl font-black text-slate-900 relative z-10 tracking-tighter">{stats.total}</p>
                    </article>
                    <article className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-colors group-hover:bg-blue-100/50"></div>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2 relative z-10">Chamados Abertos</p>
                        <p className="text-5xl font-black text-blue-600 relative z-10 tracking-tighter">{stats.open}</p>
                    </article>
                    <article className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -mr-10 -mt-10 transition-colors group-hover:bg-emerald-100/50"></div>
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 relative z-10">Faturas</p>
                        <p className="text-5xl font-black text-emerald-600 relative z-10 tracking-tighter">{stats.invoices}</p>
                    </article>
                </section>

                {/* Tabs Toggles */}
                <div className="flex items-center gap-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'tickets' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        Chamados e Suporte
                    </button>
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'invoices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                    >
                        As Minhas Faturas
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Content Area */}
                    <section className="lg:col-span-8 space-y-6" aria-labelledby="history-heading">

                        {activeTab === 'tickets' && (
                            <>
                                {customerTickets.length === 0 ? (
                                    <div className="bg-white p-16 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium text-lg">Não tem pedidos de suporte ainda.</p>
                                        <p className="text-slate-400 mt-2">Os seus pedidos de ajuda registados aparecerão aqui.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {customerTickets.map(ticket => (
                                            <article key={ticket.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-grow">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wide">
                                                            {ticket.friendly_id}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                                            <StatusIcon status={ticket.status} />
                                                            <span className="text-xs font-black text-slate-700">{ticket.status}</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                            {ticket.category}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                                                        {ticket.subject}
                                                    </h3>
                                                </div>

                                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0">
                                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> {new Date(ticket.created_at).toLocaleDateString()}
                                                    </span>
                                                    <button
                                                        onClick={() => navigate(`/portal/ticket/${ticket.id}`)}
                                                        className="btn btn-sm bg-white border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 shadow-sm group-hover:opacity-100 transition-all font-bold gap-2 rounded-xl"
                                                        aria-label={`Ver detalhes do chamado ${ticket.friendly_id}`}
                                                    >
                                                        Detalhes <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'invoices' && (
                            <>
                                {customerOrders.length === 0 ? (
                                    <div className="bg-white p-16 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium text-lg">Sem histórico financeiro.</p>
                                        <p className="text-slate-400 mt-2">Aparecerão aqui faturas pendentes ou emitidas.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {customerOrders.map(order => (
                                            <article key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div className="flex-grow">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wide">
                                                            {order.id.split('-')[0].toUpperCase()}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                                            <span className="text-xs font-black text-slate-700">
                                                                {order.status === 'completed' ? 'Paga' : order.status === 'pending' ? 'Pendente' : 'Cancelada'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-lg font-black text-slate-900 transition-colors leading-tight">
                                                        {order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-1">{order.items.length} itens no pedido</p>
                                                </div>

                                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0">
                                                    <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> {new Date(order.created_at).toLocaleDateString()}
                                                    </span>
                                                    <a
                                                        href={`/invoice/${order.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm bg-white border-slate-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm font-bold gap-2 rounded-xl"
                                                    >
                                                        Ver Fatura <FileText className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </section>

                    {/* Quick Access & Help Side Panel */}
                    <aside className="lg:col-span-4 space-y-8" aria-labelledby="assists-heading">

                        {/* HoptoDesk Remote Support Card */}
                        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                                        <MonitorPlay className="w-6 h-6 text-blue-200" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight" id="assists-heading">Assistência Remota</h3>
                                </div>
                                <p className="text-indigo-100/80 text-sm mb-6 font-medium leading-relaxed">
                                    Para resolvermos o seu problema mais rapidamente, usamos o HoptoDesk para acesso remoto seguro e encriptado.
                                </p>

                                <ol className="space-y-3 mb-8">
                                    <li className="flex items-start gap-3 text-sm bg-black/20 p-3 rounded-2xl backdrop-blur-md border border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">1</div>
                                        <p className="text-indigo-50 font-medium">Transfira o <a href="https://www.hoptodesk.com/" target="_blank" rel="noopener noreferrer" className="font-black text-white hover:text-blue-300 underline decoration-indigo-500/50 underline-offset-2">HoptoDesk aqui</a>.</p>
                                    </li>
                                    <li className="flex items-start gap-3 text-sm bg-black/20 p-3 rounded-2xl backdrop-blur-md border border-white/5">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 flex items-center justify-center font-black text-xs shrink-0 shadow-sm">2</div>
                                        <p className="text-indigo-50 font-medium">Execute e envie o <strong className="text-white font-black">ID</strong> e <strong className="text-white font-black">Senha</strong> no chat do chamado.</p>
                                    </li>
                                </ol>

                                <a
                                    href="https://www.hoptodesk.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn w-full bg-white hover:bg-slate-50 text-indigo-900 border-none shadow-xl gap-2 rounded-2xl font-black h-14 transition-all hover:scale-[1.02]"
                                >
                                    <DownloadCloud className="w-5 h-5" /> Baixar HoptoDesk
                                </a>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="bg-white border text-center border-slate-100 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <LifeBuoy className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Ajuda Urgente?</h3>
                            <p className="text-slate-500 text-sm mb-6 font-medium">
                                A nossa equipa técnica está disponível via WhatsApp para emergências críticas.
                            </p>
                            <a
                                href="https://wa.me/2588491000"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full btn bg-slate-900 hover:bg-emerald-600 text-white border-none rounded-xl font-bold transition-colors"
                            >
                                Falar no WhatsApp
                            </a>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default PortalDashboard;
