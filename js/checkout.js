document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const eventId = sessionStorage.getItem('checkout_event_id');
    const items = JSON.parse(sessionStorage.getItem('checkout_items')); 
    console.log('Checking out event:', eventId, 'with items:', items);
    
    // Perform checkout logic here, e.g., send data to server
    fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ eventId, items })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Checkout successful:', data);
        alert('Checkout successful!');
        window.location.href = 'confirmation.html';
    })
    .catch(error => {
        console.error('Error during checkout:', error);
        alert('An error occurred during checkout. Please try again.');
    });

    // Clear the form fields after submission
    document.getElementById('checkout-form').reset();

    // validation and error handling logic
if (!eventId || !items || items.length === 0) {
    alert('No items selected for checkout.');
    return; 
}

    // You can also add more complex validation, such as checking if the items are still available or if the user has sufficient funds, depending on your requirements.
if (items.some(item => item.quantity <= 0)) {
    alert('Invalid item quantity selected.');
    return; 
}


})
