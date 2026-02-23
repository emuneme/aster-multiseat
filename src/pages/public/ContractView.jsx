import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContractStore } from '../../store/contractStore';
import { Printer } from 'lucide-react';

const ContractView = () => {
    const { contractId } = useParams();
    const { contracts, fetchContracts } = useContractStore();

    useEffect(() => {
        if (contracts.length === 0) fetchContracts();
    }, [contracts.length]);

    const contract = contracts.find(c => c.id === contractId);

    if (!contract) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse">A carregar contrato ou não existe...</div>
            </div>
        );
    }

    const displayCustomer = contract.customer || contract.customer_snapshot || {};
    const { clauses } = contract;

    return (
        <div className="min-h-screen bg-gray-200 py-8 print:bg-white print:py-0 text-gray-800">
            {/* Action Bar (Hidden when printing) */}
            <div className="max-w-[210mm] mx-auto mb-4 flex justify-end print:hidden">
                <button
                    onClick={() => window.print()}
                    className="btn bg-blue-600 hover:bg-blue-700 text-white shadow-lg border-none"
                >
                    <Printer className="w-5 h-5 mr-2" /> Exportar PDF / Imprimir
                </button>
            </div>

            {/* A4 Document Area */}
            <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full p-12 relative overflow-hidden">
                {/* Header elements matching Aster Branding */}
                <div className="flex justify-between items-start mb-12 border-b-2 border-amber-500 pb-6">
                    <div>
                        <img src="/src/assets/logo.png" alt="ASTER" className="h-14 mb-4" />
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest leading-none">
                            CONTRATO DE PRESTAÇÃO DE SERVIÇOS
                        </h1>
                        <p className="text-sm text-gray-500 mt-1 font-bold tracking-widest">{contract.friendly_id}</p>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                        <p className="font-bold text-gray-900 text-sm">ASTER MULTISEAT (A. LIDA)</p>
                        <p>Av. das Indústrias, Maputo</p>
                        <p>Moçambique</p>
                        <p>NUIT: 400123456</p>
                        <p>Geral: +258 84 000 0000</p>
                    </div>
                </div>

                {/* Preambulo */}
                <div className="prose prose-sm max-w-none text-justify mb-8">
                    <p>
                        Entre <strong>ASTER MULTISEAT (A. LIDA)</strong>, adiante designada por <strong>«PRIMEIRO OUTORGANTE»</strong> ou <strong>«ASTER»</strong>,  e
                    </p>
                    <p>
                        <strong>{displayCustomer.name || '_________________________'}</strong>, contribuinte nº {displayCustomer.nuit || displayCustomer.document || '________________'},
                        com sede em {displayCustomer.address || '_________________________________'}, adiante designada por <strong>«SEGUNDO OUTORGANTE»</strong> ou <strong>«CLIENTE»</strong>.
                    </p>
                    <p>
                        Considerando que a ASTER atua no setor da tecnologia da informação e suporte, e o CLIENTE necessidade dos referidos serviços,
                        é celebrado o presente Contrato de Prestação de Serviços, regido pelas cláusulas seguintes:
                    </p>
                </div>

                {/* Clausulas */}
                <div className="space-y-6 mb-16">
                    {clauses?.map((clause, idx) => (
                        <div key={idx} className="break-inside-avoid">
                            <h3 className="font-bold text-gray-900 text-sm mb-2 underline">{clause.title}</h3>
                            <p className="text-sm text-gray-700 text-justify leading-relaxed">{clause.text}</p>
                        </div>
                    ))}

                    {/* Cláusula Estática de Exemplo */}
                    {!clauses?.find(c => c.title.includes('Deveres')) && (
                        <div className="break-inside-avoid">
                            <h3 className="font-bold text-gray-900 text-sm mb-2 underline">4. Deveres da ASTER</h3>
                            <p className="text-sm text-gray-700 text-justify leading-relaxed">
                                A ASTER obriga-se a prestar os serviços estabelecidos na Cotação base com diligência, zelando pela integridade
                                dos equipamentos e confidencialidade dos dados do CLIENTE. O portal de Helpdesk será disponibilizado 24/7.
                            </p>
                        </div>
                    )}
                </div>

                {/* Values Highlight */}
                <div className="bg-gray-50 border border-gray-200 p-6 mb-12 flex justify-between items-center rounded-lg">
                    <div>
                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">Vencimento Mensal Acordado</p>
                        <p className="font-black text-2xl text-blue-600">
                            {contract.monthly_value?.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs uppercase font-bold text-gray-500 mb-1">Validade do Acordo</p>
                        <p className="font-bold text-gray-900">
                            {contract.valid_until ? new Date(contract.valid_until).toLocaleDateString() : 'Indeterminado'}
                        </p>
                    </div>
                </div>

                {/* Assinaturas */}
                <div className="mt-16 pt-8 break-inside-avoid">
                    <p className="text-sm mb-12">
                        Maputo, {new Date(contract.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between gap-12">
                        <div className="flex-1 border-t border-gray-400 pt-2 text-center">
                            <p className="font-bold text-sm text-gray-800">ASTER MULTISEAT (A. LIDA)</p>
                            <p className="text-xs text-gray-500 uppercase">O Primeiro Outorgante</p>
                        </div>
                        <div className="flex-1 border-t border-gray-400 pt-2 text-center">
                            <p className="font-bold text-sm text-gray-800">{displayCustomer.name || 'O Cliente'}</p>
                            <p className="text-xs text-gray-500 uppercase">O Segundo Outorgante</p>
                        </div>
                    </div>
                </div>

                {/* Footer Legal (Print only) */}
                <div className="absolute bottom-8 left-12 right-12 text-center text-[9px] text-gray-400 pt-4 border-t border-gray-100 print:block">
                    Este documento não serve como fatura-recibo. Os pagamentos devidos pelas prestações de serviços serão liquidados contra Invoce mensal enviada. Documento gerado eletronicamente no sistema Aster MS ({contract.id}).
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; size: A4; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}} />
        </div>
    );
};

export default ContractView;
