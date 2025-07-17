<?php
$name = $_POST['name'] ?? 'No name';
$phone = $_POST['phone'] ?? 'No phone';
$phone = preg_replace('/\D/', '', $phone); // Digits only

// Unique log file for this lander
$logFile = 'lead_log_lander4.json';
$leads = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];

$now = time();
foreach ($leads as $key => $lead) {
    if (($now - $lead['time']) > 86400) {
        unset($leads[$key]);
    }
}

$alreadyExists = false;
foreach ($leads as $lead) {
    if ($lead['phone'] === $phone) {
        $alreadyExists = true;
        break;
    }
}

if (!$alreadyExists) {
    $leadNumber = count($leads) + 1;
    $leads[] = [
        'name' => $name,
        'phone' => $phone,
        'time' => $now
    ];
    file_put_contents($logFile, json_encode($leads, JSON_PRETTY_PRINT));

    // Telegram API config
    $botToken = "7989156777:AAEnSjDJiHQTPzWp7MHZCQYtRJsSB8U1H1s";
    $chatId = "-1002611831023";

    $message = "📥 *Lead $leadNumber (Lander 4)*\n\n👤 Name: $name\n📞 Phone: $phone";

    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'Markdown'
    ];

    $context = stream_context_create([
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
            'ignore_errors' => true
        ]
    ]);

    @file_get_contents($url, false, $context);
}

// Redirect to thank you page
header("Location: thank.php?name=" . urlencode($name) . "&phone=" . urlencode($phone));
exit();
?>