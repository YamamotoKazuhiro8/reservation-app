<?php
    // admin.php
    // 管理者ページ

    // 検索機能
    // ・名前
    // ・電話番号
    // -> ユーザーデータ および 予約履歴

    // ユーザーで特別にログイン
    // 

    // DBのGUI管理
    //    予約の修正

    include 'session.php';

    if(!$isAdmin) {
        header('Location: index.php');
        exit;
    }

    // 読み込み
    //    予約データ
    //    予約にあるユーザー
    require 'db_connect.php';

    // DBのConfigに設定される
    $startDate = $data['2025-07-15'];
    $endDate = $data['2025-09-15'];

    $status;
    $result;

    try {
        // SQLクエリの準備
        $stmt = $pdo->prepare("SELECT * FROM reservations WHERE end_date >= :start_date AND start_date <= :end_date");
        $stmt->bindParam(':start_date', $startDate);
        $stmt->bindParam(':end_date', $endDate);
        $stmt->execute();
        $reservations = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $restructuredReservations = [];
        $userIds = [];

        foreach ($reservations as $res) {
            $entry = [
                'user_id'    => $res['user_id'],
                'start_date' => $res['start_date'],
                'end_date'   => $res['end_date'],
            ];

            $restructuredReservations[] = $entry;
            $userIds[] = $res['user_id'];
        }

        // 重複を排除
        $userIds = array_unique($userIds);

        $usersData = []; 

        foreach ($userIds as $userId) {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
            $stmt->bindParam(':id', $userId);
            $stmt->execute();
            $res = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($res) {
                $usersData[$res['id']] = [
                    'name'  => $res['name'],
                    'phone' => $res['phone']
                ];
            }
        }
        
        $result = [
            'users' => $usersData,
            'reservations' => $restructuredReservations
        ];
        
    } catch (PDOException $e) {
        $status = "error";
        $result = null;
    }
?>

<!DOCTYPE html>
<html>
<head>
    <style>
        * {background-color: #f88;}
        header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    </style>
    <script>
        async function logout(){
            await fetch('api/logout.php');
            location.href = 'index.php';
        }
    </script>
</head>
<body>
    <header>
        <h2>管理者ホーム</h2>
        <div>
            <button onclick="logout()">ログアウト</button>
        </div>
    </header>
    <main>
    </main>
</body>
</html>