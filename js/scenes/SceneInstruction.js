import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */


export class SceneInstruction extends Phaser.Scene {

	constructor() {
		super("SceneInstruction");
    }
    
create(){

//créer la grille de montage
this.grille = new GrilleMontage(this, 9,15);
//this.grille.afficherGrille();

// change la couleur du fond de la scène
this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#337160");

// ajoute la musique de la scène
this.musiqueIntro = this.sound.add("musiqueIntro", {volume: 0.3, loop:true});
this.musiqueIntro.play();

// change les propriétés du texte 
let tailleTexte = Math.round(40 * GrilleMontage.ajusterRatioX());
	let style = {
    	font: `bold ${tailleTexte}px Arial`,
    	color: "#ffffff",
        align: "center",
        wordWrap: {
        width: this.game.config.width * 0.95
        }
	}
	

    //texte de saut
	this.saut = this.add.text(game.config.width, game.config.height, " Saut", style);
	
	this.saut.setFontFamily("Chelsea Market");

	this.grille.placerIndexCellule(30, this.saut);

    //texte pour le double saut
	this.DoubleSaut = this.add.text(game.config.width, game.config.height, " Double Saut", style);
	
	this.DoubleSaut.setFontFamily("Chelsea Market");

	this.grille.placerIndexCellule(83, this.DoubleSaut);

    //Ajoute les images du pointers
	let pointer = this.add.image(this.game.config.width, game.config.height, "pointer");
	let pointer2 = this.add.image(this.game.config.width, game.config.height, "pointer");
	let pointer3 = this.add.image(this.game.config.width, game.config.height, "pointer");

    //place les images
	this.grille.placerIndexCellule(22, pointer);
	this.grille.placerIndexCellule(75, pointer2);
	this.grille.placerIndexCellule(77, pointer3);

    //ajoute la flèche pour changer de scène
	let fleche = this.add.image(this.game.config.width, game.config.height, "fleche");

	this.grille.placerIndexCellule(112, fleche);

	GrilleMontage.mettreEchelleRatioX(fleche);

    //interactivité de la flèche
	fleche.setInteractive();
	fleche.on("pointerup", this.AllerJeu, this);

    //vérifie l'orientation du mobile
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
        this.fullscreen.setInteractive({
            useHandCursor: true
        });
        //Gestionnaire d'événement sur le bouton
        this.fullscreen.on("pointerup", this.mettreOuEnleverPleinEcran, this)
    }
}

}

    // Changer la scène pour celle du jeu
    AllerJeu(){
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