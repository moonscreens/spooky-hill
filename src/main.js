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

if (query_vars.orbit) {
	setInterval(()=>{
		camera.position.x = Math.sin(Date.now() / 10000) * 26;
		camera.position.z = Math.cos(Date.now() / 10000) * 26;
		camera.lookAt(0,0,0)
	}, 16)
}

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({
	antialias: false,
	alpha: false,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

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

	renderer.render(scene, camera);

	lastFrame = Date.now();
	if (stats) stats.end();
}

// add a callback function for when a new message with emotes is sent
const emoteArray = [];
ChatInstance.listen((emotes) => {
	const group = new THREE.Group();

	group.dateSpawned = Date.now();

	group.velocity = new THREE.Vector3(-1, 0, 0).normalize().multiplyScalar(5);
	group.position.copy(house.position);
	group.position.z += -10;
	group.position.add(new THREE.Vector3(
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
		Math.random() * 2 - 1,
	))

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
import terrain from './objects/terrain';
const terrainScale = 10;
terrain.position.y = -terrainScale;
terrain.position.z = -50 * terrainScale;
terrain.rotation.x += Math.PI * 0.01;
terrain.scale.setScalar(terrainScale)
terrain.castShadow = true;
terrain.receiveShadow = true;
scene.add(terrain);

import hill from './objects/hill'
hill.position.x = 5;
hill.castShadow = true;
hill.receiveShadow = true;
scene.add(hill);

import house from './objects/house';
house.position.x = hill.position.x + 4.5;
house.position.y = -1;
scene.add(house);

scene.fog = new THREE.Fog(0x000E16, 1, 400);

/*
** Sky setup
*/

scene.add(new THREE.AmbientLight(0x000E16, 1))

// Light hitting the moon
const sunLight = new THREE.DirectionalLight(0xFFEE6D, 1);
sunLight.position.set(0.5, -0.4, -0.8);
sunLight.layers.set(1);
scene.add(sunLight);
/*const ambient = new THREE.AmbientLight(0x000E16, 2);
ambient.layers.set(1);
scene.add(ambient);*/

import moon from './objects/moon';
moon.position.x += -120;
moon.position.y += 50;
moon.position.z += -400;
scene.add(moon);

// light cast by the moon
const moonLight = new THREE.SpotLight(0xfff396, 1, 500, Math.PI * 0.2, 0.25, 0.2);
moonLight.castShadow = true;
moonLight.position.copy(moon.position);
moonLight.lookAt(house.position);
moonLight.shadow.mapSize.width = 2048 * 2;
moonLight.shadow.mapSize.height = 2048 * 2;
scene.add(moonLight)

scene.background = new THREE.Color(0x000E16);

const cloudGeometry = new THREE.PlaneBufferGeometry(1300, 1000);
import cloudMaterial from './objects/materials/clouds';
const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloud.position.y = 50;
cloud.position.z = -620;
cloud.rotation.x = Math.PI / 2;
cloud.layers.set(1);
scene.add(cloud);