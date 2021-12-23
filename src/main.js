import './main.css';
import * as THREE from "three";
import TwitchChat from 'twitch-chat-emotes-threejs';
import Stats from "stats-js";

// a default array of twitch channels to join
let channels = ['moonmoon'];

// the following few lines of code will allow you to add ?channels=channel1,channel2,channel3 to the URL in order to override the default array of channels
const query_vars = {};
const query_parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
	query_vars[key] = value;
});

if (query_vars.channels) {
	channels = query_vars.channels.split(',');
}

let stats = false;
if (query_vars.stats) {
	stats = new Stats();
	stats.showPanel(1);
	document.body.appendChild(stats.dom);
}

const ChatInstance = new TwitchChat({
	// If using planes, consider using MeshBasicMaterial instead of SpriteMaterial
	materialType: THREE.SpriteMaterial,

	// Passed to material options
	materialOptions: {
		transparent: true,
	},

	channels,
	maximumEmoteLimit: 3,
})

const camera = new THREE.PerspectiveCamera(39.6, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.layers.enable(1);
camera.position.z = 20;
camera.position.y = 0;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
	antialias: false,
	alpha: false
});
document.body.appendChild(renderer.domElement);


function resize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);


let lastFrame = Date.now();
// Called once per frame
function draw() {
	if (stats) stats.begin();
	window.requestAnimationFrame(draw);

	// number of seconds since the last frame was drawn
	const delta = (Date.now() - lastFrame) / 1000;

	moon.rotation.y += delta * 0.02;

	for (let index = emoteArray.length - 1; index >= 0; index--) {
		const element = emoteArray[index];

		// Emotes will travel either towards or away from the camera as a basic example
		element.position.x += element.velocity.x * delta;
		element.position.y += element.velocity.y * delta;
		element.position.z += element.velocity.z * delta;

		// Remove a given set of emotes after 10 seconds have passed
		if (element.dateSpawned < Date.now() - 10000) {
			scene.remove(element);
			emoteArray.splice(index, 1);
		}
	}

	cloudUniforms.u_time.value += delta;
	renderer.render(scene, camera);

	lastFrame = Date.now();
	if (stats) stats.end();
}

// add a callback function for when a new message with emotes is sent
const emoteArray = [];
ChatInstance.listen((emotes) => {
	const group = new THREE.Group();

	group.dateSpawned = Date.now();

	group.velocity = new THREE.Vector3(
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
	).normalize().multiplyScalar(5);

	for (let index = 0; index < emotes.length; index++) {
		const emote = emotes[index];

		const sprite = new THREE.Sprite(emote.material);
		sprite.position.x = index;

		group.add(sprite);
	}
	scene.add(group);
	emoteArray.push(group);
})

window.requestAnimationFrame(draw);

/*
** Hill setup
*/

const hillGeometry = new THREE.SphereBufferGeometry(30, 32, 8, 0, Math.PI);
import grassMaterial from './grass';
const frontHill = new THREE.Mesh(hillGeometry, grassMaterial);
frontHill.rotation.x = -Math.PI /2;
frontHill.position.y = -33;
frontHill.position.x = -5;
scene.add(frontHill)


const fog = new THREE.Fog(0x000E16, 1, 10);
scene.add(fog);

/*
** Sky setup
*/

// Light hitting the moon
const sunLight = new THREE.DirectionalLight(0xFFEE6D, 1);
sunLight.position.set(0.5, -0.4, -0.8);
sunLight.layers.set(1);
scene.add(sunLight);
/*const ambient = new THREE.AmbientLight(0x000E16, 2);
ambient.layers.set(1);
scene.add(ambient);*/


import moonTextureUrl from './moon-texture-contrast.png';
import moonDisplacementTextureUrl from './moon-displacement.png';
const moonTexture = new THREE.TextureLoader().load(moonTextureUrl);
moonTexture.magFilter = THREE.NearestFilter;
moonTexture.minFilter = THREE.NearestFilter;
const moonDisplacementTexture = new THREE.TextureLoader().load(moonDisplacementTextureUrl);
moonDisplacementTexture.magFilter = THREE.NearestFilter;
moonDisplacementTexture.minFilter = THREE.NearestFilter;
const moonMaterial = new THREE.MeshPhongMaterial({
	map: moonTexture,
	shininess: 1,
	specular: 0xFFFFFF,
	emissive: 0x000E16,
	bumpMap: moonDisplacementTexture,
	bumpScale: 0.5,
});
/*const toonColors = [];
const moonMaterial = new THREE.MeshToonMaterial({
	gradientMap: new THREE.DataTexture([], )
});*/
const moonSize = 60;
const moon = new THREE.Mesh(new THREE.SphereBufferGeometry(moonSize, 16, 16), moonMaterial);
moon.position.x = -120;
moon.position.y = 50 + 1 + moonSize;
moon.position.z = -400;
moon.rotation.y = Math.PI * 2 * Math.random();
moon.layers.set(1);
scene.add(moon);

// light cast by the moon
const moonLight = new THREE.DirectionalLight(0xfff396, 1);
moonLight.position.copy(moon.position);
scene.add(moonLight)

scene.background = new THREE.Color(0x000E16);

const cloudGeometry = new THREE.PlaneBufferGeometry(1300, 1000);
const cloudFragShader = document.getElementById('simplexFragmentShader').textContent;
const cloudVertShader = document.getElementById('SimpleVertexShader').textContent;
const cloudUniforms = {
	u_time: { value: 0 },
	u_resolution: { value: 512 },
}
const cloudMaterial = new THREE.ShaderMaterial({
	uniforms: cloudUniforms,
	vertexShader: cloudVertShader,
	fragmentShader: cloudFragShader,
	transparent: true,
})
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud.position.y = 50;
cloud.position.z = -620;
cloud.rotation.x = Math.PI / 2;
cloud.layers.set(1);
scene.add(cloud);