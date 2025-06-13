const emailInput = document.querySelector('.email-input');
const usernameInput = document.querySelector('.username-input');
const passwordInput = document.querySelector('.password-input');
const messageEl = document.getElementById('signup-message');
const signUpBtn = document.querySelector('.signup-button');

// User first-time sign in
signUpBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!email || !username || !password) {
    messageEl.textContent = 'Please fill out all fields.';
    messageEl.style.color = 'red';
    return;
  }

  fetch('http://localhost:3000/addUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        messageEl.textContent = 'Email/username already in use';
        messageEl.style.color = 'red';
      } else {
        messageEl.textContent = 'Signup successful!';
        messageEl.style.color = 'green';
        emailInput.value = '';
        usernameInput.value = '';
        passwordInput.value = '';

        // Redirect to dashboard
        // only works if the files are in the same branch so after merging
        setTimeout(() => {
          window.location.href = "http://localhost:8080/dashboard.html";
        }, 2500); // after 2.5 seconds
      }
    })
    .catch(err => {
      console.error(err);
      messageEl.textContent = 'Server error. Try again later.';
      messageEl.style.color = 'red';
    });
});

// Google sign-in setup
function handleGoogleResponse(res) {
  const credential = res.credential;

  // Send user data to server
  fetch('http://localhost:3000/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Google login response:', data);
    })
    .catch(err => {
      console.error('Google login failed:', err);
    });
}
window.handleGoogleResponse = handleGoogleResponse;