import React, { useState } from 'react';
import { Camera, Monitor, Server, Youtube, Play, ExternalLink } from 'lucide-react';

const Projects = () => {
    // Basic SEO Title
    React.useEffect(() => {
        document.title = "Nossos Projetos | ASTER - Informática & Serviços";
    }, []);

    const [activeCategory, setActiveCategory] = useState("todos");

    const categories = [
        { id: "todos", label: "Todos" },
        { id: "sistemas", label: "Sistemas & Software" },
        { id: "websites", label: "Websites" },
        { id: "infra", label: "Infraestrutura & CCTV" },
    ];

    const projects = [
        {
            id: 1,
            title: "Sistema de Gestão Escolar (SGE)",
            category: "sistemas",
            image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1470&auto=format&fit=crop",
            description: "Plataforma completa para gestão acadêmica e financeira de escolas em Maputo.",
            type: "Web App"
        },
        {
            id: 2,
            title: "Website Corporativo - JD Consultoria",
            category: "websites",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1415&auto=format&fit=crop",
            description: "Portal institucional responsivo com integração de blog e agendamento.",
            type: "Website"
        },
        {
            id: 3,
            title: "Infraestrutura de Rede e CCTV",
            category: "infra",
            image: "https://images.unsplash.com/photo-1558494949-efc5270f9c01?q=80&w=1402&auto=format&fit=crop",
            description: "Cabeamento estruturado e instalação de câmeras para empresa de logística.",
            type: "Infraestrutura"
        },
        {
            id: 4,
            title: "SGC - Sistema de Gestão Comercial",
            category: "sistemas",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
            description: "ERP para controle de estoque, vendas e faturação certificado.",
            type: "Desktop App"
        },
        {
            id: 5,
            title: "E-commerce TechStore",
            category: "websites",
            image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1470&auto=format&fit=crop",
            description: "Loja virtual completa com pagamentos via M-Pesa e Ponto 24.",
            type: "E-commerce"
        },
        {
            id: 6,
            title: "Laboratório Multiseat",
            category: "infra",
            image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=1470&auto=format&fit=crop",
            description: "Implementação de sala de informática com 20 estações usando apenas 4 CPUs.",
            type: "Multiseat"
        }
    ];

    const filteredProjects = activeCategory === "todos"
        ? projects
        : projects.filter(p => p.category === activeCategory);

    return (
        <div className="font-sans antialiased bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            {/* Header Hero */}
            <section className="relative bg-slate-900 py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="container px-6 mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Nossos Projectos
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Explore nosso portfólio de soluções digitais, infraestrutura e implementações de sucesso em Moçambique.
                    </p>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-20">
                <div className="container px-6 mx-auto">
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${activeCategory === cat.id
                                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                        {project.type}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-amber-500 transition-colors">
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                        {project.description}
                                    </p>
                                    <button className="text-sm font-semibold text-blue-600 dark:text-amber-500 flex items-center gap-2 hover:gap-3 transition-all">
                                        Ver Detalhes <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Showcase Section */}
            <section className="py-20 bg-slate-100 dark:bg-slate-800/50">
                <div className="container px-6 mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold mb-6">
                                <Youtube className="w-4 h-4" /> Canal do YouTube
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Veja nossas implementações em ação
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                Acompanhe nossos vídeos demonstrativos de sistemas, tutoriais e o dia-a-dia de nossas instalações de infraestrutura e multiseat.
                            </p>
                            <a href="https://www.youtube.com/@EusebioAugusto" className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-red-600/30 transition-all">
                                <Play className="w-5 h-5 fill-current" /> Inscrever-se no Canal
                            </a>
                        </div>
                        <div className="md:w-1/2 w-full">
                            {/* Video Placeholder Card */}
                            <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-700">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube-nocookie.com/embed/Bdax5ZXBitU?si=uXy9BGa8_JyXiUOC"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default Projects;
