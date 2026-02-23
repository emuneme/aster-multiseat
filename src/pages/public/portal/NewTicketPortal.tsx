import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuthStore } from '../../../store/customerAuthStore';
import { useTicketStore } from '../../../store/ticketStore';
import { useNotificationStore } from '../../../store/notificationStore';
import type { Ticket } from '../../../store/ticketStore';
import {
    ChevronLeft, Send, AlertCircle,
    Monitor, Globe, LifeBuoy
} from 'lucide-react';

const NewTicketPortal = () => {
    const { customerUser } = useCustomerAuthStore();
    const { addTicket } = useTicketStore();
    const { addNotification } = useNotificationStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        category: 'Outro' as Ticket['category'],
        description: '',
        priority: 'Média' as Ticket['priority']
    });

    const categories = [
        { id: 'Hardware', label: 'Problema de Hardware', icon: <Monitor className="w-5 h-5" /> }, // Changed icon to Monitor as HardDrive is removed
        { id: 'Software', label: 'Problema de Software', icon: <Monitor className="w-5 h-5" /> },
        { id: 'Rede', label: 'Problema de Rede', icon: <Globe className="w-5 h-5" /> },
        { id: 'Outro', label: 'Outra Questão', icon: <Monitor className="w-5 h-5" /> } // Changed icon to Monitor as HelpCircle is removed
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerUser) return;

        setLoading(true);
        // Simular envio
        setTimeout(async () => {
            await addTicket({
                customer: {
                    name: customerUser.name,
                    email: customerUser.email,
                    phone: customerUser.phone
                },
                customer_id: customerUser.id,
                subject: formData.subject,
                description: formData.description,
                category: formData.category,
                priority: formData.priority
            });

            // Trigger Admin Notification
            addNotification({
                type: 'new_ticket',
                title: 'Novo Chamado Aberto',
                message: `[${formData.priority.toUpperCase()}] ${customerUser.name} relatou um problema de ${formData.category}.`
            });

            setIsSuccess(true);
            setLoading(false);
            // navigate('/portal'); // Removed direct navigation after success
        }, 1000);
    };

    // Redirecionar se não estiver autenticado
    if (!customerUser) {
        navigate('/portal/login');
        return null;
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 font-sans">
                <div className="text-center animate-in zoom-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Chamado Aberto!</h1>
                    <p className="text-gray-500 mb-8">A nossa equipa já foi notificada e entrará em contacto em breve.</p>
                    <button
                        onClick={() => navigate('/portal')}
                        className="btn bg-blue-600 hover:bg-blue-700 text-white border-none h-14 px-10 rounded-2xl shadow-xl shadow-blue-200 gap-2 text-lg font-bold"
                    >
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-6 py-6 sticky top-0 z-30">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/portal')}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" /> Voltar ao Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <LifeBuoy className="w-6 h-6 text-blue-600" />
                        <span className="font-black text-xl tracking-tight text-gray-900">Aster Support</span>
                    </div>
                </div>
            </header>

            <main className="flex-grow p-6 lg:p-12 max-w-3xl mx-auto w-full">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Novo Pedido de Suporte</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Descreva o problema com o máximo de detalhe possível para que possamos ajudar rapidamente.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Category Selection */}
                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">Em que área precisa de ajuda?</label>
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.id as any })}
                                    className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 ${formData.category === cat.id
                                        ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-50'
                                        : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                        }`}
                                >
                                    {cat.icon}
                                    <span className="font-bold text-sm">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest">Resumo do Problema (Assunto)</label>
                        <input
                            type="text"
                            placeholder="Ex: O e-mail não sincroniza no Outlook"
                            className="input input-bordered w-full h-14 rounded-2xl focus:ring-2 focus:ring-blue-500 border-gray-200 font-medium"
                            required
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase text-gray-400 tracking-widest">Descrição Detalhada</label>
                        <textarea
                            placeholder="Descreva o que aconteceu, quando começou e se houveram mudanças recentes..."
                            className="textarea textarea-bordered w-full h-48 rounded-2xl focus:ring-2 focus:ring-blue-500 border-gray-200 font-medium py-4 text-base"
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    {/* Submit Section */}
                    <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>Tempo médio de resposta: 2 a 4 horas úteis.</span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn bg-blue-600 hover:bg-blue-700 text-white border-none h-14 px-10 rounded-2xl shadow-xl shadow-blue-200 gap-2 text-lg font-bold w-full md:w-auto"
                        >
                            {loading ? <span className="loading loading-spinner"></span> : <><Send className="w-5 h-5" /> Enviar Pedido</>}
                        </button>
                    </div>
                </form>
            </main>

            <footer className="p-10 text-center border-t border-gray-50 bg-gray-50/30">
                <p className="text-gray-400 text-sm font-medium">Aster - Suporte Técnico Especializado em Moçambique</p>
            </footer>
        </div>
    );
};

export default NewTicketPortal;
