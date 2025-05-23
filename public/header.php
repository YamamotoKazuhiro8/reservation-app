
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