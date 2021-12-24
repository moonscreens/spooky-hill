import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import grassMaterial from './materials/grass';

const simplex = new SimplexNoise();


const segments = 200;


const geometry = new THREE.PlaneGeometry( 100, 100, segments, segments );

const vertices = geometry.attributes.position.array;
for (let i = 3; i < vertices.length; i += 3) {
	const x = vertices[i-2];
	const y = vertices[i];
	vertices[i-1] = simplex.noise2D(x * 0.1, y * 0.1) * 1.5;
	vertices[i-1] += simplex.noise2D(x*0.7, y*0.7) * 0.1;
}
geometry.computeVertexNormals();
const mesh = new THREE.Mesh( geometry, grassMaterial );
mesh.rotation.x = -Math.PI * 0.5;
export default mesh;