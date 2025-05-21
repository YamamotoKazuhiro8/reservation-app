<?php
    // 予約情報の取得
    // ログイン中の場合、自分の予約にフラグ付
    require '../db_connect.php';
    include '../session.php';

    header('Content-Type: application/json');

    $inputData = file_get_contents('php://input');
    $data = json_decode($inputData, true);
    $startDate = $data['start_date'];
    $endDate = $data['end_date'];

    try {
        // SQLクエリの準備
        $stmt = $pdo->prepare("SELECT * FROM reservations WHERE end_date >= :start_date AND start_date <= :end_date");
        $stmt->bindParam(':start_date', $startDate);
        $stmt->bindParam(':end_date', $endDate);
        $stmt->execute();
        $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $restructuredReservations = [];

        foreach ($reservations as $res) {
            $entry = [
                'start_date' => $res['start_date'],
                'end_date'   => $res['end_date'],
            ];

            if ($isLogin && $res['user_id'] == $_SESSION['user_id']) {
                $entry['is_user'] = true; // ユーザーの予約
            }

            $restructuredReservations[] = $entry;
        }

        $result = [
            'status' => $isLogin ? 'user' : 'guest',
            'reservations' => $restructuredReservations
        ];

        echo json_encode($result);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "データベースエラー: " . $e->getMessage()]);
    }
?>