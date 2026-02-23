import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Monitor } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

const Navbar = () => {
    const items = useCartStore((state) => state.items);

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    const location = useLocation();

    // Pages where menu should be hidden for better conversion focus
    const isStorePage = ['/cart'].includes(location.pathname);

    // Hide completely on Admin and Invoice pages (layout handled elsewhere or standalone)
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/invoice')) {
        return null;
    }

    return (
        <div className="sticky top-0 z-50 transition-all duration-300 font-sans">
            <div className="navbar bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm border-b border-slate-100 dark:border-slate-800 h-20">
                <div className="navbar-start">
                    <div className={`dropdown ${isStorePage ? 'hidden' : ''}`}>
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-slate-600 dark:text-slate-300">
                            <Menu className="h-6 w-6" />
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-white dark:bg-slate-900 rounded-2xl w-64 border border-slate-100 dark:border-slate-800">
                            <li><Link to="/" className="py-3 font-medium">Início</Link></li>
                            <li><Link to="/features" className="py-3 font-medium">Funcionalidades</Link></li>
                            <li><Link to="/services" className="py-3 font-medium">Serviços</Link></li>
                            <li><Link to="/contact" className="py-3 font-medium">Contato</Link></li>
                            <li><Link to="/projects" className="py-3 font-medium">Projetos</Link></li>
                            <li><Link to="/portal" className="py-3 font-bold text-blue-600">Portal do Cliente</Link></li>
                            <li><Link to="/purchase" className="py-3 font-bold text-amber-600 dark:text-amber-500">Comprar</Link></li>
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost hover:bg-transparent px-2">
                        <img src="/src/assets/logo.png" alt="ASTER" className="h-16 w-auto object-contain transition-transform hover:scale-105 duration-300" />
                    </Link>
                </div>

                {/* CENTERED MENU - Hidden on Store Pages */}
                {!isStorePage && (
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1 gap-2 font-medium text-[15px] text-slate-600 dark:text-slate-300">
                            <li><Link to="/" className="hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors rounded-xl px-4 py-2">Início</Link></li>
                            <li><Link to="/features" className="hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors rounded-xl px-4 py-2">Funcionalidades</Link></li>
                            <li><Link to="/services" className="hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors rounded-xl px-4 py-2">Serviços</Link></li>
                            <li><Link to="/contact" className="hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors rounded-xl px-4 py-2">Contato</Link></li>
                            <li><Link to="/projects" className="hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors rounded-xl px-4 py-2">Projetos</Link></li>
                            <li><Link to="/purchase" className="hover:scale-105 bg-amber-50 dark:bg-slate-800/50 hover:bg-amber-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-500 font-bold transition-all rounded-xl px-4 py-2">Comprar</Link></li>
                        </ul>
                    </div>
                )}

                {/* RIGHT SIDE - Cart */}

                <div className="navbar-end gap-3">
                    <Link to="/portal" className="btn btn-ghost btn-sm hidden md:inline-flex font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50">
                        Portal Cliente
                    </Link>

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle group hover:bg-amber-50 dark:hover:bg-slate-800">
                            <div className="indicator">
                                <ShoppingCart className={`h-5 w-5 text-slate-600 dark:text-slate-300 transition-colors ${totalItems > 0 ? 'text-amber-500' : ''}`} />
                                {totalItems > 0 && (
                                    <span key={totalItems} className="badge badge-sm badge-warning indicator-item font-bold shadow-sm animate-bounce">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div tabIndex={0} className="card card-compact dropdown-content bg-white dark:bg-slate-900 z-[1] mt-4 w-64 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-2xl">
                            <div className="card-body">
                                <span className="text-lg font-bold text-slate-800 dark:text-white">{totalItems} Itens</span>
                                <span className="text-amber-600 font-bold text-lg">{subtotal.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                <div className="card-actions mt-2">
                                    <Link to="/cart" className="btn bg-slate-900 hover:bg-slate-800 text-white btn-block shadow-lg border-none rounded-xl">Ver Carrinho</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Navbar;
