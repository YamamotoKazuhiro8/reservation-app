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
</body>
</html>