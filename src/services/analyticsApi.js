/**
 * Analytics Service (Visual Mock Mode)
 * Fornece dados simulados para visualização do painel administrativo.
 */

/**
 * Simula o tráfego geral do Google Analytics 4
 */
export const fetchGA4Metrics = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simula carga

        // Gera dados semi-aleatórios e crescentes para manter o aspeto "vivo"
        const baseUsers = 1540;
        const baseViews = 4890;
        const spike = Math.floor(Math.random() * 50);

        return {
            users: baseUsers + spike,
            views: baseViews + (spike * 3),
            status: 'success'
        };

    } catch (error) {
        console.error("Erro simulado do GA4:", error);
        return { users: 0, views: 0, status: 'error' };
    }
};

/**
 * Simula o rastreio de eventos do Meta Pixel (Facebook)
 */
export const fetchMetaStats = async () => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simula carga

        const baseEvents = 5230;
        const spike = Math.floor(Math.random() * 100);

        return {
            pageViews: baseEvents + spike,
            status: 'success'
        };

    } catch (error) {
        console.error("Erro simulado do Meta:", error);
        return { pageViews: 0, status: 'error' };
    }
};
