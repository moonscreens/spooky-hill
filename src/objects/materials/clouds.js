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
const material = new THREE.MeshBasicMaterial({
	map: new THREE.CanvasTexture(canvas),
	transparent: true,
});
material.onBeforeCompile = function (shader) {
	shader.uniforms.u_time = { value: Math.random() * 1000 };
	uniforms = shader.uniforms;
	tick();

	material.userData.shader = shader;

	shader.fragmentShader = `
	uniform float u_time;
	${snoise}
	
	${shader.fragmentShader.replace('#include <dithering_fragment>',`
		#include <dithering_fragment>
		${frag}
	`)}`;
};

// Make sure WebGLRenderer doesn't reuse a single program
material.customProgramCacheKey = function () {
	return parseInt(window.shaderPID++); // some random ish number
};


export default material





