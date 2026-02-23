import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { useCustomerStore } from '../../store/customerStore';
import { User, Mail, Plus, Phone, X, Save, Download, Edit2, Search, Key } from 'lucide-react';
import { exportToExcel } from '../../utils/exportToExcel';
import { toFriendlyOrderId, toFriendlyCustomerId } from '../../utils/friendlyId';
import { insforge } from '../../lib/insforge';

const Customers = () => {
    const { orders } = useOrderStore();
    const { customers: manualCustomers, addCustomer, updateCustomer, deleteCustomer } = useCustomerStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', nuit: '' });
    const [selectedCustomerEmail, setSelectedCustomerEmail] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all'); // all, site, manual

    // Extract unique customers from orders and manual entries
    const customersMap = new Map();

    // 1. Add manual customers first
    manualCustomers.forEach(customer => {
        if (customer.email) {
            customersMap.set(customer.email, {
                ...customer,
                totalSpent: 0,
                ordersCount: 0,
                lastOrder: null,
                source: 'manual'
            });
        }
    });

    // 2. Merge order customers (prevent duplicates)
    orders.forEach(order => {
        if (!customersMap.has(order.customer.email)) {
            customersMap.set(order.customer.email, {
                ...order.customer,
                totalSpent: 0,
                ordersCount: 0,
                lastOrder: order.date,
                source: 'order'
            });
        }

        const customer = customersMap.get(order.customer.email);
        customer.totalSpent += order.total;
        customer.ordersCount += 1;

        if (!customer.lastOrder || new Date(order.date) > new Date(customer.lastOrder)) {
            customer.lastOrder = order.date;
        }

        // If a manual customer made an order, update their source to show they are active buyers
        if (customer.source === 'manual') {
            customer.source = 'manual_and_order';
        }
    });

    const allCustomers = Array.from(customersMap.values());

    const filteredCustomers = allCustomers.filter(c => {
        const matchesSearch = !searchQuery ||
            c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            toFriendlyCustomerId(c.id).toLowerCase().includes(searchQuery.toLowerCase());

        let matchesSource = true;
        if (sourceFilter === 'site') {
            matchesSource = c.source === 'order' || c.source === 'manual_and_order';
        } else if (sourceFilter === 'manual') {
            matchesSource = c.source === 'manual';
        }

        return matchesSearch && matchesSource;
    });

    const selectedCustomer = selectedCustomerEmail ? allCustomers.find(c => c.email === selectedCustomerEmail) : null;
    const customerOrders = selectedCustomerEmail ? orders.filter(o => o.customer.email === selectedCustomerEmail) : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCustomer) {
            updateCustomer(editingCustomer.id, formData);
        } else {
            addCustomer(formData);
        }
        setIsModalOpen(false);
        setEditingCustomer(null);
        setFormData({ name: '', email: '', phone: '', company: '', nuit: '' });
    };

    const handleResetPassword = async (customer) => {
        if (!customer.phone) {
            alert(`Atenção: O cliente ${customer.name} não tem número de telemóvel registado. Não será possível enviar a credencial via WhatsApp.\n\nPor favor, edite o cliente e adicione o contacto primeiro.`);
            return;
        }

        if (window.confirm(`Tem a certeza que deseja gerar uma nova senha de acesso para ${customer.name}? 🔑\n\nIsto irá abrir o seu WhatsApp para notificar o cliente na hora.`)) {
            // Gerar senha aleatoria de 6 digitos maiusculos
            const newPassword = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Gravar DB
            await updateCustomer(customer.id, { password: newPassword });

            // Format phone number (remove spaces and non-digits)
            let cleanPhone = customer.phone.replace(/\D/g, '');
            // Se for número Moçambicano sem indicativo, adicionar +258
            if (cleanPhone.length === 9 && cleanPhone.startsWith('8')) {
                cleanPhone = '258' + cleanPhone;
            }

            // Criar a Mensagem Mágica do WhatsApp
            const message = `Olá *${customer.name}*, tudo bem?\n\nA sua nova credencial de acesso ao *Portal de Suporte Aster* foi gerada com sucesso.\n\n🔑 Sua Nova Senha: *${newPassword}*\n\nPor favor, utilize o seu e-mail e esta senha temporária para iniciar sessão em:\nhttps://aster.co.mz/portal/login\n\n_Recomendamos que guarde este dado em segurança._`;

            const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

            // Disparar o Alerta de Sucesso
            alert(`A senha foi atualizada com sucesso!\n\nFoi gerado um Link Mágico. O seu WhatsApp vai abrir-se agora para enviar a nova senha ao cliente.`);

            // Abrir Whatsapp num novo Tab
            window.open(whatsappUrl, '_blank');
        }
    };

    const openEditModal = (cx) => {
        setEditingCustomer(cx);
        setFormData({
            name: cx.name || '',
            email: cx.email || '',
            phone: cx.phone || '',
            company: cx.company || '',
            nuit: cx.nuit || ''
        });
        setIsModalOpen(true);
    };

    const handleExportCustomers = () => {
        const reportData = allCustomers.map(c => ({
            'Nome': c.name,
            'Email': c.email,
            'Telefone': c.phone || 'N/A',
            'Empresa': c.company || 'N/A',
            'NUIT': c.nuit || 'N/A',
            'Origem': c.source === 'manual' ? 'Manual' : 'Site',
            'Total Gasto (MZN)': c.totalSpent,
            'Qtd Pedidos': c.ordersCount,
            'Última Atividade': c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('pt-MZ') : 'N/A'
        }));

        exportToExcel(reportData, 'Relatorio_Clientes_ASTER', 'Clientes');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Meus Clientes</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportCustomers}
                        className="btn bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm gap-2 transition-all rounded-xl font-bold"
                        title="Exportar Clientes para Excel"
                    >
                        <Download className="w-5 h-5 text-green-600" /> Exportar Lista
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-none shadow-lg shadow-purple-200 dark:shadow-none gap-2 hover:shadow-xl hover:scale-105 transition-all rounded-xl font-bold"
                    >
                        <Plus className="w-5 h-5" /> Cadastrar Cliente
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
                {/* Left Panel: Customer List */}
                <div className="lg:w-1/3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 dark:bg-gray-800/50 space-y-2">
                        <h2 className="font-bold text-gray-700 dark:text-gray-200 px-1">Lista de Clientes ({filteredCustomers.length})</h2>
                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar por nome ou ID..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                {[
                                    { id: 'all', label: 'Todos' },
                                    { id: 'site', label: 'Site' },
                                    { id: 'manual', label: 'Manual' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSourceFilter(tab.id)}
                                        className={`flex-1 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${sourceFilter === tab.id ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredCustomers.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">{allCustomers.length === 0 ? 'Nenhum cliente registrado.' : 'Nenhum resultado encontrado.'}</div>
                        ) : (
                            filteredCustomers.map((cx, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedCustomerEmail(cx.email)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all flex items-center gap-4 ${selectedCustomerEmail === cx.email ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50'}`}
                                >
                                    {cx.photoUrl ? (
                                        <img src={cx.photoUrl} alt={cx.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-200" />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${cx.source === 'manual' || cx.source === 'manual_and_order' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {cx.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">{cx.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono">{toFriendlyCustomerId(cx.id)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Panel: Customer Details & History */}
                <div className="lg:w-2/3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    {selectedCustomer ? (
                        <>
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-4">
                                    {selectedCustomer.photoUrl ? (
                                        <img src={selectedCustomer.photoUrl} alt={selectedCustomer.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-gray-200 shadow-sm" />
                                    ) : (
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${selectedCustomer.source === 'manual' || selectedCustomer.source === 'manual_and_order' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {selectedCustomer.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{toFriendlyCustomerId(selectedCustomer.id)}</span>
                                            {(selectedCustomer.source === 'manual' || selectedCustomer.source === 'manual_and_order') && (
                                                <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full uppercase tracking-wider">Manual</span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedCustomer.name}</h2>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-gray-400" /> {selectedCustomer.email}</span>
                                            {selectedCustomer.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400" /> {selectedCustomer.phone}</span>}
                                            {selectedCustomer.company && <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" /> {selectedCustomer.company}</span>}
                                        </div>
                                    </div>
                                </div>
                                {selectedCustomer.source === 'manual' || selectedCustomer.source === 'manual_and_order' ? (
                                    <div className="flex flex-col gap-2 relative">
                                        <button
                                            onClick={() => openEditModal(selectedCustomer)}
                                            className="btn btn-sm btn-ghost text-blue-500 hover:bg-blue-50 justify-start"
                                        >
                                            <Edit2 className="w-4 h-4" /> Editar
                                        </button>
                                        <button
                                            onClick={() => handleResetPassword(selectedCustomer)}
                                            className="btn btn-sm btn-ghost text-amber-500 hover:bg-amber-50 justify-start"
                                            title="Gerar nova credencial e enviar ao cliente."
                                        >
                                            <Key className="w-4 h-4" /> Gerar Nova Senha
                                        </button>
                                        <button
                                            onClick={() => { deleteCustomer(selectedCustomer.id); setSelectedCustomerEmail(null); }}
                                            className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 justify-start"
                                        >
                                            <X className="w-4 h-4" /> Eliminar
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 relative">
                                        <button
                                            onClick={() => handleResetPassword(selectedCustomer)}
                                            className="btn btn-sm btn-outline border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white justify-start shadow-sm"
                                            title="Gerar nova credencial e enviar ao cliente."
                                        >
                                            <Key className="w-4 h-4" /> Reset Portal
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Total Gasto</p>
                                    <p className="text-xl font-black text-green-600">{selectedCustomer.totalSpent.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Pedidos</p>
                                    <p className="text-xl font-bold text-gray-800">{selectedCustomer.ordersCount}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Última Compra</p>
                                    <p className="text-sm font-medium text-gray-700">{selectedCustomer.lastOrder ? new Date(selectedCustomer.lastOrder).toLocaleString('pt-MZ') : 'Nunca'}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Histórico de Compras ({customerOrders.length})</h3>
                                {customerOrders.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">Nenhuma compra registada através do site.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date)).map(order => (
                                            <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors bg-gray-50/50">
                                                <div className="flex justify-between items-center mb-3">
                                                    <div>
                                                        <span className="font-mono text-sm font-bold text-gray-800 mr-3">#{order.friendly_id || order.id.substring(0, 8).toUpperCase()}</span>
                                                        <span className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('pt-MZ', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                        {order.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 mb-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm">
                                                            <span className="text-gray-700">{item.name} <span className="text-gray-400 text-xs">(x1)</span></span>
                                                            <span className="text-gray-600">{item.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                                    <span className="text-xs text-gray-500 font-medium">TOTAL DO PEDIDO</span>
                                                    <span className="font-bold text-blue-600">{order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50 dark:bg-gray-800/50">
                            <User className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Nenhum Cliente Selecionado</h3>
                            <p className="text-sm">Selecione um cliente da lista à esquerda para visualizar os seus detalhes e histórico de compras completo.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Cadastro */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
                            </h2>
                            <button onClick={() => { setIsModalOpen(false); setEditingCustomer(null); setFormData({ name: '', email: '', phone: '', company: '', nuit: '' }); }} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="input input-bordered w-full"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">Telefone (Opcional)</label>
                                <input
                                    type="tel"
                                    className="input input-bordered w-full"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label">NUIT (Opcional)</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    placeholder="Número Fiscal"
                                    value={formData.nuit}
                                    onChange={e => setFormData({ ...formData, nuit: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none w-full mt-4">
                                <Save className="w-4 h-4 mr-2" /> {editingCustomer ? 'Guardar Alterações' : 'Salvar Cliente'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
