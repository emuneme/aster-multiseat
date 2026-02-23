import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    const location = useLocation();

    // Hide footer on Admin and Invoice pages
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/invoice')) {
        return null;
    }

    const socialLinks = [
        { icon: Facebook, href: "https://www.facebook.com/aster.co.mz", label: "Facebook" },
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Linkedin, href: "https://www.linkedin.com/company/aster-informatica", label: "LinkedIn" },
        { icon: Mail, href: "mailto:geral@aster.co.mz", label: "Email" }
    ];

    const navLinks = [
        { name: 'Início', path: '/' },
        { name: 'Funcionalidades', path: '/features' },
        { name: 'Serviços', path: '/services' },
        { name: 'Portal do Cliente', path: '/portal' },
        { name: 'Contacto', path: '/contact' }
    ];

    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-20 pb-12">
            <div className="container px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                            <img src="/logo.png" alt="ASTER Logo" className="h-14 w-auto object-contain dark:brightness-110" />
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed max-w-sm">
                            Redefinindo a infraestrutura digital moçambicana com soluções inovadoras e tecnologia sustentável.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                            Navegação
                        </h4>
                        <ul className="space-y-4">
                            {navLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social & Contact */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-6">
                            Conecte-se
                        </h4>
                        <div className="flex gap-4 mb-6">
                            {socialLinks.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Machava Sede, Cidade da Matola<br />
                            Moçambique
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 dark:text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} ASTER Informática & Serviços. Todos os direitos reservados.
                    </p>

                    <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-sm">
                        <span>Crafted by</span>
                        <a
                            href="https://web.facebook.com/eusebio.a.muneme"
                            target="_blank" rel="noopener noreferrer"
                            className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Eusebio A. Munene
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
