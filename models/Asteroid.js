import * as THREE from '../../libs/three.module.js';

const AsteroidType = {
    A: "A",
    B: "B",
    C: "C",
}

class Asteroid {

    constructor(game, type) {

        this.game = game;
        this.type = type;
        this.exist = true;
        //BORRAR CUANDO LOS ASTEROIDES TENGAN SU CONFIGURACION DE INICIO
        this.parcheRocket = true;
        
        if (this.type === undefined) {
            this.type =  Math.floor(Math.random()*3);
        }

        this.lessRadius = 0;

        switch(this.type) {
            case 0:
                this.asteroidType = AsteroidType.A;
                this.lives = 7;
                this.lessRadius = 2.9;
                this.rock = this.createRock(10+Math.random());
                break;
            case 1:
                this.asteroidType = AsteroidType.B;
                this.lives = 3;
                this.lessRadius = 1.5;
                this.rock = this.createRock(5+Math.random());
                break;
            case 2:
                this.asteroidType = AsteroidType.C;
                this.lives = 2;
                this.lessRadius = 0.75;
                this.rock = this.createRock(2.5+Math.random());
                break;
        }

        this.rockBox = new THREE.Box3().setFromObject(this.rock);

        const center = new THREE.Vector3();
        this.rockBox.getCenter(center);
        this.bsphere = this.rockBox.getBoundingSphere(new THREE.Sphere(center));
        this.bsphere.set(center, this.bsphere.radius -= this.lessRadius);

        this.game.scene.add(this.rock);

    }

    createRock(size) {

        const rock3D = new THREE.Object3D();

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
        rock.scale.set(0.4,0.4,0.4);
        rock.r = {};
        rock.r.x = Math.random() * 0.15;
        rock.r.y = Math.random() * 0.15;
        rock.r.z = Math.random() * 0.15;
   
        rock3D.add(rock);

        return rock3D;

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

    getObject() {
        return this.rock;
    }

    remove() {
        this.game.scene.remove(this.rock);
        this.exist = false;
    }

    sufferShot(bullet) {
        this.lives--;

        if (this.lives == 0) {
            this.remove();
        }

        bullet.remove();
    }

    collision(obj) {

        if(obj.name === 'Rocket' && this.bsphere.intersectsSphere(obj.getSphere())) {
            //SACAR DEL IF CUANDO ESTE EL COMPORTAMIENTO DE INICIO DE ASTEROIDES
            if (this.parcheRocket) {
                this.parcheRocket = false;
            } else {
                obj.remove();
            }
        }

        if (obj.name === 'Bullet' && this.bsphere.intersectsBox(obj.getBox())) {
            this.sufferShot(obj);
        }

    }

    update() {

        this.rock.rotateX(this.rock.children[0].r.x * this.game.delta);
        this.rock.rotateY(this.rock.children[0].r.y * this.game.delta);
        this.rock.rotateZ(this.rock.children[0].r.z * this.game.delta);

        this.bsphere.set(this.rock.position, this.bsphere.radius);

    }

}

export { Asteroid };