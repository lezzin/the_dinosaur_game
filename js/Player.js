import PlayerStates from "./PlayerStates.js";
import SpriteAnimation from "./SpriteAnimation.js";

export const musics = {
  jump: new Audio("sounds/jump.wav"),
  steps: new Audio("sounds/step.ogg"),
  hit: new Audio("sounds/hit.wav"),
  background: new Audio("sounds/background.mp3"),

  config: () => {
    musics.steps.volume = musics.hit.volume = musics.jump.volume = musics.background.volume = 0.4;
    musics.steps.playbackRate = 0.6;

    musics.background.loop = true;
    musics.background.play();
  },

  toggleMute: () => {
    musics.steps.muted = musics.hit.muted = musics.jump.muted = musics.background.muted = !musics.steps.muted;
  }
}

export default class Player {
  constructor(ctx) {
    this.state = PlayerStates.idle;

    musics.config();

    this.x = 0;
    this.y = ctx.canvas.height - ctx.canvas.height / 3 - 9;

    this.width = ctx.canvas.width / 4;
    this.height = ctx.canvas.height / 3;

    this.shouldJump = false;
    this.jumpCount = 0;
    this.jumpHeight = 12;

    this.#createAnimations();

    document.addEventListener("keydown", this.#keydown);
    document.addEventListener("keyup", this.#keyup);
  }

  draw(ctx, isDead) {
    this.#setState();
    isDead && (this.state = PlayerStates.dead);

    const animation = this.animations.find(animation => animation.isFor(this.state));
    const image = animation.getImage();
    const currentState = this.state;

    // pulo
    if (this.jumpPressed && currentState !== PlayerStates.dead) {
      this.shouldJump = true;
      this.jumpCount = 0;
      musics.jump.play();

      this.jumpPressed = false;
    }

    if (this.shouldJump) {
      this.jumpCount++;

      if (this.jumpCount < 18) this.y -= this.jumpHeight;
      if (this.jumpCount > 18) this.y += this.jumpHeight;
    }

    // gravidade
    if (this.y > ctx.canvas.height - ctx.canvas.height / 3 - 9) {
      this.y = ctx.canvas.height - ctx.canvas.height / 3 - 9;
      this.shouldJump = false;
    }

    if (this.rightPressed && currentState !== PlayerStates.dead || this.leftPressed && currentState !== PlayerStates.dead) {
      musics.steps.playbackRate = 0.5;
      musics.steps.play();
    }

    // mover para direita
    if (this.rightPressed && currentState !== PlayerStates.dead) {
      this.x += 5;
      if (this.x > ctx.canvas.width) this.x = -ctx.canvas.width / 4;
    }

    // mover para esquerda
    if (this.leftPressed && currentState !== PlayerStates.dead) {
      this.x -= 3;
      if (this.x < -ctx.canvas.width / 4) this.x = ctx.canvas.width;
    }

    // correr para direita e esquerda
    if (this.runPressed && currentState !== PlayerStates.dead && !this.leftPressed) {
      musics.steps.playbackRate = 1.5;

      if (this.rightPressed) this.x += 6;
    }

    ctx.drawImage(image, this.x, this.y, this.width, this.height);
  }

  #setState() {
    if (this.deadPressed) return this.state = PlayerStates.dead;
    if (this.jumpPressed) return this.state = PlayerStates.jump;

    if (this.runPressed)
      if (this.rightPressed) return this.state = PlayerStates.runRight;

    if (this.rightPressed || this.leftPressed) return this.state = PlayerStates.walkRight;

    this.state = PlayerStates.idle;
  }

  reset(ctx) {
    this.x = 0;
    this.y = ctx.canvas.height - ctx.canvas.height / 3 - 9;
  }

  #createAnimations() {
    this.deadAnimation = new SpriteAnimation("Dead (?).png", 8, 4, PlayerStates.dead, true);
    this.idleAnimation = new SpriteAnimation("Idle (?).png", 10, 6, PlayerStates.idle);
    this.jumpAnimation = new SpriteAnimation("Jump (?).png", 12, 6, PlayerStates.jump);
    this.runRightAnimation = new SpriteAnimation("RunRight (?).png", 8, 6, PlayerStates.runRight);
    this.walkRightAnimation = new SpriteAnimation("WalkRight (?).png", 10, 6, PlayerStates.walkRight);

    this.animations = [this.idleAnimation, this.jumpAnimation, this.runRightAnimation, this.walkRightAnimation, this.deadAnimation];
  }

  #keydown = (event) => {
    const events = {
      ArrowRight: () => this.rightPressed = true,
      ArrowUp: () => this.jumpPressed = true,
      ArrowLeft: () => this.leftPressed = true,
      ShiftLeft: () => this.runPressed = true,
      ShiftRight: () => this.runPressed = true,
      Space: () => this.jumpPressed = true,
    }

    events[event.code] && events[event.code]();
  };

  #keyup = (event) => {
    const events = {
      ArrowRight: () => this.rightPressed = false,
      ArrowUp: () => this.jumpPressed = false,
      ArrowLeft: () => this.leftPressed = false,
      ShiftLeft: () => this.runPressed = false,
      ShiftRight: () => this.runPressed = false,
      Space: () => this.jumpPressed = false,
    }

    events[event.code] && events[event.code]();
  };
}
