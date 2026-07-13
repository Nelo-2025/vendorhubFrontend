document.getElementById('organise-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventLocation = document.getElementById('event-location').value;
    const eventTime = document.getElementById('event-time').value;
    const eventDescription = document.getElementById('event-description').value;

    // Perform event organisation logic here, e.g., send data to server
    console.log('Organising event:', { eventName, eventDate, eventLocation, eventTime, eventDescription });     
    document.getElementById('preview-name').textContent = eventName;
    document.getElementById('preview-date').textContent = `Date: ${eventDate}`;
    document.getElementById('preview-location').textContent = `Location: ${eventLocation}`;
    document.getElementById('preview-time').textContent = `Time: ${eventTime}`;
    document.getElementById('preview-description').textContent = `Description: ${eventDescription}`;
    document.getElementById('qr-code').textContent = `QR Code for ${eventName}`;
    alert('Event created successfully!');
    window.location.href = 'index.html';
});

