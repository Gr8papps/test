const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
const sunLight = new THREE.PointLight(0xffffff, 8, 1000);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0xffffff, .5));

// Sun
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffcc00, emissiveIntensity: 60 })
);
scene.add(sun);

// Stars
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(20000 * 3);
for(let i=0; i < 20000 * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 2000;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1 }));
scene.add(stars);

// Planets
const planets = [];
const planetColors = [0x00f2ff, 0x7000ff, 0xff007b, 0x00ff8c];
for(let i=0; i<6; i++) {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(2 + Math.random() * 3, 32, 32),
        new THREE.MeshStandardMaterial({ color: planetColors[i % 4], emissive: planetColors[i % 4], emissiveIntensity: 0.3 })
    );
    const dist = 60 + (i * 35);
    scene.add(mesh);
    planets.push({ mesh, dist, speed: 0.001 + Math.random() * 0.003, angle: Math.random() * Math.PI * 2 });
}

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.enableZoom = false; 
camera.position.set(0, 50, 200);

// Loop
function animate() {
    requestAnimationFrame(animate);
    planets.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.dist;
        p.mesh.position.z = Math.sin(p.angle) * p.dist;
    });
    stars.rotation.y += 0.0002;
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
