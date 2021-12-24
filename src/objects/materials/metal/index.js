// Free texture from https://www.poliigon.com/textures/free
import * as THREE from 'three';
import colorMapUrl from './COL.jpg';
import specularMapUrl from './SPECULAR.jpg';
import normalMapUrl from './NRM.jpg';
import aoMapUrl from './AO.jpg';
import dispMapUrl from './DISP.jpg';


const genMetalMaterial = (matOptions = {}, wrapX = 0.75, wrapY = false, resolution = 128) => {
	if (!wrapY) wrapY = wrapX;
	const mat = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specularMap: new THREE.CanvasTexture(document.createElement('canvas')),
		specular: 0.25,
		normalMap: new THREE.CanvasTexture(document.createElement('canvas')),
		aoMap: new THREE.CanvasTexture(document.createElement('canvas')),
		displacementMap: new THREE.CanvasTexture(document.createElement('canvas')),
		displacementScale: 0.1,

		...matOptions,
	});


	const updateTxt = (texture) => {
		if (!texture) return;
		texture.wrapS = wrapX;
		texture.wrapT = wrapY;
		texture.repeat.set(wrapX, wrapY);
		texture.magFilter = THREE.NearestFilter;
	}

	function resizeTexture(texture, matTexture) {
		const canvas = matTexture.image;
		const ctx = canvas.getContext('2d');
		canvas.width = resolution;
		canvas.height = resolution;
		ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);
		matTexture.needsUpdate = true;
	}

	new THREE.TextureLoader().load(colorMapUrl, texture => { resizeTexture(texture, mat.map) })
	new THREE.TextureLoader().load(specularMapUrl, texture => { resizeTexture(texture, mat.specularMap) })
	new THREE.TextureLoader().load(normalMapUrl, texture => { resizeTexture(texture, mat.normalMap) })
	new THREE.TextureLoader().load(aoMapUrl, texture => { resizeTexture(texture, mat.aoMap) })
	new THREE.TextureLoader().load(dispMapUrl, texture => { resizeTexture(texture, mat.displacementMap) })


	updateTxt(mat.map);
	updateTxt(mat.specularMap);
	updateTxt(mat.normalMap);
	updateTxt(mat.aoMap);
	updateTxt(mat.displacementMap);
	return mat;
};

export default genMetalMaterial;

