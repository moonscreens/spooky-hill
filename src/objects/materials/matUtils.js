import * as THREE from 'three';

export const newCanvas = (size) => {
	const canvas = document.createElement('canvas');
	canvas.width = size;
	canvas.height = size;
	return canvas;
}

export const updateTxtWrapping = (texture, wrapCount = 1) => {
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.setScalar(wrapCount);
	texture.magFilter = THREE.NearestFilter;
	texture.needsUpdate = true;
}
export const applyTexture = (image, matTexture, size = 128, wrapCount = 1) => {
	const canvas = matTexture.image;
	const ctx = canvas.getContext('2d');
	canvas.width = size;
	canvas.height = size;
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	updateTxtWrapping(matTexture, wrapCount);
}

export const loadImage = (url, callback) => {
	const image = new Image();
	image.addEventListener('load', () => {
		callback(image);
	});
	image.src = url;
}