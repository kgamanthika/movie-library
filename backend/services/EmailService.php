<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/../../vendor/autoload.php';

class EmailService
{
    private string $fromName;
    private array $config;

    public function __construct(array $config)
    {
        $this->fromName = $config['from_name'];
        $this->config = $config;
    }

    /**
     * Send an email using PHPMailer SMTP.
     */
    public function send(
        string $to,
        string $subject,
        string $message
    ): bool {

        $mail = new PHPMailer(true);

        try {

            // SMTP configuration
            $mail->isSMTP();

            if ($this->config['smtp_username'] === '' || $this->config['smtp_password'] === '') {
                throw new Exception('SMTP credentials are not configured.');
            }

            $mail->Host = $this->config['smtp_host'];
            $mail->SMTPAuth = true;
            $mail->Username = $this->config['smtp_username'];
            $mail->Password = $this->config['smtp_password'];
            $mail->SMTPSecure = $this->config['smtp_encryption'] === 'ssl'
                ? PHPMailer::ENCRYPTION_SMTPS
                : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = $this->config['smtp_port'];


            // Sender
            $mail->setFrom(
                $this->config['smtp_username'],
                $this->fromName
            );


            // Recipient
            $mail->addAddress($to);


            // Email content
            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';

            $mail->Subject = $subject;
            $mail->Body = $message;


            // Plain-text alternative
            $mail->AltBody = strip_tags($message);


            return $mail->send();

        } catch (Exception $e) {

            // Log the actual error instead of
            // corrupting the JSON API response.
            error_log(
                'Email sending failed: ' . ($e->getMessage() ?: $mail->ErrorInfo)
            );

            return false;
        }
    }


    /**
     * Send automatic response to user.
     */
    public function sendAutoResponse(
        string $email,
        string $firstName
    ): bool {

        $subject =
            "Thank you for contacting Movie Library";


        $safeFirstName =
            htmlspecialchars(
                $firstName,
                ENT_QUOTES,
                'UTF-8'
            );


        $message = "
            <html>
            <body>

                <h2>Thank you, {$safeFirstName}!</h2>

                <p>
                    We have received your message.
                </p>

                <p>
                    Our team will review your inquiry
                    and get back to you if necessary.
                </p>

                <p>
                    Regards,<br>
                    Movie Library Team
                </p>

            </body>
            </html>
        ";


        return $this->send(
            $email,
            $subject,
            $message
        );
    }


    /**
     * Send submitted form details to administrators.
     */
    public function sendAdminNotification(
        array $adminEmails,
        array $submission
    ): bool {

        $subject =
            "New Movie Library Contact Submission";


        $firstName =
            htmlspecialchars(
                $submission['firstName'],
                ENT_QUOTES,
                'UTF-8'
            );


        $lastName =
            htmlspecialchars(
                $submission['lastName'],
                ENT_QUOTES,
                'UTF-8'
            );


        $email =
            htmlspecialchars(
                $submission['email'],
                ENT_QUOTES,
                'UTF-8'
            );


        $phone =
            htmlspecialchars(
                $submission['phone'] ?: 'Not provided',
                ENT_QUOTES,
                'UTF-8'
            );


        $comments =
            nl2br(
                htmlspecialchars(
                    $submission['comments'],
                    ENT_QUOTES,
                    'UTF-8'
                )
            );


        $submittedAt =
            htmlspecialchars(
                $submission['submittedAt'],
                ENT_QUOTES,
                'UTF-8'
            );


        $message = "
            <html>
            <body>

                <h2>New Contact Form Submission</h2>

                <p>
                    <strong>First Name:</strong>
                    {$firstName}
                </p>

                <p>
                    <strong>Last Name:</strong>
                    {$lastName}
                </p>

                <p>
                    <strong>Email:</strong>
                    {$email}
                </p>

                <p>
                    <strong>Phone:</strong>
                    {$phone}
                </p>

                <p>
                    <strong>Comments:</strong>
                </p>

                <p>
                    {$comments}
                </p>

                <p>
                    <strong>Submitted At:</strong>
                    {$submittedAt}
                </p>

            </body>
            </html>
        ";


        $success = true;


        foreach ($adminEmails as $adminEmail) {

            $sent = $this->send(
                $adminEmail,
                $subject,
                $message
            );

            if (!$sent) {
                $success = false;
            }
        }


        return $success;
    }
}