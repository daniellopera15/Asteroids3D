import { AudioListener, Audio, PositionalAudio, AudioLoader }  from '../libs/three.module.js';
import { SoundsEnum } from './sounds/SoundsEnum.js';

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

        this.sounds[name] = sound;

        if(name.startsWith(SoundsEnum.SHOOT)) {
            name = SoundsEnum.SHOOT;
        }

        if(name.startsWith(SoundsEnum.EXPLOSION)) {
            name = SoundsEnum.EXPLOSION;
        }

        const audioLoader = new AudioLoader().setPath(this.assetsPath);
        audioLoader.load(`${name}.mp3`, buffer => {
            sound.setBuffer(buffer);
            sound.setLoop(loop);
            sound.setVolume(vol);
        });
    }

    setVolume(name, volume) {
        const sound = this.sounds[name];

        if (sound !== undefined) {
            sound.setVolume(volume);
        }
    }

    setLoop(name, loop) {
        const sound = this.sounds[name];

        if (sound !== undefined) {
            sound.setLoop(loop);
        }
    }
    
    play(name) {
        if (name !== SoundsEnum.SHOOT && name !== SoundsEnum.EXPLOSION) {

            const sound = this.sounds[name];

            if (sound !== undefined && !sound.isPlaying) {
                sound.play();
            }

        } else {

            for(let i = 1; i <= 10; i++) {
                const sound = this.sounds[name + "_" + i];

                if (sound !== undefined && !sound.isPlaying) {
                    sound.play();                    
                    break;
                }
            }

        }
    }

    stop(name) {
        const sound = this.sounds[name];

        if (sound !== undefined && sound.isPlaying) {
            sound.stop();
        }
    }

    stopAll() {
        for(let name in this.sounds) {
            this.stop(name);
        }
    }

    pause(name) {
        const sound = this.sounds[name];

        if (sound !== undefined && sound.isPlaying) {
            sound.pause();
        }
    }

}

export { SFX };