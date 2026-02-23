import React from 'react';
import { Wrench, Cpu, Users, Shield, Zap, Headphones, Briefcase, Check } from 'lucide-react';

const Services = () => {
    // Basic SEO Title management
    React.useEffect(() => {
        document.title = "Serviços de TI e Outsourcing em Matola | ASTER";
    }, []);

    const services = [
        {
            icon: <Cpu className="w-12 h-12" />,
            title: "Desenvolvimento de Software",
            description: "Criamos soluções personalizadas para sua empresa, desde sistemas web até aplicações desktop.",
            features: ["Sistemas ERP/CRM", "Aplicações Web", "Automação de Processos"]
        },
        {
            icon: <Wrench className="w-12 h-12" />,
            title: "Suporte Técnico",
            description: "Assistência técnica especializada para manter seus sistemas sempre funcionando.",
            features: ["Suporte Remoto", "Manutenção Preventiva", "Atendimento 24/7"]
        },
        {
            icon: <Users className="w-12 h-12" />,
            title: "Consultoria de TI",
            description: "Orientamos sua empresa nas melhores práticas de tecnologia e inovação.",
            features: ["Análise de Infraestrutura", "Planejamento Estratégico", "Otimização de Processos"]
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: "Segurança da Informação",
            description: "Proteção completa dos seus dados e sistemas contra ameaças digitais.",
            features: ["Backup e Recuperação", "Antivírus Corporativo", "Firewall e Monitoramento"]
        },
        {
            icon: <Zap className="w-12 h-12" />,
            title: "Infraestrutura de Rede",
            description: "Implementação e gestão de redes corporativas eficientes e seguras.",
            features: ["Cabeamento Estruturado", "Configuração de Servidores", "Wi-Fi Empresarial"]
        },
        {
            icon: <Headphones className="w-12 h-12" />,
            title: "Treinamento e Capacitação",
            description: "Formação de equipes para uso eficiente de ferramentas e sistemas.",
            features: ["Cursos Personalizados", "Certificações", "Workshops Práticos"]
        }
    ];

    const outsourcingPlans = [
        {
            name: "Básico",
            price: "12.000",
            period: "mês",
            description: "Ideal para pequenas empresas",
            features: [
                "Suporte técnico 8x5",
                "1 técnico dedicado",
                "Manutenção preventiva mensal",
                "Backup semanal",
                "Relatórios mensais"
            ],
            highlighted: false
        },
        {
            name: "Profissional",
            price: "20.000",
            period: "mês",
            description: "Para empresas em crescimento",
            features: [
                "Suporte técnico 24x7",
                "2 técnicos dedicados",
                "Manutenção preventiva quinzenal",
                "Backup diário",
                "Monitoramento em tempo real",
                "Relatórios semanais",
                "Consultoria mensal incluída"
            ],
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "Personalizado",
            period: "",
            description: "Soluções sob medida",
            features: [
                "Suporte técnico 24x7 prioritário",
                "Equipe dedicada completa",
                "Manutenção preventiva contínua",
                "Backup em tempo real",
                "Monitoramento avançado",
                "Relatórios personalizados",
                "Consultoria ilimitada",
                "SLA personalizado"
            ],
            highlighted: false
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-4 block">Soluções Profissionais</span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6">Nossos Serviços</h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Soluções completas em tecnologia para impulsionar o crescimento da sua empresa
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                            >
                                <div className="text-blue-600 dark:text-blue-400 mb-4">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    {service.description}
                                </p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-gray-700 dark:text-gray-400">
                                            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Outsourcing Plans Section */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <Briefcase className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">
                            Outsourcing de TI
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Planos de contrato personalizados para terceirização completa da sua infraestrutura de TI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {outsourcingPlans.map((plan, index) => (
                            <div
                                key={index}
                                className={`relative rounded-2xl p-8 transition-all duration-300 ${plan.highlighted
                                    ? 'bg-blue-600 text-white shadow-2xl scale-105 border-4 border-blue-600'
                                    : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-xl'
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Mais Popular
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="text-center mb-8">
                                    {plan.price === "Personalizado" ? (
                                        <div className={`text-3xl font-bold ${plan.highlighted ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                                            Sob Consulta
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`text-4xl font-extrabold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                                                {plan.price} <span className="text-2xl">MZN</span>
                                            </div>
                                            <div className={`text-sm ${plan.highlighted ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                por {plan.period}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-blue-200' : 'text-blue-600'}`} />
                                            <span className={`text-sm ${plan.highlighted ? 'text-blue-50' : 'text-gray-700 dark:text-gray-300'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="/contact"
                                    className={`block w-full text-center py-3 px-6 rounded-xl font-bold transition-all ${plan.highlighted
                                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    Contratar Agora
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                        Pronto para transformar seu negócio?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Entre em contato conosco e descubra como podemos ajudar sua empresa a crescer com tecnologia
                    </p>
                    <a
                        href="/contact"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        Fale Conosco
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Services;
