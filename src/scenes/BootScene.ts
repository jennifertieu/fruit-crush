import Phaser from 'phaser'

const FRUIT_COLORS = [
  0xdc3232, // Apple - red
  0xf08c1e, // Orange - orange
  0x8c3cbe, // Grape - purple
  0xf0dc1e, // Lemon - yellow
  0x32b446, // Watermelon - green
  0x3c64d2, // Blueberry - blue
  0xe6508c, // Cherry - pink
  0x50a032, // Kiwi - dark green
]

const FRAME_SIZE = 64

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    // Generate a placeholder sprite sheet via Phaser Graphics.
    // Replace with a real asset load once game art is available:
    //   this.load.spritesheet('fruits', 'assets/sprites/fruits.png', {
    //     frameWidth: FRAME_SIZE, frameHeight: FRAME_SIZE,
    //   })
    this.generatePlaceholderSpriteSheet()
  }

  create(): void {
    // Placeholder textures are ready; transition to MenuScene once it exists.
    // this.scene.start('MenuScene')
    console.log('BootScene: placeholder sprite sheet loaded, game ready')
  }

  private generatePlaceholderSpriteSheet(): void {
    const g = this.add.graphics()

    FRUIT_COLORS.forEach((color, i) => {
      const cx = i * FRAME_SIZE + FRAME_SIZE / 2
      const cy = FRAME_SIZE / 2

      // Fruit body
      g.fillStyle(color, 1)
      g.fillCircle(cx, cy, 26)

      // Highlight
      g.fillStyle(0xffffff, 0.25)
      g.fillCircle(cx - 8, cy - 8, 10)
    })

    g.generateTexture('fruits', FRAME_SIZE * FRUIT_COLORS.length, FRAME_SIZE)
    g.destroy()

    // Register individual frames so Phaser treats this as a sprite sheet
    const texture = this.textures.get('fruits')
    for (let i = 0; i < FRUIT_COLORS.length; i++) {
      texture.add(i, 0, i * FRAME_SIZE, 0, FRAME_SIZE, FRAME_SIZE)
    }
  }
}
