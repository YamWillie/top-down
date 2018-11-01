class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, frame) {
    super(scene, x, y, 'slime', frame)
    this.scene = scene

    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)
    this.setScale(2)

    // move our enemy
    this.timeEvent = this.scene.time.addEvent({
      delay: 3000,
      callback: this.move,
      loop: true,
      callbackScope: this,
    })

    function move() {
      const randNumber = Math.floor(Math.random() * 4 + 1)
      switch (randNumber) {
        case 1:
          this.setVelocityX(100)
          break
        case 2:
          this.setVelocityX(-100)
          break
        case 3:
          this.setVelocityY(100)
          break
        case 4:
          this.setVelocityX(-100)
          break
        default:
          this.setVelocityX(100)
          break
      }
      this.scene.time.addEvent({
        delay: 500,
        callback: () => {
          this.setVelocity(0)
        },
        callbackScope: this,
      })
    }
  }
}
