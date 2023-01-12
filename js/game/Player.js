import PlayerStates from "./PlayerStates.js";
import SpriteAnimation from "./SpriteAnimation.js";
import sounds from "./sounds.js";

export default class Player {
  shouldJump = false;
  jumpCount = 0;
  jumpHeight = 12;

  constructor(ctx) {
    this.state = PlayerStates.idle;

    this.x = 10;
    this.y = ctx.canvas.height - ctx.canvas.height / 3 - 9;

    this.width = ctx.canvas.width / 4;
    this.height = ctx.canvas.height / 3;
  }

  draw(ctx, isDead) {
    this.#setState();
    isDead && (this.state = PlayerStates.dead);

    const animation = this.animations.find(animation => animation.isFor(this.state));
    const image = animation.getImage();
    const currentState = this.state;

    // ---------------------------- Pulo ---------------------------- //
    if (this.jumpPressed && currentState !== PlayerStates.dead && this.y === ctx.canvas.height - ctx.canvas.height / 3 - 9) {
      this.jumpAnimation.reset();
      this.shouldJump = true;
      this.jumpCount = 0;
      sounds.jumpSFX.play();
    }

    if (this.shouldJump) {
      this.jumpCount++;

      if (this.jumpCount < 18) this.y -= this.jumpHeight;
      if (this.jumpCount > 18) this.y += this.jumpHeight;
    }

    const defaultAnimationHeight = ctx.canvas.height - ctx.canvas.height / 3 - 9;
    if (this.y > defaultAnimationHeight) this.y = defaultAnimationHeight;


    // ---------------------------- Movimentos ---------------------------- //
    const arrowRightIsPressed = this.rightPressed && currentState !== PlayerStates.dead;
    const arrowLeftPressed = this.leftPressed && currentState !== PlayerStates.dead;
    if (arrowRightIsPressed || arrowLeftPressed) {
      sounds.stepsSFX.playbackRate = 0.5;
      sounds.stepsSFX.play();
    }

    // correr para direita e esquerda
    const runToRight = this.runPressed && currentState !== PlayerStates.dead && this.rightPressed;
    if (runToRight) sounds.stepsSFX.playbackRate = 1.5;

    this.#checkIfPassedTheCanvasBorders(ctx);
    ctx.drawImage(image, this.x, this.y, this.width, this.height);
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

  #checkIfPassedTheCanvasBorders(ctx) {
    const isInTheRightBorder = this.x > ctx.canvas.width - this.width / 2 - 15;
    const isInTheLeftBorder = this.x < 10;
    const isInTheTopBorder = this.y < 0;

    if (isInTheRightBorder) this.x = ctx.canvas.width - this.width / 2 - 15;
    if (isInTheLeftBorder) this.x = 10;
    if (isInTheTopBorder) this.y = 0;
  }

  reset(ctx) {
    this.x = 0;
    this.y = ctx.canvas.height - ctx.canvas.height / 3 - 9;
  }

  createAnimations() {
    this.deadAnimation = new SpriteAnimation("Dead (?).png", 8, 4, PlayerStates.dead, true);
    this.idleAnimation = new SpriteAnimation("Idle (?).png", 10, 6, PlayerStates.idle);
    this.jumpAnimation = new SpriteAnimation("Jump (?).png", 12, 3, PlayerStates.jump, true);
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

    const eventExists = keydownEvents[event.code];
    const callEvent = keydownEvents[event.code];

    eventExists && callEvent();
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

    const eventExists = keypressEvents[event.code];
    const callEvent = keypressEvents[event.code];

    eventExists && callEvent();
  };
}
