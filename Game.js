import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { Rocket } from './models/Rocket.js';
import { Edge, EdgeType } from './models/Edge.js';

class Game {
    constructor() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
        this.camera.position.set(0,28,0);
        this.camera.rotateX(3 * Math.PI / 2); this.camera.rotateZ(3 * Math.PI / 2);

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

        //Controles para testear
        //const controls = new OrbitControls( this.camera, this.renderer.domElement );

        //Creacion de la nave
        this.rocket = new Rocket(this);

        //Creación de los bordes
        this.edgeUp = new Edge(this, EdgeType.UP);
        this.edgeLeft = new Edge(this, EdgeType.LEFT);
        this.edgeRight = new Edge(this, EdgeType.RIGHT);
        this.edgeDown = new Edge(this, EdgeType.DOWN);

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
        this.edgeUp.update(this.rocket.getObject());
        this.edgeLeft.update(this.rocket.getObject());
        this.edgeRight.update(this.rocket.getObject());
        this.edgeDown.update(this.rocket.getObject());
        this.renderer.render( this.scene, this.camera );
    }

}

export { Game };