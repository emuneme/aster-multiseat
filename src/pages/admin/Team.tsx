import React, { useState, useEffect } from 'react';
import { useTechnicianStore } from '../../store/technicianStore';
import type { Technician } from '../../store/technicianStore';
import { User, Mail, Plus, X, Save, Shield, Trash2, Key, Edit2, Phone, MessageSquare } from 'lucide-react';

const Team = () => {
    const { technicians, loading, fetchTechnicians, addTechnician, updateTechnician, deleteTechnician } = useTechnicianStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTech, setEditingTech] = useState<Technician | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'technician' });

    useEffect(() => {
        fetchTechnicians();
    }, [fetchTechnicians]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingTech) {
                // If editing, only update changed fields. Password only if provided.
                const updates: Partial<Technician> & { password_hash?: string } = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role
                };
                if (formData.password.trim()) {
                    updates.password_hash = formData.password;
                }

                await updateTechnician(editingTech.id, updates);
            } else {
                // Creating new
                await addTechnician({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    password_hash: formData.password
                } as any); // Type cast due to hidden password field in interface
            }

            setIsModalOpen(false);
            setEditingTech(null);
            setFormData({ name: '', email: '', phone: '', password: '', role: 'technician' });
        } catch (error) {
            console.error('Failed to save technician:', error);
            alert('Erro ao guardar o membro da equipa.');
        }
    };

    const openEditModal = (tech: Technician) => {
        setEditingTech(tech);
        setFormData({
            name: tech.name,
            email: tech.email,
            phone: tech.phone || '',
            password: '', // Leave empty to not override unless intended
            role: tech.role
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (tech: Technician) => {
        if (tech.role === 'admin') {
            alert('Atenção: Não é possível excluir o Administrador principal.');
            return;
        }

        if (window.confirm(`Tem a certeza que deseja revogar o acesso de ${tech.name}?\nEsta ação não afetará os chamados que ele resolveu, mas impedirá novos logins.`)) {
            await deleteTechnician(tech.id);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <Shield className="w-8 h-8 text-blue-500" /> Equipa de Suporte
                    </h1>
                    <p className="text-gray-500 mt-1">Gerencie os acessos ao painel administrativo e de helpdesk.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingTech(null);
                        setFormData({ name: '', email: '', phone: '', password: '', role: 'technician' });
                        setIsModalOpen(true);
                    }}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg gap-2 rounded-xl"
                >
                    <Plus className="w-5 h-5" /> Adicionar Membro
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="rounded-tl-3xl py-4 px-6">Funcionário</th>
                                <th className="py-4">Contactos</th>
                                <th className="py-4">Nível de Permissão</th>
                                <th className="py-4">Data de Registo</th>
                                <th className="rounded-tr-3xl py-4 text-right">Ações Rápidas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10">
                                        <span className="loading loading-spinner text-blue-500 h-8 w-8"></span>
                                    </td>
                                </tr>
                            ) : technicians.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        Nenhum funcionário cadastrado. Clique em "Adicionar Membro" para começar.
                                    </td>
                                </tr>
                            ) : (
                                technicians.map((tech) => (
                                    <tr key={tech.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                {tech.avatar_url ? (
                                                    <img src={tech.avatar_url} alt={tech.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200" />
                                                ) : (
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${tech.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {tech.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">{tech.name}</p>
                                                    <p className="text-xs text-gray-400 font-mono">ID: {tech.id.substring(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-400" /> {tech.email}
                                                </div>
                                                {tech.phone && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Phone className="w-3 h-3 text-green-500" /> {tech.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${tech.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {tech.role === 'admin' ? 'Administrador Global' : 'Técnico de Suporte'}
                                            </span>
                                        </td>
                                        <td className="py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(tech.created_at).toLocaleDateString('pt-MZ')}
                                        </td>
                                        <td className="py-4 whitespace-nowrap text-right space-x-2">
                                            {tech.role !== 'admin' && ( // Don't allow editing main admin profile freely
                                                <button
                                                    onClick={() => openEditModal(tech)}
                                                    className="btn btn-sm btn-ghost btn-circle text-blue-500 hover:bg-blue-50"
                                                    title="Editar Dados e Senha"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {tech.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDelete(tech)}
                                                    className="btn btn-sm btn-ghost btn-circle text-red-500 hover:bg-red-50"
                                                    title="Revogar Acesso"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col animate-in zoom-in duration-200 overflow-hidden my-auto max-h-[90vh]">

                        <div className="p-6 border-b border-gray-100 shrink-0 flex justify-between items-center bg-white dark:bg-gray-800 z-10">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                {editingTech ? <Edit2 className="w-5 h-5 text-blue-500" /> : <User className="w-5 h-5 text-blue-500" />}
                                {editingTech ? 'Editar Funcionário' : 'Novo Funcionário'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 min-h-0">
                            <form id="techForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        required
                                        className="input input-bordered w-full bg-gray-50 focus:bg-white"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ex: João Silva"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        required
                                        className="input input-bordered w-full bg-gray-50 focus:bg-white"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="joao@aster.co.mz"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">WhatsApp <MessageSquare className="w-3 h-3 text-green-500" /></label>
                                    <input
                                        type="tel"
                                        className="input input-bordered w-full bg-gray-50 focus:bg-white"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Ex: +258 84 000 0000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Palavra-passe</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required={!editingTech} // Required only for new accounts
                                            className="input input-bordered w-full pl-9 bg-gray-50 focus:bg-white"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={editingTech ? "Deixe em branco para manter a atual" : "Digite uma senha segura"}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">
                                        O funcionário usará este e-mail e password para entrar no painel.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Privilégios</label>
                                    <select
                                        className="select select-bordered w-full bg-gray-50"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="technician">Técnico de Suporte (Helpdesk)</option>
                                        <option value="admin">Administrador Global (Total)</option>
                                    </select>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
                            <button type="submit" form="techForm" className="btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full border-none shadow-lg">
                                <Save className="w-5 h-5 mr-2" />
                                {editingTech ? 'Confirmar e Atualizar' : 'Criar Conta de Acesso'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Team;
