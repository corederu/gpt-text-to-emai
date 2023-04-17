const storage = chrome.storage.local;

storage.get('api', function(result) {
  if (result.api) {
    displayApiForm();
    displayApi(result.api);
  } else {
    displayApiForm();
  }
});

function displayApi(api) {
  const apiDiv = document.getElementById('api-div');
  const apiText = document.createElement('p');
  apiText.setAttribute('id', 'api-text');
  apiText.textContent = `ma clé API : ${api}`;
  apiDiv.appendChild(apiText);
}

function removeApi() {
  const apiDiv = document.getElementById('api-text');
  if (apiDiv) {
    apiDiv.remove();
  }
}

function displayApiForm() {
  const apiDiv = document.getElementById('api-div');
  const form = document.createElement('form');
  form.className = 'container';

  const formGroup = document.createElement('div');
  formGroup.className = 'form-group';

  const link = document.createElement('a');
  link.textContent = 'Créer une clé API';
  link.style.margin = '0.5em';
  link.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://platform.openai.com/overview' });
  });
  formGroup.appendChild(link);

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'api';
  input.placeholder = 'Entrer la clé API ici...';
  input.style.margin = '0.5em';
  formGroup.appendChild(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Enregistrer';
  button.style.margin = '0.5em';
  formGroup.appendChild(button);

  form.appendChild(formGroup);

  form.addEventListener('submit', function(e) {
    removeApi();
    e.preventDefault();
    const api = input.value.trim();
    storage.set({'api': api}, function() {
      displayApi(api);
    });
  });

  apiDiv.appendChild(form);
}
