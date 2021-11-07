var SpaceArcade = SpaceArcade || {};

SpaceArcade.Enemy = function(game, x, y, key, health, enemyBullets, score) {

	Phaser.Sprite.call(this, game, x, y, key);


	this.game = game;
	this.health = health;
	this.enemyBullets = enemyBullets;
	this.score = score;


	this.game.physics.arcade.enable(this);

	//this.animations.add("explode", [1, 2, 3, 4, 5], 25, true);
	
    
	this.anchor.setTo(0.5);
	

	this.enemyTimer = this.game.time.create(false);
	this.enemyTimer.start();
	this.scheduleShooting();


};

SpaceArcade.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SpaceArcade.Enemy.prototype.constructor = SpaceArcade.Enemy;



SpaceArcade.Enemy.prototype.update = function (){


		
	
	if (this.x < 0.05 * this.game.world.width){
		this.x = 0.05 * this.game.world.width +4;
		this.body.velocity.x = this.body.velocity.x* -1;
		console.log("nach rechts");
	}else if (this.x > 0.95 * this.game.world.width){
		this.x = 0.95 * this.game.world.width -4 ;
		this.body.velocity.x  = this.body.velocity.x *-1;
		console.log("nach links");
	}
	
	if (this.top > this.game.world.height){
		this.kill();

	}
},

SpaceArcade.Enemy.prototype.damage = function(amount){
	Phaser.Sprite.prototype.damage.call(this, amount);

	//this.play(getHit);

	if (this.health <= 0){
		console.log("tod");
		highscore = highscore + this.score;



		// Explosionsanimation
		this.explosion = SpaceArcade.MainState.game.add.sprite (this.x, this.y, "explosion1Sprite",0);
		this.explosion.anchor.setTo(0.5,0.5);
		this.explosion.animations.add("explode", [0,1,2,3,4,5,6,7,8,9,10,11], 15, false);
		this.explosion.play("explode");

		// Zerstören der Animation
		this.game.time.events.add(Phaser.Timer.SECOND * 0.8, this.killexplosion, this);
		
		 
	// Der Gegner hört auf zu schießen wenn er Tod ist	 
	this.enemyTimer.pause();

	}
},

SpaceArcade.Enemy.prototype.reset = function (x, y, health, key, scale, speedX, speedY, angle, bulletVelocityX, bulletVelocityY){

Phaser.Sprite.prototype.reset.call(this, x, y, health);

this.enemyTimer.resume();

this.loadTexture(key);
this.scale.setTo(scale);
this.body.velocity.x = speedX;
this.body.velocity.y = speedY;
this.angle = angle;
this.bulletVelocityX = bulletVelocityX;
this.bulletVelocityY = bulletVelocityY;





},

SpaceArcade.Enemy.prototype.scheduleShooting = function () {

	this.shoot();

	this.enemyTimer.add(Phaser.Timer.SECOND * 1.5, this.scheduleShooting, this);
},

SpaceArcade.Enemy.prototype.shoot = function(){

	var bullet = this.enemyBullets.getFirstExists(false);

	if (!bullet){
		bullet = new SpaceArcade.EnemyBullet(this.game, this.x, this.bottom);
		this.enemyBullets.add(bullet);
	}else{
		bullet.reset(this.x, this.y);
	}

	
	
	bullet.body.velocity.y = this.bulletVelocityY;
	bullet.body.velocity.x = this.bulletVelocityX;
	

	
},

SpaceArcade.Enemy.prototype.killexplosion = function () {
this.explosion.destroy();

}