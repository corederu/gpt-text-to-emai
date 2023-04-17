const storage = chrome.storage.local;

storage.get('api', function(result) {
  if (result.api) {
    displayApiForm();
    displayApi(result.api);
  } else {
    displayApiForm();
  }
  displayLangBut();
  modifylang(1);
});

function displayApi(api) {
  const apiDiv = document.getElementById('api-div');
  const apiText = document.createElement('p');
  apiText.id = 'my_api_key';
  apiDiv.appendChild(apiText);

  const apiKey = document.createElement('p');
  apiKey.textContent = api;
  apiKey.setAttribute('id', 'api-text');
  apiDiv.appendChild(apiKey);
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
  link.id = 'build_api_key';
  link.style.margin = '0.5em';
  link.addEventListener('click', function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://platform.openai.com/overview' });
  });
  formGroup.appendChild(link);

  const input = document.createElement('input');
  input.id = 'input_api_key';
  input.type = 'text';
  input.name = 'api';
  input.style.margin = '0.5em';
  formGroup.appendChild(input);

  const button = document.createElement('button');
  button.type = 'submit';
  button.id = 'save_but'
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

function displayLangBut() {
  //add language options
  const apiDiv = document.getElementById('api-div');

  const button_fr = document.createElement('button');
  button_fr.textContent = 'fr';
  button_fr.style.margin = '0.5em';
  button_fr.addEventListener('click', function() {
    // load fr as language
    storage.set({'lang': "fr"}, function() {
      modifylang();
    });
  });
  apiDiv.appendChild(button_fr);

  const button_eng = document.createElement('button');
  button_eng.textContent = 'eng';
  button_eng.style.margin = '0.5em';
  button_eng.addEventListener('click', function() {
    storage.set({'lang': "eng"}, function() {
      modifylang();
    });
  });
  apiDiv.appendChild(button_eng);
}

function modifylang() {
  // id = 0 : fr
  // id = 1 : eng
  storage.get('lang', function(result) {
    let id;
    if (result.lang == 'fr') {
      id = 0;
    } else if (result.lang == 'eng') {
      id = 1;
    } else {
      id = 1;
    }
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let xmlDoc = this.responseXML;
        
        //build api key p
        const p_build_api_key = document.getElementById('build_api_key');
        let text_p_build_api_key = xmlDoc.getElementsByTagName("build_api_key")[0];
        p_build_api_key.textContent = text_p_build_api_key.textContent;

        //input api key
        const input_api_key = document.getElementById('input_api_key');
        let text_input_api_key = xmlDoc.getElementsByTagName("input_api_key")[0];
        input_api_key.placeholder = text_input_api_key.textContent;

        //input api key
        const save_but = document.getElementById('save_but');
        let text_save_but = xmlDoc.getElementsByTagName("save_but")[0];
        save_but.textContent = text_save_but.textContent;

        //my_api_key
        const my_api_key = document.getElementById('my_api_key');
        let text_my_api_key = xmlDoc.getElementsByTagName("my_api_key")[0];
        my_api_key.textContent = text_my_api_key.textContent;
      }
    };
    if(id == 0) {
      xmlhttp.open("GET", "../lang/fr.xml", true);
    }
    if(id == 1) {
      xmlhttp.open("GET", "../lang/eng.xml", true);
    }
    xmlhttp.send();
  });
}