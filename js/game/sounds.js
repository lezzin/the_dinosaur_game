const sounds = {
    jumpSFX: new Audio("../../sounds/jump.wav"),
    stepsSFX: new Audio("../../sounds/step.ogg"),
    hitSFX: new Audio("../../sounds/hit.wav"),
    backgroundSFX: new Audio("../../sounds/background.mp3"),

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