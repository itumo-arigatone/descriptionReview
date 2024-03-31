window.addEventListener('load', function() {
  console.log('loaded chrome extension');
  let description = document.querySelector('task-lists').firstElementChild.innerText;
  chrome.storage.local.set({ 'prDescription': description });
});