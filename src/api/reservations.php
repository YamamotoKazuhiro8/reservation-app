<?php
    // 予約情報の取得
    // ログイン中の場合、自分の予約にフラグ付
    require '../db_connect.php';
    include '../session.php';

    header('Content-Type: application/json');

    $inputData = file_get_contents('php://input');
    $data = json_decode($inputData, true);
    $startDate = $data['startDate'];
    $endDate = $data['endDate'];

    $startDate = '2025-05-01';
    $endDate = '2025-05-30';

    try {
        // SQLクエリの準備
        $stmt = $pdo->prepare("SELECT * FROM reservations WHERE end_date >= :start_date AND start_date <= :end_date");
        $stmt->bindParam(':start_date', $startDate);
        $stmt->bindParam(':end_date', $endDate);
        $stmt->execute();
        $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($reservations as &$reservation) {
            $reservation['user_id'] = ($isLogin && $reservation['user_id'] === $_SESSION['user_id']) ? 1 : 0;
        }
        unset($reservation);

        echo json_encode(["status" => "success", "results" => $reservations]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "データベースエラー: " . $e->getMessage()]);
    }
?>