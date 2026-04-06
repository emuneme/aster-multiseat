import React, { useState, useEffect } from 'react';
import { useContractStore } from '../../store/contractStore';
import { useQuoteStore } from '../../store/quoteStore';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { FileText, Plus, Search, Eye, CheckCircle, Clock, XCircle, Printer, Calendar } from 'lucide-react';

const Contracts = () => {
    const { contracts, fetchContracts, addContract } = useContractStore();
    const updateContractStatus = useContractStore(state => state.updateContractStatus);
    const { quotes, fetchQuotes } = useQuoteStore();
    const { user } = useAuthStore();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const statuses = ['Minuta', 'Em Revisão', 'Assinado', 'Terminado', 'Cancelado'];

    useEffect(() => {
        fetchContracts();
        if (quotes.length === 0) fetchQuotes();
    }, []);

    // Form for new contract (picking an approved quote)
    const [selectedQuoteId, setSelectedQuoteId] = useState('');
    const [validUntil, setValidUntil] = useState('');
    const [monthlyValue, setMonthlyValue] = useState(0);

    const approvedQuotes = quotes.filter(q => q.status === 'approved');

    const handleCreateContract = async (e) => {
        e.preventDefault();
        const quote = quotes.find(q => q.id === selectedQuoteId);
        if (!quote) return;

        let validCustomerId = quote.customer?.id || null;
        if (validCustomerId && validCustomerId.length !== 36) {
            validCustomerId = null;
        }

        const newContract = await addContract({
            quote_id: quote.id,
            customer_id: validCustomerId,
            customer_snapshot: quote.customer || {},
            manager_id: user?.role === 'technician' ? user.id : null,
            status: 'Minuta',
            clauses: [
                { title: "1. Objeto", text: "Prestação de serviços de suporte técnico..." },
                { title: "2. Prazo", text: `O presente contrato é válido até ${new Date(validUntil).toLocaleDateString()}` },
                { title: "3. Valores", text: `Fica acordado o valor mensal de ${Number(monthlyValue).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}` }
            ],
            valid_until: new Date(validUntil).toISOString(),
            monthly_value: Number(monthlyValue)
        });

        if (newContract) {
            setIsCreateModalOpen(false);
            setSelectedQuoteId('');
            setValidUntil('');
            setMonthlyValue(0);
        } else {
            alert("Ocorreu um erro ao gerar a minuta. Por favor, verifique se a cotação é válida.");
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            'Minuta': "bg-gray-100 text-gray-700 border-gray-200",
            'Em Revisão': "bg-amber-100 text-amber-700 border-amber-200",
            'Assinado': "bg-green-100 text-green-700 border-green-200",
            'Terminado': "bg-blue-100 text-blue-700 border-blue-200",
            'Cancelado': "bg-red-100 text-red-700 border-red-200"
        };
        const icons = {
            'Assinado': <CheckCircle className="w-3 h-3" />,
            'Minuta': <FileText className="w-3 h-3" />,
            'Em Revisão': <Clock className="w-3 h-3" />,
            'Terminado': <CheckCircle className="w-3 h-3" />,
            'Cancelado': <XCircle className="w-3 h-3" />
        };

        return (
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
                {icons[status]} {status}
            </span>
        );
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-2">
                        <FileText className="w-8 h-8 text-blue-500" /> Contratos Fixos
                    </h1>
                    <p className="text-gray-500 text-sm">Gere os contratos de prestação de serviços (Avenças/SLAs).</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg gap-2 rounded-xl font-bold"
                    >
                        <Plus className="w-5 h-5" /> Novo Contrato
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Pesquisar contrato / cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    />
                </div>
                <select
                    className="select select-bordered w-full sm:w-auto rounded-xl bg-white dark:bg-gray-800"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">Todos os Estados</option>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {contracts.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-blue-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-600">Nenhum contrato gerado</h3>
                        <p className="text-gray-400">Clique em "Novo Contrato" para iniciar uma minuta a partir de uma cotação.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="pl-6 text-xs font-bold uppercase text-gray-400">ID Contrato</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Cliente</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Validade</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Valor Mensal</th>
                                    <th className="text-xs font-bold uppercase text-gray-400">Estado</th>
                                    <th className="text-xs font-bold uppercase text-gray-400 text-right pr-6">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {contracts
                                    .filter(c => {
                                        const matchSearch = !searchQuery.trim() || c.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
                                        return matchSearch && matchStatus;
                                    })
                                    .map(contract => (
                                        <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="pl-6 font-mono text-xs font-bold text-blue-600">{contract.friendly_id}</td>
                                            <td>
                                                <div className="font-bold text-gray-800">{contract.customer?.name || 'Vazio'}</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {contract.valid_until ? new Date(contract.valid_until).toLocaleDateString() : 'Sem prazo'}
                                                </div>
                                            </td>
                                            <td className="font-bold text-gray-800">
                                                {contract.monthly_value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                            </td>
                                            <td>
                                                <select
                                                    className="select select-bordered select-sm text-xs font-bold rounded-full w-full max-w-[130px]"
                                                    value={contract.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        updateContractStatus(contract.id, newStatus).catch(err => console.error(err));
                                                    }}
                                                >
                                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                            <td className="pr-6 text-right">
                                                <Link
                                                    to={`/contract/${contract.id}`}
                                                    target="_blank"
                                                    className="btn btn-sm btn-outline text-gray-600 hover:bg-blue-50 border-gray-200"
                                                >
                                                    <Printer className="w-4 h-4" /> PDF
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <form onSubmit={handleCreateContract} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold">Início de Novo Contrato</h3>
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-circle btn-sm btn-ghost">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase text-gray-400">Cotação Aprovada (Orçamento Base)</label>
                                <select
                                    required
                                    className="select select-bordered rounded-xl"
                                    value={selectedQuoteId}
                                    onChange={(e) => setSelectedQuoteId(e.target.value)}
                                >
                                    <option value="">Selecione a cotação vinculada...</option>
                                    {approvedQuotes.map(q => (
                                        <option key={q.id} value={q.id}>{q.id} - {q.customer?.name} ({q.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })})</option>
                                    ))}
                                </select>
                                {approvedQuotes.length === 0 && (
                                    <label className="label text-xs text-red-500">Nenhuma cotação aprovada disponível. Aprove uma primeiro.</label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase text-gray-400">Validade Máxima (Prazo)</label>
                                <input
                                    type="date"
                                    required
                                    className="input input-bordered rounded-xl"
                                    value={validUntil}
                                    onChange={(e) => setValidUntil(e.target.value)}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase text-gray-400">Valor Acordado Mensal (SLA)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">MZN</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="input input-bordered w-full pl-14 rounded-xl"
                                        value={monthlyValue}
                                        onChange={(e) => setMonthlyValue(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end">
                            <button type="submit" disabled={!selectedQuoteId} className="btn bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-lg">
                                Gerar Minuta Contratual
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Contracts;
