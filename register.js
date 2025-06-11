// register.js

// DOM要素の取得
const registerForm = document.getElementById('register-form');
const registerButton = document.getElementById('register-button');
const googleRegisterButton = document.getElementById('google-register');

// フォームの送信イベント
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // パスワード確認
    if (password !== confirmPassword) {
        showToast('パスワードが一致しません', 'error');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            // メール認証を送信
            user.sendEmailVerification()
                .then(() => {
                    showToast('メール認証を送信しました。メールを確認してください。', 'success');
                    auth.signOut();
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    showToast(error.message, 'error');
                });
        })
        .catch((error) => {
            let errorMsg = '';
            if (error.code === 'auth/email-already-in-use') {
                errorMsg = 'このメールアドレスは既に使用されています。';
            } else if (error.code === 'auth/weak-password') {
                errorMsg = 'パスワードは6文字以上で入力してください。';
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = '無効なメールアドレスです。';
            } else {
                errorMsg = error.message;
            }
            showToast(errorMsg, 'error');
        });
});

// Googleアカウントで登録の処理
googleRegisterButton.addEventListener('click', () => {
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
        // メール認証が完了しているか確認
        if (user.emailVerified) {
            checkUsername(user);
        } else {
            showToast('メールアドレスを認証してください。', 'error');
            auth.signOut();
        }
    }
});
