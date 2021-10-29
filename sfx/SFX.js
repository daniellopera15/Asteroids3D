import { AudioListener, Audio, PositionalAudio, AudioLoader }  from '../libs/three.module.js';

class SFX {

    constructor(camera, assetsPath) {
        this.listener = new AudioListener();
        camera.add(this.listener);

        this.assetsPath = assetsPath;

        this.sounds = {};
    }

    load(name, loop=false, vol=0.5, obj= null) {
        const sound = (obj == null) ? new Audio(this.listener) :
        PositionalAudio(this.listener);

        const newSound = {name: name, sound: sound, loaded: false};

        this.sounds[name] = newSound;

        const audioLoader = new AudioLoader().setPath(this.assetsPath);
        audioLoader.load(`${name}.mp3`, buffer => {
            sound.setBuffer(buffer);
            sound.setLoop(loop);
            sound.setVolume(vol);
        });
    }

    isLoadead(name) {
        return this.sounds[name].loaded;
    }

    setVolume(name, volume) {
        const sound = this.sounds[name].sound;

        if (sound !== undefined) {
            sound.setVolume(volume);
        }
    }

    setLoop(name, loop) {
        const sound = this.sounds[name].sound;

        if (sound !== undefined) {
            sound.setLoop(loop);
        }
    }
    
    play(name) {
        const sound = this.sounds[name].sound;

        if (sound !== undefined && !sound.isPLaying) {
            sound.play();
        }
    }

    stop(name) {
        const sound = this.sounds[name].sound;

        if (sound !== undefined && !sound.isPLaying) {
            sound.stop();
        }
    }

    stopAll() {
        for(let name in this.sounds) {
            this.stop(name);
        }
    }

    pause(name) {
        const sound = this.sounds[name].sound;

        if (sound !== undefined && !sound.isPLaying) {
            sound.pause();
        }
    }

}

export { SFX };