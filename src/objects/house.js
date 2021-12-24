import * as THREE from 'three';
import woodMaterial from './materials/wood';
import metalMaterial from './materials/metal';

const scene = new THREE.Group();

const houseSize = 7;

const house = new THREE.Mesh(
	new THREE.BoxBufferGeometry(houseSize,houseSize,houseSize),
	woodMaterial
);
scene.add(house);


const generateRoofSegment = ()=>{
	const roofSegment = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(houseSize, houseSize, 512, 1),
		metalMaterial
	);
	roofSegment.position.y = houseSize * 0.65;
	scene.add(roofSegment);
	return roofSegment;
}
const frontRoof = generateRoofSegment();
frontRoof.position.z = houseSize * 0.35;
frontRoof.rotation.x = -Math.PI * 0.25;

const backRoof = generateRoofSegment();
backRoof.position.z = -houseSize * 0.35;
backRoof.rotation.x = Math.PI * 0.25 + Math.PI;


const atticShape = new THREE.Shape();
atticShape.moveTo(0, houseSize*0.5);
atticShape.lineTo(-houseSize*0.5, 0);
atticShape.lineTo(houseSize*0.5, 0);
const atticMesh = new THREE.Mesh( new THREE.ShapeGeometry(atticShape), woodMaterial );
atticMesh.position.x = -houseSize*0.5;
atticMesh.position.y = houseSize*0.5;
atticMesh.rotation.y = -Math.PI*0.5
scene.add(atticMesh);

for (let index = 0; index < scene.children.length; index++) {
	const element = scene.children[index];
	element.castShadow = true;
	element.receiveShadow = true;
}

export default scene;