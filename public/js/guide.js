const modalIDs = ['login', 'register'];

// モーダルウィンドウを開く
function showModal(id){
    document.getElementById(id).classList.add('visible');
}

// モーダルウィンドウを閉じる
function hideModal(id){
    const inputs = document.querySelectorAll(`#${id} input, #${id} textarea`); // 入力欄の取得
    inputs.forEach(input => input.value = ''); // 入力欄を空に
    document.getElementById(id).classList.remove('visible');
}

// 全てのモーダルウィンドウを閉じる
function hideAllModals() {
    modalIDs.forEach(id => close(id));
}

// ログアウト
async function logout(){
    await fetch('api/logout.php');
    location.reload(); // ページのリロード   
}

// ログイン
async function login(){
    const tel = document.querySelector('input[name="login_tel"]').value.trim().replace(/-/g, '');
    // const password = 

    if (tel === '') {
        alert('電話番号を入力してください');
    } else if (!/^0\d{9,10}$/.test(tel)) {
        alert('正しい電話番号を入力してください');
    } else {
        // 有効
        try {
            const res = await fetch('api/login.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: tel })
            });

            const data = await res.json();

            if (data.status === "error") {
                throw new Error(data.message);
            } else {
                location.reload();
            }
        } catch (error) {
            alert(error.message);
        }
    }
}

// 新規登録
async function register(){
    const name = document.querySelector('input[name="register_name"]').value.trim(); 
    const tel = document.querySelector('input[name="register_tel"]').value.trim().replace(/-/g, '');

    if (name === '') {
        alert('名前を入力してください');
    } else if(tel === '') {
        alert('電話番号を入力してください');
    } else if (!/^0\d{9,10}$/.test(tel)) {
        alert('正しい電話番号を入力してください');
    } else {
        // 有効
        try {
            const res = await fetch('api/register.php', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: name, phone: tel })  // JSON形式で送る
            });

            const data = await res.json();

            if (data.status === "error") { // 登録に失敗
                throw new Error(data.message);
            } else {
                location.reload();
            }
        } catch (error) {
            alert(error.message);
        }
    }
}