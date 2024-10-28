document.getElementById('verifyEmail').addEventListener('click', function() {
    const email = document.getElementById('email').value;

    fetch('/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('OTP has been sent to your email!');
        } else {
            alert('Error sending OTP. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    });
});
