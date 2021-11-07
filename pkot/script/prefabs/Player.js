var SpaceArcade = SpaceArcade || {};

SpaceArcade.Player = function(game, x, y, health, playerBullets) {

	var frameIdleHit = 3;
	 

	Phaser.Sprite.call(this, game, x, y, "player");


	this.game = game;

	

	

	this.animations.add("getHitIdle", [3,0,3,0,3,0], 15, false);
	
	this.health = health;
	this.playerBullets = playerBullets;


	this.game.physics.arcade.enable(this);

	//verkleinert den Collision Body
	// this.body.setSize(10, 10, 1, 1);

    
	this.anchor.setTo(0.5);
	
	 
	

	this.body.collideWorldBounds = true;

	// Player Konstanten
	this.PLAYER_SPEED = 350;
	this.BULLET_SPEED = -1000;


	//Player Input
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


	text = this.game.add.text(0, 540, "Spielerleben: "+this.health, style);



 
	

};

SpaceArcade.Player.prototype = Object.create(Phaser.Sprite.prototype);
SpaceArcade.Player.prototype.constructor = SpaceArcade.Player;


SpaceArcade.Player.prototype.update = function (){

	 this.body.velocity.x = 0;


	if(this.cursors.left.isDown) {
      this.body.velocity.x = -this.PLAYER_SPEED;
      //this.frame = 1;
      this.angle =-8;
      
    }
    else if(this.cursors.right.isDown) {
     this.body.velocity.x = this.PLAYER_SPEED;
    //this.frame = 2;
     this.angle = +8;

	} else {
	//this.frame = 0;
	this.rotation = 0;

	}
    	
   
     // console.log("Die Globale Health Variable: "+playerHealth);
       //console.log("Die lokale Health Variable: "+this.health);
    
    if (this.spaceKey.isDown){

	 this.createPlayerBullet(); 
	

    }





text.setText("Spielerleben: "+this.health);

	//updaten der globalen Variablen Health und player Position auf der X-Achse
	// damit die Leben und position des Spielers beim Levelwechsel bestehen bleiben.
 	playerHealth = this.health;
	playerPosX = this.x;
		
},

SpaceArcade.Player.prototype.damage = function(amount){
	Phaser.Sprite.prototype.damage.call(this, amount);

	
		this.play("getHitIdle");  //funktioniert nicht in Verbindung mit  Zeile 69  this.frame = 0;
		
	
	if (this.health <= 0){
		

		//Eventuell den Higscore veringern?
		//highscore = highscore + this.score;



		// Explosionsanimation
		this.explosion = SpaceArcade.MainState.game.add.sprite (this.x, this.y, "explosion1Sprite",0);
		this.explosion.anchor.setTo(0.5,0.5);
		this.explosion.animations.add("explode", [0,1,2,3,4,5,6,7,8,9,10,11], 15, false);
		this.explosion.play("explode");

		// Zerstören der Animation
		this.game.time.events.add(Phaser.Timer.SECOND * 0.8, this.killexplosion, this);
		

	}

},

SpaceArcade.Player.prototype.createPlayerBullet = function () {
	

	if (this.game.time.now > bulletTime){

		 var playerBullet = this.playerBullets.getFirstExists(false);

		 if(!playerBullet){
      //console.log("create bullet");
     playerBullet = new SpaceArcade.PlayerBullet ( this.game, this.x, this.top);
      this.playerBullets.add(playerBullet);
       bulletTime = this.game.time.now + fireDelay;

    }else{
      // reset position
      playerBullet.reset(this.x, this.top);
       bulletTime = this.game.time.now + fireDelay;

    }
    // set velocity
    playerBullet.body.velocity.y = this.BULLET_SPEED;

    }


  
	},

	SpaceArcade.Player.prototype.killexplosion = function () {
	this.explosion.destroy();

}

	