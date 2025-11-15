gsap.registerPlugin(ScrollTrigger);

let cursor = document.getElementById('cursor');
let cursorGlow = document.getElementById('cursor-glow');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

updateCartCount();

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  cursorGlow.style.left = (e.clientX - 20) + 'px';
  cursorGlow.style.top = (e.clientY - 20) + 'px';
});

document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-canvas').appendChild(renderer.domElement);

const shirtGroup = new THREE.Group();

const bodyGeometry = new THREE.BoxGeometry(8, 10, 2);
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: 0xE8DCC8,
  metalness: 0.2,
  roughness: 0.8
});
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
shirtGroup.add(body);

const sleeveGeometry = new THREE.BoxGeometry(3, 8, 2);
const leftSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial);
leftSleeve.position.set(-5.5, -1, 0);
leftSleeve.rotation.z = 0.3;
shirtGroup.add(leftSleeve);

const rightSleeve = new THREE.Mesh(sleeveGeometry, bodyMaterial);
rightSleeve.position.set(5.5, -1, 0);
rightSleeve.rotation.z = -0.3;
shirtGroup.add(rightSleeve);

const collarGeometry = new THREE.BoxGeometry(4, 1.5, 1);
const collarMaterial = new THREE.MeshStandardMaterial({
  color: 0xD4C4B0,
  metalness: 0.2,
  roughness: 0.8
});
const collar = new THREE.Mesh(collarGeometry, collarMaterial);
collar.position.set(0, 5.5, 0.5);
shirtGroup.add(collar);

scene.add(shirtGroup);

const light1 = new THREE.PointLight(0xFFD700, 2, 100);
light1.position.set(20, 20, 20);
scene.add(light1);

const light2 = new THREE.PointLight(0xE8DCC8, 2, 100);
light2.position.set(-20, -20, 20);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 30;

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.background = Math.random() > 0.5 ? '#A761FF' : '#00C8FF';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
    particlesContainer.appendChild(particle);
  }
}

createParticles();

const style = document.createElement('style');
style.innerHTML = `
  @keyframes float {
    0% { transform: translateY(0) translateX(0); }
    50% { transform: translateY(-100px) translateX(50px); }
    100% { transform: translateY(0) translateX(0); }
  }
`;
document.head.appendChild(style);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);

  shirtGroup.rotation.x += 0.003;
  shirtGroup.rotation.y += 0.005;

  shirtGroup.rotation.x += mouseY * 0.001;
  shirtGroup.rotation.y += mouseX * 0.001;

  light1.position.x = Math.sin(Date.now() * 0.001) * 30;
  light1.position.y = Math.cos(Date.now() * 0.001) * 30;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const heroTl = gsap.timeline();

heroTl.to('.hero-title .line', {
  opacity: 1,
  y: 0,
  duration: 1,
  stagger: 0.2,
  ease: 'power4.out'
})
.to('.hero-subtitle .line', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: 'power3.out'
}, '-=0.5')
.to('.hero-search', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power3.out'
}, '-=0.5')
.to('.hero-buttons', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  ease: 'power3.out'
}, '-=0.5');

gsap.set('.hero-title .line', { opacity: 0, y: 100 });
gsap.set('.hero-subtitle .line', { opacity: 0, y: 50 });
gsap.set('.hero-search', { opacity: 0, y: 30 });
gsap.set('.hero-buttons', { opacity: 0, y: 30 });

ScrollTrigger.create({
  trigger: '.hero-section',
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  onUpdate: (self) => {
    const progress = self.progress;
    shirtGroup.rotation.y = progress * Math.PI * 2;
    shirtGroup.position.y = progress * -20;
  }
});

gsap.utils.toArray('.product-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: i * 0.1,
    scrollTrigger: {
      trigger: card,
      start: 'top 80%',
      end: 'top 50%',
      toggleActions: 'play none none reverse'
    }
  });

  gsap.set(card, { opacity: 0, y: 50 });
});

const showcaseScene = new THREE.Scene();
const showcaseCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const showcaseRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

const showcaseCanvas = document.getElementById('showcase-canvas');
if (showcaseCanvas) {
  showcaseRenderer.setSize(showcaseCanvas.offsetWidth, showcaseCanvas.offsetHeight);
  showcaseCanvas.appendChild(showcaseRenderer.domElement);

  const sweaterGroup = new THREE.Group();

  const sweaterBody = new THREE.BoxGeometry(7, 9, 1.5);
  const sweaterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xC9A961,
    metalness: 0.1,
    roughness: 0.9,
    clearcoat: 0.1,
    clearcoatRoughness: 0.8
  });
  const sweater = new THREE.Mesh(sweaterBody, sweaterMaterial);
  sweaterGroup.add(sweater);

  const sweaterSleeve1 = new THREE.BoxGeometry(2.5, 7, 1.5);
  const sleeve1 = new THREE.Mesh(sweaterSleeve1, sweaterMaterial);
  sleeve1.position.set(-4.5, -1, 0);
  sleeve1.rotation.z = 0.2;
  sweaterGroup.add(sleeve1);

  const sleeve2 = new THREE.Mesh(sweaterSleeve1, sweaterMaterial);
  sleeve2.position.set(4.5, -1, 0);
  sleeve2.rotation.z = -0.2;
  sweaterGroup.add(sleeve2);

  showcaseScene.add(sweaterGroup);

  const showcaseLight1 = new THREE.DirectionalLight(0xffffff, 1);
  showcaseLight1.position.set(5, 5, 5);
  showcaseScene.add(showcaseLight1);

  const showcaseLight2 = new THREE.PointLight(0x00C8FF, 1);
  showcaseLight2.position.set(-5, 0, 5);
  showcaseScene.add(showcaseLight2);

  const showcaseAmbient = new THREE.AmbientLight(0xffffff, 0.5);
  showcaseScene.add(showcaseAmbient);

  showcaseCamera.position.z = 20;

  function animateShowcase() {
    requestAnimationFrame(animateShowcase);
    sweaterGroup.rotation.y += 0.01;
    showcaseRenderer.render(showcaseScene, showcaseCamera);
  }

  animateShowcase();

  ScrollTrigger.create({
    trigger: '.showcase-section',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
    onUpdate: (self) => {
      sweaterGroup.rotation.y = self.progress * Math.PI * 2;
    }
  });

  document.querySelectorAll('.showcase-item').forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          const color = item.dataset.color;
          gsap.to(sweaterMaterial.color, {
            r: parseInt(color.slice(1, 3), 16) / 255,
            g: parseInt(color.slice(3, 5), 16) / 255,
            b: parseInt(color.slice(5, 7), 16) / 255,
            duration: 0.5
          });
        }
      }
    });

    gsap.set(item, { opacity: 0, x: -50 });
  });
}

gsap.utils.toArray('.gallery-item').forEach((item) => {
  const speed = item.dataset.speed || 1;

  gsap.to(item, {
    y: -100 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: item,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });

  ScrollTrigger.create({
    trigger: item,
    start: 'top 80%',
    onEnter: () => {
      gsap.to(item.querySelector('img'), {
        filter: 'grayscale(0) blur(0)',
        scale: 1,
        duration: 1,
        ease: 'power3.out'
      });
    }
  });

  gsap.set(item.querySelector('img'), { filter: 'grayscale(0.8) blur(5px)', scale: 0.9 });
});

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    });
  });
});

document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const productId = btn.dataset.product;
    const card = btn.closest('.product-card');
    const productName = card.querySelector('.product-name').textContent;
    const productPrice = card.querySelector('.product-price').textContent;
    const productImage = card.querySelector('.product-image img').src;

    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1
    });

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    gsap.to(btn, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(167, 97, 255, 0.8)';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '10000';
    document.body.appendChild(ripple);

    gsap.to(ripple, {
      width: 300,
      height: 300,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => ripple.remove()
    });
  });
});

function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = cart.length;

    gsap.fromTo(countEl,
      { scale: 1.5 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );
  }
}

document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('.newsletter-input');
  const btn = e.target.querySelector('.btn-primary');

  gsap.to(btn, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      input.value = '';
      btn.textContent = 'Subscribed!';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
      }, 2000);
    }
  });
});

document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
  if (btn.textContent.includes('Shop Now')) {
    btn.addEventListener('click', () => {
      window.location.href = 'products.html';
    });
  } else if (btn.textContent.includes('Explore Products')) {
    btn.addEventListener('click', () => {
      document.querySelector('.featured-section').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }
});
