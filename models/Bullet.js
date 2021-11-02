import * as THREE from '../../libs/three.module.js';

class Bullet {

    constructor(game, rocket) {

        this.bullet = new THREE.Object3D(); 
        this.bullet.position.copy(rocket.position);
        this.bullet.quaternion.copy(rocket.quaternion);
        this.bullet.rotateZ(3 * Math.PI / 2);  
        this.bullet.translateY(2);
        this.bullet.distanceEdgeX = 1;
        this.bullet.distanceEdgeZ = 1;
        this.bullet.limitEdgeX = 2.6;
        this.bullet.limitEdgeZ = 4.8;
        this.name = 'Bullet';
        this.velocity = 0;
        this.limitDistance = 30;
        this.exist = true;
            
        this.game = game;
        this.game.scene.add(this.bullet);

        const bulletGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 8);
        const bulletMaterial = new THREE.MeshPhongMaterial({color: 'red'});
        const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);

        this.bullet.add(bulletMesh);
        this.bulletBox = new THREE.Box3().setFromObject(this.bullet);

    }

    getObject() {
        return this.bullet;
    }

    getBox() {
        return this.bulletBox;
    }

    remove() {
        this.game.scene.remove(this.bullet);
        this.exist = false;
    }

    update() {
        this.bulletBox.setFromObject(this.bullet);

        //Mientras aún tenga recorrido y no haya impactado con un asteroide
        if(this.limitDistance >= 0) {
            this.velocity += 5;
            this.bullet.translateY(this.velocity * this.game.delta);
            this.limitDistance -= 1;
        } else {
            this.remove();
        }

    }

}

export { Bullet };