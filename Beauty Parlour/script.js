document.getElementById('slotBookingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    const confirmationMessage = `
        Thank you ${name} for booking a ${service} on ${date} at ${time}. 
        A confirmation email will be sent to ${email}.
    `;

    document.getElementById('confirmationMessage').innerText = confirmationMessage;

    // Here you would typically send the data to the server
});