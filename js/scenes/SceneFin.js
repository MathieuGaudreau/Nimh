import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */


export class SceneFin extends Phaser.Scene {

	constructor() {
		super("SceneFin");
    }
    
create(){

//creer la grille de montage
this.grille = new GrilleMontage(this, 9,15);
//this.grille.afficherGrille();

//change la couleur de la scene
this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#337160");

//ajoute la musique de fond
this.musiqueIntro = this.sound.add("musiqueIntro", {volume: 0.3, loop:true});
this.musiqueIntro.play();

//ajoute le boute de restart
let restart = this.add.image(this.game.config.width, game.config.height, "restart");

this.grille.placerIndexCellule(112, restart);

GrilleMontage.mettreEchelleRatioX(restart);

//interactiviter du bouton de restart
restart.setInteractive();
restart.on("pointerup", this.Recommencer, this);

//va chercher le meilleur score
game.jeuTp1.meilleurScore = Math.max(game.jeuTp1.score, game.jeuTp1.meilleurScore);
localStorage.setItem(game.jeuTp1.NOM_LOCAL_STORAGE, game.jeuTp1.meilleurScore);

//propriété du texte
let tailleTexte = Math.round(40 * GrilleMontage.ajusterRatioX());
	let style = {
    	font: `bold ${tailleTexte}px Arial`,
    	color: "#ffffff",
        align: "center",
        wordWrap: {
        width: this.game.config.width * 0.95
        }
    }
    
		//texte du score actuel
		let leTexte = "Votre score:\n";
		leTexte += game.jeuTp1.score + " Secondes survécues\n\n";

		//texte du meilleur score
		leTexte += "Meilleur score:\n";
		leTexte += game.jeuTp1.meilleurScore + " Secondes survécues";

		//ajoute le texte du score
		let finJeuTxt = this.add.text(game.config.width / 2, game.config.height / 2, leTexte, style)
		finJeuTxt.setOrigin(0.5);
		
		//change la police du texte
        finJeuTxt.setFontFamily("Chelsea Market");

		//ajoute l'image du personnage mort
        this.persoMort = this.add.image(game.config.width / 2, game.config.height / 2, "persoMort");
		this.grille.placerIndexCellule(22, this.persoMort);
		
		//vérifie l'orientation de l'écran sur mobile
      	if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
      	this.verifierOrientation();
      	}

		//permet de mettre le jeu en plein écran si le jeu est sur desktop
		if (!this.sys.game.device.os.android && !this.sys.game.device.os.iOS ) {
			if (this.sys.game.device.fullscreen.available) {
				//On peut gérer le mode FullScreen alors on affiche le bouton         
				this.fullscreen = this.add.image(game.config.width/2, game.config.height/2, "fullscreen");
				this.grille.placerIndexCellule(8, this.fullscreen);
				this.fullscreen.setDepth(2);
				GrilleMontage.mettreEchelleRatioX(this.fullscreen);
				this.fullscreen.setInteractive({
					useHandCursor: true
				});
				//Gestionnaire d'événement sur le bouton
				this.fullscreen.on("pointerup", this.mettreOuEnleverPleinEcran, this)
			}
		}
}


	//permet de recommencer le jeu
	Recommencer(){
		this.scene.start("SceneJeu");
		this.musiqueIntro.stop();
	}

	  //Fait apparaitre l'écran pause si le jeu est dans la mauvaise orientation sur mobile
	  verifierOrientation() {
		if (window.orientation === 90 || window.orientation === -90) {
			document.getElementById("pause").style.display = "block";
			this.scene.pause(this);
		} 
		else {
			this.pause = document.getElementById("pause");
			this.scene.resume(this);
			this.pause.style.display = "none";
		}
	  }

	// Met le jeu en plein écran ou l'enlève
	mettreOuEnleverPleinEcran() {
		if (!this.scale.isFullscreen) {
			this.scale.startFullscreen();
		} else {
			this.scale.stopFullscreen();
		}
	}
}