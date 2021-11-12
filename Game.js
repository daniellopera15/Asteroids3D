import * as THREE from './libs/three.module.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { Rocket } from './models/Rocket.js';
import { Asteroid, AsteroidType } from './models/Asteroid.js';
import { Edge, EdgeType } from './models/Edge.js';
import { SFX } from './sfx/SFX.js';
import { SoundsEnum } from './sfx/sounds/SoundsEnum.js';

class Game {
    constructor() {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);

        this.clock = new THREE.Clock();
        this.delta = 0;
        // 120 fps
        this.interval = 1 / 120;

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
        this.camera.position.set(0,28,0);
        this.camera.rotateX(3 * Math.PI / 2); this.camera.rotateZ(3 * Math.PI / 2);

        //Sonido
        this.sfx = new SFX(this.camera, './sfx/sounds/');
        this.sfx.load(SoundsEnum.GAME_SOUND, true, 1);
        this.sfx.load(SoundsEnum.ROCKET, true);
        this.sfx.load(SoundsEnum.GAME_OVER, false, 1);
        for (let i = 1; i <= 10; i++) {
            this.sfx.load(SoundsEnum.SHOOT + "_" + i);
            this.sfx.load(SoundsEnum.EXPLOSION + "_" + i);
        }

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.TextureLoader().load('./images/space.png', function(texture) {});

        window.addEventListener('resize', this.resize.bind(this));

        this.load();

        this.playGame = false;

        const gameover = document.getElementById('gameover');
        gameover.style.display = 'none';

        const retryBtn = document.getElementById('retryBtn');
        retryBtn.addEventListener('click', this.startGame.bind(this));
        retryBtn.style.display = 'none';

        const btn = document.getElementById('playBtn');
        btn.addEventListener('click', this.startGame.bind(this));

    }

    startGame() {
        const title = document.getElementById('title');
        const playBtn = document.getElementById('playBtn');
        const gameover = document.getElementById('gameover');
        const retryBtn = document.getElementById('retryBtn');

        title.style.display = 'none';
        playBtn.style.display = 'none';
        gameover.style.display = 'none';
        retryBtn.style.display = 'none';

        this.rocket.init();

        this.score = 0;
        this.lives = 3;

        let elm = document.getElementById('score');
        elm.innerHTML = 'SCORE ' + this.score;
        
        elm = document.getElementById('lives');
        elm.innerHTML = 'LIFES ' + this.lives;

        this.sfx.play(SoundsEnum.GAME_SOUND);

        this.playGame = true;

        this.asteroirdsLimit = 24;
        this.asteroidsScreen = 0;

        this.cleanAsteroids();
        this.startAsteroids();

    }

    cleanAsteroids() {
        this.asteroids.forEach(asteroid => {
            asteroid.clean();
        });
        this.asteroids = [];
    }

    startAsteroids() {
        const gameClass = this;
        setTimeout(function() {
            gameClass.createAsteroid();
            gameClass.startAsteroids();
        }, 2500);
    }

    load() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.container.appendChild( this.renderer.domElement );

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

        //Creacion de la nave
        this.rocket = new Rocket(this);

        //Balas
        this.bullets = [];

        //Asteroides
        this.asteroids = [];

        //Explosions
        this.explosions = [];

    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

    render() {   
        window.requestAnimationFrame(this.render.bind(this));
        this.delta += this.clock.getDelta();
        this.time = this.clock.getElapsedTime();

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

        //Explosiones
        this.explosions = this.explosions.filter(explosion => explosion.exist);
        this.explosions.forEach(explosion => {
            explosion.update();
        });

        //Bordes
        this.edgesListener(this.rocket.getObject());
       
        if (this.delta > this.interval) {
            this.renderer.render( this.scene, this.camera );
            this.delta = this.delta % this.interval;
        }
    }

    isPlayGame() {
        return this.playGame;
    }

    createAsteroid() {

        const type =  Math.floor(Math.random()*3);
        let asteroidValue;
        switch(type) {
            case 0:
                asteroidValue = 6;
                break;
            case 1:
                asteroidValue = 2;
                break;
            case 2:
                asteroidValue = 1;
                break;
        }

        if (this.asteroidsScreen + asteroidValue > this.asteroirdsLimit) {
            return;
        }

        this.asteroidsScreen += asteroidValue;

        const asteroid = new Asteroid(this, type);
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

    addExplosion(explosion) {
        this.explosions.push(explosion);
        this.scene.add(explosion.explosion);
    }

    edgesListener(obj) {
        this.edgeUp.update(obj);
        this.edgeLeft.update(obj);
        this.edgeRight.update(obj);
        this.edgeDown.update(obj);
    }

    decAsteroids() {
        this.asteroidsScreen -= 1;
    }

    incScore(score){
        this.score += score;
        const elm = document.getElementById('score');
        elm.innerHTML = 'SCORE ' + this.score;
    }

    decLives(){
        this.lives--;
        const elm = document.getElementById('lives');
        elm.innerHTML = 'LIFES ' + this.lives;
    }

    gameOver() {
        this.playGame = false;
        this.sfx.play(SoundsEnum.GAME_OVER);
        const gameover = document.getElementById('gameover');
        gameover.style.display = 'block';
        const retryBtn = document.getElementById('retryBtn');
        retryBtn.style.display = 'block';
    }

}

export { Game };