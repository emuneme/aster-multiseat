const { Resend } = require('resend');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// InsForge Edge Function for Notification
module.exports = async function (request) {
    if (request.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    // Apenas aceita requisições POST
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const resend = new Resend('re_JFEGY6q5_NLm3rQit39pKcmccwUDbjojz');
        const adminEmail = 'emunene@aster.co.mz';

        let subject = '';
        let htmlBody = '';

        if (body.type === 'new_ticket') {
            subject = `[Aster Portal] ${body.title}`;
            htmlBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #2563eb; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Novo Chamado de Suporte</h2>
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="color: #1f2937;">${body.title}</h3>
                        <p style="color: #4b5563; line-height: 1.5;">${body.message}</p>
                        
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="https://aster.co.mz/admin/tickets" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Aceder ao Painel Admin</a>
                        </div>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                        Aster Lda &copy; ${new Date().getFullYear()} - Sistema Automático de Notificações
                    </div>
                </div>
            `;
        }
        else if (body.type === 'new_customer') {
            subject = `[Aster Portal] ${body.title}`;
            htmlBody = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #059669; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Novo Registo de Cliente</h2>
                    </div>
                    <div style="padding: 20px;">
                        <h3 style="color: #1f2937;">Detalhes do Registo</h3>
                        <p style="color: #4b5563; line-height: 1.5;">${body.message}</p>
                        
                        <div style="margin-top: 30px; text-align: center;">
                            <a href="https://aster.co.mz/admin/customers" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Ver Cliente</a>
                        </div>
                    </div>
                    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                        Aster Lda &copy; ${new Date().getFullYear()} - Sistema Automático de Notificações
                    </div>
                </div>
            `;
        }
        else {
            return new Response(JSON.stringify({ error: 'Tipo de notificação inválido' }), { status: 400, headers: corsHeaders });
        }

        const data = await resend.emails.send({
            from: 'Aster Notificações <onboarding@resend.dev>', // Email padrão de sandbox para teste (deve estar verificado no Resend)
            to: adminEmail,
            subject: subject,
            html: htmlBody
        });

        return new Response(JSON.stringify({ success: true, data }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Email Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
};
