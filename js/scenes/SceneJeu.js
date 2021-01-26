// Inspiré par Emanuele Feronato

import{
    GrilleMontage
}from "../utils/GrilleMontage.js";

/**
 * Class representant la scène du jeu comme tel
 */

 export class SceneJeu extends Phaser.Scene{

    constructor() {
    super("SceneJeu");

    //ajoute le local storage pour le score du jeu
    game.jeuTp1.meilleurScore = localStorage.getItem(game.jeuTp1.NOM_LOCAL_STORAGE) === null ? 0 : localStorage.getItem(game.jeuTp1.NOM_LOCAL_STORAGE);
    
    }
    
    init(){
      //commence le score a 0
      game.jeuTp1.score = 0;
    }
    create(){

      //options générales du jeu
      this.optionsJeu = {
        vitessePlateforme: 350,
        spawnRange: [100, 350],
        grandeurPlateforme: [50, 250],
        graviteJoueur: 900,
        forceSaut: 400,
        positionDebutJoueur: 100,
        sauts: 2
      };

      // ajoute l'image du fond 
      let imageFond = this.add.image(game.config.width/2, game.config.height/2, "background2");
      GrilleMontage.mettreEchelleHauteurJeu(imageFond);
      imageFond.setDepth(-2);
      
      //ajoute la musique de fond
      this.musiqueBackground = this.sound.add("musiqueJeu", {volume: 0.3, loop:true});
      this.musiqueBackground.play(); 
      
      //creer le groupe de platforme
      this.groupePlateforme = this.add.group({
          removeCallback : function(plateforme){
          plateforme.scene.plateformePool.add(plateforme)
        }
      });

      //creer le pool de plateforme
      this.plateformePool = this.add.group({
        removeCallback : function(plateforme){
          plateforme.scene.groupePlateforme.add(plateforme)
        }
      });

      //nombre de saut effectuer par le personnage
      this.nbSaut = 0;

      //appele la fonction pour creer les plateformes
      this.ajouterPlateforme(this.game.config.width, this.game.config.width/2)

      //creer le personnage
      this.perso = this.physics.add.sprite(this.optionsJeu.positionDebutJoueur, this.game.config.height / 2, "persoJeu");
      GrilleMontage.mettreEchelleRatioX(this.perso);

      //donne la gravité du personnage
      this.perso.setGravityY(this.optionsJeu.graviteJoueur);

      //change la grandeur du collider du personnage
      this.perso.body.setSize(50, 100);

      //creer l'animation de marche du perso
      this.anims.create({
        key:"animMarche",
        frames:this.anims.generateFrameNumbers("persoJeu", {
          start:4,
          end:6
        }),
        frameRate:12,
        repeat: -1
      });

      //fait jouer l'animation du perso
      this.perso.anims.play("animMarche");

      //ajoute le collider sur le personnage et les plateformes
      this.physics.add.collider(this.perso, this.groupePlateforme);

      //appele la fonction de saut a chaque click dans l'écran
      this.input.on("pointerdown", this.sauter, this);

      //vérifie l'orientation de l'écran sur mobile
      if (navigator.userAgent.includes("Mobile") || navigator.userAgent.includes("Tablet")) {
      this.verifierOrientation();
      }

      //creer la minuterie qui compte le temps de jeu
      this.minuterie = this.time.addEvent({
        delay:1000,
        repeat:-1,
        callback:this.augmenterTemps,
        callbackScope:this
      });

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

      // ajoute le texte du temps de jeu
      this.tempsTxt = this.add.text(game.config.width / 2, 0, "" + this.Compteur, style);
      this.tempsTxt.setOrigin(0.5, 0);
      
      //change la police du texte
      this.tempsTxt.setFontFamily("Chelsea Market");
  }


  //fonction qui va créer les plateformes dans le jeu
  ajouterPlateforme(largeurPlateforme, posX){
    
    let plateforme;

    //vérrifie l'espace entre les plateformes
    if(this.plateformePool.getLength()){
      plateforme = this.plateformePool.getFirst();
      plateforme.x = posX;
      plateforme.active = true;
      plateforme.visible = true;
      this.plateformePool.remove(plateforme);
    }

    //fait apparaitre des plateformes avec les propriétés instancier plus haut dnas optionJeu
    else{
      plateforme = this.physics.add.sprite(posX, this.game.config.height * 0.8, "Plateforme");
      plateforme.setImmovable(true);
      plateforme.setVelocityX(this.optionsJeu.vitessePlateforme * -1);
      this.groupePlateforme.add(plateforme);
      plateforme.body.setSize(plateforme.displayWidth, 150);
      plateforme.setDepth(-1);
      GrilleMontage.mettreEchelleRatioX(plateforme);
    }

    //largeur des plateformes
    plateforme.displayWidth = largeurPlateforme;

    //distance entre les plateformes
    this.distanceProchainePlateforme = Phaser.Math.Between(this.optionsJeu.spawnRange[0], this.optionsJeu.spawnRange[1]);
  }

  //fait sauter les personnages
  sauter(){
    //si le perso touche le sol et que le compteur de saut est plus grand que 0, il ce remet a 0
    if(this.perso.body.touching.down || (this.nbSaut > 0 && this.nbSaut < this.optionsJeu.sauts)){
      if(this.perso.body.touching.down){
        this.nbSaut = 0;
      }

      //donne la force de saut du perso
      this.perso.setVelocityY(this.optionsJeu.forceSaut *-1);

      //augmente le nombre de saut
      this.nbSaut++;
    }
  }

  update(){
    //si le perso est plus bas que la scene, le jeu change de scène et la musique arrete
    if(this.perso.y > this.game.config.height){
      this.scene.start("SceneFin");
      this.minuterie.destroy();
      this.musiqueBackground.stop();
    }

    //place le perso a la position de départ
    this.perso.x = this.optionsJeu.positionDebutJoueur;

    //distance minimale entre les plateformes
    let distanceMin = game.config.width;

    //place et enlève les plateformes quand elles sortent de la scène
    this.groupePlateforme.getChildren().forEach(function(plateforme){
      let distancePlateforme = game.config.width - plateforme.x - plateforme.displayWidth /2;
      distanceMin = Math.min(distanceMin, distancePlateforme);
      if(plateforme.x < - plateforme.displayWidth / 2){
        this.groupePlateforme.killAndHide(plateforme);
        this.groupePlateforme.remove(plateforme);
      }
    },this);

    //ajoute la prochaine plateforme quand la distance est assez grande
    if(distanceMin > this.distanceProchainePlateforme){
      var grandeurProchainePlateforme = Phaser.Math.Between(this.optionsJeu.grandeurPlateforme[0], this.optionsJeu.grandeurPlateforme[1]);
      this.ajouterPlateforme(grandeurProchainePlateforme, game.config.width + grandeurProchainePlateforme / 2);
    }
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
  
  //augmente le compteur de la minuterie a chaque seconde et l,afffiche dans la scene
  augmenterTemps() {
		game.jeuTp1.score++;
		this.tempsTxt.text = "" + game.jeuTp1.score;
  }
  
}