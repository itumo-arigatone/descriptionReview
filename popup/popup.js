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
        let prDescription = prData.prData;
        console.log(prData.prData);
        document.getElementsByClassName('loading')[0].style = "display:block";

        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.apiKey}`
          },
          body: JSON.stringify({
            messages: [
              { role: "system", content: "Please point out the following aspects of the github PullRequest description. Please make sure that the evaluation criteria include the following: purpose, what was done, what was not done, bug description, how the bug was resolved, and what should be shared with the team. Please let us know if there is any other information you would like us to review. Please answer in Japanese." },
              { role: "user", content: prDescription}
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.6, stream: false,
          })
        }).then(response => response.json())
          .then(response_data => {
            document.getElementsByClassName('loading')[0].style = "display:none";
            console.log(response_data);
            if (response_data.error) {
              document.getElementById('prDescription').textContent = response_data.error.message;
            } else {
              document.getElementById('prDescription').textContent = response_data.choices[0].message.content;
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
    document.getElementById('prDescription').textContent = 'click start review button to get review result.';
  });
});