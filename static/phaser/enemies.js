class Enemies extends Phaser.Physics.Arcade.Group {
  constructor(world, scene, children, spriteArray) {
    super(world, scene, children)
    this.scene = scene

    this.createEnemies(scene, spriteArray)
  }

  createEnemies(scene, spriteArray) {
    spriteArray.forEach(sprite => {})
    const spriteImage = this.load.image('../images/slime.png')
    const enemy = new Enemy(
      scene,
      sprite.x,
      sprite.y,
      this.spriteFrames[spriteImage]
    )
    this.add(enemy)
    sprite.destroy()
  }
}
