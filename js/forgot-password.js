const usersKey = 'nearby_users';
const resetCodeKey = 'nearby_reset_code';

function loadUsers() {
  return JSON.parse(localStorage.getItem(usersKey) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function showMessage(elementId, message, isSuccess = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.remove('hidden', 'success-box', 'notice');
  element.classList.add(isSuccess ? 'success-box' : 'notice');
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

document.querySelectorAll('[data-toggle-password]').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.togglePassword;
    const input = document.getElementById(targetId);
    if (!input) return;

    const shouldReveal = input.type === 'password';
    input.type = shouldReveal ? 'text' : 'password';
    button.textContent = shouldReveal ? 'Hide' : 'Show';
  });
});

const forgotForm = document.getElementById('forgot-password-form');
const verifyForm = document.getElementById('verify-code-form');
const resetForm = document.getElementById('reset-password-form');

let pendingEmail = '';

if (forgotForm) {
  forgotForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('reset-email').value.trim().toLowerCase();
    const users = loadUsers();

    if (!email) {
      showMessage('forgot-message', 'Enter the email address on your account.');
      return;
    }

    const userExists = users.some((user) => user.email === email);
    if (!userExists) {
      showMessage('forgot-message', 'No account found for that email address.');
      return;
    }

    pendingEmail = email;
    const code = generateCode();
    localStorage.setItem(resetCodeKey, JSON.stringify({ email, code, expiresAt: Date.now() + 10 * 60 * 1000 }));

    verifyForm.classList.remove('hidden');
    showMessage('forgot-message', `Verification code generated for ${email}. In a live app this would be emailed to the user.`, true);
    forgotForm.querySelector('button[type="submit"]').disabled = true;
  });
}

if (verifyForm) {
  verifyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const enteredCode = document.getElementById('verification-code').value.trim();
    const storedReset = JSON.parse(localStorage.getItem(resetCodeKey) || 'null');

    if (!storedReset || storedReset.email !== pendingEmail || Date.now() > storedReset.expiresAt) {
      showMessage('forgot-message', 'The verification code has expired. Please request a new one.');
      verifyForm.classList.add('hidden');
      resetForm.classList.add('hidden');
      document.getElementById('forgot-password-form').querySelector('button[type="submit"]').disabled = false;
      return;
    }

    if (enteredCode !== storedReset.code) {
      showMessage('forgot-message', 'The verification code is incorrect.');
      return;
    }

    resetForm.classList.remove('hidden');
    showMessage('forgot-message', 'Email verified. Set your new password below.', true);
  });
}

if (resetForm) {
  resetForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newPassword = document.getElementById('new-password').value;
    const storedReset = JSON.parse(localStorage.getItem(resetCodeKey) || 'null');

    if (!storedReset || storedReset.email !== pendingEmail) {
      showMessage('forgot-message', 'Please complete email verification first.');
      return;
    }

    if (newPassword.length < 6) {
      showMessage('forgot-message', 'Password must be at least 6 characters long.');
      return;
    }

    const users = loadUsers();
    const updatedUsers = users.map((user) => user.email === pendingEmail ? { ...user, password: newPassword } : user);
    saveUsers(updatedUsers);
    localStorage.removeItem(resetCodeKey);

    document.getElementById('forgot-success').classList.remove('hidden');
    document.getElementById('forgot-success').textContent = 'Password updated successfully. You can now log in with your new password.';
    forgotForm.reset();
    verifyForm.reset();
    resetForm.reset();
    verifyForm.classList.add('hidden');
    resetForm.classList.add('hidden');
    forgotForm.querySelector('button[type="submit"]').disabled = false;
  });
}