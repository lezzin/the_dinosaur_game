const sounds = {
    jumpSFX: new Audio("../../../sounds/jump.webm"),
    stepsSFX: new Audio("../../../sounds/step.webm"),
    hitSFX: new Audio("../../../sounds/hit.webm"),
    backgroundSFX: new Audio("../../../sounds/background.webm"),

    config: () => {
        sounds.stepsSFX.volume = sounds.hitSFX.volume = sounds.jumpSFX.volume = sounds.backgroundSFX.volume = 0.4;
        sounds.stepsSFX.playbackRate = 0.6;

        sounds.backgroundSFX.loop = true;
    },

    toggleMute: () => {
        sounds.stepsSFX.muted = sounds.hitSFX.muted = sounds.jumpSFX.muted = sounds.backgroundSFX.muted = !sounds.stepsSFX.muted;
    }
}

export default sounds;