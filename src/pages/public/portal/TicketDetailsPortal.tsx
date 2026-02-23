import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTicketStore } from '../../../store/ticketStore';
import { useCustomerAuthStore } from '../../../store/customerAuthStore';
import {
    ChevronLeft, Clock, MessageSquare,
    AlertCircle, CheckCircle, Calendar,
    Tag, User, LifeBuoy, Send
} from 'lucide-react';

const TicketDetailsPortal = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { tickets, fetchTickets, addTicketNote } = useTicketStore();
    const { customerUser } = useCustomerAuthStore();

    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const ticket = tickets.find(t => t.id === ticketId || t.friendly_id === ticketId);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !ticket || !customerUser) return;

        setIsSending(true);
        await addTicketNote(ticket.id, {
            text: newMessage.trim(),
            author: customerUser.name,
            is_internal: false
        });
        setNewMessage('');
        setIsSending(false);
    };

    // Proteção: verificar se o ticket pertence ao utilizador logado
    if (ticket && ticket.customer.email !== customerUser?.email) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Acesso Negado</h2>
                    <p className="text-gray-500 mb-6">Não tem permissão para visualizar este ticket.</p>
                    <button onClick={() => navigate('/portal')} className="btn btn-primary rounded-xl">Voltar ao Dashboard</button>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Ticket não encontrado</h2>
                    <button onClick={() => navigate('/portal')} className="btn btn-ghost mt-4">Voltar</button>
                </div>
            </div>
        );
    }

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            'Novo': 'bg-blue-50 text-blue-600 border-blue-100',
            'Em Análise': 'bg-purple-50 text-purple-600 border-purple-100',
            'Aguardando Cliente': 'bg-amber-50 text-amber-600 border-amber-100',
            'Resolvido': 'bg-green-50 text-green-600 border-green-100',
            'Encerrado': 'bg-slate-50 text-slate-600 border-slate-200'
        };

        const icons: Record<string, React.ReactNode> = {
            'Novo': <Clock className="w-4 h-4" />,
            'Em Análise': <Clock className="w-4 h-4" />,
            'Aguardando Cliente': <AlertCircle className="w-4 h-4" />,
            'Resolvido': <CheckCircle className="w-4 h-4" />,
            'Encerrado': <CheckCircle className="w-4 h-4" />
        };

        return (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-xs ${styles[status] || styles['Novo']}`}>
                {icons[status] || icons['Novo']}
                {status}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans">
            <header className="bg-white border-b border-gray-100 px-6 py-6 sticky top-0 z-30">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/portal')}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" /> Voltar
                    </button>
                    <div className="flex items-center gap-3">
                        <LifeBuoy className="w-6 h-6 text-blue-600" />
                        <span className="font-black text-xl tracking-tight text-gray-900">Detalhes do Chamado</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow p-6 lg:p-12 max-w-5xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Ticket Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-mono font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg uppercase mb-3 inline-block">
                                        {ticket.friendly_id}
                                    </span>
                                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{ticket.subject}</h1>
                                </div>
                                <StatusBadge status={ticket.status} />
                            </div>

                            <div className="prose max-w-none text-gray-600 leading-relaxed mb-8">
                                <p className="whitespace-pre-wrap font-medium">{ticket.description}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-gray-50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Categoria</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                                        <Tag className="w-4 h-4 text-blue-500" /> {ticket.category}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Criado em</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                                        <Calendar className="w-4 h-4 text-blue-500" /> {new Date(ticket.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Prioridade</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                                        <AlertCircle className="w-4 h-4 text-amber-500" /> {ticket.priority}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Solicitante</span>
                                    <div className="flex items-center gap-2 text-gray-900 font-bold text-sm text-ellipsis overflow-hidden">
                                        <User className="w-4 h-4 text-blue-500" /> {ticket.customer.name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline / Updates */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-8">
                                <MessageSquare className="w-5 h-5 text-blue-600" /> Histórico de Atualizações
                            </h2>

                            <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:bg-gray-50">
                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center text-blue-600 z-10 shadow-sm">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-sm font-bold text-gray-900 mb-1">Abertura do Chamado</p>
                                        <p className="text-sm text-gray-500 mb-2">O seu pedido foi recebido pelo sistema e aguarda atribuição a um técnico.</p>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(ticket.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {ticket.status !== 'Novo' && (
                                    <div className="relative pl-12">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-amber-100 border-4 border-white flex items-center justify-center text-amber-600 z-10 shadow-sm">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                        <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                                            <p className="text-sm font-bold text-gray-900 mb-1">Estado atual: {ticket.status}</p>
                                            <p className="text-sm text-gray-500">Última atualização de progresso.</p>
                                        </div>
                                    </div>
                                )}

                                {ticket.notes && ticket.notes.filter(note => !note.is_internal).map((note, idx) => (
                                    <div key={idx} className="relative pl-12">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-blue-100 border-4 border-white flex items-center justify-center text-blue-600 z-10 shadow-sm">
                                            <MessageSquare className="w-4 h-4" />
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-sm font-bold text-gray-900">{note.author}</p>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(note.date).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chat Input */}
                            {ticket.status !== 'Resolvido' && ticket.status !== 'Cancelado' && ticket.status !== 'Encerrado' && (
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <form onSubmit={handleSendMessage} className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                                            {customerUser?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                placeholder="Escreva a sua mensagem para a equipa..."
                                                className="input input-bordered w-full pr-12 rounded-2xl bg-gray-50 focus:bg-white transition-colors h-12"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                disabled={isSending}
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-ghost btn-square btn-sm absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:bg-blue-50"
                                                disabled={!newMessage.trim() || isSending}
                                            >
                                                {isSending ? <span className="loading loading-spinner loading-xs"></span> : <Send className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Actions & Support */}
                    <div className="space-y-6">
                        {ticket.status === 'Resolvido' && (
                            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl shadow-sm relative overflow-hidden text-center">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                <h3 className="text-lg font-black text-emerald-900 mb-2">O seu problema foi resolvido?</h3>
                                <p className="text-emerald-700 text-sm mb-4">
                                    A equipa técnica marcou este chamado como resolvido. Se confirmar a resolução, encerre o chamado.
                                </p>
                                <button
                                    onClick={async () => {
                                        const { useTicketStore } = await import('../../../store/ticketStore');
                                        await useTicketStore.getState().updateTicketStatus(ticket.id, 'Encerrado');
                                        await addTicketNote(ticket.id, {
                                            text: 'O Chamado foi formalmente encerrado pelo cliente.',
                                            author: customerUser?.name || 'Cliente',
                                            is_internal: false
                                        });
                                    }}
                                    className="btn w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-none shadow-md rounded-xl"
                                >
                                    Confirmar e Encerrar
                                </button>
                            </div>
                        )}

                        <div className="bg-blue-600 p-8 rounded-3xl shadow-xl shadow-blue-100 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-2">Alguma dúvida?</h3>
                                <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                    Se precisar de uma resposta rápida, entre em contacto via WhatsApp referindo o ID do chamado.
                                </p>
                                <a
                                    href={`https://wa.me/2588491000?text=${encodeURIComponent(`Olá, estou com uma dúvida sobre o meu chamado *${ticket.friendly_id}*`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white text-blue-600 px-6 py-3 rounded-2xl font-black text-sm inline-block shadow-lg hover:scale-105 transition-transform w-full text-center"
                                >
                                    Falar com Técnico
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">Informação de Conta</h3>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm mx-auto mb-3 text-xl">
                                        {customerUser?.name?.charAt(0)}
                                    </div>
                                    <p className="font-bold text-gray-900">{customerUser?.name}</p>
                                    <p className="text-xs text-gray-500">{customerUser?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TicketDetailsPortal;
