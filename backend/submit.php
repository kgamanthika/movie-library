<?php

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

header('Content-Type: application/json');

require_once __DIR__ . '/services/StorageService.php';
require_once __DIR__ . '/services/EmailService.php';
require_once __DIR__ . '/controllers/ContactController.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);

    exit;
}

$config = require __DIR__ . '/config/config.php';

$storageService = new StorageService(
    $config['storage_file']
);

$emailService = new EmailService($config);

$controller = new ContactController(
    $storageService,
    $emailService,
    $config
);

$result = $controller->submit($_POST);

if (!$result['success']) {
    http_response_code(400);
}

echo json_encode($result);