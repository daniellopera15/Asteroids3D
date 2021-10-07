import * as THREE from '../../libs/three.module.js';
import { Vector2 } from '../../libs/three.module.js';

class Rocket {

    constructor(game) {

        this.game = game;
        this.rocket = this.load();
        this.rocket.rotateZ(Math.PI / 2); this.rocket.rotateX(Math.PI / 2);
        
        this.velocity = new Vector2(0,0);
        this.speedUp = false;
        this.rotateLeft = false;
        this.rotateRight = false;

        //Controls
        document.addEventListener('keyup', this.keyUp.bind(this));
        document.addEventListener('keydown', this.keyDown.bind(this));

    }

    load() {

        const rocket = new THREE.Object3D();
        this.game.scene.add(rocket);

        //Base
        const baseGeometry = new THREE.BoxGeometry();
        const baseMaterial = new THREE.MeshPhongMaterial({color: 'red'});
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        rocket.add(baseMesh);

        //Cockpit
        const cockpitGeometry = new THREE.SphereGeometry(0.4, 17, 14);
        const cockpitMaterial = new THREE.MeshPhongMaterial({color: 'blue'});
        const cockpitMesh = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
        cockpitMesh.position.set(0,0.45,0);
        baseMesh.add(cockpitMesh);

        //NoseCone
        const noseCone = new THREE.Object3D();
        noseCone.rotateX(Math.PI / 4);
        baseMesh.add(noseCone);

        //NoseCone - Base
        const baseNoseGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);
        const baseNoseMaterial = new THREE.MeshPhongMaterial({color: 'red'});
        const baseNoseMesh = new THREE.Mesh(baseNoseGeometry, baseNoseMaterial);
        baseNoseMesh.position.set(0.5,0,0);
        noseCone.add(baseNoseMesh);

        //NoseCone - Body
        const bodyNoseGeometry = new THREE.BoxGeometry(0.3, 0.7, 0.7);
        const bodyNoseMaterial = new THREE.MeshPhongMaterial({color: 'yellow'});
        const bodyNoseMesh = new THREE.Mesh(bodyNoseGeometry, bodyNoseMaterial);
        bodyNoseMesh.position.set(1,0,0);
        noseCone.add(bodyNoseMesh);

        //NoseCone - Nose
        const noseGeometry = new THREE.CylinderGeometry(0, 0.5, 0.8, 4);
        const noseMaterial = new THREE.MeshPhongMaterial({color: 'red'});
        const noseMesh = new THREE.Mesh(noseGeometry, noseMaterial);
        noseMesh.position.set(1.55,0,0);
        noseMesh.rotateX(-(Math.PI / 4));
        noseMesh.rotateZ((3 * Math.PI) / 2);
        noseCone.add(noseMesh);

        //Thrusters
        const thrusterLeft = this.createThrusters();
        const thrusterRight = this.createThrusters();
        thrusterLeft.position.z = -0.3;
        thrusterRight.position.z = 0.3;
        baseMesh.add(thrusterLeft);
        baseMesh.add(thrusterRight);

        const wingRight = this.createWings();
        const wingLeft = this.createWings();
        wingRight.position.set(-0.25,0,0.8);
        wingLeft.position.set(-0.25,0,-0.8);
        baseMesh.add(wingLeft);
        baseMesh.add(wingRight);

        return rocket;

    }

    createThrusters() {

        const thrusterGeometry = new THREE.CylinderGeometry(0.3, 0.1, 0.4, 19);
        const thrusterMaterial = new THREE.MeshPhongMaterial({color: 'gray'});
        const thrusterMesh = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
        thrusterMesh.rotateZ(Math.PI / 2);
        thrusterMesh.position.x = -0.7;

        return thrusterMesh;

    }

    createWings() {

        //Wings
        const wing = new THREE.Object3D();

        //Wing - base
        const wingBaseGeometry = new THREE.BoxGeometry(0.5,0.6,0.6);
        const wingBaseMaterial = new THREE.MeshPhongMaterial({color: 'orange'});
        const wingBaseMesh = new THREE.Mesh(wingBaseGeometry, wingBaseMaterial);
        wing.add(wingBaseMesh);

        //Wing - Turbine
        const turbine = new THREE.Object3D();
        turbine.position.x = 0.7;
        turbine.position.z = 0.04;
        wingBaseMesh.add(turbine);

        const turbineGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
        const turbineMaterial = new THREE.MeshPhongMaterial({color: 'yellow'});
        const turbineMesh = new THREE.Mesh(turbineGeometry, turbineMaterial);
        turbineMesh.rotateZ(Math.PI / 2);
        turbine.add(turbineMesh);

        //Wing - Turbine - Nose
        const noseTurbineGeometry = new THREE.CylinderGeometry(0.2, 0.1, 0.3, 16);
        const noseTurbineMaterial = new THREE.MeshPhongMaterial({color: 'orange'});
        const noseTurbineMesh = new THREE.Mesh(noseTurbineGeometry, noseTurbineMaterial);
        noseTurbineMesh.position.x = 0.65;
        noseTurbineMesh.rotateZ(Math.PI / 2);
        turbine.add(noseTurbineMesh);

        return wing;

    }

    keyUp(evt) {
        switch(evt.keyCode) {
            //Forward
            case 87:
            case 38:
                this.speedUp = false;
                break;
            //Left
            case 65:
            case 37:
                this.rotateLeft = false;
                break;
            //Right
            case 68:
            case 39:
                this.rotateRight = false;
                break;
            
        }
    }

    keyDown(evt) {
        switch(evt.keyCode) {
            //Forward
            case 87:
            case 38:
                this.speedUp = true;
                break;
            //Left
            case 65:
            case 37:
                this.rotateLeft = true;
                break;
            //Right
            case 68:
            case 39:
                this.rotateRight = true;
                break;
        }
    }

    update(time){

        if (this.speedUp) {
            if (this.velocity.x < 0.3) {
                this.velocity.x += 0.003;
            }  
        } else {
            if (this.velocity.x > 0) {
                this.velocity.x -= 0.004;
                if (this.velocity.x <= 0) {
                    this.velocity.x = 0;
                }
            }  
        }

        if(this.rotateRight || this.rotateLeft) {
            if (this.rotateRight) {
                if (this.velocity.y > -0.07) {
                    this.velocity.y -= 0.005;
                } 
            } else {
                if (this.velocity.y < 0.07) {
                    this.velocity.y += 0.005;
                } 
            }
            
        } else {
            if (this.velocity.y > 0) {
                this.velocity.y -= 0.003;
                if (this.velocity.y <= 0) {
                    this.velocity.y = 0;
                }
            } else if (this.velocity.y < 0) {
                this.velocity.y += 0.003;
                if (this.velocity.y >= 0) {
                    this.velocity.y = 0;
                }
            }
        }

        this.rocket.translateX(this.velocity.x);
        this.rocket.rotateY(this.velocity.y);

    }

}

export { Rocket };