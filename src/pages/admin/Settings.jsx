import React, { useState } from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import { Save, Shield, CreditCard, Store } from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings } = useSettingsStore();
    const [formData, setFormData] = useState(settings);
    const [isSaved, setIsSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Configurações do Sistema</h1>

            {isSaved && (
                <div className="alert alert-success shadow-lg mb-6 text-white">
                    <Save className="w-5 h-5" />
                    <span>Configurações salvas com sucesso!</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* General Settings */}
                <div className="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2 text-gray-700 dark:text-white">
                            <Store className="w-5 h-5 text-blue-500" /> Geral
                        </h2>
                        <div className="divider my-0"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="form-control">
                                <label className="label font-medium">Nome da Loja</label>
                                <input
                                    type="text"
                                    name="storeName"
                                    value={formData.storeName}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">Email de Contato</label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2 text-gray-700 dark:text-white">
                            <CreditCard className="w-5 h-5 text-green-500" /> Pagamentos & Moeda
                        </h2>
                        <div className="divider my-0"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                            <div className="form-control">
                                <label className="label font-medium">Moeda Principal</label>
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="select select-bordered"
                                >
                                    <option value="MZN">Metical (MZN)</option>
                                    <option value="USD">Dólar (USD)</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">Taxa de Câmbio (USD -&gt; MZN)</label>
                                <input
                                    type="number"
                                    name="currencyRate"
                                    value={formData.currencyRate}
                                    onChange={handleChange}
                                    step="0.01"
                                    className="input input-bordered"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fiscal & Contact Info */}
                <div className="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2 text-gray-700 dark:text-white">
                            <Shield className="w-5 h-5 text-orange-500" /> Dados Fiscais & Contato
                        </h2>
                        <div className="divider my-0"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div className="form-control">
                                <label className="label font-medium">NUIT (Tributário)</label>
                                <input
                                    type="text"
                                    name="companyNuit"
                                    value={formData.companyNuit || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="Ex: 400123456"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">Telefone / Celular</label>
                                <input
                                    type="text"
                                    name="companyPhone"
                                    value={formData.companyPhone || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="+258 84 ..."
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">Website</label>
                                <input
                                    type="text"
                                    name="companyWebsite"
                                    value={formData.companyWebsite || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="www.exemplo.co.mz"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">Facebook (URL ou Nome)</label>
                                <input
                                    type="text"
                                    name="companyFacebook"
                                    value={formData.companyFacebook || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="facebook.com/pagina"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security (Mock) */}
                <div className="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2 text-gray-700 dark:text-white">
                            <Shield className="w-5 h-5 text-red-500" /> Segurança
                        </h2>
                        <div className="divider my-0"></div>
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-4">
                                <input
                                    type="checkbox"
                                    name="enableNotifications"
                                    checked={formData.enableNotifications}
                                    onChange={handleChange}
                                    className="checkbox checkbox-primary"
                                />
                                <span className="label-text">Habilitar notificações de novos pedidos por email</span>
                            </label>
                        </div>
                        <div className="mt-4">
                            <button type="button" className="btn btn-outline btn-error btn-sm">
                                Alterar Senha de Admin
                            </button>
                        </div>
                    </div>
                </div>

                {/* Invoice Settings */}
                <div className="card bg-white dark:bg-gray-800 shadow-sm border border-gray-100">
                    <div className="card-body">
                        <h2 className="card-title flex items-center gap-2 text-gray-700 dark:text-white">
                            <Store className="w-5 h-5 text-purple-500" /> Personalização da Fatura
                        </h2>
                        <div className="divider my-0"></div>
                        <div className="grid grid-cols-1 gap-6 mt-4">
                            <div className="form-control">
                                <label className="label font-medium">URL do Logotipo da Fatura</label>
                                <input
                                    type="text"
                                    name="invoiceLogo"
                                    value={formData.invoiceLogo || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="/logo.png"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">Endereço na Fatura</label>
                                <textarea
                                    name="invoiceAddress"
                                    value={formData.invoiceAddress || ''}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Endereço completo da empresa"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">Rodapé da Fatura</label>
                                <input
                                    type="text"
                                    name="invoiceFooter"
                                    value={formData.invoiceFooter || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="Mensagem de agradecimento ou termos"
                                />
                            </div>
                        </div>
                        <div className="divider">Dados Bancários para Fatura</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-control">
                                <label className="label font-medium">Conta BIM</label>
                                <input
                                    type="text"
                                    name="bankAccountBIM"
                                    value={formData.bankAccountBIM || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="Ex: 123456789"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">M-Pesa</label>
                                <input
                                    type="text"
                                    name="bankAccountMPesa"
                                    value={formData.bankAccountMPesa || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="Ex: 841234567 (Nome)"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-medium">E-Mola</label>
                                <input
                                    type="text"
                                    name="bankAccountEMola"
                                    value={formData.bankAccountEMola || ''}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    placeholder="Ex: 871234567 (Nome)"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="btn btn-primary text-white px-8">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
