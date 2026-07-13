document.getElementById('newsletter-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('newsletter-email').value;

    // Perform newsletter signup logic here, e.g., send data to server
    console.log('Signing up for newsletter:', { email });

    // Clear the form fields after submission
    document.getElementById('newsletter-email').value = '';
    document.getElementById('newsletter-form').reset();

    // Display a success message
    alert('Thank you for subscribing to our newsletter!');
});

// validation and error handling logic
if (!email) {
    alert('Please enter your email address.');
    return;
}

// You can also add more complex validation, such as checking email format, depending on your requirements.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailPattern.test(email)) {
    alert('Please enter a valid email address.');
    return;
}

// If all validations pass, proceed with newsletter signup logic
console.log('Signing up for newsletter:', { email });
alert('Thank you for subscribing to our newsletter!');
window.location.href = 'index.html';


