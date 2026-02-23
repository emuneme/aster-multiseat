import React from 'react';
import {
    Monitor, Zap, Leaf, Scaling, Clock, Sparkles, Network, Server, Volume1,
    CheckCircle, XCircle, Bluetooth, Wifi, Cast
} from 'lucide-react';

const Features = () => {
    const features = [
        { icon: <Zap className="w-8 h-8 text-amber-500" />, title: "Redução de Custos", description: "Economia de até 47% no orçamento geral de TI ao reduzir a compra de hardware." },
        { icon: <Server className="w-8 h-8 text-blue-500" />, title: "Economia de Energia", description: "Reduza drasticamente a conta de eletricidade operando apenas um gabinete central." },
        { icon: <Leaf className="w-8 h-8 text-green-500" />, title: "Ecológico", description: "Menos lixo eletrônico e menor pegada de carbono. Um planeta mais verde." },
        { icon: <Scaling className="w-8 h-8 text-purple-500" />, title: "Economia de Espaço", description: "Libere espaço na mesa. Ideal para escritórios pequenos, call centers e escolas." },
        { icon: <Clock className="w-8 h-8 text-red-500" />, title: "Implantação Rápida", description: "Configure um novo posto de trabalho em apenas 5 minutos. Sem formatação." },
        { icon: <Sparkles className="w-8 h-8 text-indigo-500" />, title: "Fácil de Usar", description: "Configure uma única vez. Funciona automaticamente a cada reinicialização." },
        { icon: <Network className="w-8 h-8 text-cyan-500" />, title: "Sem Carga de Rede", description: "Crie estações sem depender da rede local ou internet (Zero Network Load)." },
        { icon: <Volume1 className="w-8 h-8 text-pink-500" />, title: "Baixo Ruído", description: "Menos torres com ventoinhas significam um ambiente de trabalho muito mais silencioso." }
    ];

    const differences = [
        {
            check: true,
            text: "Opera perfeitamente com aplicativos 3D e vídeos pesados, ao contrário de terminais thin-client."
        },
        {
            check: true,
            text: "Funciona sem conexão constante com a Internet e sem mensalidades (modelo de licença perpétua)."
        },
        {
            check: true,
            text: "Suporte nativo total ao Windows 10 e 11, aproveitando drivers de fábrica."
        },
        {
            check: true,
            text: "Baixos requisitos de hardware (CPU/RAM) comparado a máquinas virtuais pesadas."
        },
        {
            check: true,
            text: "Compatível com periféricos modernos: USB-C, webcams, leitores de cartão e tablets."
        }
    ];

    return (
        <div className="font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24 relative overflow-hidden border-b border-gray-300 dark:border-gray-700">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-4 block animate-fade-in-up">Potência & Eficiência</span>
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up delay-100">
                        O ASTER é Inovação
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto animate-fade-in-up delay-200">
                        Transforme 1 PC em até 12 estações independentes. Economia real para seu negócio.
                    </p>
                </div>
            </section>

            {/* Conexão Simples Section */}
            <section className="py-24 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                <div className="container px-6 mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-amber-500 pl-4">
                                Conexão Simples e Eficiente
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                O conceito é simples: conecte monitores extras, teclados e mouses ao seu computador existente. O software ASTER gerencia os recursos para criar sessões independentes.
                            </p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Suporta quaisquer placas de vídeo (NVIDIA, AMD, Intel)</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Compatível com teclados e mouses sem fio</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Use webcams, microfones e áudio individualmente</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/2 flex justify-center">
                            <img
                                src="/assets/conexao-aster.png.png"
                                alt="Diagrama de Conexão ASTER"
                                className="rounded-2xl shadow-2xl bg-white p-2 w-full max-w-3xl object-contain min-h-[400px]"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    // Fallback opcional mantido
                                    e.target.src = "https://rabistha.com.np/images/work_study_internet_dark.png"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section - Image Only */}
            <section className="py-0 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
                <div className="container px-6 mx-auto text-center">
                    <div className="flex justify-center">
                        <img
                            src="https://ibiksoft.com/wp-content/uploads/2022/01/money_pt.jpg"
                            alt="Economia de 47% com ASTER"
                            className="rounded-3xl shadow-none max-w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Wireless & Compatibility */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Liberdade de Conexão</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">O ASTER é compatível com as tecnologias mais modernas.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-t-4 border-blue-500 hover:-translate-y-2 transition-transform">
                            <Bluetooth className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bluetooth</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Use teclados, mouses e headsets sem fio para manter as mesas organizadas.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-t-4 border-amber-500 hover:-translate-y-2 transition-transform">
                            <Wifi className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Wi-Fi & Wireless</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Monitores via Wi-Fi e periféricos wireless são totalmente suportados.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-t-4 border-emerald-500 hover:-translate-y-2 transition-transform">
                            <Cast className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Miracast</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Projeção sem fio para telas compatíveis, ideal para salas de reunião.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                <div className="container px-6 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Benefícios Exclusivos</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center p-8 bg-gray-50 dark:bg-gray-700/30 rounded-3xl hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl mb-6 shadow-sm">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-center text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container px-6 mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="lg:w-1/3">
                            <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-2 block">Vantagem Competitiva</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Porque ASTER vence a concorrência</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                Ao contrário de Thin Clients, Zero Clients ou soluções baseadas em VM, o ASTER entrega performance nativa sem complicações.
                            </p>
                            <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                                Baixar Teste Gratuitamente
                            </button>
                        </div>
                        <div className="lg:w-2/3 w-full">
                            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                                <h3 className="text-xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                                    Diferenciais em relação a outros Multiseat
                                </h3>
                                <div className="space-y-6">
                                    {differences.map((diff, idx) => (
                                        <div key={idx} className="flex gap-4 items-start">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                </div>
                                            </div>
                                            <p className="text-gray-300 text-lg">{diff.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Features;
