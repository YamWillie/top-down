class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'slime', 0)
    this.scene = scene

    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)
    this.setScale(2)
  }
}
