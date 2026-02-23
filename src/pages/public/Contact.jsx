import React from 'react';
import { Mail, MapPin, Phone, Clock, Send, Globe } from 'lucide-react';

const Contact = () => {
    // Basic SEO Title
    React.useEffect(() => {
        document.title = "Fale Conosco | ASTER Matola e Maputo";
    }, []);

    const [formData, setFormData] = React.useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = React.useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch('/api/send_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setStatus({ type: 'success', message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.' });
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                throw new Error(result.message || 'Erro ao enviar mensagem.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            // Fallback to mailto if PHP script fails (e.g., no server)
            setStatus({ type: 'error', message: 'Erro de conexão. Tentando abrir seu app de email...' });

            setTimeout(() => {
                const { name, phone, email, subject, message } = formData;
                const mailSubject = encodeURIComponent(`[Contato Site] ${subject || 'Nova Mensagem'}`);
                const mailBody = encodeURIComponent(
                    `Nome: ${name}\n` +
                    `Telefone: ${phone}\n` +
                    `Email: ${email}\n` +
                    `Assunto: ${subject}\n\n` +
                    `Mensagem:\n${message}`
                );
                window.location.href = `mailto:geral@aster.co.mz?subject=${mailSubject}&body=${mailBody}`;
            }, 2000);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-4 block">Atendimento Dedicado</span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">Fale Conosco</h1>
                    <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto animate-fade-in-up delay-100">
                        Estamos prontos para atender você e sua empresa em <span className="text-amber-400 font-bold">Matola e Maputo</span>.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-6 -mt-20 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Location Card */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Localização & Atuação</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">Matola e Maputo</p>
                            <p className="text-gray-500 text-sm">Moçambique</p>
                        </div>

                        {/* Contacts Card */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <Phone className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Contatos</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <a href="tel:+258878491000" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">+258 87 849 1000</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <a href="mailto:geral@aster.co.mz" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">geral@aster.co.mz</a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <a href="https://www.aster.co.mz" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">www.aster.co.mz</a>
                                </div>
                            </div>
                        </div>

                        {/* Hours Card */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mb-6">
                                <Clock className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Horário de Atendimento</h3>
                            <p className="text-gray-600 dark:text-gray-300">Segunda a Sexta: 8h - 17h</p>
                            <p className="text-gray-500 text-sm mt-1">Sábado: 8h - 12h</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 h-full">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Envie uma mensagem</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Preencha o formulário abaixo e nossa equipe entrará em contato o mais breve possível.
                                </p>
                            </div>

                            {status.message && (
                                <div className={`p-4 mb-6 rounded-xl ${status.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-control">
                                        <label className="label text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Seu nome"
                                            className="input input-bordered w-full h-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+258 84 000 0000"
                                            className="input input-bordered w-full h-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                </div>

                                <div className="form-control">
                                    <label className="label text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="seu@email.com"
                                        className="input input-bordered w-full h-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assunto</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="select select-bordered w-full h-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        <option value="" disabled>Selecione um assunto</option>
                                        <option value="Orçamento de Software">Orçamento de Software</option>
                                        <option value="Suporte Técnico">Suporte Técnico</option>
                                        <option value="Consultoria">Consultoria</option>
                                        <option value="Outsourcing">Outsourcing</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensagem</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="textarea textarea-bordered h-40 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 dark:border-gray-600 p-4"
                                        placeholder="Como podemos ajudar?"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full h-14 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 border-none disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>Enviando...</>
                                    ) : (
                                        <><Send className="w-5 h-5" /> Enviar Mensagem</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
