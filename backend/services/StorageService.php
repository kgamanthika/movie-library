<?php

class StorageService
{
    private string $filePath;

    public function __construct(string $filePath)
    {
        $this->filePath = $filePath;
    }

    /**
     * Save a new contact submission.
     */
    public function save(array $submission): bool
    {
        $directory = dirname($this->filePath);

        if (!is_dir($directory)) {
            mkdir($directory, 0777, true);
        }

        $submissions = $this->getAll();

        $submissions[] = $submission;

        $json = json_encode(
            $submissions,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE
        );

        if ($json === false) {
            return false;
        }

        return file_put_contents(
            $this->filePath,
            $json,
            LOCK_EX
        ) !== false;
    }


    /**
     * Get all stored submissions.
     */
    public function getAll(): array
    {
        if (!file_exists($this->filePath)) {
            return [];
        }

        $content = file_get_contents($this->filePath);

        if ($content === false || trim($content) === '') {
            return [];
        }

        $data = json_decode($content, true);

        return is_array($data) ? $data : [];
    }
}