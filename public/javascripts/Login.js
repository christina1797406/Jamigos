window.handleLogin = function() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'http://localhost:3000/login', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            try {
                var response = JSON.parse(this.responseText);

                if (this.status === 200) {
                    alert('Login successful!');

                    // Redirect to Dashboard only works if the files
                    // are in the same branch so after merging
                    setTimeout(function() {
                        window.location.href = "http://localhost:8080/dashboard.html";
                    }, 2500); // after 2.5 seconds

                } else if (this.status === 400 || this.status === 401) {
                    alert('Login failed: ' + (response.error || 'Unknown error'));
                } else {
                    alert('Unexpected error occurred');
                }
            } catch (error) {
                alert('Error processing the response');
                console.error(error);
            }
        }
    };
    var result = JSON.stringify({ email, password });
    xhttp.send(result);
}