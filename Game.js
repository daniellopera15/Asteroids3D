import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { Rocket } from './models/Rocket.js';
import { Asteroid } from './models/Asteroid.js';
import { Edge, EdgeType } from './models/Edge.js';

class Game {
    constructor() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.clock = new THREE.Clock();
        this.delta = 0;
        // 120 fps
        this.interval = 1 / 120;

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
        this.camera.position.set(0,28,0);
        this.camera.rotateX(3 * Math.PI / 2); this.camera.rotateZ(3 * Math.PI / 2);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.TextureLoader().load('./background/space.png', function(texture) {});

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( this.renderer.domElement );

        window.requestAnimationFrame(this.render.bind(this));

        //Iluminación
        const ambient = new THREE.HemisphereLight(0xFFFFFF, 0xBBBBFF, 0.3);
        this.scene.add(ambient);

        const light = new THREE.DirectionalLight();
        light.position.set(0.2, 1, 1);
        this.scene.add(light);

        //Controles para testear
        //const controls = new OrbitControls( this.camera, this.renderer.domElement );

        //Creación de los bordes
        this.edgeUp = new Edge(this, EdgeType.UP);
        this.edgeLeft = new Edge(this, EdgeType.LEFT);
        this.edgeRight = new Edge(this, EdgeType.RIGHT);
        this.edgeDown = new Edge(this, EdgeType.DOWN);

        //Asteroides
        this.asteroids = [];
        this.createAsteroid();

        //Creacion de la nave
        this.rocket = new Rocket(this);

        //Balas
        this.bullets = [];

        window.addEventListener('resize', this.resize.bind(this));

    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

    render() {   
        window.requestAnimationFrame(this.render.bind(this));
        this.delta += this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        //Nave
        this.rocket.update();
        this.collisionAsteroids(this.rocket);

        //Asteroides
        this.asteroids = this.asteroids.filter(asteroid => asteroid.exist);
        this.asteroids.forEach(asteroid => {
            asteroid.update();
            this.edgesListener(asteroid.getObject())
        });

        //Disparos
        this.bullets = this.bullets.filter(bullet => bullet.exist);
        this.bullets.forEach(bullet => { 
            bullet.update(); 
            this.collisionAsteroids(bullet);
            this.edgesListener(bullet.getObject())
        });

        //Bordes
        this.edgesListener(this.rocket.getObject());
       
        if (this.delta > this.interval) {
            this.renderer.render( this.scene, this.camera );
            this.delta = this.delta % this.interval;
        }
    }

    createAsteroid() {
        const asteroid = new Asteroid(this);
        const edge = Math.floor(Math.random()*4);
        const sign = Math.floor(Math.random()*2) == 1 ? 1 : -1;

        switch(edge) {
            //UP
            case 0:
                asteroid.getObject().position.x = this.edgeUp.getObject().position.x;
                asteroid.getObject().position.z = Math.random()*36 * sign;
                asteroid.getObject().rotateY(Math.random()*(7 * Math.PI / 6) + (5 * Math.PI / 6));
                break;
            //LEFT
            case 1:
                asteroid.getObject().position.z = this.edgeLeft.getObject().position.z;
                asteroid.getObject().position.x = Math.random()*18 * sign;
                asteroid.getObject().rotateY(Math.random()*(4 * Math.PI / 6) + (Math.PI / 3));
                break;
            //RIGHT
            case 2:
                asteroid.getObject().position.z = this.edgeRight.getObject().position.z;
                asteroid.getObject().position.x = Math.random()*18 * sign;
                asteroid.getObject().rotateY(Math.random()*(4 * Math.PI / 6) + (Math.PI / 3));
                break;
            //DOWN
            case 3:
                asteroid.getObject().position.x = this.edgeDown.getObject().position.x;
                asteroid.getObject().position.z = Math.random()*36 * sign;
                asteroid.getObject().rotateY(Math.random()*(7 * Math.PI / 6) + (5 * Math.PI / 6));
                break;
        }
        this.asteroids.push(asteroid);
    }

    collisionAsteroids(obj) {
        this.asteroids.forEach(asteroid => asteroid.collision(obj));
    }

    edgesListener(obj) {
        this.edgeUp.update(obj);
        this.edgeLeft.update(obj);
        this.edgeRight.update(obj);
        this.edgeDown.update(obj);
    }

}

export { Game };