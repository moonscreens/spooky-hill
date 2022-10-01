import * as THREE from 'three';
import genWoodMaterial from './materials/wood';
import genWood2Material from './materials/wood2';
import genMetalMaterial from './materials/metal';
import generateWindow from './window';

const scene = new THREE.Group();

const houseSize = 7;
const houseHeight = houseSize * 0.75;

const house = new THREE.Mesh(
	new THREE.BoxGeometry(houseSize, houseHeight, houseSize),
	genWoodMaterial(),
);
house.position.y += houseSize * 0.125;
scene.add(house);

const sideWindow = generateWindow(1.5, 2);
sideWindow.position.z = houseSize * 0.5;
sideWindow.position.y = -.5;
house.add(sideWindow);

const frontLeftWindow = generateWindow(1, 1.5);
frontLeftWindow.position.x = -houseSize*.5;
frontLeftWindow.position.z = -2;
frontLeftWindow.position.y = -0.25;
frontLeftWindow.rotation.y = -Math.PI * .5;
house.add(frontLeftWindow);

const frontRightWindow = generateWindow(1, 1.5);
frontRightWindow.position.x = -houseSize*.5;
frontRightWindow.position.z = 2;
frontRightWindow.position.y = -0.25;
frontRightWindow.rotation.y = -Math.PI * .5;
house.add(frontRightWindow);


const door = new THREE.Mesh(
	new THREE.BoxGeometry(0.1, 3, 1.5),
	genWood2Material({}, 0.5, 2)
);
door.position.x = -houseSize * 0.5;
scene.add(door);

const stepCount = 5;
const stepSize = 0.25;
const stepGeometry = new THREE.BoxGeometry(stepSize, stepSize, 2);
const stepMaterial = genWoodMaterial();
for (let index = 0; index < stepCount; index++) {
	const step = new THREE.Mesh(stepGeometry, stepMaterial);
	step.position.x = (-houseSize * .5) - (stepSize * index) - stepSize;
	step.position.y = (-1.5) - (stepSize * index);
	scene.add(step);
}

const houseBase = new THREE.Mesh(
	new THREE.BoxGeometry(houseSize * 1.05, houseSize * 0.1, houseSize * 1.05),
	genWood2Material({}, 1, 0.15, 128),
);
scene.add(houseBase);
houseBase.position.copy(house.position);
houseBase.position.y -= houseHeight * 0.5;

const columnGeometry = new THREE.BoxGeometry(houseSize * 0.05, houseSize, houseSize * 0.05);
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


const generateRoofSegment = (matOptions, useMat = true) => {
	const roofSegment = new THREE.Mesh(
		new THREE.PlaneGeometry(houseSize * 1.1, houseSize, 512, 1),
		useMat ? genMetalMaterial(matOptions) : new THREE.MeshBasicMaterial(matOptions)
	);
	roofSegment.position.y = houseSize * 0.65;
	scene.add(roofSegment);
	return roofSegment;
}
const frontRoof = generateRoofSegment();
frontRoof.position.z = houseSize * 0.35;
frontRoof.rotation.x = -Math.PI * 0.25;

const backRoof = generateRoofSegment({ side: THREE.BackSide, normalScale: 0, color: 0x000000 }, false);
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