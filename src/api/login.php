<?php
    // login.php
    // (電話番号でログイン可能)

    require '../db_connect.php';
    include '../session.php';

    $inputData = file_get_contents('php://input'); // リクエストの本文を取得

    $data = json_decode($inputData, true); // JSON をデコードして連想配列に変換

    $phone = $data['phone'];
    // $password = $data['password'];

    try {
        // ユーザー情報をデータベースから取得
        $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = :phone");
        $stmt->bindParam(':phone', $phone);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // ユーザーが見つかった場合、ログイン成功
            $_SESSION['user_id'] = $user['id']; // ユーザーIDをセッション保存
            $_SESSION['username'] = $user['name']; // ユーザー名をセッションに保存
            $_SESSION['is_admin'] = $user['role'] === "admin"; // 管理者かセッションに保存

            echo json_encode(["status" => "success", "messsage" => "ログイン成功"]);
        } else {
            // ログイン失敗
            echo json_encode(["status" => "error", "message" => "ユーザーが見つかりません"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "データベースエラー " . $e->getMessage()]);
    }
?>