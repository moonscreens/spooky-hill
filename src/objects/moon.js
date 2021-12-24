import * as THREE from 'three';
import moonTextureUrl from './materials/moon/moon-texture-contrast.png';
import moonDisplacementTextureUrl from './materials/moon/moon-displacement.png';

const moonTexture = new THREE.TextureLoader().load(moonTextureUrl);
moonTexture.magFilter = THREE.NearestFilter;
moonTexture.minFilter = THREE.NearestFilter;
const moonDisplacementTexture = new THREE.TextureLoader().load(moonDisplacementTextureUrl);
moonDisplacementTexture.magFilter = THREE.NearestFilter;
moonDisplacementTexture.minFilter = THREE.NearestFilter;
const moonMaterial = new THREE.MeshPhongMaterial({
	map: moonTexture,
	shininess: 1,
	specular: 0xFFFFFF,
	emissive: 0x000E16,
	emissiveIntensity: 0.5,
	bumpMap: moonDisplacementTexture,
	bumpScale: 0.5,
	fog: 0,
});
const moonSize = 60;
const moon = new THREE.Mesh(new THREE.SphereBufferGeometry(moonSize, 16, 16), moonMaterial);
moon.position.y = 1 + moonSize;
moon.rotation.y = Math.PI * 2 * Math.random();
moon.layers.set(1);

export default moon;