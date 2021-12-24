import * as THREE from 'three';
import grassMaterial from './materials/grass';

const scene = new THREE.Group();

const hillSize = 50;

const hillGeometry = new THREE.SphereBufferGeometry(hillSize, 64, 64, 0, Math.PI);
const frontHill = new THREE.Mesh(hillGeometry, grassMaterial);
frontHill.rotation.x = -Math.PI /2;
frontHill.position.y = -hillSize - 3.5;
scene.add(frontHill);

frontHill.castShadow = true;
frontHill.receiveShadow = true;

export default scene;