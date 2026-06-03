import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Desactivar mensaje de error de CORS si carga bien el módulo
document.getElementById('error-msg').style.display = 'none';

// ==========================================
// ⚙️ BASE DE DATOS EMOCIONAL PERSONALIZADA
// ==========================================
const emojisPosibles = ['❤️', '💕', '💖', '💗', '💓', '💞', '✨', '🌹', '🌸', '🫶', '💫', '♡', '🦋', '🌷', '🌟', '💌'];
const paletaColores = ['#ffb3c6', '#ff809f', '#ffd1dc', '#ffffff', '#ff99b3'];

const frases = [
    "Tu sonrisa", "Tu mirada profunda", "Tu risa contagiosa", "La calidez de tu voz", "Tu inteligencia brillante", 
    "Tu sentido del humor único", "Tus abrazos que curan todo", "La paz infinita que me das", "Tu bondad desinteresada", "Tu locura divertida",
    "Tu forma única de ver el mundo", "La pasión que le pones a todo", "Tu gran empatía", "Tu creatividad sin límites", "Tu fuerza inquebrantable", 
    "Tu ternura al hablarme", "Tu paciencia conmigo", "El apoyo incondicional que me brindas", "La luz que irradias", "Tu energía positiva",
    "La suavidad de tus manos", "Tus caricias inesperadas", "Tu aroma que me encanta", "Tu forma de caminar", "Cómo me escuchas con atención", 
    "Cómo me hablas al oído", "Cómo me haces sentir único", "Tu maravillosa compañía", "Tus silencios cómodos", "Tu besos",
    "Tus pequeños detalles", "Tus anecdotas", "Tu forma tan pura de amar", "Tu sinceridad total", "Tu honestidad valiente", 
    "Tu lealtad absoluta", "La confianza que me inspiras", "Tu valentía ante los retos", "Tu inmensa determinación", "Tu perseverancia",
    "Tu optimismo contagiante", "Tu esperanza en el futuro", "Tu fe en nosotros", "Tu alegría de vivir", "Tu entusiasmo por lo simple", 
    "Tu curiosidad de niña", "Tu increíble imaginación", "Tu maravillosa espontaneidad", "Tu autenticidad", "Tu hermosa originalidad",
    "Tus grandes metas", "Tus sueños más locos", "Tu forma de soñar despierta", "Tu forma de luchar por lo que quieres", "Tu resiliencia", 
    "Tu capacidad de perdonar", "Tu capacidad de aprender siempre", "Tu gran sabiduría", "Tu intención perfecta", "Tu hermosa sensibilidad",
    "Cómo te emocionas por pequeñas cosas", "Tus gestos unicos", "Tus divertidas manías", "Esos labios pequeños y hermosos que tanto me gustan", "Tu cabello", 
    "Tu perfil perfecto", "Tus ojitos hermosos", "Tus mensajes en las mañanas", "Tu carita cuando comes algo rico", "Tu forma de ser cuando estamos a solas",
    "Tus mensajes de buenos días", "Tus caricias", "Tus sabios consejos", "Tu forma de cuidarme", "Tu forma de protegerme", 
    "Tu forma de animarme", "Tu forma de hacerme ver que somos el mejor equipo", "Tu facilidad para hacerme reír", "Tu capacidad de hacerme pensar", "Que seas TU"
];

const interactiveData = frases.map((frase, i) => {
    return {
        id: i,
        emoji: emojisPosibles[Math.floor(Math.random() * emojisPosibles.length)],
        color: paletaColores[Math.floor(Math.random() * paletaColores.length)],
        title: frase,
        // Tu dedicatoria espacial integrada a la perfección:
        card: "En medio de tantas estrellas en el espacio, " + frase + " es lo que me hace mantener los pies en la tierra."
    };
});

// Configuración básica de la escena
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030102, 0.002);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
const targetZ = 120;
camera.position.set(0, 40, targetZ);

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.03;
controls.autoRotate = true; controls.autoRotateSpeed = 0.2;
controls.maxDistance = 350; controls.minDistance = 25;

// Post-procesamiento Cinemático (Bloom/Glow)
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8, 0.6, 0.2
);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene); composer.addPass(bloomPass);

// Agujero Negro Central
const bhGeometry = new THREE.SphereGeometry(12, 64, 64);
const bhMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
const blackHole = new THREE.Mesh(bhGeometry, bhMaterial);
scene.add(blackHole);

// Disco de Acreción (GLSL Shaders personalizados)
const diskGeometry = new THREE.PlaneGeometry(100, 100, 128, 128);
const diskShaderMaterial = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0.0 }, color1: { value: new THREE.Color(0xffd1dc) }, color2: { value: new THREE.Color(0xff5522) } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
        uniform float time; uniform vec3 color1; uniform vec3 color2; varying vec2 vUv;
        float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
        void main() {
            vec2 p = -1.0 + 2.0 * vUv; float r = length(p); float a = atan(p.y, p.x);
            if(r < 0.25) discard;
            float f = sin(r * 30.0 - time * 2.0 + a * 4.0) + sin(r * 50.0 - time * 4.0 + a * 8.0) * 0.5;
            vec3 col = mix(color2, color1, f * 0.5 + 0.5);
            float glow = 0.08 / (r - 0.2); float edgeFade = smoothstep(1.0, 0.3, r);
            float alpha = edgeFade * glow * (f * 0.5 + 0.8) + (rand(p * time * 0.001) * 0.1);
            gl_FragColor = vec4(col * alpha * 1.5, alpha);
        }
    `,
    transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false
});
const accretionDisk = new THREE.Mesh(diskGeometry, diskShaderMaterial);
accretionDisk.rotation.x = Math.PI / 2.1; 
scene.add(accretionDisk);

// Polvo estelar / Estrellas fijas de fondo
const starGeo = new THREE.BufferGeometry(); const starPos = new Float32Array(15000 * 3);
for(let i = 0; i < 15000; i++) {
    const r = 25 + Math.pow(Math.random(), 2) * 250; const theta = Math.random() * 2 * Math.PI; const phi = Math.acos((Math.random() * 2 - 1) * 0.1); 
    starPos[i*3] = r * Math.sin(phi) * Math.cos(theta); starPos[i*3+1] = r * Math.cos(phi) * (Math.random() * 0.6); starPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({ size: 0.6, color: 0xffe6ea, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
const stars = new THREE.Points(starGeo, starMat); scene.add(stars);

// ==========================================
// 💖 CREACIÓN DE HOLOGRAMAS CANVASEXPR
// ==========================================
const interactiveSprites = [];

function createEmojiHologramSprite(emojiText, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(256, 256, 30, 256, 256, 220);
    gradient.addColorStop(0, colorHex); 
    gradient.addColorStop(0.5, colorHex + '66'); 
    gradient.addColorStop(1, 'rgba(0,0,0,0)'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    ctx.font = '160px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'; 
    ctx.shadowBlur = 20;
    
    ctx.fillStyle = '#ffffff'; 
    ctx.fillText(emojiText, 256, 255); 

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace; 
    
    const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true, 
        blending: THREE.NormalBlending, 
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(16, 16, 1); 
    return sprite;
}

interactiveData.forEach((data, index) => {
    const sprite = createEmojiHologramSprite(data.emoji, data.color);
    const angle = (index / interactiveData.length) * Math.PI * 4 + Math.random(); 
    const distance = 40 + (Math.random() * 100); 
    const height = (Math.random() - 0.5) * 60;
    
    sprite.position.set(Math.cos(angle) * distance, height, Math.sin(angle) * distance);

    sprite.userData = {
        data: data, angle: angle, distance: distance, baseY: height,
        speed: 0.001 + Math.random() * 0.002, bobSpeed: 1 + Math.random() * 2, originalScale: 16
    };

    scene.add(sprite);
    interactiveSprites.push(sprite);
});

// Interacción Raycaster (Mouse y Clicks)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const crosshair = document.getElementById('crosshair');
const cardModal = document.getElementById('message-card');

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('click', () => {
    if (cardModal.classList.contains('active')) return;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveSprites);

    if (intersects.length > 0) {
        const sprite = intersects[0].object;
        const data = sprite.userData.data;
        
        sprite.scale.set(24, 24, 1);
        setTimeout(() => sprite.scale.set(16, 16, 1), 300);

        document.getElementById('card-icon').innerText = data.emoji;
        document.getElementById('card-icon').style.textShadow = `0 0 20px ${data.color}`;
        document.getElementById('card-title').innerText = data.title;
        document.getElementById('card-text').innerText = data.card;
        cardModal.classList.add('active');
    }
});

document.getElementById('btn-close').addEventListener('click', () => cardModal.classList.remove('active'));

// Animación de entrada fluida (Lerp en el bucle principal)
let introAnimacion = false;

document.getElementById('btn-enter').addEventListener('click', () => {
    const intro = document.getElementById('intro-screen'); 
    intro.style.opacity = 0;
    setTimeout(() => intro.style.display = 'none', 2500);
    
    camera.position.z = targetZ + 100;
    introAnimacion = true;
});

// Redimensionamiento Responsivo
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight); 
    composer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

// Bucle Continuo de Renderizado
function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (introAnimacion) {
        camera.position.z -= (camera.position.z - targetZ) * 0.05;
        if (Math.abs(camera.position.z - targetZ) < 0.1) {
            camera.position.z = targetZ;
            introAnimacion = false;
        }
    }

    controls.update();
    diskShaderMaterial.uniforms.time.value = elapsedTime;
    stars.rotation.y = elapsedTime * 0.005;

    // Movimientos de flotación orbital e individual de los hologramas
    interactiveSprites.forEach((sprite) => {
        const ud = sprite.userData;
        ud.angle += ud.speed;
        sprite.position.x = Math.cos(ud.angle) * ud.distance;
        sprite.position.z = Math.sin(ud.angle) * ud.distance;
        sprite.position.y = ud.baseY + Math.sin(elapsedTime * ud.bobSpeed + ud.angle) * 3;
        
        const pulse = ud.originalScale + Math.sin(elapsedTime * 3 + ud.angle) * 1.5;
        if(sprite.scale.x < 20) sprite.scale.set(pulse, pulse, 1);
    });

    // Lógica continua del cursor y Crosshair activo
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveSprites);
    if(intersects.length > 0) {
        crosshair.classList.add('active'); 
        document.body.style.cursor = 'pointer';
    } else {
        crosshair.classList.remove('active'); 
        document.body.style.cursor = 'default';
    }

    composer.render();
}

animate();
    
