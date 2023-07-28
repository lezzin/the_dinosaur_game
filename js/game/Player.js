import PlayerStates from "./PlayerStates.js";
import SpriteAnimation from "./SpriteAnimation.js";
import sounds from "./sounds.js";

export default class Player {
  shouldJump = false;
  jumpCount = 0;
  jumpHeight = 12;

  constructor(context) {
    this.context = context;
    this.state = PlayerStates.idle;

    this.x = 10;
    this.y = this.context.canvas.height - 200;

    this.width = this.context.canvas.width / 3;
    this.height = this.context.canvas.height / 3 - 10;

    this.createAnimations();
  }

  draw(isDead) {
    this.#setState();
    isDead && (this.state = PlayerStates.dead);

    const animation = this.animations.find(animation => animation.isFor(this.state));
    const image = animation.getImage();
    const isInGround = this.y === this.context.canvas.height - 200;

    if (this.jumpPressed && this.state !== PlayerStates.dead && isInGround) {
      sounds.jumpSFX.play();
      this.jumpAnimation.reset();
      this.shouldJump = true;
      this.jumpCount = 0;
    }

    if (this.shouldJump) {
      let playerIsRunning = this.runPressed && this.rightPressed && this.state !== PlayerStates.dead;
      let millisecondsInTheAir = playerIsRunning ? 15 : 28;

      this.jumpCount++;

      if (this.jumpCount < 13)
        this.y -= this.jumpHeight;

      if (this.jumpCount > 13 && this.jumpCount < 25)
        this.y += 0;

      if (this.jumpCount > millisecondsInTheAir)
        this.y += this.jumpHeight;

      if (this.jumpCount > 45) {
        this.shouldJump = false;
        this.jumpCount = 0;
      }
    }

    const ground = this.context.canvas.height - 200;
    const playerIsAboveTheGround = this.y > ground;
    if (playerIsAboveTheGround) this.y = ground;

    const arrowRightIsPressed = this.rightPressed && this.state !== PlayerStates.dead;
    const arrowLeftPressed = this.leftPressed && this.state !== PlayerStates.dead;
    const playerIsRunning = this.runPressed && this.rightPressed && this.state !== PlayerStates.dead;

    if (arrowRightIsPressed || arrowLeftPressed) {
      sounds.stepsSFX.playbackRate = playerIsRunning ? 1.5 : 0.5;
      sounds.stepsSFX.play();
    }

    this.context.drawImage(image, this.x, this.y, this.width, this.height);
  }

  #setState() {
    if (this.jumpPressed)
      return this.state = PlayerStates.jump;

    if (this.runPressed && this.rightPressed)
      return this.state = PlayerStates.run;

    if (this.rightPressed || this.leftPressed)
      return this.state = PlayerStates.walk;

    this.state = PlayerStates.idle;
  }

  reset() {
    this.x = 10;
    this.y = this.context.canvas.height - 200;
  }

  createAnimations() {
    this.deadAnimation = new SpriteAnimation("Dead (?).png", 8, 4, PlayerStates.dead, true);
    this.idleAnimation = new SpriteAnimation("Idle (?).png", 10, 6, PlayerStates.idle);
    this.jumpAnimation = new SpriteAnimation("Jump (?).png", 12, 3, PlayerStates.jump);
    this.runAnimation = new SpriteAnimation("Run (?).png", 8, 6, PlayerStates.run);
    this.walkAnimation = new SpriteAnimation("Walk (?).png", 10, 6, PlayerStates.walk);

    this.animations = [this.idleAnimation, this.jumpAnimation, this.runAnimation, this.walkAnimation, this.deadAnimation];
  }

  resetDeadAnimation() {
    this.deadAnimation.reset();
  }

  keydown = (event) => {
    const keydownEvents = {
      ArrowRight: () => this.rightPressed = true,
      ArrowUp: () => this.jumpPressed = true,
      ArrowLeft: () => this.leftPressed = true,
      ShiftLeft: () => this.runPressed = true,
      ShiftRight: () => this.runPressed = true,
      Space: () => this.jumpPressed = true,
    }

    keydownEvents[event.code] && keydownEvents[event.code]();
  };

  keyup = (event) => {
    const keypressEvents = {
      ArrowRight: () => this.rightPressed = false,
      ArrowUp: () => this.jumpPressed = false,
      ArrowLeft: () => this.leftPressed = false,
      ShiftLeft: () => this.runPressed = false,
      ShiftRight: () => this.runPressed = false,
      Space: () => this.jumpPressed = false,
    }

    keypressEvents[event.code] && keypressEvents[event.code]();
  };
}
