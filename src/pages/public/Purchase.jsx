import React, { useState, useEffect } from 'react';
import { Check, ShoppingCart, Users, Maximize2, Repeat, LifeBuoy, Plus, Minus, X } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import PurchaseAuthModal from '../../components/PurchaseAuthModal';
import { insforge } from '../../lib/insforge';

const Purchase = () => {
    const [isPerpetual, setIsPerpetual] = useState(false);
    const [notification, setNotification] = useState("");
    const [quantities, setQuantities] = useState({});
    const [buyerUser, setBuyerUser] = useState(null);
    const [pendingProduct, setPendingProduct] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { addItem } = useCartStore();

    // Restore session on page load (e.g. after OAuth redirect back)
    useEffect(() => {
        insforge.auth.getCurrentSession().then(({ data }) => {
            if (data?.session?.user) {
                setBuyerUser(data.session.user);
            }
        });
    }, []);

    const getQty = (id) => quantities[id] ?? 1;
    const changeQty = (id, delta) => setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] ?? 1) + delta) }));

    const handleAddToCart = (product) => {
        // If user is not authenticated, open auth modal first
        if (!buyerUser) {
            setPendingProduct(product);
            setIsAuthModalOpen(true);
            return;
        }
        addToCartDirectly(product);
    };

    const addToCartDirectly = (product) => {
        const qty = getQty(product.id);
        for (let i = 0; i < qty; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                type: product.type
            });
        }
        setNotification(`${qty}x ${product.name} adicionado ao carrinho!`);
        setTimeout(() => setNotification(""), 3000);
    };

    const handleAuthSuccess = (user) => {
        setBuyerUser(user);
        setIsAuthModalOpen(false);
        if (pendingProduct) {
            addToCartDirectly(pendingProduct);
            setPendingProduct(null);
        }
    };

    // Prices converted to logical MZN commercial values
    // USD 15 ~ 1100 MZN
    // USD 60 ~ 4500 MZN
    const products = {
        annual: [
            {
                id: 1, type: "annual-2", name: "Licença Anual - 2 Usuários",
                price: 1160, users: 2, image: "/assets/products/license-1.png",
                features: ["2 usuários", "Expansível (até 12) *", "Transferível (4 Vezes)", "Suporte Técnico"],
                is_popular: true
            },
            {
                id: 2, type: "annual-3", name: "Licença Anual - 3 Usuários",
                price: 1150, users: 3, image: "/assets/products/license-2.png",
                features: ["até 3 usuários", "Expansível (até 12) *", "Transferível (4 Vezes)", "Suporte Técnico"],
                is_popular: false
            },
            {
                id: 3, type: "annual-6", name: "Licença Anual - 6 Usuários",
                price: 2130, users: 6, image: "/assets/products/license-3.png",
                features: ["até 6 usuários", "Expansível (até 12) *", "Transferível (4 Vezes)", "Suporte Técnico"],
                is_popular: false
            }
        ],
        perpetual: [
            {
                id: 4, type: "pro-2", name: "Licença Vitalícia - 2 Usuários",
                price: 3450, users: 2, image: "/assets/products/license-4.png",
                features: ["2 usuários", "Expansível (até 12) *", "Transferível (4 Vezes / ano)", "Suporte Técnico"],
                is_popular: true
            },
            {
                id: 5, type: "pro-3", name: "Licença Vitalícia - 3 Usuários",
                price: 4330, users: 3, image: "/assets/products/license-5.png",
                features: ["até 3 usuários", "Expansível (até 12) *", "Transferível (4 Vezes / ano)", "Suporte Técnico"],
                is_popular: false
            },
            {
                id: 6, type: "pro-6", name: "Licença Vitalícia - 6 Usuários",
                price: 8260, users: 6, image: "/assets/products/license-6.png",
                features: ["até 6 usuários", "Expansível (até 12) *", "Transferível (4 Vezes / ano)", "Suporte Técnico"],
                is_popular: false
            }
        ]
    };

    const currentProducts = isPerpetual ? products.perpetual : products.annual;

    const FeatureIcon = ({ feature }) => {
        if (feature.toLowerCase().includes("usuário")) return <Users className="w-5 h-5 text-blue-500" />;
        if (feature.toLowerCase().includes("expansível")) return <Maximize2 className="w-5 h-5 text-green-500" />;
        if (feature.toLowerCase().includes("transferível")) return <Repeat className="w-5 h-5 text-orange-500" />;
        if (feature.toLowerCase().includes("suporte")) return <LifeBuoy className="w-5 h-5 text-red-500" />;
        return <Check className="w-5 h-5 text-blue-500" />;
    };

    return (
        <section className="min-h-screen py-16">
            {/* Auth Modal */}
            <PurchaseAuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={handleAuthSuccess}
                productName={pendingProduct?.name}
            />

            {/* Notification Toast */}
            {notification && (
                <div className="toast toast-top toast-end z-50">
                    <div className="alert alert-success text-white shadow-lg">
                        <span>{notification}</span>
                    </div>
                </div>
            )}

            {/* Buyer identity indicator */}
            {buyerUser && (
                <div className="fixed top-20 right-4 z-40 bg-white border border-green-200 shadow-lg rounded-2xl px-4 py-2 flex items-center gap-3 text-sm">
                    <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-xs">
                        {(buyerUser.profile && buyerUser.profile.name ? buyerUser.profile.name : buyerUser.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800 leading-tight text-xs">{(buyerUser.profile && buyerUser.profile.name) || 'Comprador'}</p>
                        <p className="text-gray-400 text-xs">{buyerUser.email}</p>
                    </div>
                    <button onClick={() => { insforge.auth.signOut(); setBuyerUser(null); }} className="text-gray-300 hover:text-red-400 ml-1 transition-colors" title="Sair">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="container px-6 mx-auto">
                <h1 className="text-3xl font-bold text-center text-gray-800 capitalize lg:text-4xl dark:text-white mb-4">
                    Nossos Planos
                </h1>

                <div className="flex mx-auto mb-8 justify-center">
                    <span className="inline-block w-24 h-1.5 bg-blue-600 rounded-full"></span>
                </div>

                <p className="max-w-2xl mx-auto text-center text-gray-500 dark:text-gray-300 text-lg mb-12">
                    Escolha a solução ideal para transformar seus computadores. Preços acessíveis em Meticais.
                </p>

                {/* Custom Toggle Switch */}
                <div className="flex items-center justify-center mb-16">
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-xl inline-flex relative shadow-inner">
                        <button
                            onClick={() => setIsPerpetual(false)}
                            className={`relative z-10 px-8 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${!isPerpetual ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Anual
                        </button>
                        <button
                            onClick={() => setIsPerpetual(true)}
                            className={`relative z-10 px-8 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${isPerpetual ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Vitalícia
                        </button>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 gap-8 xl:gap-12 lg:grid-cols-3">
                    {currentProducts.map((product) => (
                        <div
                            key={product.id}
                            className={`relative flex flex-col p-8 bg-white dark:bg-gray-800 rounded-2xl transition-all duration-300 border ${product.is_popular ? 'border-blue-500 shadow-2xl scale-105 z-10' : 'border-gray-100 dark:border-gray-700 hover:shadow-xl'}`}
                        >
                            {product.is_popular && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <span className="px-4 py-1 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full shadow-lg">
                                        Recomendado
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-center mb-6">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-48 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-lg font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-4">
                                    {product.name}
                                </h2>
                                <div className="flex items-baseline justify-center">
                                    <span className="text-4xl font-extrabold text-gray-800 dark:text-white">
                                        {product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-400 mt-2 block">
                                    {product.type.includes('annual') ? 'por ano' : 'pagamento único'}
                                </span>
                            </div>

                            <div className="flex-grow space-y-4 mb-8">
                                {product.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="mt-1"><FeatureIcon feature={feature} /></div>
                                        <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <span className="text-sm font-medium text-gray-500 mr-1">Quantidade:</span>
                                <button
                                    onClick={() => changeQty(product.id, -1)}
                                    className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-blue-400 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 font-bold"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center text-xl font-black text-gray-800 dark:text-white">{getQty(product.id)}</span>
                                <button
                                    onClick={() => changeQty(product.id, 1)}
                                    className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-blue-400 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all hover:scale-110 active:scale-95 font-bold"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => handleAddToCart(product)}
                                className={`w-full px-5 py-4 text-sm font-bold tracking-wide text-white uppercase transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 ${product.is_popular ? 'bg-gradient-to-r from-blue-600 to-blue-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                            >
                                <ShoppingCart className="inline-block w-4 h-4 mr-2" />
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Purchase;

