var SpaceArcade = SpaceArcade || {};
SpaceArcade.game = new Phaser.Game(720, 560, Phaser.Auto,"",null,false,true);


SpaceArcade.game.state.add("MainState",SpaceArcade.MainState);
SpaceArcade.game.state.start("MainState");