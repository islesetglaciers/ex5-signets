import './ListeDossiers.scss';
import Dossier from './Dossier';
import * as crudDossiers from '../services/crud-dossiers';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(16.5),
    marginTop: theme.spacing(3),
    minWidth: 300,
  },
}));

export default function ListeDossiers({utilisateur, etatDossiers}) {
  // État des dossiers (vient du composant Appli)
  const [dossiers, setDossiers] = etatDossiers;
  const classes = useStyles();

  // Trier les dossiers
  const triDossiers = (event) => {
    var champ = "";
    var ordre = "";
    const tri = event.target.value;
    // console.log(tri);
    switch (tri) {
      case '1':
        champ = "datemodif"
        ordre = "desc"
        break;
      case '2':
        champ = "nom";
        ordre = "asc";
        break;
      case '3':
        champ = "nom";
        ordre = "desc";
        break;
      default:
        champ = "datemodif";
        ordre = "desc";
        break;
    }
    // console.log(champ, ordre);
    crudDossiers.lireTout(utilisateur.uid, champ, ordre).then(
      dossiers => setDossiers(dossiers)
    );
  };

  // Lire les dossiers dans Firestore et forcer le réaffichage du composant
  // Remarquez que ce code est dans un useEffect() car on veut l'exécuter 
  // UNE SEULE FOIS (regardez le tableau des 'deps' - dépendances) et ceci 
  // APRÈS l'affichage du composant pour que la requête asynchrone à Firestore  
  // ait eu le temps d'être complétée et le réaffichage du composant soit
  // forcé par la mutation de l'état des dossiers
  useEffect(
    () => {
      crudDossiers.lireTout(utilisateur.uid, "datemodif", "desc").then(
        dossiers => setDossiers(dossiers)
      )
    }, []
  );

  /**
   * Gérer le clic du bouton 'supprimer' correspondant au dossier identifié en argument
   * @param {string} idd identifiant Firestore du dossier
   */
  async function gererSupprimer(idd) {
    // On fait appel à la méthode supprimer de notre code d'interaction avec Firestore
    crudDossiers.supprimer(utilisateur.uid, idd).then(
      () => {
        const tempDossiers = [...dossiers]; // copier le tableau des dossiers existants
        const dossiersRestants = tempDossiers.filter((elt) => elt.id!==idd); // filtrer pour garder tous les dossiers sauf celui qu'on a demandé de supprimer
        setDossiers(dossiersRestants); // Muter l'état pour forcer le réaffichage du composant
      }).catch(erreur => console.log('Échec de la suppression - Firestore a répondu :', erreur.message));
  }
  
  return (
    <>
    <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="age-native-label-placeholder">
          Tri des dossiers
        </InputLabel>
        <NativeSelect
          onChange={triDossiers}
        >
          <option value={1}>Date de modification descendante</option>
          <option value={2}>Nom de dossier ascendant</option>
          <option value={3}>Nom de dossier descendant</option>
        </NativeSelect>
      </FormControl>
    <ul className="ListeDossiers">
      {
        (dossiers.length > 0) ?
          dossiers.map(dossier => <li key={dossier.id}><Dossier {...dossier} gererSupprimer={gererSupprimer} /></li>)
        :
          <li className="msgAucunDossier">
            Votre liste de dossiers est vide 
            <p>;-(</p>
          </li>
      }
    </ul>
    </>
  );
}