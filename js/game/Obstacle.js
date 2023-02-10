import { writeTextOnCanvas } from "../utils/functions.js"; 
import { OBSTACLES_VELOCITIES, OBSTACLE_IMAGE } from "./constants.js"; 
 
export default class Obstacles { 
    canMoveLeft = false; 
    canMoveRight = false; 
    playerIsRunning = false; 
 
    constructor(context) { 
        this.context = context; 
        this.x = 0; 
        this.y = 0; 
        this.width = context.canvas.width; 
        this.height = context.canvas.height; 
 
        this.obstacles = [ 
            new Obstacle(context), 
            new Obstacle(context), 
            new Obstacle(context), 
            new Obstacle(context), 
            new Obstacle(context), 
            new Obstacle(context), 
        ]; 
 
        this.setVelocity(); 
    } 
 
    draw() { 
        for (const obstacle of this.obstacles) { 
            obstacle.draw(); 
 
             
             
 
             
        } 
    } 
 
    setVelocity(selectedDifficulty = "easy") { 
        for (const obstacle of this.obstacles) obstacle.setVelocity(selectedDifficulty); 
    } 
 
    reset() { 
        for (const obstacle of this.obstacles) obstacle.reset(); 
    } 
} 
 
class Obstacle { 
    velocity = 0; 
    width = 70; 
    height = 30; 
    passed = false; 
 
    constructor(context) { 
        this.context = context; 
 
        this.x = context.canvas.width; 
        this.y = context.canvas.height - 35; 
    } 
 
    setVelocity(selectedDifficulty) { 
        this.velocity = OBSTACLES_VELOCITIES[selectedDifficulty]; 
    } 
 
    draw() { 
        writeTextOnCanvas( 
            this.context, 
            OBSTACLE_IMAGE, 
            { x: this.x, y: this.y, }, 
            { font: "50px Arial" }, 
        ); 
    } 
 
    moveLeft(playerIsRunning) { 
        this.x -= this.velocity + (playerIsRunning ? 5 : 0); 
    } 
 
    moveRight() { 
        this.x += this.velocity; 
    } 
 
    reset() { 
        let randomNumber = Math.floor(Math.random() * 1000); 
        this.x = this.context.canvas.width + randomNumber * 15; 
        this.passed = false; 
    } 
 
    outOfBounds() { 
        const outOfScreen = this.x + this.width < 0; 
        this.passed = outOfScreen && !this.passed; 
        return outOfScreen; 
    } 
}