/*
  Ce fichier contient les variables de configuration
  reliées à Firebase et ses produits.
*/

// Configuration Firebase (mettez-y les vôtres !)
const firebaseConfig = {
  apiKey: "AIzaSyDg9Y9_KlsPAThZZTHRb88R3xXTC0U9o3Q",
  authDomain: "pvt-h21.firebaseapp.com",
  databaseURL: "https://pvt-h21-default-rtdb.firebaseio.com",
  projectId: "pvt-h21",
  storageBucket: "pvt-h21.appspot.com",
  messagingSenderId: "424129836393",
  appId: "1:424129836393:web:7e74a91d073d91e2a2f9f8"
};
export default firebaseConfig;

// Nom de la collection principale
export const utilRef = "utilisateurs-ex5";
// Nom de la sous-collection
export const dossRef = "dossiers";