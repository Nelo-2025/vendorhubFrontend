const usersKey = 'nearby_users';

function loadUsers() {
  return JSON.parse(localStorage.getItem(usersKey) || '[]');
}

function showMessage(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.remove('hidden', 'success-box');
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

const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showMessage('login-message', 'Please fill in all fields.', true);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showMessage('login-message', 'Please enter a valid email address.', true);
      return;
    }

    const users = loadUsers();
    const matchedUser = users.find((user) => user.email === email && user.password === password);

    if (!matchedUser) {
      showMessage('login-message', 'Email or password is incorrect.', true);
      return;
    }

    sessionStorage.setItem('nearby_current_user', JSON.stringify({ name: matchedUser.name, email: matchedUser.email }));
    showMessage('login-message', 'Login successful. Redirecting…');
    loginForm.reset();

    window.setTimeout(() => {
      window.location.href = 'index.html';
    }, 700);
  });
}