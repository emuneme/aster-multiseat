import { createClient } from '@insforge/sdk';

const insforgeUrl = import.meta.env.VITE_INSFORGE_URL;
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!insforgeUrl || !insforgeAnonKey) {
    console.error("InsForge Credentials are not correctly configured in environment variables.");
}

export const insforge = createClient({
    baseUrl: insforgeUrl || '',
    anonKey: insforgeAnonKey || '',
});
