<?php

header('Content-Type: application/json');

require_once __DIR__ . '/services/StorageService.php';
require_once __DIR__ . '/services/EmailService.php';
require_once __DIR__ . '/controllers/ContactController.php';


// Check request method

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);

    exit;
}


// Load configuration


$config = require __DIR__ . '/config/config.php';


//load services

$storageService = new StorageService(
    $config['storage_file']
);

$emailService = new EmailService(
    $config
);


//create controller

$controller = new ContactController(
    $storageService,
    $emailService,
    $config
);


// Process submission

$result = $controller->submit($_POST);


// Return result

if (!$result['success']) {
    http_response_code(400);
}

echo json_encode($result);