// Free texture from https://www.poliigon.com/textures/free
import * as THREE from 'three';
import colorMapUrl from './COL.jpg';
import specularMapUrl from './SPECULAR.jpg';
import normalMapUrl from './NRM.jpg';
import aoMapUrl from './AO.jpg';
import dispMapUrl from './DISP.jpg';
import { applyTexture, loadImage, newCanvas } from '../matUtils';


const genMetalMaterial = (matOptions = {}, wrapX = 0.75, wrapY = false, resolution = 128) => {
	const mat = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		specularMap: new THREE.CanvasTexture(newCanvas(resolution)),
		specular: 0.25,
		normalMap: new THREE.CanvasTexture(newCanvas(resolution)),
		aoMap: new THREE.CanvasTexture(newCanvas(resolution)),
		displacementMap: new THREE.CanvasTexture(newCanvas(resolution)),
		displacementScale: 0.1,
		...matOptions,
	});

	loadImage(specularMapUrl, texture => { applyTexture(texture, mat.specularMap, resolution, wrapX); mat.needsUpdate = true; });
	loadImage(normalMapUrl, texture => { applyTexture(texture, mat.normalMap, resolution, wrapX); mat.needsUpdate = true; });
	loadImage(aoMapUrl, texture => { applyTexture(texture, mat.aoMap, resolution, wrapX); mat.needsUpdate = true; });
	loadImage(dispMapUrl, texture => { applyTexture(texture, mat.displacementMap, resolution, wrapX); mat.needsUpdate = true; });
	return mat;
};

export default genMetalMaterial;

