function getText(id) {
  // prend le texte de l'email
  let element = document.getElementsByClassName("Am Al editable LW-avf tS-tW");

  if (element[id] !== null) {
    let texte = element[id].textContent;
    return texte;
  }
}

function putButton(storage) {
  //ajouter boutton au mail et event listener
  let div = document.getElementsByClassName("Ar Au");
  let id = 0;

  Array.from(div).forEach((mail) => {
    //vérifie si on a déjà mit un boutton clique
    let myButon = document.getElementById("mail_to_ai_but" + id);

    //si pas de bouton
    if (myButon == null) {
      //verifie si l'element existe
      if (mail != null) {
        //affiche un bouton
        let bouton = document.createElement("button");
        bouton.textContent = "Transformer en mail";
        bouton.style.marginBottom = "10px";
        bouton.id = "mail_to_ai_but" + id.toString();
        bouton.style.background = "linear-gradient(135deg, #009FFF, #ec2F4B)";
        bouton.style.borderRadius = "5px";
        bouton.style.padding = "10px 20px";
        bouton.style.border = "none";
        bouton.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        bouton.style.color = "#fff";
        bouton.style.cursor = "pointer";
        bouton.addEventListener(
          "click",
          (function (id, storage) {
            return function () {
              ShowNewMail(id, storage);
            };
          })(id, storage)
        );

        mail.insertAdjacentElement("afterbegin", bouton);
      }
    }

    id++;
  });
}

function generatedMail(prompt, id, storage) {
  // genere le mail
  let final_prompt =
    "transforme ce texte en magnifique corps de mail (sans l'objet) : " +
    prompt;

  openai_test();

  async function openai_test() {
    const url =
      "https://api.openai.com/v1/engines/text-davinci-003/completions";

    // récupère api
    storage.get("api", async function (result) {
      const apiKey = result.api;
      const url =
        "https://api.openai.com/v1/engines/text-davinci-003/completions";
      const data = {
        prompt: final_prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0.75,
        presence_penalty: 0,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        const responseText = responseData.choices[0].text;

        //affiche la reponse
        displayMail(responseText, id);
      } catch (error) {
        console.error(error);
      }
    });
  }
}

function displayMail(texte, id) {
  //affiche le tetxe à la place de l'ancien mail
  let element = document.getElementsByClassName("Am Al editable LW-avf tS-tW");
  if (element[id] !== null) {
    element[id].textContent = texte;
  }

  //change le bouton
  let bouton = document.getElementById("mail_to_ai_but" + id.toString());
  bouton.textContent = "Transformer en mail";
  bouton.style.marginBottom = "10px";
  bouton.style.background = "linear-gradient(135deg, #009FFF, #ec2F4B)";
  bouton.style.borderRadius = "5px";
  bouton.style.padding = "10px 20px";
  bouton.style.border = "none";
  bouton.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
  bouton.style.color = "#fff";
  bouton.style.cursor = "pointer";
  bouton.disabled = false;
}

async function ShowNewMail(id, storage) {
  // change le boutton
  let bouton = document.getElementById("mail_to_ai_but" + id);
  bouton.textContent = "Chargement";
  bouton.style.backgroundImage = "linear-gradient(to right, #d6d6d6, #f6f6f6)";
  bouton.style.color = "#333";
  bouton.disabled = true;

  // prend le texte, appel l'ia et l'affiche
  const mail = getText(id);

  // genere le nouveau mail
  generatedMail(mail, id, storage);
}

//MAIN

const storage = chrome.storage.local;

//vérifie si on a une api
storage.get("api", function (result) {
  if (result.api !== undefined) {
    //si api défini
    //si on clique
    document.addEventListener("click", function () {
      setTimeout(function () {
        putButton(storage);
      }, 100);
    });

    //ajoute bouton au demarrage du site
    window.addEventListener("load", function () {
      setTimeout(function () {
        putButton(storage);
      }, 100);
    });
  }
});