import * as THREE from 'three';
import grassMaterial from './materials/grass';
import genWoodMaterial from './materials/wood';
import generateSign from './textPlane';

const scene = new THREE.Group();

const hillSize = 50;

const hillGeometry = new THREE.SphereBufferGeometry(hillSize, 64, 64, 0, Math.PI);
const frontHill = new THREE.Mesh(hillGeometry, grassMaterial);
frontHill.rotation.x = -Math.PI / 2;
frontHill.position.y = -hillSize - 3.5;
scene.add(frontHill);

frontHill.castShadow = true;
frontHill.receiveShadow = true;

export default scene;




/*
Decorations
*/

window.requestAnimationFrame(() => {
	frontHill.updateWorldMatrix(true);
	const rayCaster = new THREE.Raycaster();
	const downVector = new THREE.Vector3(0, -1, 0);
	const plantObject = (x, z, object) => {
		rayCaster.set(new THREE.Vector3(x, 100, z), downVector);
		const point = rayCaster.intersectObject(frontHill, false)[0].point;
		point.x -= scene.position.x;
		object.position.copy(point);
		//object.position.sub();
	}

	const generatePost = (x = 0, z = 0, postHeight = 1.5, postWidth = 0.15) => {
		const postMaterial = genWoodMaterial({}, 1 - 10 / 11, 1);
		const postGeometry = new THREE.BoxBufferGeometry(postWidth, postHeight, postWidth);
		const sign = new THREE.Mesh(postGeometry, postMaterial);
		plantObject(x, z, sign);
		sign.position.y += postHeight * 0.5;
		sign.castShadow = true;
		scene.add(sign);
		return sign;
	}

	
	const newSign = (x, y, rotation, text) => {
		const signPost = generatePost(x, y);
		const sign = new THREE.Mesh(
			new THREE.BoxBufferGeometry(0.15, 0.75, 1),
			genWoodMaterial()
		)
		sign.position.y += 0.3
		sign.position.x -= 0.07
		signPost.add(sign);
		signPost.rotation.y = rotation;
		const signtext = generateSign(1, 0.75, 50, text, "#aa0000", 20);
		signtext.rotation.y = -Math.PI * 0.5;
		signtext.position.x = -0.0751;
		sign.add(signtext);
	}

	newSign(3, 5, Math.PI * 0.125, "BALD");
	newSign(4, 6, Math.PI * 0.125, "KEEP OUT");
	newSign(5, 7, Math.PI * 0.125, "NO ENTRY");

	newSign(-7, -2, -Math.PI * 1.3, "NO NaM");

});
