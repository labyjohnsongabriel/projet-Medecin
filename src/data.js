import axios from "axios";

// Requête GET
axios.get('http://localhost:3000/api/users')
  .then(response => {
    // Traitement des données
    console.log(response.data);
  })
  .catch(error => {
    // Gestion des erreurs
    if (error.response) {
      // La requête a reçu une réponse, mais le serveur a répondu avec un code de statut en dehors de la plage 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // La requête a été faite, mais aucune réponse n'a été reçue
      console.log(error.request);
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.log('Erreur', error.message);
    }
    console.log(error.config);
  });

// Requête POST avec une URL configurée
const apiUrl = "http://localhost:8888/api/users/Ajouter";
const data = {}; // Ajouter les données à envoyer
axios.post(apiUrl, data)
  .then(response => {
    // Traitement de la réponse
  })
  .catch(error => {
    // Gestion des erreurs
  });

// Fonction pour effectuer une requête POST vers une URL spécifiée
function postToApi(url, data) {
  axios.post(url, data)
    .then(response => {
      // Traitement de la réponse
    })
    .catch(error => {
      // Gestion des erreurs
    });
}

// Utilisation de la fonction avec l'URL spécifié
const dataToSend = {}; // Ajouter les données à envoyer
postToApi("http://localhost:8888/api/users/Ajouter", dataToSend);
