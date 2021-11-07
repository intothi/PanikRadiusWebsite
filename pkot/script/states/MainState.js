
// Achtung globale Variablen!!!
// Bitte 100 Meter Sicherheitsabstand halten und nicht füttern!

var SpaceArcade = SpaceArcade || {};
var bulletTime = 0;  // wird als globale Variable für den fire delay benötigt
var fireDelay = 150; // fire delay in miliseconds
var playerBulletsDamage = 1;  // Der Schaden den der Spieler an Gegner durch einen Schuss verursacht
var playerBodyDamage = 9999;  // Der Schaden den der Spieler bei Kollision mit Gegner an den Gegnern verursacht
var style = { font: "bold 16px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
var highscore = 0;  // Der Highscore
var playerHealth = 999;  // Die Spielerleben
var playerPosX = 720/2;  // Die Spielerposition auf der X Achse



SpaceArcade.MainState = {

  init: function(currentLevel){

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Level Daten
        //Anzahl der Level
    this.numLevels = 3;

    // Das momentane Level = Das Momentane Level. Wenn kein current Level Exestiert dann Level 1.
	// Kann man auch als if else Funktion umbauen.
	this.currentLevel = currentLevel ? currentLevel : 1;

  },




  preload: function() {

this.load.image("space", "assets/images/pkot_back_800x600.jpg");
//this.load.image("player", "assets/images/pkot_player_ship_64.png");
this.load.spritesheet("player", "assets/images/pkot_player_ship_3f64.png", 64, 64, 6);
this.load.image("playerBulletSprite", "assets/images/pkot_player_shot_10x16.png");
this.load.image("enemy_01", "assets/images/pkot_enemy_01_64.png");
this.load.image("enemyBulletSprite", "assets/images/pkot_enemy_bullet_16.png");
//this.load.image("middleEnemy", "assets/images/middleEnemy");
//this.load.image("hardEnemy", "assets/images/hardEnemy");
//this.load.spritesheet("explosion1Sprite","assets/images/pkot_explo_12f64.png", 64, 64, 12);
this.load.spritesheet("explosion1Sprite","assets/images/pkot_explo_12f128.png", 128, 128, 12);
 // "lad mir mal das Spritesheet, ein Objekt ist 104 Pixel breit , 151 Pixel hoch und davon gibbed dann 13 Stück""  // aus irgendeinem Grund muss ich 14 anstatt 13 sagen damit er auf Frame 13 zugreifen kann Oo?
  

  // Laden der Level Daten
  this.load.text("level1", "assets/data/level1.json");
  this.load.text("level2", "assets/data/level2.json");
  this.load.text("level3", "assets/data/level3.json");


  },




  create:function(){
    

    this.background = this.add.tileSprite(0,0, this.game.world.width, this.game.world.height, "space");
	this.background.autoScroll(0,100);


    this.initPlayers();
	this.createPlayer(playerPosX, 500, playerHealth);
    this.initEnemies();
	this.loadLevel();


    //Texteinblendungen / Interface
    highscoreText = this.game.add.text(580, 540, "Highscore: "+highscore, style);

    currentLevelText = this.game.add.text(580, 520, "Level: "+this.currentLevel, style);

    prototypText = this.game.add.text(250, 540, " Erster Prototyp von PKOT!", style);


  },

 render: function(){

  // this.game.debug.body(this.players);

  // this.game.debug.body(this.enemies);

    //this.game.debug.bodyInfo(this, 32, 32);

 },




  update: function(){
    

    // Funktioniert so : an dritter Stelle steht die aufzurufende Methode, diese Methode bekommt die beiden vorhergehenden Objekte ( die zur overlap überprüfung), übergeben. 
    // Am besten die Funktion in der Doku nochmal nachlesen. 
    //Kollisionsabfrage zwischen den Playerbullets und den Gegnern.
    this.game.physics.arcade.overlap (this.playerBullets, this.enemies, this.damageEnemy, null, this );

    //Kollisionsabfrage zwischen den Gegnerbullets und dem Spieler.
    this.game.physics.arcade.overlap (this.enemyBullets, this.players, this.damagePlayerByShooting, null, this );

    //Kollisionsabfrage zwischen dem GegnerBody und dem Spieler.
    this.game.physics.arcade.overlap (this.enemies, this.players, this.damagePlayerByBodyCollision, null, this );

    //aktualisieren des Highscore Textes
   highscoreText.setText("Highscore: "+highscore);

  },
  


  initEnemies: function(){
      this.enemies = this.add.group();
      this.enemies.enableBody = true;

      this.enemyBullets = this.add.group();
      this.enemyBullets.enableBody = true;
 

    },

  

    damageEnemy: function (playerBullet, enemy){

      enemy.damage(playerBulletsDamage);

      playerBullet.kill();
    },


  damagePlayerByShooting: function(enemyBullet, player){

    enemyBullet.kill();

    player.damage(1);



},

damagePlayerByBodyCollision: function(enemy, player){
  enemy.damage(playerBodyDamage);
  console.log("Kollidiert!");
  player.damage(5);

  /*
  Alternativ:

  enemy.kill();
  enemy.enemyTimer.pause();
*/
},




loadLevel:function(){

  this.currentEnemyIndex = 0;


  this.levelData = JSON.parse(this.game.cache.getText("level"+ this.currentLevel));

    // Level Ende Timer 
    // Ersetzten durch andere Bedingung

    this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000 , function(){
      console.log("level ended!");

      if(this.currentLevel < this.numLevels){
          this.currentLevel ++ ;
      }else{
        this.currentLevel = 1;
      }

      this.game.state.start("MainState", true, false, this.currentLevel);
    },this);

    this.scheduleNextEnemy();
},

scheduleNextEnemy: function() {
    var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
    
    if(nextEnemy){
      var nextTime = 1000 * ( nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time));
      
      this.nextEnemyTimer = this.game.time.events.add(nextTime, function(){
        this.createEnemy(nextEnemy.x * this.game.world.width, -100, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY, nextEnemy.score, nextEnemy.angle, nextEnemy.bulletVelocityY, nextEnemy.bulletVelocityX);
        
        this.currentEnemyIndex++;
        this.scheduleNextEnemy();
      }, this);
    }

  },

  createEnemy: function(x, y, health, key, scale, speedX, speedY,score, angle, bulletVelocityY, bulletVelocityX){
  
    var enemy = this.enemies.getFirstExists(false);
    
    if(!enemy){
      enemy = new SpaceArcade.Enemy(this.game, x, y, key, health, this.enemyBullets, score, bulletVelocityY, bulletVelocityX);
      this.enemies.add(enemy);
    }
    
    enemy.reset(x, y, health, key, scale, speedX, speedY, angle, bulletVelocityX, bulletVelocityY);
  },





  initPlayers: function(){
      this.players = this.add.group();
      this.players.enableBody = true;

       this.playerBullets = this.add.group();
       this.playerBullets.enableBody = true;
     

    },

    

  createPlayer: function(x, y, health){
  
    var testPlayer = this.players.getFirstExists(false);
    
    if(!testPlayer){
      testPlayer = new SpaceArcade.Player(this.game, x, y, health, this.playerBullets);
      this.players.add(testPlayer);
    }


  },









}

