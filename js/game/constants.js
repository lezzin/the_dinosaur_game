const OBSTACLES_VELOCITIES = {
    easy: 5,
    medium: 10,
    hard: 15
};

const OBSTACLE_IMAGE = "🌵";

const CLOUD_VELOCITIES = {
    normal: (width) => 0.2 * Math.floor(width / 100),
    running: (width) => 0.4 * Math.floor(width / 100),
}

const GAME_SCREENS = {
    menu: "menuScreen",
    running: "gameScreen",
    gameOver: "gameOverScreen",
    win: "winScreen",
    scoreboard: "scoreboardScreen",
    commands: "commandsScreen",
};

const DEFAULT_SCREEN = GAME_SCREENS.menu;

const SCREENS_MESSAGES = {
    menu: {
        button: "Start the game",
        subtitle: "Press C to open the commands",
    },
    gameOver: {
        title: "Game Over!",
        button: "Restart the game",
        paragraph: "Press C to open the commands",
    },
    win: {
        title: "You Win!",
        subtitle: "Press Enter to play again",
        paragraph: "Press C to open the commands",
    },
    scoreboard: {
        title: "Scoreboard",
        paragraph: "Press Enter to go back to menu",
        noScores: "No scores here... 😢",
        score: (index, score) => `${index + 1}. Score: ${score.score} & Date: ${score.date}`,
    },
    score: (score) => `Score: ${score}`,
    highest: (highest) => `Highest score: ${highest}`,
    lifes: (lifes) => lifes.join(""),
    record: "Good job! You've just broken the record! 🎉🎉🎉",
};

const SCREEN_TITLES = {
    menuScreen: "Main menu",
    gameScreen: "Game",
    winScreen: "New record!",
    scoreboardScreen: "Scoreboard",
    commandsScreen: "Commands",
};

export {
    OBSTACLES_VELOCITIES,
    OBSTACLE_IMAGE,
    CLOUD_VELOCITIES,
    GAME_SCREENS,
    DEFAULT_SCREEN,
    SCREENS_MESSAGES,
    SCREEN_TITLES
};