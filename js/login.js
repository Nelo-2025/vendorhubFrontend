document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Perform login logic here, e.g., send data to server
    console.log('Logging in user:', { email, password });
});

//  Clear the form fields after submission
document.getElementById('email').value = '';
document.getElementById('password').value = '';
document.getElementById('login-form').reset();

// validation and error handling logic
if (!email || !password) {
    alert('Please fill in all fields.');
    return;
}

// You can also add more complex validation, such as checking email format or password strength, depending on your requirements.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(email)) {
    alert('Please enter a valid email address.');
    return;
}

// If all validations pass, proceed with login logic
console.log('Logging in user:', { email, password });
alert('Login successful!');
window.location.href = 'index.html';