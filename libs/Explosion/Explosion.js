import * as THREE from '../three.module.js';

class Explosion {

    constructor(game, obj) {

        this.game = game;

        this.dirs = [];
        this.vertices = [];
        this.totalObjects = 1000;
        const movementSpeed = 80 * this.game.delta;
        const objectSize = 0.1;
  
        for (var i = 0; i < this.totalObjects; i++) { 
            var vertex = new THREE.Vector3();
            vertex.x = obj.position.x;
            vertex.y = obj.position.y;
            vertex.z = obj.position.z;

            this.vertices.push(vertex);
            this.dirs.push({
                x:(Math.random() * movementSpeed)-(movementSpeed/2),
                y:(Math.random() * movementSpeed)-(movementSpeed/2),
                z:(Math.random() * movementSpeed)-(movementSpeed/2)
            });
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(this.vertices);
        const material = new THREE.ParticleBasicMaterial( { size: objectSize,  color: 0xFFFFFF });
        const particles = new THREE.ParticleSystem( geometry, material );
        
        this.explosion = particles;
        this.status = true;
        this.exist = true;
        
        this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
        this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
        this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);

        this.game.addExplosion(this);

        const explosionClass = this;
        setTimeout(function(){explosionClass.remove()}, 2000);

    }
    
    remove() {
        this.exist = false;
        this.game.scene.remove(this.explosion);
    }

    update() {
        if (this.status){
            
            var pCount = 0;
            const vertices = this.explosion.geometry.attributes.position.array;

            for (var i = 0; i < vertices.length; i+=3) { 
                vertices[i] += this.dirs[pCount].x;
                vertices[i + 1] += this.dirs[pCount].y;
                vertices[i + 2] += this.dirs[pCount].z;
                pCount++;
            }
            
            this.explosion.geometry.attributes.position.needsUpdate = true;
        }
    }

}

export { Explosion };
