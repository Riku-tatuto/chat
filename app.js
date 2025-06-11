// app.js

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

// Firestoreを取得
const db = firebase.firestore();

/**
 * トーストを表示する関数
 * @param {string} message - 表示するメッセージ
 * @param {string} type - 'success' または 'error'
 */
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (type === 'error') {
        toast.classList.add('error');
    } else {
        toast.classList.add('success');
    }
    toast.textContent = message;
    toastContainer.appendChild(toast);

    // トランジションをトリガー
    void toast.offsetWidth;

    toast.classList.add('show');

    // 自動で消える
    setTimeout(() => {
        toast.classList.remove('show');
        // 完全に消えた後に削除
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}
