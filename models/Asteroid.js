import * as THREE from '../../libs/three.module.js';

const AsteroidType = {
    A: "A",
    B: "B",
    C: "C",
}

class Asteroid {

    constructor(game) {

        this.game = game;
        
        const type =  Math.floor(Math.random()*3);

        switch(type) {
            case 0:
                this.asteroidType = AsteroidType.A;
                this.rock = this.createRock(5+Math.random()*1);
                break;
            case 1:
                this.asteroidType = AsteroidType.B;
                this.rock = this.createRock(5+Math.random()*0.5);
                break;
            case 2:
                this.asteroidType = AsteroidType.C;
                this.rock = this.createRock(5+Math.random()*0.1);
                break;
        }

        console.log("tipo: " + this.asteroidType);
        this.game.scene.add(this.rock);

    }

    createRock(size) {
        const geometry = new THREE.DodecahedronGeometry(size, 1);
        var color = '#111111';
        color = this.colorLuminance(color,2+Math.random()*10);
        const texture = new THREE.MeshStandardMaterial({color:color,
                                            shading: THREE.FlatShading,
                                        //   shininess: 0.5,
                                                roughness: 0.8,
                                                metalness: 1
                                            });

        const rock = new THREE.Mesh(geometry, texture);
        rock.castShadow = true;
        rock.receiveShadow = true;
        rock.scale.set(1+Math.random()*0.2,1+Math.random()*0.4,1+Math.random()*0.2);
        rock.r = {};
        rock.r.x = Math.random() * 0.15;
        rock.r.y = Math.random() * 0.15;
        rock.r.z = Math.random() * 0.15;
   
        return rock;

    }

    colorLuminance(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;
    
        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }
    
        return rgb;
    }

    update() {
        this.rock.rotation.x -= this.rock.r.x * this.game.delta;
        this.rock.rotation.y -= this.rock.r.y * this.game.delta;
        this.rock.rotation.z -= this.rock.r.z * this.game.delta;
    }

}

export { Asteroid };