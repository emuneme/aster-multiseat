import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { useCustomerStore } from '../../store/customerStore';
import { useProductStore } from '../../store/productStore';
import { Link } from 'react-router-dom';
import { Eye, Clock, CheckCircle, XCircle, Plus, ShoppingBag, X, Save, Trash2, Printer, Mail, Search, Download, Share2 } from 'lucide-react';
import { exportToExcel } from '../../utils/exportToExcel';
import { toFriendlyOrderId } from '../../utils/friendlyId';

const Orders = () => {
    const { orders, updateOrderStatus, addOrder, updateOrderItems } = useOrderStore();
    const { customers } = useCustomerStore();
    const { products } = useProductStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [emailSent, setEmailSent] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, paid, pending, cancelled

    // Scroll to top when modal opens
    useEffect(() => {
        if (isCreateModalOpen) {
            document.body.style.overflow = 'hidden';
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCreateModalOpen]);

    // Form State for New Manual Order
    const [newOrderData, setNewOrderData] = useState({
        customerEmail: '', // Will link to existing or new customer
        customerName: '', // Fallback/Manual
        paymentMethod: 'pos', // pos, cash, bim, mpesa
        items: []
    });

    // Helper to calculate total of building order
    const currentTotal = newOrderData.items.reduce((acc, item) => acc + item.price, 0);

    const handleAddItem = (product) => {
        setNewOrderData(prev => ({
            ...prev,
            items: [...prev.items, { ...product, id: Date.now() }] // Unique ID for list
        }));
    };

    const handleRemoveItem = (index) => {
        setNewOrderData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleCreateOrder = (e) => {
        e.preventDefault();

        const customer = customers.find(c => c.email === newOrderData.customerEmail) || {
            name: newOrderData.customerName || "Cliente nao Registado",
            email: newOrderData.customerName ? "manual@aster.co.mz" : "nao_registado@aster.co.mz"
        };

        addOrder({
            items: newOrderData.items,
            total: currentTotal,
            customer: customer,
            paymentMethod: newOrderData.paymentMethod,
            source: 'manual'
        });

        setIsCreateModalOpen(false);
        setNewOrderData({ customerEmail: '', customerName: '', paymentMethod: 'pos', items: [] });
    };

    const handleSimulateEmail = () => {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 3000);
    };

    const handleLicenseChange = (itemIndex, value) => {
        if (!selectedOrder) return;

        const updatedItems = [...selectedOrder.items];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], licenseKey: value };

        // Optimistically update local state for input
        setSelectedOrder({ ...selectedOrder, items: updatedItems });
    };

    const saveLicenses = () => {
        if (!selectedOrder) return;

        // Ensure we are saving the CURRENT state of items from the selectedOrder (which is updated by handleLicenseChange)
        updateOrderItems(selectedOrder.id, selectedOrder.items);

        // Show feedback
        const btn = document.getElementById('save-license-btn');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Salvo!</span>';
            btn.classList.add('btn-success', 'text-white');
            btn.classList.remove('btn-primary');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
            }, 2000);
        }
    };

    // Derived status badge component
    const StatusBadge = ({ status }) => {
        const styles = {
            paid: "bg-green-100 text-green-700 border-green-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            cancelled: "bg-red-100 text-red-700 border-red-200"
        };
        const icons = {
            paid: <CheckCircle className="w-3 h-3" />,
            pending: <Clock className="w-3 h-3" />,
            cancelled: <XCircle className="w-3 h-3" />
        };

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
                {icons[status] || icons.pending}
                {status === 'paid' ? 'Pago' : status === 'pending' ? 'Pendente' : 'Cancelado'}
            </span>
        );
    };

    const handleExportOrders = () => {
        // Obter os pedidos visíveis (aplicando o mesmo filtro da pesquisa se existir, ou todos)
        const filteredOrders = orders.filter((order) => {
            const matchesSearch = !searchQuery.trim() ||
                order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (order.customer.phone && order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (order.customer.company && order.customer.company.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        const reportData = filteredOrders.map(o => ({
            'Pedido ID': toFriendlyOrderId(o.id),
            'Data': new Date(o.date).toLocaleDateString('pt-MZ'),
            'Cliente Nome': o.customer.name,
            'Cliente Email': o.customer.email,
            'Telefone': o.customer.phone || 'N/A',
            'Empresa': o.customer.company || 'N/A',
            'NUIT': o.customer.nuit || 'N/A',
            'Localidade': o.customer.address || 'N/A',
            'Total (MZN)': o.total,
            'Status': o.status === 'paid' ? 'Pago' : o.status === 'pending' ? 'Pendente' : 'Cancelado',
            'Método Pagt.': o.paymentMethod || o.source,
            'Qtd Itens': o.items?.length || 0,
            'Itens Detalhe': (o.items || []).map(i => i.name).join('; ')
        }));

        exportToExcel(reportData, 'Lista_de_Pedidos_ASTER', 'Pedidos');
    };

    return (
        <div className="animate-fade-in-up">
            {/* Success Toast */}
            {emailSent && (
                <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4">
                    <div className="alert alert-success text-white shadow-xl flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Fatura enviada com sucesso para o cliente!</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Pedidos</h1>
                    <p className="text-gray-500 text-sm">Gerencie e acompanhe todas as vendas.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportOrders}
                        className="btn bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm gap-2 transition-all rounded-xl font-bold"
                        title="Exportar Tabela Atual para Excel"
                    >
                        <Download className="w-5 h-5 text-green-600" /> Exportar Relatório
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-lg shadow-blue-200 dark:shadow-none gap-2 hover:shadow-xl hover:scale-105 transition-all rounded-xl font-bold"
                    >
                        <Plus className="w-5 h-5" /> Novo Pedido Manual
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por nome, email ou telefone do cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl h-[52px]">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'paid', label: 'Pagos' },
                        { id: 'pending', label: 'Pendentes' },
                        { id: 'cancelled', label: 'Cancelados' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${statusFilter === tab.id ? 'bg-white dark:bg-gray-800 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {orders.filter((order) => {
                    const matchesSearch = !searchQuery.trim() ||
                        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (order.customer.phone && order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
                        (order.customer.company && order.customer.company.toLowerCase().includes(searchQuery.toLowerCase()));

                    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

                    return matchesSearch && matchesStatus;
                }).length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-600">
                            {searchQuery ? 'Nenhum pedido encontrado' : 'Nenhum pedido ainda'}
                        </h3>
                        <p className="text-gray-400">
                            {searchQuery ? 'Tente pesquisar com outros termos.' : 'Os pedidos aparecerão aqui quando forem criados.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="pl-6 text-xs font-bold uppercase text-gray-400">ID</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Cliente</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Data</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Total</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Status</th>
                                    <th className="text-xs font-bold uppercase text-gray-400 text-right pr-6">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders
                                    .filter((order) => {
                                        const matchesSearch = !searchQuery.trim() ||
                                            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            (order.customer.phone && order.customer.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                            (order.customer.company && order.customer.company.toLowerCase().includes(searchQuery.toLowerCase()));

                                        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

                                        return matchesSearch && matchesStatus;
                                    })
                                    .map((order) => (
                                        <tr key={order.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="pl-6 font-mono text-xs font-bold text-blue-500">{toFriendlyOrderId(order.id)}</td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                        {order.customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-700 dark:text-gray-200">{order.customer.name}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">{order.source === 'manual' ? 'Manual' : 'Web'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-500 font-medium">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="font-bold text-gray-800 dark:text-white">
                                                {order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                            </td>
                                            <td><StatusBadge status={order.status} /></td>
                                            <td className="pr-6">
                                                <div className="flex justify-end gap-2 text-right">
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="btn btn-square btn-sm btn-outline hover:bg-blue-50 text-gray-600 hover:text-blue-600 border-gray-300"
                                                        title="Ver Detalhes"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <select
                                                        className="select select-bordered select-xs w-28 text-xs"
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <option value="pending">Pendente</option>
                                                        <option value="paid">Pago</option>
                                                        <option value="cancelled">Cancelado</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-24">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col relative">
                        {/* Header Fixed at top of modal content relative */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Pedido #{selectedOrder.id}</h3>
                                <p className="text-sm text-gray-500">{new Date(selectedOrder.date).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="btn btn-circle btn-sm bg-gray-100 hover:bg-gray-200 border-none text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                <div>
                                    <h4 className="text-sm font-bold uppercase text-gray-400">Ações Rápidas</h4>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                    <button onClick={handleSimulateEmail} className="btn btn-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 gap-2 flex-1 sm:flex-none">
                                        <Mail className="w-4 h-4" /> Email
                                    </button>
                                    <Link to={`/invoice/${selectedOrder.id}`} target="_blank" className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-none gap-2 flex-1 sm:flex-none">
                                        <Printer className="w-4 h-4" /> Fatura
                                    </Link>
                                    {selectedOrder.customer.phone && (
                                        <a
                                            href={`https://api.whatsapp.com/send?phone=${selectedOrder.customer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(
                                                `Olá ${selectedOrder.customer.name}, a sua fatura *#${toFriendlyOrderId(selectedOrder.id)}* no valor de *${selectedOrder.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}* está disponível. Pode consultá-la aqui: ${window.location.origin}/invoice/${selectedOrder.id}`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none gap-2 flex-1 sm:flex-none"
                                        >
                                            <Share2 className="w-4 h-4" /> WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex items-center gap-4 border border-gray-100 dark:border-gray-600">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">👤</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{selectedOrder.customer.name}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="text-sm font-bold uppercase text-gray-400 mb-3 tracking-wider">Itens do Pedido</h4>
                                <div className="space-y-3">
                                    {(selectedOrder.items || []).map((item, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{item.name}</span>
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {item.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                                </span>
                                            </div>
                                            {/* Manual License Input */}
                                            {selectedOrder.status === 'paid' ? (
                                                <div className="mt-2 text-xs">
                                                    <label className="label-text text-gray-400 text-[10px] uppercase font-bold mb-1 block">Chave de Licença</label>
                                                    <input
                                                        type="text"
                                                        className="input input-xs input-bordered w-full font-mono text-gray-600 bg-gray-50"
                                                        placeholder="Cole a chave aqui (AAAA-BBBB...)"
                                                        value={item.licenseKey || ''}
                                                        onChange={(e) => handleLicenseChange(idx, e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 italic">
                                                    * Confirme o pagamento para liberar a inserção de licença.
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {selectedOrder.status === 'paid' && (
                                    <div className="mt-4 flex justify-end">
                                        <button id="save-license-btn" onClick={saveLicenses} className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none gap-2 px-6">
                                            <Save className="w-4 h-4" /> Salvar Licenças
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="divider my-0"></div>

                            <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <span className="text-lg font-bold text-gray-600">Total</span>
                                <span className="text-2xl font-extrabold text-blue-600">
                                    {selectedOrder.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Manual Order Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0 bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Novo Pedido Manual</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="btn btn-circle btn-sm btn-ghost bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 border-none">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                            {/* 1. Cliente */}
                            <section>
                                <h4 className="text-sm font-bold uppercase text-gray-400 mb-3">1. Informações do Cliente</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">Selecionar Cliente Existente</label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={newOrderData.customerEmail}
                                            onChange={(e) => setNewOrderData({ ...newOrderData, customerEmail: e.target.value })}
                                        >
                                            <option value="">-- Manual / Balcão --</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.email}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">Nome (se manual)</label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            disabled={!!newOrderData.customerEmail}
                                            placeholder="Nome do Cliente"
                                            value={newOrderData.customerName}
                                            onChange={(e) => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-control col-span-1 md:col-span-2">
                                        <label className="label">Método de Pagamento</label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={newOrderData.paymentMethod}
                                            onChange={(e) => setNewOrderData({ ...newOrderData, paymentMethod: e.target.value })}
                                        >
                                            <option value="pos">POS (Cartão)</option>
                                            <option value="cash">Numerário</option>
                                            <option value="mpesa">E-Mola</option>
                                            <option value="bim">Transferência BIM</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="divider"></div>

                            {/* 2. Produtos */}
                            <section>
                                <h4 className="text-sm font-bold uppercase text-gray-400 mb-3">2. Selecionar Produtos</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                    {products.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleAddItem(product)}
                                            className="btn btn-outline btn-sm h-auto py-2 flex flex-col items-start gap-1 text-left hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                        >
                                            <span className="font-bold text-xs line-clamp-1">{product.name}</span>
                                            <span className="text-[10px] opacity-70">
                                                {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {/* Selected Items List */}
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                    <h5 className="font-bold text-sm mb-3">Itens Selecionados ({newOrderData.items.length})</h5>
                                    {newOrderData.items.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">Nenhum item adicionado.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {newOrderData.items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between items-center text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-600">
                                                    <span>{item.name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold">{item.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                                        <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </section>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500 uppercase font-bold">Total a Pagar</p>
                                <p className="text-2xl font-extrabold text-blue-600">{currentTotal.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</p>
                            </div>
                            <button
                                onClick={handleCreateOrder}
                                disabled={newOrderData.items.length === 0}
                                className="btn btn-primary text-white"
                            >
                                <Save className="w-5 h-5 mr-2" /> Confirmar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
