// set-username.js

// DOM要素の取得
const usernameForm = document.getElementById('username-form');
const usernameInput = document.getElementById('username');
const usernameError = document.getElementById('username-error');

// フォームの送信イベント
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();

    if (username === '') {
        showToast('ユーザー名を入力してください。', 'error');
        return;
    }

    // ユーザー名の一意性を確認
    checkUsernameUnique(username)
        .then((isUnique) => {
            if (isUnique) {
                // ユーザー名を保存
                saveUsername(username);
            } else {
                // ユーザー名が既に使われている
                showToast('このユーザー名は既に使用されています。', 'error');
            }
        })
        .catch((error) => {
            showToast(error.message, 'error');
        });
});

/**
 * Firestoreでユーザー名のユニーク性を確認
 * @param {string} username 
 * @returns {Promise<boolean>}
 */
function checkUsernameUnique(username) {
    const usersRef = db.collection('users');
    return usersRef.where('username', '==', username).get()
        .then((querySnapshot) => {
            return querySnapshot.empty;
        });
}

/**
 * ユーザー名をFirestoreに保存
 * @param {string} username 
 */
function saveUsername(username) {
    const user = auth.currentUser;
    if (!user) {
        showToast('ユーザーが認証されていません。', 'error');
        return;
    }

    const userRef = db.collection('users').doc(user.uid);
    userRef.set({
        username: username,
        email: user.email
    }, { merge: true })
        .then(() => {
            showToast(`ようこそ、${username}さん！`, 'success');
            // チャットページにリダイレクト
            window.location.href = 'chat.html';
        })
        .catch((error) => {
            showToast(error.message, 'error');
        });
}

// 認証状態の監視
auth.onAuthStateChanged((user) => {
    if (!user) {
        // ユーザーがログインしていない場合、ログインページにリダイレクト
        window.location.href = 'login.html';
    }
});
