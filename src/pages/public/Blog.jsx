import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
    const posts = [
        {
            title: "Como economizar 50% em hardware de escritório",
            summary: "Descubra como o ASTER pode reduzir drasticamente seus custos de TI eliminando a necessidade de CPUs adicionais.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
            date: "12 Mar 2024",
            author: "Carlos TI"
        },
        {
            title: "ASTER para Escolas: O laboratório perfeito",
            summary: "Um estudo de caso sobre como escolas em Moçambique estão duplicando sua capacidade de alunos sem comprar novos computadores.",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
            date: "05 Fev 2024",
            author: "Ana Souza"
        },
        {
            title: "Jogos Multiplayer em um PC?",
            summary: "Sim, é possível! Veja como configurar o ASTER para rodar duas instâncias de jogos no mesmo computador.",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
            date: "28 Jan 2024",
            author: "Gamer Pro"
        }
    ];

    return (
        <section className="bg-white dark:bg-gray-900 min-h-screen py-16">
            <div className="container px-6 mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Blog ASTER</h1>
                    <p className="mt-4 text-gray-500">Notícias, dicas e tutoriais sobre multiseat e virtualização.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col">
                            <div className="h-48 overflow-hidden">
                                <img src={`${post.image}?auto=format&fit=crop&w=500&q=60`} alt={post.title} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-blue-500 font-semibold mb-4 uppercase tracking-wider">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                                    {post.summary}
                                </p>
                                <a href="#" className="mt-auto inline-flex items-center text-blue-600 font-bold hover:underline">
                                    Ler Artigo <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Blog;
