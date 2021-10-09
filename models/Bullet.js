import * as THREE from '../../libs/three.module.js';

class Bullet {

    constructor(game, rocket) {

        this.bullet = new THREE.Object3D(); 
        this.bullet.position.copy(rocket.position);
        this.bullet.quaternion.copy(rocket.quaternion); 
        this.velocity = 0;
        this.bullet.rotateZ(3 * Math.PI / 2);        

        game.scene.add(this.bullet);

        const bulletGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 8);
        const bulletMaterial = new THREE.MeshPhongMaterial({color: 'red'});
        const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);

        this.bullet.add(bulletMesh);

    }

    shoot(pos) {

        var limitDistance = 1;

        //Mientras aún tenga recorrido y no haya impactado con un asteroide
        while(limitDistance >= 0) {
            this.velocity += 0.1;
            this.bullet.translateY(this.velocity);
            limitDistance -= 0.1;
        }

    }

}

export { Bullet };