// Firebase 初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQdnFMnR4UKZRjTYJYgM98StDklLssZOA",
  authDomain: "online-chat-app-db.firebaseapp.com",
  projectId: "online-chat-app-db",
  storageBucket: "online-chat-app-db.firebasestorage.app",
  messagingSenderId: "485166356040",
  appId: "1:485166356040:web:1071fed931b12a9197aa7d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// DOM 要素
const userPanel = document.getElementById('user-panel');
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// 認証状態監視
onAuthStateChanged(auth, user => {
  userPanel.innerHTML = '';
  if (user) {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'ログアウト';
    logoutBtn.onclick = () => signOut(auth);
    userPanel.appendChild(logoutBtn);
    loadMessages();
  } else {
    const googleBtn = document.createElement('button');
    googleBtn.textContent = 'Google でログイン';
    googleBtn.onclick = () => signInWithPopup(auth, provider);
    const emailForm = document.createElement('form');
    emailForm.innerHTML = `
      <input type=\"email\" id=\"email\" placeholder=\"メールアドレス\" required />
      <input type=\"password\" id=\"password\" placeholder=\"パスワード\" required />
      <button type=\"submit\">登録 / ログイン</button>
    `;
    emailForm.onsubmit = async e => {
      e.preventDefault();
      const email = emailForm.email.value;
      const password = emailForm.password.value;
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch { /* ログイン済みならログイン試行 */
        await signInWithEmailAndPassword(auth, email, password);
      }
    };
    userPanel.append(googleBtn, emailForm);
  }
});

// メッセージ送信
messageForm.addEventListener('submit', async e => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return alert('ログインしてください');
  await addDoc(collection(db, 'messages'), {
    uid: user.uid,
    author: user.displayName || user.email,
    text: messageInput.value,
    createdAt: serverTimestamp()
  });
  messageInput.value = '';
});

// メッセージ読み込み
function loadMessages() {
  const q = query(collection(db, 'messages'), orderBy('createdAt'));
  onSnapshot(q, snapshot => {
    messagesDiv.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.classList.add('message');
      div.innerHTML = `<span class=\"author\">${data.author}:</span> <span class=\"text\">${data.text}</span>`;
      messagesDiv.appendChild(div);
    });
  });
}
