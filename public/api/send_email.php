<?php
// Set headers for CORS and JSON content
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (
    empty($data->name) ||
    empty($data->email) ||
    empty($data->message)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Dados incompletos"]);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags($data->name));
$email = filter_var($data->email, FILTER_SANITIZE_EMAIL);
$phone = isset($data->phone) ? htmlspecialchars(strip_tags($data->phone)) : "Não informado";
$subject = isset($data->subject) ? htmlspecialchars(strip_tags($data->subject)) : "Novo Contato do Site";
$message = htmlspecialchars(strip_tags($data->message));

// Email configuration
$to = "geral@aster.co.mz"; // Main recipient
$email_subject = "[Site Contact] $subject";

// Email Body
$email_body = "
<html>
<head>
    <title>Nova Mensagem do Site</title>
</head>
<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
    <div style='background-color: #f4f4f4; padding: 20px;'>
        <div style='background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);'>
            <h2 style='color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 10px;'>Nova Mensagem de Contato</h2>
            <p><strong>Nome:</strong> $name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Telefone:</strong> $phone</p>
            <p><strong>Assunto:</strong> $subject</p>
            <div style='margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #0056b3;'>
                <p><strong>Mensagem:</strong></p>
                <p style='white-space: pre-wrap;'>$message</p>
            </div>
            <p style='font-size: 12px; color: #888; margin-top: 20px;'>Enviado via formulário do site ASTER.</p>
        </div>
    </div>
</body>
</html>
";

// Headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Site ASTER <geral@aster.co.mz>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

// Send email
if (mail($to, $email_subject, $email_body, $headers)) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Mensagem enviada com sucesso!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Falha ao enviar mensagem. Verifique a configuração do servidor."]);
}
?>