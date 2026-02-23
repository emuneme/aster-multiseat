import React, { useState } from 'react';
import { useProductStore } from '../../store/productStore';
import { Edit, Trash2, Plus, Star, Tag, X, Save } from 'lucide-react';

const Products = () => {
    const { products, addProduct, updateProduct, deleteProduct, toggleFeatured } = useProductStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'annual',
        desc: '',
        features: []
    });

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                category: product.category,
                features: product.features || []
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                category: 'annual',
                features: ['Suporte Técnico'] // Default feature
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFeaturesChange = (e) => {
        const featuresArray = e.target.value.split('\n').filter(f => f.trim() !== '');
        setFormData({ ...formData, features: featuresArray });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            users: formData.category.includes('2') ? 2 : formData.category.includes('3') ? 3 : 6 // Basic logic extraction
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct(productData);
        }
        closeModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Produtos & Licenças</h1>
                <button
                    onClick={() => openModal()}
                    className="btn bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none gap-2 shadow-lg shadow-green-200 dark:shadow-none hover:shadow-xl hover:scale-105 transition-all rounded-xl font-bold"
                >
                    <Plus className="w-5 h-5" /> Novo Produto
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th>Nome</th>
                                <th>Preço (MZN)</th>
                                <th>Categoria</th>
                                <th>Destaque</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="font-bold text-gray-700 dark:text-gray-200">{product.name}</td>
                                    <td>{product.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</td>
                                    <td>
                                        <span className={`badge ${product.category === 'annual' ? 'badge-info' : product.category === 'monthly' ? 'badge-secondary' : 'badge-warning'} badge-sm`}>
                                            {product.category === 'annual' ? 'Anual' : product.category === 'monthly' ? 'Mensal' : 'Vitalício'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => toggleFeatured(product.id)}
                                            className={`btn btn-circle btn-sm ${product.is_popular ? 'btn-warning text-white' : 'btn-ghost text-gray-300'}`}
                                        >
                                            <Star className="w-4 h-4 fill-current" />
                                        </button>
                                    </td>
                                    <td className="flex gap-2">
                                        <button onClick={() => openModal(product)} className="btn btn-square btn-sm btn-outline text-blue-600 hover:bg-blue-50 border-blue-300">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="btn btn-square btn-sm btn-outline text-red-500 hover:bg-red-50 border-red-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative animate-in zoom-in-95">
                        <button onClick={closeModal} className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost">
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">
                            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="form-control">
                                <label className="label font-medium">Nome do Produto</label>
                                <input
                                    type="text"
                                    required
                                    className="input input-bordered w-full"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label font-medium">Preço (MZN)</label>
                                    <input
                                        type="number"
                                        required
                                        className="input input-bordered w-full"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label font-medium">Categoria</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="monthly">Mensal</option>
                                        <option value="annual">Anual</option>
                                        <option value="perpetual">Vitalício</option>
                                        <option value="perpetual">Sem vinculo</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label font-medium">Funcionalidades (uma por linha)</label>
                                <textarea
                                    className="textarea textarea-bordered h-32"
                                    placeholder="Ex: 2 Usuários&#10;Suporte Técnico"
                                    value={formData.features.join('\n')}
                                    onChange={handleFeaturesChange}
                                ></textarea>
                            </div>

                            <div className="modal-action">
                                <button type="button" onClick={closeModal} className="btn btn-ghost">Cancelar</button>
                                <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white border-none gap-2">
                                    <Save className="w-4 h-4" /> Salvar Produto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
