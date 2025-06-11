// Firebaseの設定
const firebaseConfig = {
    apiKey: "AIzaSyCQdnFMnR4UKZRjTYJYgM98StDklLssZOA",
    authDomain: "online-chat-app-db.firebaseapp.com",
    projectId: "online-chat-app-db",
    storageBucket: "online-chat-app-db.firebasestorage.app",
    messagingSenderId: "485166356040",
    appId: "1:485166356040:web:1071fed931b12a9197aa7d"
};

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);

// Firebase認証サービスを取得
const auth = firebase.auth();

// DOM要素の取得
const authForm = document.getElementById('auth-form');
const authButton = document.getElementById('auth-button');
const authTitle = document.getElementById('auth-title');
const toggleText = document.getElementById('toggle-text');
const toggleLink = document.getElementById('toggle-link');
const googleSigninButton = document.getElementById('google-signin');
const errorMessage = document.getElementById('error-message');

// モード（ログインか登録か）
let isLoginMode = true;

// トグルリンクのクリックイベント
toggleLink.addEventListener('click', () => {
    isLoginMode = !isLoginMode;
    if (isLoginMode) {
        authTitle.textContent = 'ログイン';
        authButton.textContent = 'ログイン';
        toggleText.innerHTML = 'アカウントを持っていませんか？ <span id="toggle-link">新規登録</span>';
    } else {
        authTitle.textContent = '新規登録';
        authButton.textContent = '登録';
        toggleText.innerHTML = '既にアカウントを持っていますか？ <span id="toggle-link">ログイン</span>';
    }
});

// フォームの送信イベント
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (isLoginMode) {
        // ログイン処理
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // ログイン成功
                const user = userCredential.user;
                alert(`ようこそ、${user.email}さん！`);
                // ここでチャットページにリダイレクトするなどの処理を追加
            })
            .catch((error) => {
                errorMessage.textContent = error.message;
            });
    } else {
        // 新規登録処理
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // 登録成功
                const user = userCredential.user;
                alert(`登録が完了しました、${user.email}さん！`);
                // ここでチャットページにリダイレクトするなどの処理を追加
            })
            .catch((error) => {
                errorMessage.textContent = error.message;
            });
    }
});

// Googleサインインの処理
googleSigninButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            // サインイン成功
            const user = result.user;
            alert(`ようこそ、${user.displayName}さん！`);
            // ここでチャットページにリダイレクトするなどの処理を追加
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
});

// 認証状態の監視
auth.onAuthStateChanged((user) => {
    if (user) {
        // ユーザーがログインしている場合
        console.log('ユーザーがログインしています:', user);
        // チャットページにリダイレクトするなどの処理を追加
    } else {
        // ユーザーがログアウトしている場合
        console.log('ユーザーがログアウトしています。');
    }
});
