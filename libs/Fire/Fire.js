import * as THREE from './../three.module.js';
import { FireShader } from './FireShader.js';

/**
 * @author mattatz / http://github.com/mattatz
 *
 * Ray tracing based real-time procedural volumetric fire object for three.js
 */

const Fire = function ( fireTex, color ) {

	this.fireMaterial = new THREE.ShaderMaterial( {
        defines         : FireShader.defines,
        uniforms        : THREE.UniformsUtils.clone( FireShader.uniforms ),
        vertexShader    : FireShader.vertexShader,
        fragmentShader  : FireShader.fragmentShader,
		transparent     : true,
		depthWrite      : false,
        depthTest       : false
	} );

    // initialize uniforms 

    fireTex.magFilter = fireTex.minFilter = THREE.LinearFilter;
    fireTex.wrapS = fireTex.wrapT = THREE.ClampToEdgeWrapping;
    
    this.fireMaterial.uniforms.fireTex.value = fireTex;
    this.fireMaterial.uniforms.color.value = color || new THREE.Color( 0xeeeeee );
    this.fireMaterial.uniforms.invModelMatrix.value = new THREE.Matrix4();
    this.fireMaterial.uniforms.scale.value = new THREE.Vector3( 1, 1, 1 );
    this.fireMaterial.uniforms.seed.value = Math.random() * 19.19;

	this.fire = new THREE.Mesh( new THREE.BoxGeometry( 1.0, 1.0, 1.0 ), this.fireMaterial );
	return this;

};

Fire.prototype = Object.create( THREE.Mesh.prototype );
Fire.prototype.constructor = Fire;

Fire.prototype.update = function ( time ) {

    var invModelMatrix = this.fireMaterial.uniforms.invModelMatrix.value;

    this.fire.updateMatrixWorld();
    invModelMatrix.getInverse( this.fire.matrixWorld );

    if( time !== undefined ) {
        this.fireMaterial.uniforms.time.value = time;
    }

    this.fireMaterial.uniforms.invModelMatrix.value = invModelMatrix;

    this.fireMaterial.uniforms.scale.value = this.fire.scale;

};

export { Fire };