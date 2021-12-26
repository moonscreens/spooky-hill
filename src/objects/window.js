import * as THREE from 'three';
import genWood2Material from './materials/wood2';

const generateWindow = (width = 1, height = 2, castLight = true) => {
	const scene = new THREE.Group();

	const boxLight = new THREE.Mesh(
		new THREE.BoxBufferGeometry(width, height, 0.1),
		new THREE.MeshBasicMaterial({
			color: 0xd4c33b,
		})
	);
	scene.add(boxLight);

	const columnGeometry = new THREE.BoxBufferGeometry(0.1, height + 0.1, 0.2);
	const rowGeometry = new THREE.BoxBufferGeometry(width + 0.1, 0.1, 0.2);

	const frameMaterial = genWood2Material();

	const generateRow = (y) => {
		const row = new THREE.Mesh(
			rowGeometry,
			frameMaterial
		);
		scene.add(row);
		row.position.y = y;
	};
	const generateCol = (x) => {
		const column = new THREE.Mesh(
			columnGeometry,
			frameMaterial
		);
		scene.add(column);
		column.position.x = x;
	};

	generateRow(-height * 0.5);
	generateRow(0);
	generateRow(height * 0.5);

	generateCol(-width * 0.5);
	generateCol(0);
	generateCol(width * 0.5);

	if (castLight) {
		const lightTarget = new THREE.Object3D();
		lightTarget.position.z = 1;
		lightTarget.position.y = -0.5;
		scene.add(lightTarget);

		const light = new THREE.SpotLight(0xd4c33b, 0.5, 15, Math.PI * .35, 0, 1);
		light.position.set(0, 0, 0);
		light.target = lightTarget;
		scene.add(light);
		light.castShadow = true;
		light.shadow.mapSize.width = 256;
		light.shadow.mapSize.height = 256;
	}

	return scene;
}
export default generateWindow;