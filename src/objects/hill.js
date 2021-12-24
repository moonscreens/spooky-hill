import * as THREE from 'three';
import grassMaterial from './materials/grass';

const scene = new THREE.Group();

const hillGeometry = new THREE.SphereBufferGeometry(30, 32, 8, 0, Math.PI);
const frontHill = new THREE.Mesh(hillGeometry, grassMaterial);
frontHill.rotation.x = -Math.PI /2;
frontHill.position.y = -33;
frontHill.position.x = 5;
scene.add(frontHill);

export default scene;