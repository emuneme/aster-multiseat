import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Download, Monitor, Cpu, Users, Zap, Keyboard, Mouse, Mic, Headphones, Gamepad2, Settings, LifeBuoy, MessageSquare } from 'lucide-react';

const Home = () => {
    // Testimonial Logic
    const testimonials = [
        {
            text: "“O ASTER nos permitiu economizar muito na montagem do nosso laboratório de informática. Funciona perfeitamente!”",
            name: "Roberto Silva",
            title: "CTO, Tech Solutions",
            img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=880&q=80"
        },
        {
            text: "“Uma solução incrível para escritórios pequenos. Reduzimos o ruído e o calor na sala drasticamente.”",
            name: "Joana Dias",
            title: "CEO, JD Consultoria",
            img: "https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&auto=format&fit=crop&w=764&q=80"
        },
        {
            text: "“Excelente suporte e fácil instalação. Meus filhos usam o mesmo PC para jogos e estudos sem conflitos.”",
            name: "Ema Watson",
            title: "Gerente de Marketing",
            img: "https://images.unsplash.com/photo-1488508872907-592763824245?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
                <style>
                    {`
                        @keyframes float {
                            0% { transform: translateY(0px); }
                            50% { transform: translateY(-20px); }
                            100% { transform: translateY(0px); }
                        }
                        .animate-float {
                            animation: float 6s ease-in-out infinite;
                        }
                    `}
                </style>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>

                <div className="container px-6 py-24 mx-auto relative z-10">
                    <div className="items-center lg:flex gap-12">
                        <div className="w-full lg:w-1/2 lg:order-1 sm:mt-10 animate-fade-in-up">
                            <div className="lg:max-w-3xl">
                                <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-amber-500 bg-amber-500/10 rounded-full uppercase">
                                    Inovação em Multiseat
                                </div>
                                <h1 className="text-4xl font-extrabold text-white lg:text-7xl mb-6 leading-tight">
                                    Um Computador.<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
                                        Múltiplos Usuários.
                                    </span>
                                </h1>
                                <p className="mt-4 text-lg text-blue-100 max-w-xl leading-relaxed">
                                    Transforme uma única torre em até 12 estações de trabalho independentes. Economize energia, espaço e custos de hardware sem perder performance.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <Link to="/purchase" className="btn bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold border-none px-8 py-3 rounded-xl shadow-lg hover:shadow-amber-500/50 transition-all text-lg flex items-center gap-2">
                                        <Monitor className="w-5 h-5" /> Adquira Agora
                                    </Link>
                                    <Link to="/features" className="btn btn-outline border-white/30 hover:bg-white/10 text-white px-8 py-3 rounded-xl transition-all text-lg flex items-center gap-2">
                                        Saiba Mais
                                    </Link>
                                </div>

                                <div className="mt-10 flex items-center gap-6 text-sm text-blue-200">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-amber-500" /> +100 Usuários
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-amber-500" /> Economia de Energia
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center w-full mt-12 lg:mt-0 lg:w-1/2 lg:order-2 animate-float">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-amber-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <img
                                    className="relative w-full rounded-2xl shadow-2xl border border-white/10 bg-slate-800/50 backdrop-blur-sm"
                                    src="/assets/hero_banner.png"
                                    alt="ASTER Multiseat Setup"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is ASTER Section */}
            <section className="bg-white dark:bg-gray-800 py-24">
                <div className="container px-6 mx-auto">
                    <div className="items-center lg:flex gap-16">
                        <div className="flex items-center justify-center w-full lg:w-1/2">
                            <img
                                className="w-full h-auto max-w-2xl object-contain drop-shadow-2xl animate-float"
                                src="/assets/aster_whatis.png"
                                alt="Esquema de funcionamento ASTER Multiseat com múltiplos monitores"
                                loading="lazy"
                                width="672"
                                height="400"
                            />
                        </div>
                        <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
                            <div className="mb-6 relative inline-block pb-3">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl relative z-10">
                                    O que é o ASTER?
                                </h2>
                                <span className="absolute bottom-0 left-0 w-2/3 h-2 bg-amber-500 rounded-full z-0"></span>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                ASTER é um software revolucionário que permite criar múltiplas estações de trabalho ("seats") baseadas em uma única unidade de sistema (PC).
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                Vários usuários podem trabalhar simultaneamente em um único computador (laptop) sem se atrapalharem. O uso do programa reduz em 50% o custo de aquisição e operação de equipamentos de informática.
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                Cada estação de trabalho pode se conectar de forma independente à rede local, aos servidores corporativos ou aos servidores de jogos.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                        <Cpu className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white mb-1">Sem Hardware Extra</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Esqueça thin clients ou terminais caros. Use apenas monitores e periféricos.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-white mb-1">Independência Total</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Cada usuário tem seu próprio desktop, configurações e pode rodar seus apps favoritos simultaneamente.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section - Reference Style */}
            <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="container px-6 mx-auto">
                    <div className="text-left mb-20 border-b-4 border-blue-600 inline-block pb-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                            Como Funciona
                        </h2>
                    </div>

                    <div className="space-y-32">
                        {/* Passo Um */}
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Passo um
                                </h3>
                                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 font-medium">
                                    Conecte um monitor ou TV adicional ao computador.
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                                    Os monitores podem ser conectados ao computador via HDMI, DisplayPort, DVI, VGA, USB ou Wi-Fi.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center gap-2 group">
                                        <Monitor className="w-8 h-8 text-gray-500 transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500">HDMI</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 group">
                                        <Monitor className="w-8 h-8 text-gray-500 transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500">Display Port</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 group">
                                        <Monitor className="w-8 h-8 text-gray-500 transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500">DVI</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 group">
                                        <Monitor className="w-8 h-8 text-gray-500 transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500">VGA</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 group">
                                        <Keyboard className="w-8 h-8 text-gray-500 transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500">USB</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 group">
                                        <Zap className="w-8 h-8 text-gray-500 transition-colors" />
                                        <span className="text-xs font-semibold text-gray-500">Wi-Fi</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 flex flex-col items-center">
                                {/* Monitor Diagram */}
                                <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500">
                                    <div className="w-64 h-40 bg-gray-800 rounded-xl border-4 border-gray-600 shadow-2xl flex items-center justify-center relative z-10 mx-auto">
                                        <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-12 bg-gray-400 mx-auto -mt-2 relative z-0"></div>
                                    <div className="w-32 h-2 bg-gray-400 mx-auto rounded-full shadow-lg"></div>
                                </div>
                            </div>
                        </div>

                        {/* Passo Dois */}
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                            <div className="lg:w-1/2">
                                <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-500 mb-4">
                                    Passo dois
                                </h3>
                                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 font-medium">
                                    Conecte um teclado e um mouse adicionais ao computador.
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                                    Se necessário, você pode conectar um microfone, fones de ouvido, alto-falantes, webcam e dispositivos de jogos a cada posto de trabalho.
                                </p>
                            </div>
                            <div className="lg:w-1/2 flex justify-center">
                                {/* Back Panel Diagram Simulation */}
                                <div className="relative bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 w-64">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-700 rounded-b-lg"></div>
                                    {/* Ports Simulation */}
                                    <div className="grid grid-cols-2 gap-4 mt-4">
                                        <div className="h-20 bg-gray-700 rounded border border-gray-600 flex flex-col items-center justify-center gap-1 shadow-inner">
                                            <div className="w-12 h-2 bg-black rounded-full"></div>
                                            <div className="w-12 h-2 bg-black rounded-full"></div>
                                            <span className="text-[10px] text-gray-400">USB x4</span>
                                        </div>
                                        <div className="h-20 bg-gray-700 rounded border border-gray-600 flex flex-col items-center justify-center gap-2 shadow-inner">
                                            <div className="w-8 h-8 rounded-full border-2 border-green-500/50 bg-black"></div>
                                            <span className="text-[10px] text-gray-400">Audio</span>
                                        </div>
                                        <div className="col-span-2 h-16 bg-gray-700 rounded border border-gray-600 flex items-center justify-around shadow-inner px-2">
                                            <div className="w-8 h-4 bg-black border border-gray-500"></div>
                                            <div className="w-8 h-4 bg-black border border-gray-500"></div>
                                            <div className="w-8 h-4 bg-black border border-gray-500"></div>
                                        </div>
                                    </div>
                                    {/* Connection Lines (Abstract) */}
                                    <div className="absolute -left-12 top-10 flex flex-col gap-4">
                                        <div className="flex items-center gap-2 text-xs text-gray-500"><Keyboard className="w-4 h-4" /> Teclado 1</div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500"><Mouse className="w-4 h-4" /> Mouse 1</div>
                                    </div>
                                    <div className="absolute -right-12 bottom-10 flex flex-col gap-4 items-end">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">Teclado 2 <Keyboard className="w-4 h-4" /></div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">Mouse 2 <Mouse className="w-4 h-4" /></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Passo Três */}
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Passo três
                                </h3>
                                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 font-medium">
                                    Instale o programa ASTER, configure os locais de trabalho e habilite-o.
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
                                    Em cada monitor, a área de trabalho será exibida e os usuários poderão trabalhar independentemente em um computador e usar aplicativos comuns.
                                </p>
                            </div>
                            <div className="lg:w-1/2 flex items-center justify-center">
                                {/* Software Config Diagram */}
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        </div>
                                        <span className="text-xs font-mono text-gray-400">ASTER Control Panel</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                            <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                                                <Monitor className="w-4 h-4" /> Terminal 1
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-1.5 w-16 bg-blue-200 dark:bg-blue-800 rounded"></div>
                                                <div className="h-1.5 w-12 bg-blue-200 dark:bg-blue-800 rounded"></div>
                                            </div>
                                        </div>
                                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/50">
                                            <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                                                <Monitor className="w-4 h-4" /> Terminal 2
                                            </div>
                                            <div className="space-y-1">
                                                <div className="h-1.5 w-16 bg-amber-200 dark:bg-amber-800 rounded"></div>
                                                <div className="h-1.5 w-12 bg-amber-200 dark:bg-amber-800 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2">
                                        <Settings className="w-4 h-4" /> Habilitar ASTER e Reiniciar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-20 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                <div className="container px-6 mx-auto text-center">
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8">
                        Empresas e Instituições que confiam na ASTER
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-80 hover:opacity-100 transition-all duration-500">
                        {/* Client 1 - MOVERS */}
                        <div className="group transition-transform hover:scale-110">
                            <img
                                src="/assets/clients/movers.jpg"
                                alt="MOVERS EASY CARGO"
                                className="h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 mix-blend-multiply dark:mix-blend-normal"
                            />
                        </div>
                        {/* Client 2 - SBTM */}
                        <div className="group transition-transform hover:scale-110">
                            <img
                                src="/assets/clients/sbtm.jpg"
                                alt="SBTM"
                                className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 mix-blend-multiply dark:mix-blend-normal"
                            />
                        </div>
                        {/* Client 3 - SucasaMicasa */}
                        <div className="group transition-transform hover:scale-110">
                            <img
                                src="/assets/clients/sucasa.jpg"
                                alt="SucasaMicasa"
                                className="h-24 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 mix-blend-multiply dark:mix-blend-normal"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Support CTA Section */}
            <section className="py-24 bg-blue-50/50 dark:bg-gray-800/10">
                <div className="container px-6 mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-blue-100 dark:shadow-none border border-blue-100 dark:border-gray-700 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                        <div className="lg:w-2/3">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                                Suporte Técnico de <span className="text-blue-600">Alta Performance</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                                Já é cliente Aster? Aceda ao nosso portal exclusivo para abrir chamados, acompanhar resoluções em tempo real e consultar a sua documentação técnica.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                                <Link to="/portal" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none h-14 px-8 rounded-2xl shadow-xl shadow-blue-100 gap-3 text-lg font-bold">
                                    <LifeBuoy className="w-6 h-6" /> Aceder ao Portal
                                </Link>
                                <a href="https://wa.me/2588491000" target="_blank" rel="noreferrer" className="btn btn-outline border-green-500 text-green-600 hover:bg-green-50 h-14 px-8 rounded-2xl gap-3 text-lg font-bold">
                                    <MessageSquare className="w-6 h-6" /> WhatsApp
                                </a>
                            </div>
                        </div>
                        <div className="lg:w-1/3 relative">
                            <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-3xl"></div>
                            <div className="relative bg-blue-50 rounded-full p-12 lg:p-16">
                                <LifeBuoy className="w-32 h-32 lg:w-48 lg:h-48 text-blue-600 animate-spin-slow" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container px-6 mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">O que dizem sobre nós</h2>
                            <div className="flex gap-2">
                                <span className="w-12 h-1 bg-amber-500 rounded-full"></span>
                                <span className="w-4 h-1 bg-amber-500/50 rounded-full"></span>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6 md:mt-0">
                            <button onClick={handlePrev} className="p-3 rounded-full border border-gray-600 hover:bg-white/10 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button onClick={handleNext} className="p-3 rounded-full border border-gray-600 hover:bg-white/10 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testi, i) => (
                            <div key={i} className={`p-8 rounded-2xl border border-gray-700 bg-gray-800/50 backdrop-blur-sm transition-all duration-500 ${i === currentIndex ? 'scale-105 border-blue-500 shadow-xl shadow-blue-500/20' : 'opacity-70 scale-95'}`}>
                                <div className="mb-6 text-amber-400">
                                    ★★★★★
                                </div>
                                <p className="text-gray-300 italic mb-6 leading-relaxed">
                                    {testi.text}
                                </p>
                                <div className="flex items-center gap-4">
                                    <img
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                                        src={testi.img}
                                        alt={testi.name}
                                    />
                                    <div>
                                        <h4 className="font-bold text-white">{testi.name}</h4>
                                        <span className="text-sm text-blue-400">{testi.title}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
