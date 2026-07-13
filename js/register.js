document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Perform registration logic here, e.g., send data to server
    console.log('Registering user:', { name, email, password });
});

    // Clear the form fields after submission
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('register-form').reset();

    // Display a success message or redirect the user to another page
    alert('Registration successful!');
    window.location.href = 'login.html';

    // validation and error handling logic 
    if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // You can also add more complex validation, such as checking email format or password strength, depending on your requirements.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }

    // If all validations pass, proceed with registration logic
    console.log('Registering user:', {name, email, password });
    alert('Registration successful!');
    window.location.href = 'login.html';

