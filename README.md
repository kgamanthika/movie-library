## Contact form email setup

The contact form uses PHPMailer with Gmail SMTP. Gmail requires an app password;
your normal Gmail password will not work.

Set these environment variables for the PHP process before starting the server:

```text
MOVIE_LIBRARY_SMTP_HOST=smtp.gmail.com
MOVIE_LIBRARY_SMTP_USERNAME=your-sender@gmail.com
MOVIE_LIBRARY_SMTP_PASSWORD=your-16-character-google-app-password
MOVIE_LIBRARY_SMTP_PORT=587
MOVIE_LIBRARY_SMTP_ENCRYPTION=tls
```

The sender account must have 2-Step Verification enabled and an App Password
created for this application. The administrator recipient is configured in
`backend/config/config.php`.

For local development with the PHP built-in server on Windows, set the values
in the same terminal before starting PHP, for example:

```powershell
$env:MOVIE_LIBRARY_SMTP_USERNAME = "your-sender@gmail.com"
$env:MOVIE_LIBRARY_SMTP_PASSWORD = "your-app-password"
php -S localhost:8000 -t .
```
