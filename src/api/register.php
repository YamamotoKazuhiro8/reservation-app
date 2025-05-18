<?php
    // register.php

    require '../db_connect.php';
    include '../session.php';

    $inputData = file_get_contents('php://input');
    $data = json_decode($inputData, true); 

    $name  = $data['name'];
    $phone = $data['phone'];

    try {
        // ユーザー情報をデータベースから取得
        $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = :phone");
        $stmt->bindParam(':phone', $phone);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            // ユーザーがなければ追加
            $smt = $pdo->prepare("INSERT INTO users(name, phone) VALUES (:name, :phone)");
            $smt->bindParam(':name', $name);
            $smt->bindParam(':phone', $phone);
            $stmt->execute();
            $id = $pdo->lastInsertId();

            $_SESSION['user_id'] = $id; // ユーザーIDをセッション保存
            $_SESSION['username'] = $name; // ユーザー名をセッションに保存
            $_SESSION['is_admin'] = false; // 管理者かセッションに保存

            echo json_encode(["status" => "success", "message" => "登録完了"]);
        } else {
            // ログイン失敗
            echo json_encode(["status" => "error", "message" => "既に登録されています"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "データベースエラー " . $e->getMessage()]);
    }
?>