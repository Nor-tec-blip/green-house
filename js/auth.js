// Toggle show/hide password
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

const eyeOnPath = `
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
  <circle cx="12" cy="12" r="3"/>
`;
const eyeOffPath = `
  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8
    a18.45 18.45 0 015.06-5.94"/>
  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8
    a18.5 18.5 0 01-2.16 3.19"/>
  <line x1="1" y1="1" x2="23" y2="23"/>
`;

togglePassword.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  eyeIcon.innerHTML = isHidden ? eyeOffPath : eyeOnPath;
  togglePassword.setAttribute(
    'aria-label',
    isHidden ? 'Sembunyikan password' : 'Lihat password'
  );
});

import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    message.textContent = 'Memproses...';
    message.className = 'form-message';

    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.textContent = 'Berhasil masuk! Mengalihkan...';
      message.className = 'form-message success';
      setTimeout(() => (window.location.href = 'dashboard.html'), 800);
    } catch (err) {
      message.textContent = 'Email atau password salah.';
      message.className = 'form-message error';
      console.error(err);
    }
  });
}

// Auto redirect jika sudah login
onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith('login.html')) {
    window.location.href = 'dashboard.html';
  }
});

export async function logout() {
  await signOut(auth);
  window.location.href = 'login.html';
}
