var SpaceArcade = SpaceArcade || {};

SpaceArcade.PlayerBullet = function (game, x, y){
	Phaser.Sprite.call(this, game, x, y, "playerBulletSprite");

	this.anchor.setTo(0.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
};


SpaceArcade.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceArcade.PlayerBullet.prototype.constructor = SpaceArcade.PlayerBullet;