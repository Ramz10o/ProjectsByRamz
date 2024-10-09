document.getElementById('bookButton').addEventListener('click', function() {
    // Get selected services
    const selectedServices = Array.from(document.querySelectorAll('.service-item input[type=checkbox]:checked')).map(checkbox => checkbox.value);    
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    // Check if at least one service is selected
    if (selectedServices.length === 0) {
        alert('Please select at least one service.');
        return;
    }

    // Display confirmation message
    const confirmationMessage = `You have booked the following services:\n${selectedServices.join(', ')}\non ${date} at ${time}.`;
    
    document.getElementById('confirmationMessage').innerText = confirmationMessage;

    // Optionally reset the form
    document.querySelectorAll('.service-item input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
    document.getElementById('date').value = '';
    document.getElementById('time').value = '';
});