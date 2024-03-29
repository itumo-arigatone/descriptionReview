document.addEventListener('DOMContentLoaded', function() {
  console.log("aaauuuuuuuu");
  chrome.storage.local.get('prFirstLine', function(data) {
    document.getElementById('prFirstLine').textContent = data.prFirstLine;
  });
});