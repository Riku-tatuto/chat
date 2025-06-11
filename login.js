// login.js

// DOM要素の取得
const authForm = document.getElementById('auth-form');
const authButton = document.getElementById('auth-button');
const googleSigninButton = document.getElementById('google-signin');

// フォームの送信イベント
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // ユーザー名が存在するかチェック
            checkUsername(user);
        })
        .catch((error) => {
            let errorMsg = '';
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                errorMsg = 'ユーザー名またはパスワードが違います';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = '無効なメールアドレスです';
            } else {
                errorMsg = error.message;
            }
            showToast(errorMsg, 'error');
        });
});

// Googleサインインの処理
googleSigninButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            // ユーザー名が存在するかチェック
            checkUsername(user);
        })
        .catch((error) => {
            let errorMsg = error.message;
            // 既存のアカウントとの競合を処理
            if (error.code === 'auth/account-exists-with-different-credential') {
                errorMsg = 'このメールアドレスは既に他の認証方法で登録されています。';
            }
            showToast(errorMsg, 'error');
        });
});

/**
 * ユーザー名が存在するかをチェックし、存在しなければユーザー名設定画面にリダイレクト
 * @param {firebase.User} user 
 */
function checkUsername(user) {
    const userRef = db.collection('users').doc(user.uid);
    userRef.get().then((doc) => {
        if (doc.exists && doc.data().username) {
            // ユーザー名が存在すればチャットページにリダイレクト
            showToast(`ようこそ、${doc.data().username}さん！`, 'success');
            // リダイレクト先を適切に設定
            window.location.href = 'chat.html';
        } else {
            // ユーザー名が存在しない場合、ユーザー名設定画面にリダイレクト
            window.location.href = 'set-username.html';
        }
    }).catch((error) => {
        showToast(error.message, 'error');
    });
}

// 認証状態の監視
auth.onAuthStateChanged((user) => {
    if (user) {
        // ユーザーがログインしている場合
        checkUsername(user);
    }
});
