<?php
// db_connect.php
// DB接続

$dsn = 'mysql:host=localhost;dbname=test_reservation_db';
$username = getenv('DB_USERNAME');
$password = getenv('DB_PASSWORD');
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

?>