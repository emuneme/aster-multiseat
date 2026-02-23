import React, { useEffect, useState, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { insforge } from '../lib/insforge';
import {
    LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Package, Menu, FileText, LifeBuoy, Bell, Camera, Shield, X, Save, MessageSquare, Key, Mail, User as UserIcon
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { useCustomerStore } from '../store/customerStore';
import { useOrderStore } from '../store/orderStore';
import { useTicketStore } from '../store/ticketStore';
import { useNotificationStore } from '../store/notificationStore';
import { PushNotificationListener } from '../components/PushNotificationListener';
import { Helmet } from 'react-helmet-async';


const AdminLayout = () => {
    const { logout, user, updateUser } = useAuthStore();
    const fetchProducts = useProductStore(state => state.fetchProducts);
    const fetchCustomers = useCustomerStore(state => state.fetchCustomers);
    const fetchOrders = useOrderStore(state => state.fetchOrders);
    const fetchTickets = useTicketStore(state => state.fetchTickets);

    const { notifications, markAsRead, clearAll, fetchNotifications } = useNotificationStore();
    const unreadCount = notifications.filter(n => !n.read).length;

    const navigate = useNavigate();
    const location = useLocation();

    // Avatar state
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            const { data: storageData, error: storageError } = await insforge.storage
                .from('customer-logos')
                .uploadAuto(file);

            if (storageError) throw storageError;

            const avatarUrl = storageData?.url;

            if (user.id) {
                const { error: dbError } = await insforge.database
                    .from('technicians')
                    .update({ avatar_url: avatarUrl })
                    .eq('id', user.id);

                if (dbError) throw dbError;
            }

            updateUser({ avatar_url: avatarUrl });
        } catch (err) {
            console.error('Falha no upload do avatar:', err);
            alert('Não foi possível atualizar a foto.');
        } finally {
            setIsUploading(false);
        }
    };

    // Global Profile Edition
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', password: '' });

    const openProfileModal = () => {
        setProfileData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            password: ''
        });
        setIsProfileModalOpen(true);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            alert("Apenas contas de equipa podem ser editadas aqui.");
            return;
        }

        try {
            const updates = {
                name: profileData.name,
                email: profileData.email,
                phone: profileData.phone,
            };

            if (profileData.password.trim()) {
                updates.password = profileData.password;
            }

            const { error } = await insforge.database
                .from('technicians')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            updateUser({ name: profileData.name, email: profileData.email, phone: profileData.phone });
            setIsProfileModalOpen(false);

            // Optional: Provide visual feedback without alerts if possible, or simple alert 
            alert('Perfil atualizado com sucesso!');
        } catch (err) {
            console.error('Falha ao atualizar perfil:', err);
            alert('Ocorreu um erro ao guardar os dados.');
        }
    };

    // Initialize Database Data
    useEffect(() => {
        fetchProducts();
        fetchCustomers();
        fetchOrders();
        fetchTickets();
        fetchNotifications();
    }, [fetchProducts, fetchCustomers, fetchOrders, fetchTickets, fetchNotifications]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const allNavItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, roles: ['admin', 'technician'] },
        { path: '/admin/quotes', label: 'Cotações (Proformas)', icon: <FileText size={20} />, roles: ['admin'] },
        { path: '/admin/contracts', label: 'Contratos', icon: <FileText size={20} />, roles: ['admin'] },
        { path: '/admin/tickets', label: 'Chamados (Helpdesk)', icon: <LifeBuoy size={20} />, roles: ['admin', 'technician'] },
        { path: '/admin/team', label: 'Equipa de Suporte', icon: <Shield size={20} />, roles: ['admin'] },
        { path: '/admin/orders', label: 'Pedidos', icon: <ShoppingBag size={20} />, roles: ['admin'] },
        { path: '/admin/products', label: 'Produtos', icon: <Package size={20} />, roles: ['admin'] },
        { path: '/admin/customers', label: 'Clientes', icon: <Users size={20} />, roles: ['admin'] },
        { path: '/admin/settings', label: 'Configurações', icon: <Settings size={20} />, roles: ['admin'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(user?.role || 'admin'));

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            <PushNotificationListener />
            <Helmet>
                <title>Aster Workspace | Gestão e Helpdesk</title>
                <meta name="theme-color" content="#4f46e5" />
            </Helmet>
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:flex flex-col fixed h-full z-20">
                <div className="p-6 flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
                    <img src="/logo.webp" alt="Admin" className="h-10 w-auto object-contain" />
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                    {/* Admin Notifications Trigger (Mock for layout) */}
                    <div className="dropdown dropdown-top dropdown-end w-full">
                        <div tabIndex={0} role="button" className="btn btn-ghost w-full justify-between px-4 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <Bell size={20} />
                                <span>Notificações</span>
                            </div>
                            {unreadCount > 0 && (
                                <span className="badge badge-error badge-sm text-white border-none">{unreadCount}</span>
                            )}
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-white dark:bg-gray-800 rounded-box w-72 border border-gray-100 dark:border-gray-700 mb-2 max-h-96 overflow-y-auto block">
                            <li className="menu-title flex flex-row justify-between items-center py-2">
                                <span className="text-gray-800 dark:text-white font-bold">Alertas ({unreadCount})</span>
                                {notifications.length > 0 && <button onClick={clearAll} className="btn btn-xs btn-ghost text-red-500">Limpar</button>}
                            </li>
                            {notifications.length === 0 ? (
                                <li className="disabled"><span className="text-center text-gray-400 block w-full py-4 space-y-0">Sem notificações</span></li>
                            ) : (
                                notifications.map(notif => (
                                    <li key={notif.id} className="mb-1" onClick={() => markAsRead(notif.id)}>
                                        <div className={`block text-xs ${notif.read ? 'opacity-50' : 'bg-blue-50 dark:bg-blue-900/20'} rounded-lg`}>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">{notif.title}</p>
                                            <p className="text-gray-500 line-clamp-2 mt-1 whitespace-pre-wrap">{notif.message}</p>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    <div className="divider m-0 h-0"></div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        <span>Sair</span>
                    </button>

                    <div onClick={openProfileModal} className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl flex items-center gap-3 relative group cursor-pointer transition-colors shadow-sm">
                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} onClick={(e) => e.stopPropagation()} accept="image/*" className="hidden" />

                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden cursor-pointer relative shrink-0 border-2 border-transparent group-hover:border-blue-300 transition-all hover:shadow-md"
                            title="Alterar Fotografia"
                        >
                            {isUploading ? (
                                <span className="loading loading-spinner w-4 h-4 text-blue-500"></span>
                            ) : user?.avatar_url ? (
                                <>
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={14} className="text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {user?.name?.charAt(0) || 'A'}
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={14} className="text-white" />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <p className="text-sm font-bold text-gray-800 dark:text-white truncate group-hover:text-blue-600 transition-colors">{user?.name || 'Administrador'}</p>
                            <p className="text-xs text-gray-500 truncate group-hover:text-gray-600 transition-colors">{user?.email || 'admin@aster.co.mz'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-8 overflow-x-hidden">
                <Outlet />
            </main>

            {/* Profile Edit Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-hidden">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-in zoom-in duration-200" style={{ maxHeight: '90vh' }}>

                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 shrink-0 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-blue-500" /> O Meu Perfil
                            </h2>
                            <button onClick={() => setIsProfileModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="myProfileForm" onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        className="input input-bordered w-full bg-gray-50 focus:bg-white"
                                        value={profileData.name}
                                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                        placeholder="Seu Nome"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        className="input input-bordered w-full bg-gray-50 focus:bg-white"
                                        value={profileData.email}
                                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">WhatsApp / Telemóvel <MessageSquare className="w-3 h-3 text-green-500" /></label>
                                    <input
                                        type="tel"
                                        className="input input-bordered w-full bg-gray-50 focus:bg-white"
                                        value={profileData.phone}
                                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                        placeholder="Ex: +258 84 000 0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Palavra-passe Privada</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            className="input input-bordered w-full pl-9 bg-gray-50 focus:bg-white"
                                            value={profileData.password}
                                            onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                                            placeholder="Deixe em branco para manter a atual..."
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Se a preencher, a sua senha de login será redefinida na hora.
                                    </p>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0">
                            <button type="submit" form="myProfileForm" className="btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full border-none shadow-lg">
                                <Save className="w-5 h-5 mr-2" />
                                Salvar Alterações Seguras
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLayout;
