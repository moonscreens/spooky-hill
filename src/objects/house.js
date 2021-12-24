import * as THREE from 'three';
import genWoodMaterial from './materials/wood';
import genWood2Material from './materials/wood2';
import genMetalMaterial from './materials/metal';

const scene = new THREE.Group();

const houseSize = 7;
const houseHeight = houseSize * 0.75;

const house = new THREE.Mesh(
	new THREE.BoxBufferGeometry(houseSize, houseHeight, houseSize),
	genWoodMaterial(),
);
house.position.y += houseSize * 0.125;
scene.add(house);

const door = new THREE.Mesh(
	new THREE.BoxBufferGeometry(0.1, 3, 1.5),
	genWood2Material({}, 0.5, 2)
);
door.position.x = -houseSize*0.5;
scene.add(door);

const houseBase = new THREE.Mesh(
	new THREE.BoxBufferGeometry(houseSize * 1.05, houseSize * 0.1, houseSize * 1.05),
	genWood2Material({}, 1, 0.15, 128),
);
scene.add(houseBase);
houseBase.position.copy(house.position);
houseBase.position.y -= houseHeight * 0.5;

const columnGeometry = new THREE.BoxBufferGeometry(houseSize * 0.05, houseSize, houseSize * 0.05);
const columnMaterial = genWoodMaterial(
	{},
	1 - 10 / 11, // 11 planks in the texture
	8
);
const genHouseColumn = (x, z) => {
	const column = new THREE.Mesh(
		columnGeometry,
		columnMaterial,
	);
	column.position.y = -houseHeight * 0.6 + houseBase.position.y;
	column.position.x = x * houseSize * 0.5;
	column.position.z = z * houseSize * 0.5;
	scene.add(column);
}
genHouseColumn(-1, 1);
genHouseColumn(1, 1);
genHouseColumn(1, -1);
genHouseColumn(-1, -1);

genHouseColumn(0, -1);
genHouseColumn(0, 1);


const generateRoofSegment = (matOptions) => {
	const roofSegment = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(houseSize * 1.1, houseSize, 512, 1),
		genMetalMaterial(matOptions)
	);
	roofSegment.position.y = houseSize * 0.65;
	scene.add(roofSegment);
	return roofSegment;
}
const frontRoof = generateRoofSegment();
frontRoof.position.z = houseSize * 0.35;
frontRoof.rotation.x = -Math.PI * 0.25;

const backRoof = generateRoofSegment({ side: THREE.BackSide, normalScale: 0 });
backRoof.position.z = -houseSize * 0.35;
backRoof.rotation.x = Math.PI * 0.25 + Math.PI;


const atticShape = new THREE.Shape();
atticShape.moveTo(0, houseSize * 0.5);
atticShape.lineTo(-houseSize * 0.5, 0);
atticShape.lineTo(houseSize * 0.5, 0);
const atticMesh = new THREE.Mesh(new THREE.ShapeGeometry(atticShape), genWood2Material({}, 0.3));
atticMesh.position.x = -houseSize * 0.5 * 0.95;
atticMesh.position.y = houseSize * 0.5;
atticMesh.rotation.y = -Math.PI * 0.5
scene.add(atticMesh);

for (let index = 0; index < scene.children.length; index++) {
	const element = scene.children[index];
	element.castShadow = true;
	element.receiveShadow = true;
}

export default scene;