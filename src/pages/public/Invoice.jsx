import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useOrderStore } from '../../store/orderStore';
import { useQuoteStore } from '../../store/quoteStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Printer, Mail, Share2, CheckCircle } from 'lucide-react';

// --- Helper: Número por Extenso (Simples/Robusto para MZN) ---
const unidades = ["", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove"];
const dezenas = ["", "Dez", "Vinte", "Trinta", "Quarenta", "Cinquenta", "Sessenta", "Setenta", "Oitenta", "Noventa"];
const onzeADezenove = ["Dez", "Onze", "Doze", "Treze", "Quatorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove"];
const centenas = ["", "Cento", "Duzentos", "Trezentos", "Quatrocentos", "Quinhentos", "Seiscentos", "Setecentos", "Oitocentos", "Novecentos"];

function converterGrupo(n) {
    let extenso = "";
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (n === 100) return "Cem";

    if (c > 0) extenso += centenas[c];

    if (d === 1) {
        if (extenso) extenso += " e ";
        extenso += onzeADezenove[u];
        return extenso;
    }

    if (d > 1) {
        if (extenso) extenso += " e ";
        extenso += dezenas[d];
    }

    if (u > 0) {
        if (extenso) extenso += " e ";
        extenso += unidades[u];
    }
    return extenso;
}

function numeroPorExtenso(num) {
    if (num === 0) return "Zero Meticais";

    const inteiro = Math.floor(num);
    const centavos = Math.round((num - inteiro) * 100);

    let partes = [];

    const milhar = Math.floor(inteiro / 1000);
    const resto = inteiro % 1000;

    if (milhar > 0) {
        if (milhar === 1) partes.push("Mil");
        else partes.push(converterGrupo(milhar) + " Mil");
    }

    if (resto > 0) {
        if (partes.length > 0 && resto < 100 || (resto % 100 === 0)) partes.push("e");
        partes.push(converterGrupo(resto));
    }

    if (inteiro === 1) partes.push("Metical");
    else partes.push("Meticais");

    if (centavos > 0) {
        partes.push("e");
        partes.push(converterGrupo(centavos));
        if (centavos === 1) partes.push("Centavo");
        else partes.push("Centavos");
    }

    return partes.join(" ");
}

const Invoice = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const isQuote = searchParams.get('type') === 'quote';

    const { orders, fetchOrderById, loading: orderLoading } = useOrderStore();
    const { quotes } = useQuoteStore();
    const { settings } = useSettingsStore();
    const [localLoading, setLocalLoading] = useState(true);

    const order = isQuote
        ? quotes.find(q => q.id.toString() === orderId.toString())
        : orders.find(o => o.id.toString() === orderId.toString());

    useEffect(() => {
        const loadOrder = async () => {
            if (!isQuote && !order && orderId) {
                await fetchOrderById(orderId);
            }
            setLocalLoading(false);
        };
        loadOrder();
    }, [orderId, order, fetchOrderById, isQuote]);

    if (localLoading || (orderLoading && !order)) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50">
                <span className="loading loading-spinner text-blue-600 loading-lg"></span>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen grid place-items-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">{isQuote ? "Cotação" : "Fatura"} não encontrada</h1>
                    <Link to="/" className="text-blue-600 hover:underline">Voltar ao início</Link>
                </div>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    const totalExtenso = numeroPorExtenso(order.total);
    const displayId = order.friendly_id || order.id.substring(0, 8).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-100 py-6 print:bg-white print:p-0 font-sans">
            {/* Action Bar (Hidden in Print) */}
            <div className="max-w-[210mm] mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-3 px-4 print:hidden">
                <h1 className="text-2xl font-bold text-gray-800">{isQuote ? "Cotação" : "Fatura"} #{displayId}</h1>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform hover:scale-105"
                    >
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline">Imprimir / PDF</span>
                    </button>

                    <a
                        href={`mailto:${order.customer.email}?subject=${isQuote ? "Cotação" : "Fatura"} #${displayId}&body=Olá, segue em anexo a sua ${isQuote ? "proposta comercial" : "fatura"}.`}
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-bold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105"
                    >
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Email</span>
                    </a>

                    {order.customer.phone && (
                        <a
                            href={`https://api.whatsapp.com/send?phone=${order.customer.phone.replace(/\D/g, '')}&text=${encodeURIComponent(
                                `Olá ${order.customer.name}, a sua ${isQuote ? 'cotação' : 'fatura'} *#${displayId}* no valor de *${order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}* está disponível. Pode consultá-la em detalhe aqui: ${window.location.origin}/invoice/${order.id}${isQuote ? '?type=quote' : ''}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform hover:scale-105"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Invoice Paper - Compact Single-Page Design */}
            <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-[210mm] print:h-[297mm] flex flex-col relative text-sm print:m-0 overflow-hidden rounded-md print:rounded-none">

                {/* Header with Gradient Accent */}
                <div className="h-2 shrink-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>

                {/* Main Content Area (flex-stretch) */}
                <div className="flex-1 flex flex-col">

                    {/* Compact Header Section */}
                    <div className="px-8 pt-6 pb-4 flex justify-between items-start">
                        <div className="w-[55%]">
                            {settings?.invoiceLogo ? (
                                <img src={settings.invoiceLogo} alt="Logo" className="h-16 mb-3 object-contain" onError={(e) => e.target.style.display = 'none'} />
                            ) : (
                                <div className="mb-3">
                                    <h1 className="text-3xl font-extrabold text-amber-600">ASTER</h1>
                                    <span className="text-gray-400 text-[10px] uppercase font-bold">Tecnologia & Sistemas</span>
                                </div>
                            )}

                            <div className="text-xs text-gray-600 border-l-2 border-amber-500 pl-3">
                                <p className="font-bold text-gray-900 text-sm mb-1">{settings?.storeName || "ASTER"}</p>
                                <div className="whitespace-pre-line opacity-90 text-[11px]">{settings?.invoiceAddress || "Av. 24 de Julho\nMaputo, Moçambique"}</div>
                                {settings?.companyNuit && (
                                    <p className="mt-1 font-mono text-[10px] bg-gray-100 inline-block px-1.5 py-0.5 rounded text-gray-700">
                                        NUIT: <span className="font-bold">{settings.companyNuit}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="w-[40%] text-right">
                            <h2 className="text-3xl font-light text-gray-200 mb-2">{isQuote ? "COTAÇÃO / PROFORMA" : "FATURA"}</h2>
                            <div className="flex flex-col items-end gap-1.5">
                                <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-100 w-full">
                                    <span className="block text-[10px] uppercase text-gray-400 font-bold">Número</span>
                                    <span className="block text-lg font-mono font-bold text-gray-800">#{displayId}</span>
                                </div>
                                <div className="bg-gray-50 px-3 py-1.5 rounded border border-gray-100 w-full">
                                    <span className="block text-[10px] uppercase text-gray-400 font-bold">Data</span>
                                    <span className="block text-sm font-medium text-gray-800">{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div className={`px-3 py-1.5 rounded w-full flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-xs ${order.status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                    {order.status === 'paid' ? (
                                        <><span>PAGO</span> <CheckCircle className="w-3 h-3" /></>
                                    ) : (
                                        <span>PENDENTE</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Client Info - Compact */}
                    <div className="bg-gray-50 mx-8 p-4 rounded-lg border border-gray-100 mb-4">
                        <h3 className="text-[10px] font-bold uppercase text-amber-500 mb-2 tracking-wider">{isQuote ? "Proposta Para" : "Faturado Para"}</h3>
                        <div className="text-gray-800">
                            <p className="text-base font-bold">{order.customer.name}</p>
                            {order.customer.company && <p className="text-gray-600 text-xs">{order.customer.company}</p>}
                            <p className="text-gray-500 text-xs font-mono">{order.customer.email}</p>
                            {order.customer.phone && <p className="text-gray-500 text-xs">{order.customer.phone}</p>}
                        </div>
                    </div>

                    {/* Items Table - Compact */}
                    <div className="px-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 font-bold text-gray-400 uppercase text-[10px] tracking-wider">Descrição</th>
                                    <th className="text-center py-2 font-bold text-gray-400 uppercase text-[10px] tracking-wider w-16">Qtd</th>
                                    <th className="text-right py-2 font-bold text-gray-400 uppercase text-[10px] tracking-wider w-24">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-3">
                                            <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                            <p className="text-[10px] text-gray-400">{item.features ? item.features.slice(0, 1).join(', ') : 'Produto Digital'}</p>

                                            {/* License Display - Compact */}
                                            {order.status === 'paid' && item.licenseKey && (
                                                <div className="mt-1.5 inline-flex flex-col bg-gray-50 border border-gray-200 rounded px-2 py-1">
                                                    <span className="text-[9px] uppercase font-bold text-gray-400">Chave</span>
                                                    <code className="text-xs font-mono text-blue-600 font-bold select-all">{item.licenseKey}</code>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 text-center text-gray-500 text-xs">1</td>
                                        <td className="py-3 text-right font-bold text-gray-800 text-sm">
                                            {item.price.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Spacer to push content to bottom */}
                    <div className="flex-grow"></div>

                    {/* Financial Summary - Compact Single Row */}
                    <div className="mx-8 mt-4 bg-amber-50/30 rounded-lg p-4 border border-amber-100">
                        <div className="flex gap-6">
                            {/* Bank Info - Compact */}
                            <div className="flex-1">
                                <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-2 tracking-wider">Dados Bancários</h3>
                                <div className="grid grid-cols-1 gap-1.5">
                                    {settings?.bankAccountBIM && (
                                        <div className="flex items-center justify-between text-xs p-1.5 bg-white rounded border border-gray-100">
                                            <span className="font-bold text-gray-700">Millennium BIM</span>
                                            <span className="font-mono text-gray-600 text-[11px]">{settings.bankAccountBIM}</span>
                                        </div>
                                    )}
                                    {settings?.bankAccountMPesa && (
                                        <div className="flex items-center justify-between text-xs p-1.5 bg-white rounded border border-gray-100">
                                            <span className="font-bold text-red-600">M-Pesa</span>
                                            <span className="font-mono text-gray-600 text-[11px]">{settings.bankAccountMPesa}</span>
                                        </div>
                                    )}
                                    {settings?.bankAccountEMola && (
                                        <div className="flex items-center justify-between text-xs p-1.5 bg-white rounded border border-gray-100">
                                            <span className="font-bold text-orange-500">e-Mola</span>
                                            <span className="font-mono text-gray-600 text-[11px]">{settings.bankAccountEMola}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Totals - Compact */}
                            <div className="w-[280px]">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-sm text-gray-800 font-bold">{(order.total / 1.16).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-amber-200">
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">IVA (16%)</span>
                                    <span className="text-sm text-gray-800 font-bold">{(order.total - (order.total / 1.16)).toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}</span>
                                </div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-amber-900 font-black text-base whitespace-nowrap">TOTAL</span>
                                    <span className="text-amber-600 font-black text-2xl">
                                        {order.total.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 whitespace-nowrap">Por Extenso</p>
                                    <p className="text-[11px] text-gray-600 font-medium italic">
                                        {totalExtenso}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End of Main Content Area */}
                </div>

                {/* Bottom Accent / Separator */}
                <div className="mt-8 h-1 w-full shrink-0 bg-gradient-to-r from-amber-500 to-amber-600"></div>

                {/* Footer - Elegant & Organized */}
                <div className="px-10 py-6 bg-gray-50 flex flex-col items-center shrink-0">
                    <div className="w-full flex justify-between items-start text-center mb-4">
                        <div className="flex flex-col gap-0.5 w-1/4">
                            <span className="font-bold uppercase text-amber-600 text-[9px] tracking-wider">Website</span>
                            <span className="font-medium text-gray-800 text-[10px]">www.aster.co.mz</span>
                        </div>
                        <div className="flex flex-col gap-0.5 w-1/4 border-l border-gray-200">
                            <span className="font-bold uppercase text-amber-600 text-[9px] tracking-wider">Email</span>
                            <span className="font-medium text-gray-800 text-[10px]">geral@aster.co.mz</span>
                        </div>
                        <div className="flex flex-col gap-0.5 w-1/4 border-l border-gray-200">
                            <span className="font-bold uppercase text-amber-600 text-[9px] tracking-wider">Facebook</span>
                            <span className="font-medium text-gray-800 text-[10px]">facebook.com/aster.co.mz</span>
                        </div>
                        <div className="flex flex-col gap-0.5 w-1/4 border-l border-gray-200">
                            <span className="font-bold uppercase text-amber-600 text-[9px] tracking-wider">Contato</span>
                            <span className="font-medium text-gray-800 text-[10px]">87 849 1 000</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest mt-2">
                        Obrigado pela preferência. • {isQuote ? "Este documento não serve de fatura" : "Documento válido para efeitos fiscais"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
