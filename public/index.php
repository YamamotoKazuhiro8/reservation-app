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
            userId: <?= json_encode($userId) ?>,
            isAdmin: <?= json_encode($isAdmin) ?>
        };
    </script>
    <script src="js/guide.js"></script>
    <script src="js/calendar.js"></script>
</head>
<body>
    <!--ログイン状況 ヘッダーに表示-->
    <div class="login-nav">  
        <?php if(isset($_SESSION['user_id'])): ?>
            <span>ログイン中 : <?php echo $_SESSION['username']; ?></span>
            <button onclick="logout()">ログアウト</button>
        <?php else: ?>
            <span>ログアウト中 : </span> 
            <button onclick="showModal('login')">ログイン</button>
            <button onclick="showModal('register')">新規登録</button>
        <?php endif; ?>
    </div>

    <!--ログイン ヘッダーのログインボタンを押すと表示-->
    <div id="login">
        <div class="modal-wrapper">
            <div class="center">
                ログイン
            </div>
            <table>
                <tr>
                    <td>
                        Tel:
                    </td>
                    <td>
                        <input type="tel" name="login_tel" autofocus>
                    </td>
                </tr>
                <tr>
                    <td>
                        Password:
                    </td>
                    <td>
                        <input type="password" name="login_password">
                    </td>
                </tr>
            </table>
            <div class="center">
                <button onclick="login()">ログイン</button>
                <button onclick="hideModal('login')">閉じる</button>
            </div>
        </div>
    </div>
    <!--新規登録 ヘッダーの新規登録ボタンを押すと表示-->
    <div id="register">
        <div class="modal-wrapper">
            <div class="center">新規登録</div>
            <table>
                <tr>
                    <td>Name:</td>
                    <td><input type="text" name="register_name" autofocus></td>
                </tr>
                <tr>
                    <td>Tel:</td>
                    <td><input type="tel" name="register_tel"></td>
                </tr>
            </table>
            <div class="center">
                <button onclick="register()">登録</button>
                <button onclick="hideModal('register')">閉じる</button>
            </div>
        </div>
    </div>

    <!--カレンダー表示-->
    <div class="calendar-container">
        <!--カレンダーのヘッダー-->
        <div class="calendar-header">
            <div class="controls">
                <button id="prevBtn" class="btn">←</button>
                <span id="calendar-title"></span>
                <button id="nextBtn" class="btn">→</button>
            </div>

            <div class="mode-select">
                <label for="modeSelect" class="hidden-label">モード：</label>
                <select id="modeSelect" class="btn">
                    <option value="month" selected>月</option>
                    <option value="week">週</option>
                </select>
            </div>
        </div>

        <div class="calendar-viewer">
            <div id="month-viewer-container"></div>
            <div id="week-viewer-container hidden"></div>
            <div id="error-viewer"></div>
        </div>
    </div>
</body>
</html>