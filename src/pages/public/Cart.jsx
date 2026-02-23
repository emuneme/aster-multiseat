import React from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useOrderStore } from '../../store/orderStore';
import { useCustomerStore } from '../../store/customerStore';
import { Link } from 'react-router-dom';
import { insforge } from '../../lib/insforge';

const Cart = () => {
    // Basic SEO Title management
    React.useEffect(() => {
        document.title = "Carrinho de Compras | ASTER";
    }, []);

    const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
    const subtotal = getSubtotal();
    const vat = subtotal * 0.16;
    const total = subtotal + vat;

    // Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
    const [customer, setCustomer] = React.useState({ name: '', email: '', phone: '', paymentMethod: '' });
    const [orderStatus, setOrderStatus] = React.useState({ loading: false, success: false, error: '' });

    const { addOrder } = useOrderStore();
    const { customers, fetchCustomers } = useCustomerStore();

    React.useEffect(() => {
        fetchCustomers();
    }, []);

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        setOrderStatus({ loading: true, success: false, error: '' });

        try {
            // 1. Identify or Create Customer
            let customerId = null;
            const existingCustomer = customers.find(c => c.email.toLowerCase() === customer.email.toLowerCase());

            if (existingCustomer) {
                customerId = existingCustomer.id;
            } else {
                // Create new customer
                const { data, error: custError } = await insforge.database
                    .from('customers')
                    .insert([{
                        name: customer.name,
                        email: customer.email,
                        phone: customer.phone,
                        source: 'order'
                    }])
                    .select();

                if (custError) throw new Error(`Erro ao criar cliente: ${custError.message}`);
                if (data && data.length > 0) customerId = data[0].id;
            }

            // 2. Create Order
            const orderData = {
                customer: { id: customerId, ...customer },
                items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: total,
                paymentMethod: customer.paymentMethod,
                source: 'site'
            };

            const result = await addOrder(orderData);

            if (result) {
                setOrderStatus({ loading: false, success: true, error: '' });
                setTimeout(() => {
                    clearCart();
                    setIsCheckoutOpen(false);
                }, 3000);
            } else {
                throw new Error('Falha ao registar pedido no servidor.');
            }
        } catch (err) {
            console.error(err);
            setOrderStatus({
                loading: false,
                success: false,
                error: err.message || 'Erro ao processar pedido.'
            });
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 animate-fade-in">
                <div className="p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl text-center max-w-lg w-full border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-transform duration-300">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                        <ArrowRight className="w-10 h-10 text-blue-500 opacity-60" />
                    </div>
                    <h2 className="text-3xl font-extrabold mb-4 text-gray-800 dark:text-white">Seu carrinho está vazio</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg">Descubra soluções incríveis para potenciar sua produtividade.</p>
                    <Link to="/purchase" className="btn bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white w-full rounded-2xl h-14 text-lg shadow-blue-500/30 shadow-lg border-none flex items-center gap-3">
                        <Plus className="w-5 h-5" /> Explorar Produtos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-300">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Seu Carrinho
                        <span className="text-blue-600 text-5xl">.</span>
                    </h1>
                    <button
                        onClick={clearCart}
                        className="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2 rounded-full px-4"
                    >
                        <Trash2 className="w-4 h-4" /> Esvaziar Carrinho
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50">
                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                                    <img src="/logo.webp" alt="Product" className="w-14 h-14 object-contain opacity-90 grayscale group-hover:grayscale-0 transition-all duration-300" />
                                </div>

                                <div className="flex-grow text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{item.name}</h3>
                                    <p className="text-sm text-blue-500 font-semibold bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-1 rounded-md mt-1">Licença Vitalícia</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 rounded-xl p-1.5 border border-gray-100 dark:border-gray-700">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <span className="w-6 text-center font-bold text-gray-800 dark:text-white text-lg">{item.quantity}</span>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm text-gray-500 hover:text-blue-600 hover:shadow-md transition-all active:scale-95"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="text-right min-w-[120px]">
                                        <span className="block font-bold text-xl text-gray-800 dark:text-white tracking-tight">
                                            {(item.price * item.quantity).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                        </span>
                                    </div>

                                    <button
                                        className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 sticky top-28">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 border-b pb-4 dark:border-gray-700">Resumo do Pedido</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 text-lg">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-gray-800 dark:text-white">{subtotal.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>IVA (16%)</span>
                                    <span className="font-semibold text-gray-800 dark:text-white">{vat.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400 items-center">
                                    <span>Instalação</span>
                                    <span className="text-emerald-500 font-bold text-sm bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">GRÁTIS</span>
                                </div>
                            </div>

                            <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-700 my-8"></div>

                            <div className="flex justify-between items-end mb-8">
                                <span className="text-lg font-medium text-gray-600 dark:text-gray-300">Total</span>
                                <span className="text-4xl font-extrabold text-blue-600 tracking-tight">{total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                            </div>

                            <button
                                onClick={() => setIsCheckoutOpen(true)}
                                className="btn bg-amber-500 hover:bg-amber-600 text-slate-900 w-full h-16 rounded-2xl text-xl font-bold shadow-xl hover:shadow-amber-500/25 transition-all flex items-center justify-between px-8 border-none group relative overflow-hidden"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                                <span className="relative z-10">Finalizar Compra</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
                            </button>

                            <p className="text-xs text-center text-gray-400 mt-6 flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Checkout Seguro e Criptografado
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-scale-up border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setIsCheckoutOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            <Trash2 className="w-5 h-5 rotate-45" /> {/* Close Icon */}
                        </button>

                        <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Dados para Entrega</h3>
                        <p className="text-gray-500 mb-6 text-sm">Preencha seus dados para recebermos seu pedido.</p>

                        {orderStatus.success ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus className="w-8 h-8 rotate-45" /> {/* Check icon */}
                                </div>
                                <h4 className="text-xl font-bold text-green-600 mb-2">Pedido Recebido!</h4>
                                <p className="text-gray-600">Verifique seu email para mais detalhes.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                                <div>
                                    <label className="label"><span className="label-text font-semibold">Nome Completo</span></label>
                                    <input
                                        type="text" required
                                        className="input input-bordered w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                                        value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label"><span className="label-text font-semibold">Email</span></label>
                                        <input
                                            type="email" required
                                            className="input input-bordered w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                                            value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label"><span className="label-text font-semibold">Telefone</span></label>
                                        <input
                                            type="tel" required
                                            className="input input-bordered w-full rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:border-blue-500"
                                            value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="divider my-1">Pagamento</div>

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm mb-2">Selecione o Método:</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${customer.paymentMethod === 'mpesa' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-red-200'}`}>
                                            <input type="radio" name="payment" className="hidden" onClick={() => setCustomer({ ...customer, paymentMethod: 'mpesa' })} />
                                            <span className="font-bold text-red-600">e-Mola</span>
                                            <span className="text-xs text-center text-gray-500">87 849 1000</span>
                                        </label>
                                        <label className={`cursor-pointer border rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${customer.paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-blue-200'}`}>
                                            <input type="radio" name="payment" className="hidden" onClick={() => setCustomer({ ...customer, paymentMethod: 'bank' })} />
                                            <span className="font-bold text-blue-600">BIM</span>
                                            <span className="text-xs text-center text-gray-500">Transferência</span>
                                        </label>
                                    </div>

                                    {customer.paymentMethod === 'mpesa' && (
                                        <div className="bg-red-50 dark:bg-red-900/10 p-3 rounded-lg text-xs text-red-800 dark:text-red-200 mt-2">
                                            <p className="font-bold">e-Mola: 87 849 1000 (Eusebio Munene)</p>
                                            <p>Use seu NOME como referência.</p>
                                        </div>
                                    )}
                                    {customer.paymentMethod === 'bank' && (
                                        <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg text-xs text-blue-800 dark:text-blue-200 mt-2">
                                            <p className="font-bold">BIM: 172176553 (ASTER Informatica e Serviços)</p>
                                            <p>Envie o comprovativo para o nosso email.</p>
                                        </div>
                                    )}
                                </div>

                                {orderStatus.error && (
                                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                        {orderStatus.error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={orderStatus.loading || !customer.paymentMethod}
                                    className="btn bg-blue-600 hover:bg-blue-700 text-white w-full rounded-xl mt-4 h-12 shadow-lg hover:shadow-blue-500/20 border-none relative overflow-hidden disabled:bg-gray-400"
                                >
                                    {orderStatus.loading ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        "Confirmar Pedido"
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
