// Free texture from https://www.poliigon.com/textures/free
import * as THREE from 'three';

import { loadImage, applyTexture, newCanvas } from '../matUtils';


const size = 128;
const mat = new THREE.MeshPhongMaterial({
	map: new THREE.CanvasTexture(newCanvas(size)),
	specularMap: new THREE.CanvasTexture(newCanvas(size)),
	normalMap: new THREE.CanvasTexture(newCanvas(size)),
});


import colorMapUrl from './GroundForest003_COL_VAR2_1K.jpg';
loadImage(colorMapUrl, texture => { applyTexture(texture, mat.map, size, 15); mat.needsUpdate = true; });

import glossMapUrl from './GroundForest003_GLOSS_1K.jpg';
loadImage(glossMapUrl, texture => { applyTexture(texture, mat.specularMap, size, 15); mat.needsUpdate = true; });

import normalMapUrl from './GroundForest003_NRM_1K.jpg';
loadImage(normalMapUrl, texture => { applyTexture(texture, mat.normalMap, size, 15); mat.needsUpdate = true; });


export default mat;

