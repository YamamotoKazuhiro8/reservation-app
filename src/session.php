<?php
// session.php

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$isLogin = isset($_SESSION['user_id']); // ログイン状態
$isAdmin = isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true; // 管理者フラグ
?>