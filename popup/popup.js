document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('setting-button').addEventListener('click', function() {
    console.log('clicked setting button')
    chrome.runtime.openOptionsPage();
  });

  document.getElementById('review-button').addEventListener('click', function() {
    console.log('clicked review button')
    // request open ai api
    chrome.storage.sync.get('apiKey', function(data) {
      if (data === null || !data.apiKey) {
        alert('API key is not set.');
        return;
      }
      chrome.storage.local.get('prData', function(prData) {
        let prDescription = prData.prDescription;
        console.log(data.apiKey);

        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.apiKey}`
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "githubのPullRequestの説明文の評価をして修正点を指摘してください。" },
              { role: "user", content: prDescription}
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.6, stream: false,
          })
        }).then(response => response.json())
          .then(response_data => {
            console.log(response_data);
            if (response_data.error) {
              document.getElementById('prDescription').textContent = response_data.error.message;
            } else {
              document.getElementById('prDescription').textContent = response_data.choices[0].text;
            }
          });
      });
    });
  });
  
  chrome.storage.sync.get('apiKey', function(data) {
    if (!data.apiKey) {
      // only show setting button if API key is not set
      document.getElementById('review-button').style.display = 'none';
    }
  });

  chrome.storage.local.get('prDescription', function(data) {
    document.getElementById('prDescription').textContent = 'revirew ressult';
  });
});