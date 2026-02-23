import React, { useState, useEffect } from 'react';
import { useTicketStore } from '../../store/ticketStore';
import type { Ticket } from '../../store/ticketStore';
import { useCustomerStore } from '../../store/customerStore';
import { useTechnicianStore } from '../../store/technicianStore';
import { useAuthStore } from '../../store/authStore';
import { useLocation } from 'react-router-dom';
import {
    LifeBuoy, Search, Plus, Eye,
    CheckCircle, X, Send,
    Share2, MessageSquare
} from 'lucide-react';

const Tickets = () => {
    const { tickets, updateTicketStatus, addTicket, addTicketNote, assignTicket } = useTicketStore();
    const { customers } = useCustomerStore();
    const { technicians, fetchTechnicians } = useTechnicianStore();
    const { user } = useAuthStore();
    const location = useLocation();

    React.useEffect(() => {
        if (technicians.length === 0) {
            fetchTechnicians();
        }
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newNote, setNewNote] = useState('');

    // Handle Auto-open from Dashboard Link
    useEffect(() => {
        if (location.state?.openTicketId && tickets.length > 0) {
            const ticketToOpen = tickets.find(t => t.id === location.state.openTicketId);
            if (ticketToOpen) {
                setSelectedTicket(ticketToOpen);
                // Clear state so it doesn't re-open on refresh
                window.history.replaceState({}, document.title);
            }
        }
    }, [location.state, tickets]);

    // Form for new ticket
    const [newTicketData, setNewTicketData] = useState({
        customerEmail: '',
        subject: '',
        category: 'Outro' as Ticket['category'],
        priority: 'Média' as Ticket['priority'],
        description: ''
    });

    const categories: Ticket['category'][] = ['Hardware', 'Software', 'Rede', 'Impressora', 'Outro'];
    const priorities: Ticket['priority'][] = ['Baixa', 'Média', 'Alta', 'Crítica'];
    const statuses: Ticket['status'][] = ['Novo', 'Em Análise', 'Aguardando Cliente', 'Resolvido', 'Encerrado', 'Cancelado'];

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        const customer = customers.find(c => c.email === newTicketData.customerEmail);

        addTicket({
            customer: customer || { name: 'Cliente Manual', email: newTicketData.customerEmail },
            subject: newTicketData.subject,
            category: newTicketData.category,
            priority: newTicketData.priority,
            description: newTicketData.description
        });

        setIsCreateModalOpen(false);
        setNewTicketData({ customerEmail: '', subject: '', category: 'Outro', priority: 'Média', description: '' });
    };

    const handleAddNote = () => {
        if (!selectedTicket || !newNote.trim()) return;
        addTicketNote(selectedTicket.id, {
            text: newNote,
            author: user?.name || 'Sistema',
            is_internal: false
        });
        setNewNote('');
    };

    const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
        const styles = {
            'Novo': 'bg-blue-100 text-blue-700 border-blue-200',
            'Em Análise': 'bg-purple-100 text-purple-700 border-purple-200',
            'Aguardando Cliente': 'bg-amber-100 text-amber-700 border-amber-200',
            'Resolvido': 'bg-green-100 text-green-700 border-green-200',
            'Encerrado': 'bg-slate-100 text-slate-700 border-slate-200',
            'Cancelado': 'bg-gray-100 text-gray-700 border-gray-200'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
                {status}
            </span>
        );
    };

    const PriorityBadge = ({ priority }: { priority: Ticket['priority'] }) => {
        const styles = {
            'Baixa': 'text-gray-400',
            'Média': 'text-blue-500',
            'Alta': 'text-amber-500',
            'Crítica': 'text-red-500 font-black'
        };
        return <span className={`text-[10px] uppercase font-bold ${styles[priority]}`}>{priority}</span>;
    };

    return (
        <>
            <div className="animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1 flex items-center gap-3">
                            <LifeBuoy className="w-8 h-8 text-blue-500" /> Helpdesk
                        </h1>
                        <p className="text-gray-500 text-sm">Gerencie os pedidos de suporte técnico dos seus clientes.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg gap-2 rounded-xl"
                    >
                        <Plus className="w-5 h-5" /> Abrir Chamado
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar por assunto ou cliente..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="select select-bordered w-full rounded-xl bg-white dark:bg-gray-800"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos os Estados</option>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                {/* Tickets Table */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="pl-6 text-xs uppercase text-gray-400">ID</th>
                                    <th className="text-xs uppercase text-gray-400">Assunto / Cliente</th>
                                    <th className="text-xs uppercase text-gray-400">Categoria</th>
                                    <th className="text-xs uppercase text-gray-400">Prioridade</th>
                                    <th className="text-xs uppercase text-gray-400">Atribuído A</th>
                                    <th className="text-xs uppercase text-gray-400">Estado</th>
                                    <th className="text-xs uppercase text-gray-400 text-right pr-6">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {tickets
                                    .filter(t => {
                                        const matchSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            t.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchStatus = statusFilter === 'all' || t.status === statusFilter;
                                        return matchSearch && matchStatus;
                                    })
                                    .map((ticket) => (
                                        <tr key={ticket.id} className="group hover:bg-gray-50 transition-all">
                                            <td className="pl-6 font-mono text-xs font-bold text-blue-500">{ticket.friendly_id}</td>
                                            <td>
                                                <div>
                                                    <div className="font-bold text-gray-800 dark:text-gray-200">{ticket.subject}</div>
                                                    <div className="text-[10px] text-gray-400">{ticket.customer.name}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">
                                                    {ticket.category}
                                                </span>
                                            </td>
                                            <td><PriorityBadge priority={ticket.priority} /></td>
                                            <td>
                                                {ticket.technician ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                                                            {ticket.technician.name.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-600">{ticket.technician.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Não atribuído</span>
                                                )}
                                            </td>
                                            <td><StatusBadge status={ticket.status} /></td>
                                            <td className="pr-6 text-right">
                                                <button
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="btn btn-square btn-sm btn-ghost text-blue-600"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
                    <div
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-in zoom-in duration-200"
                        style={{ height: '85vh' }}
                    >
                        {/* Header (Fixo) */}
                        <div className="p-5 border-b flex justify-between items-start shrink-0 bg-gray-50 dark:bg-gray-700 relative pr-12">
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h3 className="text-xl font-bold truncate">{selectedTicket.friendly_id}</h3>
                                    <StatusBadge status={selectedTicket.status} />
                                </div>
                                <p className="text-sm font-medium text-gray-500 uppercase truncate">{selectedTicket.category}</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="btn btn-circle btn-sm btn-ghost absolute top-5 right-5 shrink-0" title="Fechar">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Corpo (Scrollable Internamente) */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50/30">

                            {/* Bloco 1: Assunto e Descrição */}
                            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="text-lg font-black text-gray-900 mb-3">{selectedTicket.subject}</h4>
                                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-sm text-gray-700 whitespace-pre-line">{selectedTicket.description}</p>
                                </div>
                            </section>

                            {/* Bloco 2: Controlos Rápidos (Painel Dividido) */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Responsável Técnico</span>
                                    <select
                                        className="select select-bordered select-sm w-full font-medium rounded-lg"
                                        value={selectedTicket.assigned_to || ''}
                                        onChange={(e) => {
                                            const techId = e.target.value || null;
                                            assignTicket(selectedTicket.id, techId);
                                            setSelectedTicket({ ...selectedTicket, assigned_to: techId });
                                        }}
                                    >
                                        <option value="">Não Atribuído</option>
                                        {technicians.map(tech => (
                                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Mudar Estado</span>
                                    <select
                                        className="select select-bordered select-sm w-full rounded-lg"
                                        value={selectedTicket.status}
                                        onChange={(e) => updateTicketStatus(selectedTicket.id, e.target.value as any)}
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                            {selectedTicket.customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-tight truncate">{selectedTicket.customer.name}</p>
                                        </div>
                                    </div>
                                    {selectedTicket.customer.phone && (
                                        <div className="flex gap-1 shrink-0">
                                            <a
                                                href={`https://api.whatsapp.com/send?phone=${selectedTicket.customer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(
                                                    `Olá *${selectedTicket.customer.name}*, aqui é da *Aster Suporte*.\nEstamos a entrar em contacto sobre o chamado *${selectedTicket.friendly_id}*.`
                                                )}`}
                                                target="_blank" rel="noreferrer"
                                                className="btn btn-circle btn-sm bg-green-500 hover:bg-green-600 text-white border-none"
                                                title="WhatsApp"
                                            >
                                                <Share2 className="w-3 h-3" />
                                            </a>
                                            {selectedTicket.status === 'Resolvido' && (
                                                <a
                                                    href={`https://api.whatsapp.com/send?phone=${selectedTicket.customer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(
                                                        `Olá *${selectedTicket.customer.name}*!\nO seu chamado *${selectedTicket.friendly_id}* foi *RESOLVIDO*.`
                                                    )}`}
                                                    target="_blank" rel="noreferrer"
                                                    className="btn btn-circle btn-sm bg-blue-500 hover:bg-blue-600 text-white border-none"
                                                    title="Notificar Fecho"
                                                >
                                                    <CheckCircle className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bloco 3: Chat/Histórico da Conversa Integrado */}
                            <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="text-sm font-bold uppercase text-gray-400 mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-blue-500" /> Conversa e Resoluções
                                </h4>

                                {(!selectedTicket.notes || selectedTicket.notes.length === 0) ? (
                                    <div className="py-6 text-center text-sm text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        Sem mensagens nesta thread. Envie a primeira resposta!
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {selectedTicket.notes.map((note: any, idx: number) => {
                                            const isMe = note.author === user?.name || note.author === 'Sistema';
                                            return (
                                                <div key={idx} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                                    <span className={`text-[10px] font-bold mb-1 ${isMe ? 'text-blue-500' : 'text-gray-500'}`}>
                                                        {note.author} <span className="font-normal text-gray-400">• {new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </span>
                                                    <div className={`p-3.5 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'}`}>
                                                        {note.text}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Rodapé (Caixa Fixa de Mensagem) */}
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            <form
                                className="flex gap-2"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAddNote();
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder="Responder ao cliente (Shift+Enter p/ nova linha)..."
                                    className="input input-bordered flex-1 rounded-xl bg-gray-50 focus:bg-white text-sm"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="btn bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl px-6 shadow-md"
                                    disabled={!newNote.trim()}
                                >
                                    <Send className="w-4 h-4" /> <span className="hidden sm:inline">Enviar</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
                    <form onSubmit={handleCreateTicket} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center shrink-0 relative pr-12">
                            <h3 className="text-2xl font-bold truncate">Novo Chamado</h3>
                            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-circle btn-sm btn-ghost absolute top-6 right-6 shrink-0">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase text-gray-400">E-mail do Cliente</label>
                                <input
                                    type="email"
                                    className="input input-bordered rounded-xl"
                                    required
                                    value={newTicketData.customerEmail}
                                    onChange={(e) => setNewTicketData({ ...newTicketData, customerEmail: e.target.value })}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase text-gray-400">Assunto</label>
                                <input
                                    type="text"
                                    className="input input-bordered rounded-xl"
                                    required
                                    value={newTicketData.subject}
                                    onChange={(e) => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-xs font-bold uppercase text-gray-400">Categoria</label>
                                    <select
                                        className="select select-bordered rounded-xl"
                                        value={newTicketData.category}
                                        onChange={(e) => setNewTicketData({ ...newTicketData, category: e.target.value as any })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label text-xs font-bold uppercase text-gray-400">Prioridade</label>
                                    <select
                                        className="select select-bordered rounded-xl"
                                        value={newTicketData.priority}
                                        onChange={(e) => setNewTicketData({ ...newTicketData, priority: e.target.value as any })}
                                    >
                                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label text-xs font-bold uppercase text-gray-400">Descrição do Problema</label>
                                <textarea
                                    className="textarea textarea-bordered rounded-xl h-32"
                                    required
                                    value={newTicketData.description}
                                    onChange={(e) => setNewTicketData({ ...newTicketData, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end shrink-0">
                            <button type="submit" className="btn bg-blue-600 text-white border-none rounded-xl px-8 shadow-lg">
                                Criar Chamado
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Tickets;
