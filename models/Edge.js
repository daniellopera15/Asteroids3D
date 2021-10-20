import * as THREE from '../../libs/three.module.js';

const EdgeType = {
    UP: "up",
    LEFT: "left",
    RIGHT: "right",
    DOWN: "down",
}

class Edge {

    constructor(game, edgeType) {

        this.type = edgeType;

        const geometry = new THREE.BoxGeometry( 0, 10, 20 );
        const edges = new THREE.EdgesGeometry(geometry);
        this.line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff } ));

        switch(this.type) {
            case EdgeType.UP:
                this.line.position.x = 20;
                break;
            case EdgeType.LEFT:
                this.line.position.z = -38;
                this.line.rotateY(Math.PI / 2);
                break;
            case EdgeType.RIGHT:
                this.line.position.z = 38;
                this.line.rotateY(Math.PI / 2);
                break;
            case EdgeType.DOWN:
                this.line.position.x = -20;
                break;
        }

        game.scene.add(this.line);

    }

    update(obj) {

        switch(this.type) {
            case EdgeType.UP:
                if (this.line.position.x - obj.position.x <= obj.limitEdgeX) {
                   obj.position.x = obj.position.x * -1 + obj.distanceEdgeX;
                }
                break;
            case EdgeType.DOWN:
                if (this.line.position.x - obj.position.x >= -1 * obj.limitEdgeX) {
                    obj.position.x = obj.position.x * -1 - obj.distanceEdgeX;
                }
                break;
            case EdgeType.LEFT:
                if (this.line.position.z - obj.position.z >= -1 * obj.limitEdgeZ) {
                    obj.position.z = obj.position.z * -1 - obj.distanceEdgeZ;
                }
                break;
            case EdgeType.RIGHT:
                if (this.line.position.z - obj.position.z <= obj.limitEdgeZ) {
                    obj.position.z = obj.position.z * -1 + obj.distanceEdgeZ;
                }
                break;
        }

    }

}

export {Edge, EdgeType};