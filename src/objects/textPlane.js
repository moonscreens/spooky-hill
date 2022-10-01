import * as THREE from 'three';

const generateSign = (width = 2, height = 1, resolution = 20, text = "spooky house ahead", color = "#ff0000", fontSize = 10) => {
	const canvas = document.createElement('canvas');
	canvas.width = width * resolution;
	canvas.height = height * resolution;
	const ctx = canvas.getContext('2d');
	canvas.style.textRendering = "pixelated";
	//ctx.strokeStyle = color;
	//ctx.strokeRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = color;
	ctx.font = fontSize + "px sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle"
	ctx.fillText(text, width * resolution * 0.5, height * resolution * 0.5, width * resolution);

	const geometry = new THREE.PlaneGeometry(width, height);
	const material = new THREE.MeshBasicMaterial({
		map: new THREE.CanvasTexture(canvas),
		side: THREE.DoubleSide,
		transparent: true,
	});
	material.map.magFilter = THREE.NearestFilter;

	const mesh = new THREE.Mesh(geometry, material);
	return mesh;
}


export default generateSign;