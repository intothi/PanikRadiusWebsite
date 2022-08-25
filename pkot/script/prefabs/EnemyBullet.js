var SpaceArcade = SpaceArcade || {};

SpaceArcade.EnemyBullet = function (game, x, y){
	Phaser.Sprite.call(this, game, x, y, "enemyBulletSprite");

	this.anchor.setTo(0.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;


};


SpaceArcade.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceArcade.EnemyBullet.prototype.constructor = SpaceArcade.EnemyBullet;