<?php

date_default_timezone_set('Asia/Colombo');
return [

    'storage_file' => __DIR__ . '/../data/submissions.json',

    // Email configuration
    'admin_emails' => [
        // 'manthikaamesh@gmail.com',
        'dumidu.kodithuwakku@ebeyonds.com',
        'prabhath.senadheera@ebeyonds.com',
    ],

    //email name
    'from_name' => 'Movie Library',

    // SMTP configuration
    'smtp_host' => $_ENV['MOVIE_LIBRARY_SMTP_HOST'] ?? 'smtp.gmail.com',
    'smtp_username' => $_ENV['MOVIE_LIBRARY_SMTP_USERNAME'] ?? '',
    'smtp_password' => $_ENV['MOVIE_LIBRARY_SMTP_PASSWORD'] ?? '',
    'smtp_port' => (int) ($_ENV['MOVIE_LIBRARY_SMTP_PORT'] ?? 587),
    'smtp_encryption' => $_ENV['MOVIE_LIBRARY_SMTP_ENCRYPTION'] ?? 'tls',

];