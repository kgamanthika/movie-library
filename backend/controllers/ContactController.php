<?php

class ContactController
{
    private StorageService $storageService;
    private EmailService $emailService;
    private array $config;

    public function __construct(
        StorageService $storageService,
        EmailService $emailService,
        array $config
    ) {
        $this->storageService = $storageService;
        $this->emailService = $emailService;
        $this->config = $config;
    }


    // Process contact form submission.
    
    public function submit(array $data): array
{
    $validation = $this->validate($data);

    if (!$validation['valid']) {

        return [
            'success' => false,
            'message' => 'Please correct the errors.',
            'errors' => $validation['errors']
        ];
    }


    $submission = [
        'firstName' => trim($data['firstName']),
        'lastName' => trim($data['lastName']),
        'email' => trim($data['email']),
        'phone' => trim($data['phone'] ?? ''),
        'comments' => trim($data['comments']),
        'submittedAt' => date('Y-m-d H:i:s')
    ];


   
    // Save submission
    

    $saved = $this->storageService->save($submission);

    if (!$saved) {

        return [
            'success' => false,
            'message' => 'Unable to save your submission.'
        ];
    }


    //  Send emails
    

    $userEmailSent =
        $this->emailService->sendAutoResponse(
            $submission['email'],
            $submission['firstName']
        );


    $adminEmailSent =
        $this->emailService->sendAdminNotification(
            $this->config['admin_emails'],
            $submission
        );



    if (!$userEmailSent || !$adminEmailSent) {
        return [
            'success' => false,
            'message' => 'Your submission was saved, but we could not send the confirmation email. Please contact the administrator.',
            'email' => [
                'user' => $userEmailSent,
                'admin' => $adminEmailSent
            ]
        ];
    }


   // Return result
    

    return [
        'success' => true,

        'message' =>
            'Thank you! Your message has been submitted successfully.',

        'email' => [
            'user' => $userEmailSent,
            'admin' => $adminEmailSent
        ]
    ];
}



    // Backend validation.
     
    private function validate(array $data): array
    {
        $errors = [];


        // First Name
        if (
            !isset($data['firstName']) ||
            trim($data['firstName']) === ''
        ) {
            $errors['firstName'] = 'First name is required.';
        }


        // Last Name
        if (
            !isset($data['lastName']) ||
            trim($data['lastName']) === ''
        ) {
            $errors['lastName'] = 'Last name is required.';
        }


        // Email
        if (
            !isset($data['email']) ||
            trim($data['email']) === ''
        ) {

            $errors['email'] = 'Email is required.';

        } elseif (
            !filter_var(
                trim($data['email']),
                FILTER_VALIDATE_EMAIL
            )
        ) {

            $errors['email'] = 'Please enter a valid email address.';
        }


        // Comments
        if (
            !isset($data['comments']) ||
            trim($data['comments']) === ''
        ) {
            $errors['comments'] = 'Comments are required.';
        }


        // Terms
        if (
            !isset($data['terms']) ||
            $data['terms'] !== 'on'
        ) {
            $errors['terms'] = 'You must agree to the terms.';
        }


        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
}