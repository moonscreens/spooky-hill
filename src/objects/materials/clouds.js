import * as THREE from 'three';

import frag from './clouds.frag';
import snoise from './snoise.glsl';


let lastFrame = Date.now();
const tick = () => {
	const delta = (Date.now() - lastFrame) / 1000;
	lastFrame = Date.now();
	if (uniforms) {
		uniforms.u_time.value += delta;
	}
	window.requestAnimationFrame(tick);
}
let uniforms = null;

const canvas = document.createElement('canvas');
canvas.width = 128;
canvas.height = 128;
canvas.fillStyle = "#ffffff";
canvas.getContext('2d').fillRect(0,0,canvas.width,canvas.height);
const material = new THREE.MeshLambertMaterial({
	map: new THREE.CanvasTexture(canvas),
	transparent: true,
	emissive: 0x042847,
});
material.onBeforeCompile = function (shader) {
	shader.uniforms.u_time = { value: Math.random() * 1000 };
	uniforms = shader.uniforms;
	tick();

	material.userData.shader = shader;

	shader.fragmentShader = `
	uniform float u_time;
	${snoise}
	
	${shader.fragmentShader.replace('#include <encodings_fragment>',`
		#include <encodings_fragment>
		${frag}
	`)}`;
};

// Make sure WebGLRenderer doesn't reuse a single program
material.customProgramCacheKey = function () {
	return parseInt(window.shaderPID++); // some random ish number
};


export default material





