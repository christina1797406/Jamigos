document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Save settings to localStorage
document.getElementById('settings-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const settings = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    autoplay: document.getElementById('autoplay').checked,
    notifications: document.getElementById('notifications').checked
  };

  localStorage.setItem('jamigosSettings', JSON.stringify(settings));
  const statusMessage = document.getElementById('status-message');
  statusMessage.textContent = 'Settings saved!';
  statusMessage.style.display = 'block';
  setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 3000);
});

// Load settings on page load
window.addEventListener('DOMContentLoaded', () => {
  const saved = JSON.parse(localStorage.getItem('jamigosSettings'));
  if (saved) {
    document.getElementById('username').value = saved.username || '';
    document.getElementById('email').value = saved.email || '';
    document.getElementById('password').value = saved.password || '';
    document.getElementById('autoplay').checked = saved.autoplay || false;
    document.getElementById('notifications').checked = saved.notifications || false;
  }
});
