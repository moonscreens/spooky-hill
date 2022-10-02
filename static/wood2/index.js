// Free texture from https://www.poliigon.com/textures/free
import * as THREE from 'three';
import { applyTexture, loadImage, newCanvas } from '../matUtils';
import colorMapUrl from './COL_VAR2.jpg';
import specularMapUrl from './REFL.jpg';
import normalMapUrl from './NRM.jpg';

const genWoodMaterial = (matOptions = {}, wrapX = 0.75, wrapY = false, resolution = 128) => {
	if (!wrapY) wrapY = wrapX;

	const mat = new THREE.MeshPhongMaterial({
		map: new THREE.CanvasTexture(newCanvas(resolution)),
		specularMap: new THREE.CanvasTexture(newCanvas(resolution)),
		normalMap: new THREE.CanvasTexture(newCanvas(resolution)),

		...matOptions,
	});

	loadImage(colorMapUrl, texture => { applyTexture(texture, mat.map, resolution, wrapX); mat.needsUpdate = true;});
	loadImage(specularMapUrl, texture => { applyTexture(texture, mat.specularMap, resolution, wrapX); mat.needsUpdate = true;});
	loadImage(normalMapUrl, texture => { applyTexture(texture, mat.normalMap, resolution, wrapX); mat.needsUpdate = true;});
	return mat;
}

export default genWoodMaterial;

