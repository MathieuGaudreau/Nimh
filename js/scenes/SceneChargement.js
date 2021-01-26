/**
 * Class representant la scène du jeu qui charge les médias.
 * @extends Phaser.Scene
 */

export class SceneChargement extends Phaser.Scene {

	constructor() {
		super("SceneChargement");
	}

	preload() {


		//Partie du chemin commun aux images...
		this.load.setPath("media/img/");

		//Charger les images du jeu
		this.load.image("Plateforme");
        this.load.image("background");
        this.load.image("background2");
		this.load.image("titre");
		this.load.image("pointer");
		this.load.image("fleche");
		this.load.image("restart");
		this.load.image("persoMort");
		this.load.image("fullscreen");

		//Charger les sprites du jeu

		//bouton play
        this.load.spritesheet("bouton", "bouton.png", {
			frameWidth: 131,
			frameHeight: 130,
		});

		//animation intro
		this.load.spritesheet("persoIntro", "persoIntro.png", {
			frameWidth: 119,
			frameHeight: 144,
		});

		//anim perso jeu
		this.load.spritesheet("persoJeu", "persoJeu.png", {
			frameWidth: 150,
			frameHeight: 150,
        });

		//charger les sons
		this.load.setPath("media/sons/");
		this.load.audio("sonPlay", ["sonPlay.mp3", "sonPlay.ogg"]);
		this.load.audio("musiqueIntro", ["musiqueIntro.mp3", "musiqueIntro.ogg"]);
		this.load.audio("musiqueJeu", ["musiqueJeu.mp3", "musiqueJeu.ogg"]);

	}

	create() {
		this.scene.start("SceneIntro");
	}
}