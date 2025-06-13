function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach((tab) => {
    tab.classList.add('hidden');
  });
  document.getElementById(tabId).classList.remove('hidden');

  document.querySelectorAll('.tab-button').forEach((btn) => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}
