import {
	GrilleMontage
} from "../utils/GrilleMontage.js";

/**
 * Class representant la scène d'intro du jeu
 * @extends Phaser.Scene
 */
export class SceneIntro extends Phaser.Scene {

	constructor() {
		super("SceneIntro");
    }
    
create(){

//creer la grille
this.grille = new GrilleMontage(this, 9,15);
//this.grille.afficherGrille();

//image de fond
let imageFond = this.add.image(game.config.width/2, game.config.height/2, "background");
GrilleMontage.mettreEchelleHauteurJeu(imageFond);

//musique intro
this.musiqueIntro = this.sound.add("musiqueIntro", {volume: 0.3, loop:true});
this.musiqueIntro.play();

//bouton play
this.bouton = this.add.sprite(game.config.width, game.config.height, "bouton", 0);
this.grille.placerIndexCellule(112, this.bouton);
GrilleMontage.mettreEchelleRatioX(this.bouton);

//interactiviter du bouton
this.bouton.setInteractive();
this.bouton.on("pointerup", this.AllerInstruction, this);

//animation du bouton
this.bouton.on("pointerover", function () {
    this.setFrame(1);
});

this.bouton.on("pointerout", function () {
    this.setFrame(0);
});

//titre du jeu
let titre = this.add.image(this.game.config.width, game.config.height, "titre");
this.grille.placerIndexCellule(94, titre);
GrilleMontage.mettreEchelleRatioX(titre);

//placer animation du personnage
let persoIntro = this.add.sprite(game.config.width, game.config.height, "persoIntro", 0);
this.grille.placerIndexCellule(67, persoIntro);
GrilleMontage.mettreEchelleRatioX(persoIntro);

//creer l'animation du perso
this.anims.create({
key:"animPersoIntro",
frames:this.anims.generateFrameNumbers("persoIntro"),
frameRate:2,
repeat:-1
});

//jouer l'animation du perso
persoIntro.anims.play("animPersoIntro");

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


//changer de scene pour celle d'instructions
AllerInstruction(){
this.musiqueIntro.stop();
this.sound.add("sonPlay").play()
this.scene.start("SceneInstruction");
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