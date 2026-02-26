import React, { useState, useEffect } from 'react';
import { useQuoteStore } from '../../store/quoteStore';
import { useOrderStore } from '../../store/orderStore';
import { useCustomerStore } from '../../store/customerStore';
import { useProductStore } from '../../store/productStore';
import { Link } from 'react-router-dom';
import { Eye, Clock, CheckCircle, XCircle, Plus, FileText, X, Save, Trash2, Printer, Search, ArrowRight, Share2 } from 'lucide-react';
import { toFriendlyOrderId } from '../../utils/friendlyId';

const Quotes = () => {
    const { quotes, updateQuoteStatus, addQuote, deleteQuote } = useQuoteStore();
    const { addOrder } = useOrderStore();
    const { customers } = useCustomerStore();
    const { products } = useProductStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
    const [convertedToast, setConvertedToast] = useState(false);

    // Scroll adjustments for modal
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

    // Form State for New Manual Quote
    const [newQuoteData, setNewQuoteData] = useState({
        customerEmail: '',
        customerName: '',
        validityDays: 15,
        items: []
    });

    const currentSubtotal = newQuoteData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const currentTax = currentSubtotal * 0.16;
    const currentTotal = currentSubtotal + currentTax;

    const handleAddItem = (product) => {
        setNewQuoteData(prev => ({
            ...prev,
            items: [...prev.items, { ...product, id: Date.now(), quantity: 1 }]
        }));
    };

    const handleRemoveItem = (index) => {
        setNewQuoteData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleCreateQuote = (e) => {
        e.preventDefault();

        const customer = customers.find(c => c.email === newQuoteData.customerEmail) || {
            name: newQuoteData.customerName || "Novo Cliente",
            email: newQuoteData.customerName ? "proforma@aster.co.mz" : "balcao@aster.co.mz"
        };

        addQuote({
            items: newQuoteData.items,
            customer: customer,
            validityDays: newQuoteData.validityDays
        });

        setIsCreateModalOpen(false);
        setNewQuoteData({ customerEmail: '', customerName: '', validityDays: 15, items: [] });
    };

    const handleConvertToOrder = () => {
        if (!selectedQuote) return;

        // Convert the quote into a real Order
        addOrder({
            items: selectedQuote.items,
            total: selectedQuote.total,
            customer: selectedQuote.customer,
            paymentMethod: 'bank_transfer', // Default for B2B
            source: 'quote_conversion'
        });

        // Mark quote as approved
        updateQuoteStatus(selectedQuote.id, 'approved');

        // Show toast
        setConvertedToast(true);
        setTimeout(() => setConvertedToast(false), 3000);
        setSelectedQuote(null);
    };

    const handleDeleteQuote = () => {
        if (!selectedQuote) return;
        if (window.confirm("Tem a certeza que deseja eliminar esta cotação?")) {
            deleteQuote(selectedQuote.id);
            setSelectedQuote(null);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            approved: "bg-green-100 text-green-700 border-green-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            rejected: "bg-red-100 text-red-700 border-red-200"
        };
        const icons = {
            approved: <CheckCircle className="w-3 h-3" />,
            pending: <Clock className="w-3 h-3" />,
            rejected: <XCircle className="w-3 h-3" />
        };

        const labels = {
            approved: 'Aprovada',
            pending: 'Pendente',
            rejected: 'Rejeitada'
        };

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.pending}`}>
                {icons[status] || icons.pending}
                {labels[status]}
            </span>
        );
    };

    return (
        <div className="animate-fade-in-up">
            {/* Convert Success Toast */}
            {convertedToast && (
                <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4">
                    <div className="alert alert-success text-white shadow-xl flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Espetáculo! Cotação convertida num Pedido de Faturação com sucesso.</span>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Cotações</h1>
                    <p className="text-gray-500 text-sm">Gere propostas comerciais (Proformas) para os seus clientes.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-none shadow-lg shadow-purple-200 dark:shadow-none gap-2 hover:shadow-xl hover:scale-105 transition-all rounded-xl font-bold"
                    >
                        <Plus className="w-5 h-5" /> Nova Cotação
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar por cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl h-[52px]">
                    {[
                        { id: 'all', label: 'Todas' },
                        { id: 'pending', label: 'Pendentes' },
                        { id: 'approved', label: 'Aprovadas' },
                        { id: 'rejected', label: 'Rejeitadas' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${statusFilter === tab.id ? 'bg-white dark:bg-gray-800 text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quotes Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {quotes.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-purple-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-600">Nenhuma cotação gerada</h3>
                        <p className="text-gray-400">Clique em "Nova Cotação" para começar a enviar propostas B2B.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="pl-6 text-xs font-bold uppercase text-gray-400">ID</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Cliente</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Data</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Validade</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Total</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Estado</th>
                                    <th className="text-xs font-bold uppercase text-gray-400 text-right pr-6">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {quotes
                                    .filter((quote) => {
                                        const matchesSearch = !searchQuery.trim() ||
                                            quote.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
                                        return matchesSearch && matchesStatus;
                                    })
                                    .map((quote) => {
                                        const expiryDate = new Date(quote.date);
                                        expiryDate.setDate(expiryDate.getDate() + quote.validityDays);
                                        const isExpired = new Date() > expiryDate && quote.status === 'pending';

                                        return (
                                            <tr key={quote.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="pl-6 font-mono text-xs font-bold text-purple-500">{quote.id}</td>
                                                <td>
                                                    <div className="font-bold text-gray-700 dark:text-gray-200">{quote.customer?.name}</div>
                                                </td>
                                                <td className="text-sm text-gray-500 font-medium">{new Date(quote.date).toLocaleDateString()}</td>
                                                <td className="text-sm">
                                                    {isExpired ? (
                                                        <span className="text-red-500 font-bold text-xs flex items-center gap-1"><XCircle className="w-3 h-3" /> Expirada</span>
                                                    ) : (
                                                        <span className="text-gray-500">{quote.validityDays} dias</span>
                                                    )}
                                                </td>
                                                <td className="font-bold text-gray-800 dark:text-white">
                                                    {quote.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                                </td>
                                                <td><StatusBadge status={quote.status} /></td>
                                                <td className="pr-6">
                                                    <div className="flex justify-end gap-2 text-right">
                                                        <button
                                                            onClick={() => setSelectedQuote(quote)}
                                                            className="btn btn-square btn-sm btn-outline hover:bg-purple-50 text-gray-600 hover:text-purple-600 border-gray-300"
                                                            title="Ver Cotação / Opções"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Quote Details Modal */}
            {selectedQuote && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-24">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col relative">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Cotação {selectedQuote.id}</h3>
                                <StatusBadge status={selectedQuote.status} />
                            </div>
                            <button onClick={() => setSelectedQuote(null)} className="btn btn-circle btn-sm bg-gray-100 hover:bg-gray-200 border-none text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Conversion Action */}
                            {selectedQuote.status === 'pending' && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 text-center space-y-3">
                                    <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">O cliente aprovou a proposta?</p>
                                    <button onClick={handleConvertToOrder} className="btn w-full bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md">
                                        <ArrowRight className="w-5 h-5" /> Converter em Pedido (Fatura)
                                    </button>
                                    <div className="flex justify-center gap-2 mt-2">
                                        <button onClick={() => { updateQuoteStatus(selectedQuote.id, 'rejected'); setSelectedQuote(null); }} className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50">
                                            Rejeitar Cotação
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-between items-center gap-4 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                <Link to={`/invoice/${selectedQuote.id}?type=quote`} target="_blank" className="btn btn-sm bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 gap-2 flex-1">
                                    <Printer className="w-4 h-4" /> Ver / Imprimir Proforma
                                </Link>
                                {selectedQuote.customer?.phone && (
                                    <a
                                        href={`https://api.whatsapp.com/send?phone=${selectedQuote.customer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(
                                            `Olá ${selectedQuote.customer.name}, a sua cotação *#${selectedQuote.id}* no valor de *${selectedQuote.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}* está disponível. Pode consultá-la aqui: ${window.location.origin}/invoice/${selectedQuote.id}?type=quote`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm bg-green-500 hover:bg-green-600 text-white border-none gap-2 flex-1 sm:flex-none"
                                    >
                                        <Share2 className="w-4 h-4" /> WhatsApp
                                    </a>
                                )}
                                <button onClick={handleDeleteQuote} className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 flex-none px-2" title="Apagar">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl flex items-center gap-4 border border-gray-100">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">🏢</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{selectedQuote.customer?.name}</p>
                                    <p className="text-sm text-gray-500">{selectedQuote.customer?.email}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 className="text-sm font-bold uppercase text-gray-400 mb-3 tracking-wider">Serviços e Produtos</h4>
                                <div className="space-y-3">
                                    {(selectedQuote.items || []).map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                                {item.quantity}x {item.name}
                                            </span>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                {(item.price * item.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="divider my-0"></div>

                            {/* Breakdown */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>{selectedQuote.subtotal?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>IVA (16%)</span>
                                    <span>{selectedQuote.tax?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200">
                                    <span className="text-lg font-bold text-gray-600">Total</span>
                                    <span className="text-xl font-extrabold text-purple-600">
                                        {selectedQuote.total?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Quote Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-10 md:pt-16 pb-10">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0 bg-gray-50 dark:bg-gray-800">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Nova Cotação (Proforma)</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="btn btn-circle btn-sm btn-ghost bg-gray-200 hover:bg-gray-300 border-none">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                            <section>
                                <h4 className="text-sm font-bold uppercase text-gray-400 mb-3">1. Detalhes Básicos</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label">Cliente Existente</label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={newQuoteData.customerEmail}
                                            onChange={(e) => setNewQuoteData({ ...newQuoteData, customerEmail: e.target.value })}
                                        >
                                            <option value="">-- Novo Cliente / Empresa --</option>
                                            {customers.map(c => (
                                                <option key={c.id} value={c.email}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-control">
                                        <label className="label">Nome da Empresa (se novo)</label>
                                        <input
                                            type="text"
                                            className="input input-bordered w-full"
                                            disabled={!!newQuoteData.customerEmail}
                                            placeholder="Ex: Escola X"
                                            value={newQuoteData.customerName}
                                            onChange={(e) => setNewQuoteData({ ...newQuoteData, customerName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-control col-span-1 md:col-span-2">
                                        <label className="label">Validade (em dias)</label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={newQuoteData.validityDays}
                                            onChange={(e) => setNewQuoteData({ ...newQuoteData, validityDays: parseInt(e.target.value) })}
                                        >
                                            <option value={7}>7 Dias</option>
                                            <option value={15}>15 Dias</option>
                                            <option value={30}>30 Dias</option>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <div className="divider"></div>

                            <section>
                                <h4 className="text-sm font-bold uppercase text-gray-400 mb-3">2. Adicionar Itens</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                    {products.map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => handleAddItem(product)}
                                            className="btn btn-outline btn-sm h-auto py-2 flex flex-col items-start gap-1 text-left hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                                        >
                                            <span className="font-bold text-xs line-clamp-1">{product.name}</span>
                                            <span className="text-[10px] opacity-70">
                                                {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                                    <h5 className="font-bold text-sm mb-3">Linhas de Orçamento ({newQuoteData.items.length})</h5>
                                    {newQuoteData.items.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">Clique nos produtos acima para adicionar à cotação.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {newQuoteData.items.map((item, idx) => (
                                                <li key={idx} className="flex justify-between items-center text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-600">
                                                    <span>1x {item.name}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold">{(item.price * item.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
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
                                <p className="text-sm text-gray-500 uppercase font-bold">Total Previsto (+IVA)</p>
                                <p className="text-2xl font-extrabold text-purple-600">{currentTotal.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</p>
                            </div>
                            <button
                                onClick={handleCreateQuote}
                                disabled={newQuoteData.items.length === 0}
                                className="btn bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md"
                            >
                                <Save className="w-5 h-5 mr-2" /> Gravar Cotação
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quotes;
