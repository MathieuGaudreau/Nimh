//Importation des scripts et classes nécessaires
import {
	SceneChargement
} from './scenes/SceneChargement.js';

import {
	SceneIntro
} from './scenes/SceneIntro.js';

import{
    SceneJeu
} from './scenes/SceneJeu.js';

import{
    SceneInstruction
} from './scenes/SceneInstruction.js';

import{
    SceneFin
} from './scenes/SceneFin.js';



//On crééra le jeu quand la page HTML sera chargée
window.addEventListener("load", function () {
	//On définit avec des variables les dimensions du jeu sur desktop
	let largeur = 576,
		hauteur = 1024;

	//On fait 2 vérifications la première pour "Mobile" et la seconde pour "Tablet"
	//Et si on est sur un mobile (tablette ou téléphone), on re-dimensionne le jeu
	if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
		//console.log("Le jeu est lu sur un mobile... on change les dimensions...");
		largeur = Math.min(window.innerWidth, window.innerHeight);
		hauteur = Math.max(window.innerWidth, window.innerHeight);
	}

	// Object pour la configuration du jeu - qui sera passé en paramètre au constructeur
	let config = {
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: largeur,
			height: hauteur,
		},
		scene: [SceneChargement, SceneIntro, SceneInstruction, SceneJeu, SceneFin],
		backgroundColor: 0xffffff,
		physics: {
			default: 'arcade',
			arcade: {
				debug: false
			}
		}
	}

	

	// Création du jeu comme tel - comme objet global pour qu'il soit accessible à toutes les scènes du jeu
	window.game = new Phaser.Game(config);


	window.game.jeuTp1 = {
		score: 0, //Score de la partie courante
		meilleurScore: 0, //Meilleur score antérieur enregistré			
		NOM_LOCAL_STORAGE: "scorejeuTp1" //Sauvegarde et enregistrement du meilleur score pour ce jeu 
	}


	let webFontConfig = {

        //  Les polices Google que nous voulons charger. Elles sont précisées dans un tableau (Array)
        //  sous forme de chaîne de caractères(en spécifier autant que vous voulez dans le tableau - mais SANS exagérer)
        google: {
            families: ["Chelsea Market"]
        }
    };

    //Chargement des polices de caractères - À  mettre uniquement après le fichier de configuration pur le chargement des fontes
    WebFont.load(webFontConfig);

}, false);