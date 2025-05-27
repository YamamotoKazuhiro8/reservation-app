<?php
    // post_reservation.php
    // ユーザーが希望（開始日、終了日、部屋数）を送信
    // 希望に合う日程がない場合、条件に近い日程を複数返してレコメンドする
    require __DIR__ . '/../../src/db_connect.php';
    include __DIR__ . '/../../src/session.php';
?>