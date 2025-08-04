<?php
ob_start();  // Start output buffering
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // recieving parameters
    $queryString = $_SERVER['QUERY_STRING'];
   
    // Extract 'click_id' safely from GET parameters
    $click_id = isset($_GET['click_id']) ? $_GET['click_id'] : '';

    // If 'click_id' exists, fire the postback request to Binom
    if (!empty($click_id)) {
        file_get_contents("https://hornybull.in/postback?click_id=$click_id&payout=0");
    }

    // Sanitize inputs
    $first_name = htmlspecialchars(trim($_POST['first_name']));
    $phone = htmlspecialchars(trim($_POST['phone']));

    // =======================
    // 📩 Send Data to Telegram
    // =======================

    $telegram_bot_token = "7989156777:AAEnSjDJiHQTPzWp7MHZCQYtRJsSB8U1H1s"; // Replace with your bot token
    $telegram_chat_id = "-1002591565989"; // Replace with your Telegram group ID

    // Format the message
    $telegram_message = "📝 *New Lead Received*\n\n";
    $telegram_message .= "📌 *Name:* $first_name\n";
    $telegram_message .= "📌 *Phone:* $phone\n";
    
    // Send data to Telegram
    $telegram_url = "https://api.telegram.org/bot$telegram_bot_token/sendMessage";

    $telegram_data = [
        'chat_id' => $telegram_chat_id,
        'text' => $telegram_message,
        'parse_mode' => 'Markdown'
    ];

    $options = [
        'http' => [
            'header'  => "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => json_encode($telegram_data)
        ]
    ];

    $context  = stream_context_create($options);
    $result = file_get_contents($telegram_url, false, $context);

    // Return JSON response to the JavaScript script before any other output
    header('Content-Type: application/json');
    echo json_encode(["success" => true, "message" => "Order sent to Telegram"]);

    // Redirect after JSON response has been sent
    header('Location: thank.php?' . $queryString . '&first_name=' . urlencode($first_name) . '&phone=' . urlencode($phone));
    exit();
}

// Clean (flush) the output buffer
ob_end_flush();
?>
