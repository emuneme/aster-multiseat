const { Resend } = require('resend');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

module.exports = async function (request) {
    if (request.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
    }

    try {
        const body = await request.json();
        const resend = new Resend('re_JFEGY6q5_NLm3rQit39pKcmccwUDbjojz');

        if (!body.email || !body.name || !body.newPassword) {
            return new Response(JSON.stringify({ error: 'Faltam parâmetros' }), { status: 400, headers: corsHeaders });
        }

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                    <h2 style="color: white; margin: 0;">Acesso ao Portal ASTER</h2>
                </div>
                <div style="padding: 20px;">
                    <h3 style="color: #1f2937;">Olá, ${body.name}</h3>
                    <p style="color: #4b5563; line-height: 1.5;">A sua nova credencial de acesso ao Portal de Suporte foi gerada com sucesso pela nossa equipa de administração.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: bold;">A sua nova Senha / Credencial</p>
                        <p style="margin: 5px 0 0 0; color: #111827; font-size: 24px; font-weight: 900; letter-spacing: 2px;">${body.newPassword}</p>
                    </div>

                    <p style="color: #4b5563; line-height: 1.5;">Utilize o seu e-mail e esta nova credencial genérica para iniciar sessão. Recomendamos que guarde este dado em segurança.</p>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://aster.co.mz/portal/login" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Aceder ao Portal</a>
                    </div>
                </div>
                <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                    Aster Lda &copy; ${new Date().getFullYear()} - Sistema Automático de Notificações
                </div>
            </div>
        `;

        const data = await resend.emails.send({
            from: 'Aster Notificações <onboarding@resend.dev>',
            to: body.email,
            subject: 'A sua nova Senha de Acesso - Aster Portal',
            html: htmlBody
        });

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Email Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
};
