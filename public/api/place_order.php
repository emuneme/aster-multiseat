<?php
// Debugging Configuration
ini_set('display_errors', 0); // Don't output raw errors to avoid breaking JSON
ini_set('log_errors', 1);
error_reporting(E_ALL);

// Set headers for CORS and JSON content
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Custom Error Handler to return JSON
function jsonErrorHandler($errno, $errstr, $errfile, $errline)
{
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Erro PHP Interno: $errstr",
        "debug" => ["file" => $errfile, "line" => $errline]
    ]);
    exit();
}
set_error_handler("jsonErrorHandler");

// Catch Fatal Errors
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_CORE_ERROR || $error['type'] === E_COMPILE_ERROR)) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Erro Fatal PHP: " . $error['message'],
            "debug" => ["file" => $error['file'], "line" => $error['line']]
        ]);
    }
});

try {
    // Handle preflight
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    // Only allow POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método não permitido (Apenas POST)", 405);
    }

    // Get JSON input
    $inputJSON = file_get_contents("php://input");
    if (!$inputJSON) {
        throw new Exception("Nenhum dado recebido");
    }

    $data = json_decode($inputJSON);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Erro ao decodificar JSON: " . json_last_error_msg());
    }

    // Validate input logic...
    if (
        empty($data->customer->name) ||
        empty($data->customer->email) ||
        empty($data->items) ||
        !is_array($data->items)
    ) {
        throw new Exception("Dados incompletos (Nome, Email ou Itens faltando)", 400);
    }

    // Sanitize Customer Info
    $customerName = htmlspecialchars(strip_tags($data->customer->name));
    $customerEmail = filter_var($data->customer->email, FILTER_SANITIZE_EMAIL);
    $customerPhone = isset($data->customer->phone) ? htmlspecialchars(strip_tags($data->customer->phone)) : "Não informado";
    $paymentMethod = isset($data->customer->paymentMethod) ? htmlspecialchars(strip_tags($data->customer->paymentMethod)) : "Não informado";

    // Map payment method to readable string
    $paymentLabel = 'A Combinar';
    switch ($paymentMethod) {
        case 'mpesa':
            $paymentLabel = 'M-Pesa (84 000 0000)';
            break;
        case 'bank':
            $paymentLabel = 'Transferência Bancária (BIM/BCI)';
            break;
    }

    // Build Order Table HTML
    $orderRows = "";
    $total = 0;

    foreach ($data->items as $item) {
        $itemName = htmlspecialchars(strip_tags($item->name));
        $quantity = (int) $item->quantity;
        $price = (float) $item->price;
        $subtotal = $price * $quantity;
        $total += $subtotal;

        $priceFormatted = number_format($price, 2, ',', '.') . " MT";
        $subtotalFormatted = number_format($subtotal, 2, ',', '.') . " MT";

        $orderRows .= "
        <tr>
            <td style='padding: 10px; border-bottom: 1px solid #eee;'>$itemName</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: center;'>$quantity</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>$priceFormatted</td>
            <td style='padding: 10px; border-bottom: 1px solid #eee; text-align: right;'>$subtotalFormatted</td>
        </tr>";
    }

    $totalFormatted = number_format($total, 2, ',', '.') . " MT";
    $orderId = "KEY-" . strtoupper(substr(uniqid(), -6));
    $orderDate = date("d/m/Y H:i");

    // Email Config
    $to = "geral@aster.co.mz";
    $subject = "[Novo Pedido] #$orderId - $customerName";

    // Email Body
    $emailBody = "
    <html>
    <head>
        <title>Novo Pedido #$orderId</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;'>
        <div style='max-width: 600px; margin: 0 auto; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);'>
            <div style='text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 20px; margin-bottom: 20px;'>
                <h1 style='color: #0056b3; margin: 0;'>Novo Pedido Recebido</h1>
                <p style='color: #888; margin-top: 5px;'>ID: <strong>#$orderId</strong> | Data: $orderDate</p>
            </div>

            <div style='margin-bottom: 30px;'>
                <h3 style='color: #333; border-left: 4px solid #f59e0b; padding-left: 10px;'>Dados do Cliente</h3>
                <p><strong>Nome:</strong> $customerName</p>
                <p><strong>Email:</strong> $customerEmail</p>
                <p><strong>Telefone:</strong> $customerPhone</p>
                <p><strong>Método de Pagamento:</strong> <span style='color: #d97706; font-weight: bold;'>$paymentLabel</span></p>
            </div>

            <div style='margin-bottom: 30px;'>
                <h3 style='color: #333; border-left: 4px solid #f59e0b; padding-left: 10px;'>Itens do Pedido</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background-color: #f4f4f4;'>
                            <th style='padding: 10px; text-align: left;'>Produto</th>
                            <th style='padding: 10px; text-align: center;'>Qtd</th>
                            <th style='padding: 10px; text-align: right;'>Preço Unit.</th>
                            <th style='padding: 10px; text-align: right;'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        $orderRows
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan='3' style='padding: 10px; text-align: right; font-weight: bold;'>Total Geral:</td>
                            <td style='padding: 10px; text-align: right; font-weight: bold; color: #0056b3; font-size: 18px;'>$totalFormatted</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div style='text-align: center; color: #888; font-size: 12px; margin-top: 40px;'>
                <p>Este é um email automático gerado pelo site ASTER.</p>
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: ASTER Vendas <geral@aster.co.mz>" . "\r\n";
    $headers .= "Reply-To: $customerEmail" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send Email
    if (!mail($to, $subject, $emailBody, $headers)) {
        throw new Exception("Falha ao enviar email via PHP mail(). Verifique as configurações do servidor.");
    }

    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Pedido #$orderId realizado com sucesso!", "orderId" => $orderId]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}