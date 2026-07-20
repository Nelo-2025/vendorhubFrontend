const baseurl = "http://localhost:3000";
const usersKey = 'nearby_users';

function loadUsers() {
  return JSON.parse(localStorage.getItem(usersKey) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(usersKey, JSON.stringify(users));
}

function showMessage(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.remove('hidden', 'success-box', 'notice');
  element.classList.add(isError ? 'notice' : 'success-box');
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

const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) {
      showMessage('register-message', 'Please fill in all fields.', true);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showMessage('register-message', 'Please enter a valid email address.', true);
      return;
    }

    if (password.length < 6) {
      showMessage('register-message', 'Password must be at least 6 characters long.', true);
      return;
    }

    const users = loadUsers();
    if (users.some((user) => user.email === email)) {
      showMessage('register-message', 'An account with this email already exists.', true);
      return;
    }

    users.push({ name, email, password });
    saveUsers(users);

    showMessage('register-message', 'Account created successfully. You can now log in.');
    registerForm.reset();

    window.setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
  });
  }

