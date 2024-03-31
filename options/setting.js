document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('save-button').addEventListener('click', function() {
    let apiKey = document.getElementById('open-ai-key').value;
    chrome.storage.sync.set({ 'apiKey': apiKey }, function() {
      alert('API key is saved.');
    });
  });
});