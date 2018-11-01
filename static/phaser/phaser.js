const config = {
  type: Phaser.AUTO, // Which renderer to use
  width: 800, // Canvas width in pixels
  height: 600, // Canvas height in pixels
  parent: 'game-container', // ID of the DOM element to add the canvas to
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // Top down game, so no gravity
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
}

const game = new Phaser.Game(config)
var player

function preload() {
  // Runs once, loads up assets like images and audio
  this.load.image(
    'tiles',
    '../images/assets/tilesets/tuxmon-sample-32px-extruded.png'
  )
  this.load.tilemapTiledJSON(
    'map',
    '../images/assets/tilemaps/tuxemon-town.json'
  )
  this.load.atlas(
    'atlas',
    '../images/assets/atlas/atlas.png',
    '../images/assets/atlas/atlas.json'
  )

  //Monsters
  this.load.image('slime', '../images/slime.png')
}

function create() {
  // Runs once, after all assets in preload are loaded
  const map = this.make.tilemap({ key: 'map' })
  const tileset = map.addTilesetImage('tuxmon-sample-32px-extruded', 'tiles')

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createStaticLayer('Below Player', tileset, 0, 0)
  const worldLayer = map.createStaticLayer('World', tileset, 0, 0)
  const aboveLayer = map.createStaticLayer('Above Player', tileset, 0, 0)

  worldLayer.setCollisionBetween(12, 44)
  worldLayer.setCollisionByProperty({ collides: true })
  aboveLayer.setDepth(10)

  //Player
  const spawnPoint = map.findObject(
    'Objects',
    obj => obj.name === 'Spawn Point'
  )
  player = this.physics.add.sprite(
    spawnPoint.x,
    spawnPoint.y,
    'atlas',
    'misa-front'
  )
  this.physics.add.collider(player, worldLayer)

  //Enemies
  enemies = this.physics.add.sprite(300, 900, 'slime')
  enemies.setScale(3)

  this.physics.add.collider(player, enemies, hitEnemy, null, this)

  // const debugGraphics = this.add.graphics().setAlpha(0.75)
  // worldLayer.renderDebug(debugGraphics, {
  //   tileColor: null, // Color of non-colliding tiles
  //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
  //   faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
  // })

  const anims = this.anims
  anims.create({
    key: 'misa-left-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-left-walk.',
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  })
  anims.create({
    key: 'misa-right-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-right-walk.',
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  })
  anims.create({
    key: 'misa-front-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-front-walk.',
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  })
  anims.create({
    key: 'misa-back-walk',
    frames: anims.generateFrameNames('atlas', {
      prefix: 'misa-back-walk.',
      start: 0,
      end: 3,
      zeroPad: 3,
    }),
    frameRate: 10,
    repeat: -1,
  })

  const camera = this.cameras.main
  camera.startFollow(player)
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
}

function update(time, delta) {
  // Runs once per frame for the duration of the scene
  const speed = 175
  const prevVelocity = player.body.velocity.clone()

  player.body.setVelocity(0)
  cursors = this.input.keyboard.createCursorKeys()

  if (cursors.left.isDown) {
    player.body.setVelocityX(-speed)
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(speed)
  }

  if (cursors.up.isDown) {
    player.body.setVelocityY(-speed)
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(speed)
  }
  player.body.velocity.normalize().scale(speed)

  if (cursors.left.isDown) {
    player.anims.play('misa-left-walk', true)
  } else if (cursors.right.isDown) {
    player.anims.play('misa-right-walk', true)
  } else if (cursors.up.isDown) {
    player.anims.play('misa-back-walk', true)
  } else if (cursors.down.isDown) {
    player.anims.play('misa-front-walk', true)
  } else {
    player.anims.stop()

    if (prevVelocity.x < 0) player.setTexture('atlas', 'misa-left')
    else if (prevVelocity.x > 0) player.setTexture('atlas', 'misa-right')
    else if (prevVelocity.y < 0) player.setTexture('atlas', 'misa-back')
    else if (prevVelocity.y > 0) player.setTexture('atlas', 'misa-front')
  }
}

function hitEnemy(player, enemies) {
  this.scene.restart()
}
