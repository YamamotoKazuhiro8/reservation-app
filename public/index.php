<?php
    // index.php
    require_once __DIR__ . '/../src/session.php';

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
    <style>
        body {
            padding: 0;
            margin: 0;
        }
        #reservation-window {
            width: 600px;
            /* max-height: 90vh; 重要 */
            background-color: wheat;
        }
    </style>
    <link rel="stylesheet" href="css/utils.css">
    <link rel="stylesheet" href="css/calendar.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <script src="js/auth.js" type="module"></script>
    <script src="js/calendar.js" type="module"></script>
</head>
<body>
    <!-- 予約エリアを表示するためのウィンドウコンテナ -->
    <div id="reservation-window" class="relative margin-center">
    
        <!-- Modal -->
        <!-- ログイン -->
        <div id="loginModal" class="modal-back hidden">
            <div>ログイン</div>
        </div>

        <!-- 新規登録 -->
        <div id="registerModal" class="modal-back hidden">
            <div>新規登録</div>
        </div>

        <!-- Header -->
        <div>
            <?php if (!$isLogin): ?>
                <button onclick="openModal('loginModal')" class="m1">ログイン</button>
            <?php else: ?>
                <button onclick="logout()">ログアウト</button>
            <?php endif; ?>
        </div>

        <!-- Main -->
        <div id="rw-main">

            <!-- <div class="flex gap-2"> -->
                <!-- 現在の日付を表示 -->
                <!-- <div id="current-date">　月　日</div> -->
                <!-- 現在日に戻る -->
                <!-- <button>現在日に戻る</button>
            </div> -->
            
            <!-- フォーカスされた月を表示 -->
            <div class="flex flex-end gap-2">
                <div id="focused-month" class="inline-bottom m1">　年　月</div>
                <div>
                    <button id="prev-month-btn"> ← </button>
                    <button id="next-month-btn"> → </button>
                </div>

                <!-- 再読み込み -->
                <button id="reload-button" class="m1 ml-auto">
                    <i class="fas fa-rotate-right"></i>
                    <i class="fas fa-spinner hidden"></i>
                </button>
            </div>

            <!-- カレンダー表示テーブル -->
            <div id="calendar-container">
                <table>
                    <thead class="z-5">
                        <tr class="inherit-background-color">
                            <th class="sun">日</th>
                            <th>月</th>
                            <th>火</th>
                            <th>水</th>
                            <th>木</th>
                            <th>金</th>
                            <th class="sat">土</th>
                        </tr>
                    </thead>
                    <tbody id="calendar-cell-container" class="text-center z-4">
                        <!-- 週行を追加していく -->
                    </tbody>
                </table>
            </div>
        </div>
        <!-- カレンダー非表示のとき代わりに表示 -->
        <div id="rw-main-off">
        </div>

        <!-- Footer -->
        <div id="rw-footer">
            <div class="absolute bottom-left p1">
                <!-- 予約案内 -->
                <!-- 予約リスト -->
                フッター
            </div>

            <!--ダミーFooter-->
            <div class="visible-0 p1">
                <!-- 予約案内 -->
                <!-- 予約リスト -->
                フッター
            </div>
        </div>
    </div>
</body>
</html>