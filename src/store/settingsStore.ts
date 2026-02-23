import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
    storeName: string;
    contactEmail: string;
    currency: string;
    currencyRate: number;
    enableNotifications: boolean;
    invoiceLogo: string;
    invoiceAddress: string;
    invoiceFooter: string;
    bankAccountBIM: string;
    bankAccountMPesa: string;
    bankAccountEMola: string;
    companyNuit: string;
    companyPhone: string;
    companyWebsite: string;
    companyFacebook: string;
    companyEmail: string;
}

interface SettingsState {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            settings: {
                storeName: 'Soluções inteligentes, mais acessíveis e sustentáveis!',
                contactEmail: 'gereal@aster.co.mz',
                currency: 'MZN',
                currencyRate: 1.0,
                enableNotifications: true,
                invoiceLogo: '/src/assets/logo.png',
                invoiceAddress: 'Av. 24 de Julho, Maputo, Moçambique',
                invoiceFooter: 'Obrigado pela preferência.',
                bankAccountBIM: '172176553',
                bankAccountMPesa: '84 550 0 561',
                bankAccountEMola: '87 849 1 000',
                companyNuit: '103860822',
                companyPhone: '87 849 1 000',
                companyWebsite: 'www.aster.co.mz',
                companyFacebook: 'facebook.com/aster.co.mz',
                companyEmail: 'geral@aster.co.mz',
            },
            updateSettings: (newSettings) => set((state) => ({
                settings: { ...state.settings, ...newSettings }
            })),
        }),
        {
            name: 'aster-settings-storage',
        }
    )
);
