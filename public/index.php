<?php
    // index.php
    include 'session.php';

    // 管理者ページに移動
    if ($isAdmin) {
        header('Location: admin.php');
        exit;
    }
?>

<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>予約表</title>
    <link rel="stylesheet" href="css/guide.css">
    <link rel="stylesheet" href="css/calendar.css">
    <script>
        window.appConfig = {
            isLogin: <?= json_encode($isLogin) ?>,
            isAdmin: <?= json_encode($isAdmin) ?>
        };
    </script>
    <script src="js/guide.js"></script>
    <script src="js/calendar.js"></script>
</head>
<body>
    <!--ログイン状況 ヘッダーに表示-->
    <?php include 'header.php' ?>

    <!--ログイン ヘッダーのログインボタンを押すと表示-->
    <?php include 'loginModal.php' ?>

    <!--新規登録 ヘッダーの新規登録ボタンを押すと表示-->
    <?php include 'registerModal.php' ?>

    <!--カレンダー表示-->
    <div class="calendar-page-container"> <!--カレンダーを置くぺージのWindow-->
        <?php include 'calendar.php' ?>
    </div>
</body>
</html>