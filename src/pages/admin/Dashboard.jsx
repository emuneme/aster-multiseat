import React from 'react';
import { Users, ShoppingCart, DollarSign, Activity, Package, ArrowRight, PieChart as PieChartIcon, BarChart, Monitor, Download, MessageSquare, Clock, CheckCircle, LifeBuoy, FileText } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useCustomerStore } from '../../store/customerStore';
import { useTicketStore } from '../../store/ticketStore';
import { useQuoteStore } from '../../store/quoteStore';
import { useContractStore } from '../../store/contractStore';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import InfoWidgets from '../../components/InfoWidgets';
import { exportToExcel } from '../../utils/exportToExcel';
import { toFriendlyOrderId } from '../../utils/friendlyId';

const Dashboard = () => {
    const { orders } = useOrderStore();
    const { customers } = useCustomerStore();
    const { tickets } = useTicketStore();
    const { quotes } = useQuoteStore();
    const { contracts, fetchContracts } = useContractStore();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchContracts();
    }, [fetchContracts]);

    // Stats Calculation
    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, order) => sum + order.total, 0);

    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
    const activeContracts = contracts.filter(c => c.status === 'Assinado' || c.status === 'Em Revisão').length;
    const totalCustomers = new Set([...customers.map(c => c.email), ...orders.map(o => o.customer.email)]).size;

    const stats = [
        { label: "Receita Total", value: totalRevenue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }), icon: <DollarSign className="w-6 h-6 text-white" />, bg: "bg-gradient-to-br from-green-400 to-green-600", shadow: "shadow-green-200" },
        { label: "Pedidos Pendentes", value: pendingOrders, icon: <ShoppingCart className="w-6 h-6 text-white" />, bg: "bg-gradient-to-br from-orange-400 to-orange-600", shadow: "shadow-orange-200" },
        { label: "Cotações Pend.", value: pendingQuotes, icon: <FileText className="w-6 h-6 text-white" />, bg: "bg-gradient-to-br from-indigo-400 to-indigo-600", shadow: "shadow-indigo-200" },
        { label: "Contratos Ativos", value: activeContracts, icon: <CheckCircle className="w-6 h-6 text-white" />, bg: "bg-gradient-to-br from-teal-400 to-teal-600", shadow: "shadow-teal-200" },
    ];

    // Data for Revenue Area Chart (Last 7 Days)
    const getRevenueData = () => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const dayRevenue = orders
                .filter(o => o.date.startsWith(date) && o.status !== 'cancelled')
                .reduce((sum, o) => sum + o.total, 0);
            return {
                name: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                receita: dayRevenue
            };
        });
    };
    const revenueData = getRevenueData();

    // Data for Payment Method Pie Chart
    const getPaymentMethodData = () => {
        const methods = { pos: 0, cash: 0, mpesa: 0, bim: 0, web: 0 };
        orders.forEach(o => {
            if (o.status === 'cancelled') return;
            // Map legacy/web orders to 'web' or use specific method if exists
            const method = o.paymentMethod || (o.source === 'manual' ? 'pos' : 'web');
            methods[method] = (methods[method] || 0) + o.total;
        });

        const labels = { pos: 'POS', cash: 'Numerário', mpesa: 'M-Pesa', bim: 'Transf. BIM', web: 'Site' };
        const colors = { pos: '#3B82F6', cash: '#10B981', mpesa: '#EF4444', bim: '#F59E0B', web: '#8B5CF6' };

        return Object.keys(methods)
            .filter(k => methods[k] > 0)
            .map(k => ({ name: labels[k] || k, value: methods[k], color: colors[k] || '#ccc' }));
    };
    const paymentData = getPaymentMethodData();

    const handleExportGeneralReport = () => {
        const reportData = orders.map(o => ({
            'ID do Pedido': o.id,
            'Data': new Date(o.date).toLocaleDateString('pt-MZ'),
            'Cliente': o.customer.name,
            'Email': o.customer.email,
            'Telefone': o.customer.phone || 'N/A',
            'Total (MZN)': o.total,
            'Status': o.status === 'paid' ? 'Pago' : o.status === 'pending' ? 'Pendente' : 'Cancelado',
            'Método Pagt.': o.paymentMethod || o.source,
            'Nº de Itens': o.items?.length || 0
        }));

        exportToExcel(reportData, 'Relatorio_Geral_ASTER', 'Estatisticas');
    };

    return (
        <div className="animate-fade-in-up pb-10">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Visão Geral</h1>
                    <p className="text-gray-500 mt-1">Bem-vindo ao painel de controle da ASTER.</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <button
                        onClick={handleExportGeneralReport}
                        className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl text-sm font-bold border border-green-200 flex items-center gap-2 transition-colors mr-2"
                        title="Exportar Relatório Geral para Excel"
                    >
                        <Download className="w-4 h-4" /> Exportar Relatório (.xlsx)
                    </button>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> v2.5 Live
                    </span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200 flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> US-East-1
                    </span>
                </div>
            </header>

            {/* Live Widgets: Clock, Temperature, Exchange Rate */}
            <InfoWidgets />

            {/* Helpdesk Quick Overview Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5 text-blue-500" /> Central de Assistência (Helpdesk)
                </h2>
                <Link to="/admin/tickets" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    Ver Todos os Chamados <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {tickets.slice(0, 3).map(ticket => (
                    <div key={ticket.id} onClick={() => navigate('/admin/tickets', { state: { openTicketId: ticket.id } })} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${ticket.status === 'Novo' ? 'bg-blue-50 text-blue-600' :
                                    ticket.status === 'Resolvido' ? 'bg-green-50 text-green-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>
                                    {ticket.status === 'Novo' ? <MessageSquare className="w-6 h-6" /> :
                                        ticket.status === 'Resolvido' ? <CheckCircle className="w-6 h-6" /> :
                                            <Clock className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 transition-colors">{ticket.subject}</h3>
                                    <p className="text-xs font-bold text-gray-400 mt-0.5">{ticket.customer.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-mono font-bold uppercase">{ticket.friendly_id}</span>
                            <span className="text-xs font-bold text-gray-400 flex items-center gap-1"><Clock className={`w-3 h-3 ${ticket.status === 'Resolvido' ? 'text-green-500' : ''}`} /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}

                {tickets.length === 0 && (
                    <div className="col-span-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-dashed border-gray-200 focus:outline outline-dashed justify-center items-center flex flex-col">
                        <LifeBuoy className="w-10 h-10 text-gray-300 mb-3" />
                        <h3 className="font-bold text-gray-600">Sem chamados registados</h3>
                        <p className="text-sm text-gray-400">Quando os clientes submeterem pedidos de suporte, eles aparecerão aqui.</p>
                    </div>
                )}
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.shadow} shadow-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-2xl font-extrabold text-gray-800 dark:text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <BarChart className="w-5 h-5 text-blue-500" /> Receita (Últimos 7 Dias)
                        </h2>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value) => [value.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' }), 'Receita']}
                                />
                                <Area type="monotone" dataKey="receita" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Payment Methods Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-purple-500" /> Fontes de Receita
                        </h2>
                    </div>
                    <div className="h-72 w-full flex justify-center items-center">
                        {paymentData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {paymentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => value.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })} />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-gray-400 text-sm">Sem dados de pagamento ainda.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders List - Premium */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Pedidos Recentes</h2>
                            <p className="text-sm text-gray-400">Últimas transações na plataforma</p>
                        </div>
                        <Link to="/admin/orders" className="btn btn-sm btn-outline gap-2">
                            Ver Todos <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-all border border-transparent hover:border-gray-100 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${order.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {order.customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition-colors">{order.customer.name}</p>
                                        <p className="text-xs text-gray-400 font-mono">{toFriendlyOrderId(order.id)} • {new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800 dark:text-white">
                                        {order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                    </p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${order.status === 'paid' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'}`}>
                                        {order.status === 'paid' ? 'Pago' : 'Pendente'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && (
                            <div className="text-center py-10 text-gray-400">
                                Nenhum pedido registrado ainda.
                            </div>
                        )}
                    </div>
                </div>

                {/* Split grid for Cotações e Contratos */}
                <div className="flex flex-col gap-8">
                    {/* Cotações Recentes */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Cotações Pendentes</h2>
                            </div>
                            <Link to="/admin/quotes" className="text-sm text-blue-500 font-bold hover:underline">Ver Todas</Link>
                        </div>
                        <div className="space-y-3">
                            {quotes.filter(q => q.status === 'pending').slice(0, 3).map((quote) => (
                                <div key={quote.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">{quote.customer?.name}</p>
                                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">{quote.id}</p>
                                    </div>
                                    <p className="font-extrabold text-sm text-indigo-600">
                                        {quote.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                    </p>
                                </div>
                            ))}
                            {quotes.filter(q => q.status === 'pending').length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">Sem cotações pendentes.</p>
                            )}
                        </div>
                    </div>

                    {/* Contratos Recentes */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-white">Últimos Contratos</h2>
                            </div>
                            <Link to="/admin/contracts" className="text-sm text-teal-500 font-bold hover:underline">Gerir</Link>
                        </div>
                        <div className="space-y-3">
                            {contracts.slice(0, 3).map((contract) => (
                                <div key={contract.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1">{contract.customer?.name}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Sub: {contract.monthly_value.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}/mês</p>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase ${contract.status === 'Assinado' ? 'bg-teal-100 text-teal-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {contract.status}
                                    </span>
                                </div>
                            ))}
                            {contracts.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-4">Nenhum contrato ativo.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden mt-8">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-2">Ações Rápidas</h2>
                    <p className="text-blue-100 mb-8 text-sm">Gerencie sua loja com eficiência.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/admin/orders" className="flex items-center justify-center p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/10">
                            <Package className="w-5 h-5 mr-3" />
                            <span className="font-bold text-sm">Novo Pedido Manual</span>
                        </Link>
                        <Link to="/admin/products" className="flex items-center justify-center p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/10">
                            <Activity className="w-5 h-5 mr-3" />
                            <span className="font-bold text-sm">Adicionar Produto</span>
                        </Link>
                        <Link to="/admin/customers" className="flex items-center justify-center p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all border border-white/10">
                            <Users className="w-5 h-5 mr-3" />
                            <span className="font-bold text-sm">Ver Clientes</span>
                        </Link>
                    </div>
                </div>
                {/* Abstract Circles */}
                <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default Dashboard;
