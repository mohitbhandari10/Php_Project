<?php
// submit_odoo.php - Simplified Odoo submission handler
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// Load environment variables
require_once 'vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// After loading .env
if (!isset($_ENV['ODOO_ENDPOINT_URL'], $_ENV['ODOO_API_KEY'], $_ENV['ODOO_SECRET_KEY'])) {
    file_put_contents('odoo_errors.log', 
        date('Y-m-d H:i:s')." | Missing environment variables\n", FILE_APPEND);
    exit();
}

// Get form data
$name = $_POST['name'] ?? 'No name';
$phone = $_POST['phone'] ?? 'No phone';
$phone = preg_replace('/\D/', '', $phone);
$plan = $_POST['plan'] ?? 'No plan selected';

// Prepare data for Odoo
$data = [
    'name' => $name,
    'phone' => $phone,
    'plan' => $plan,
    'source' => 'Website',
    'secret_key' => $_ENV['ODOO_SECRET_KEY']
];

try {
    // Send to Odoo endpoint
    $ch = curl_init($_ENV['ODOO_ENDPOINT_URL']);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            // 'Authorization: Bearer '.$_ENV['ODOO_API_KEY']
        ],
        CURLOPT_TIMEOUT => 5
    ]);
    
    $response = curl_exec($ch);
    if ($response === false) {
        file_put_contents('odoo_errors.log',
            date('Y-m-d H:i:s')." | cURL Error: ".curl_error($ch)."\n", FILE_APPEND);
        curl_close($ch);
        exit();
    }

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        // Log successful submission
        file_put_contents('odoo_submissions.log', 
            date('Y-m-d H:i:s') . " | Submission successful | Name: $name | Phone: $phone | Plan: $plan\n", 
            FILE_APPEND);
    } else {
        throw new Exception("HTTP $httpCode - $response");
    }
} catch (Exception $e) {
    // Log errors
    file_put_contents('odoo_errors.log', 
        date('Y-m-d H:i:s') . " | Error: " . $e->getMessage() . " | Data: " . json_encode($data) . "\n", 
        FILE_APPEND);
}

exit();