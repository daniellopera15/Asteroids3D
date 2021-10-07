import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { Rocket } from './models/rocket/Rocket.js';

class Game {
    constructor() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
        this.camera.position.set(0,0,28);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.TextureLoader().load('./background/space.png', function(texture) {});

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( this.renderer.domElement );

        this.renderer.setAnimationLoop(this.render.bind(this));

        //Iluminación
        const ambient = new THREE.HemisphereLight(0xFFFFFF, 0xBBBBFF, 0.3);
        this.scene.add(ambient);

        const light = new THREE.DirectionalLight();
        light.position.set(0.2, 1, 1);
        this.scene.add(light);

        //Creacion de la nave
        this.rocket = new Rocket(this);

        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

    render() {   
        const time = this.clock.getElapsedTime();
        this.rocket.update(time);
        this.renderer.render( this.scene, this.camera );
    }

}

export { Game };