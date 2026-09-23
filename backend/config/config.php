<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Storage
    |--------------------------------------------------------------------------
    */

    'storage_file' => __DIR__ . '/../data/submissions.json',


    /*
    |--------------------------------------------------------------------------
    | Email
    |--------------------------------------------------------------------------
    */

    // Admin recipients required by the assessment
    'admin_emails' => [
        // 'dumidu.kodithuwakku@ebeyonds.com',
        // 'prabhath.senadheera@ebeyonds.com'
        'kgamanthika@gmail.com'
    ],

    // Name shown in emails
    'from_name' => 'Movie Library',

    // Configure these values in the PHP server environment.
    'smtp_host' => getenv('MOVIE_LIBRARY_SMTP_HOST') ?: 'smtp.gmail.com',
    'smtp_username' => getenv('MOVIE_LIBRARY_SMTP_USERNAME') ?: '',
    'smtp_password' => getenv('MOVIE_LIBRARY_SMTP_PASSWORD') ?: '',
    'smtp_port' => (int) (getenv('MOVIE_LIBRARY_SMTP_PORT') ?: 587),
    'smtp_encryption' => getenv('MOVIE_LIBRARY_SMTP_ENCRYPTION') ?: 'tls',

];