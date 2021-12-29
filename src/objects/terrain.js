import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import grassMaterial from './materials/grass';

const scene = new THREE.Group();
const treeGroup = new THREE.Group();

const simplex = new SimplexNoise();
const segments = 170;
const geometry = new THREE.PlaneGeometry(100, 100, segments, segments);

const getNoise = (x, y) => {
	return simplex.noise2D(x * 0.1, y * 0.1) * 1.5 + simplex.noise2D(x * 0.7, y * 0.7) * 0.1;
}

const vertices = geometry.attributes.position.array;
for (let i = 3; i < vertices.length; i += 3) {
	const x = vertices[i - 2];
	const y = vertices[i];
	vertices[i - 1] = getNoise(x, y);
}
geometry.rotateX(-Math.PI / 2);
geometry.computeVertexNormals();
const mesh = new THREE.Mesh(geometry, grassMaterial);
mesh.add(treeGroup);
scene.add(mesh);
export default scene;



/*
** Trees
*/

const treeSize = 1;
import treeImage from './materials/tree-01.png';

window.requestAnimationFrame(() => {
	window.requestAnimationFrame(() => {
		const treeMaterial = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load(treeImage),
			transparent: true,
			side: THREE.DoubleSide,
		});
		treeMaterial.map.magFilter = THREE.NearestFilter;
		treeMaterial.map.minFilter = THREE.NearestFilter;
		const treeGeometry = new THREE.PlaneBufferGeometry(treeSize * 0.5, treeSize, 1, 1);

		const treeMesh = new THREE.InstancedMesh(
			treeGeometry,
			treeMaterial,
			segments * segments,
		);
		treeGroup.add(treeMesh);
		const dummy = new THREE.Object3D();

		for (let i = 0; i < 5000; i++) {
			/*const point = Math.floor(Math.random() * mesh.geometry.attributes.position.count) * 3;
			dummy.position.x = mesh.geometry.attributes.position.array[point];
			dummy.position.y = mesh.geometry.attributes.position.array[point - 2] + treeSize;
			dummy.position.z = mesh.geometry.attributes.position.array[point - 1];*/

			dummy.position.x = Math.random() * 100 - 50;
			dummy.position.z = Math.random() * 100 - 50;
			dummy.position.y = treeSize * 0.5 + getNoise(-dummy.position.z, dummy.position.x);

			dummy.updateMatrix();
			treeMesh.setMatrixAt(i, dummy.matrix);
		}


		/*for (let x = 1; x < 49; x++) {
			for (let z = 1; z < 49; z++) {
				generateTree(1);
			}
		}*/
	});
});
