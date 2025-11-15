gsap.registerPlugin(ScrollTrigger);

let cursor = document.getElementById('cursor');
let cursorGlow = document.getElementById('cursor-glow');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let quantity = 1;

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorGlow.style.left = (e.clientX - 20) + 'px';
  cursorGlow.style.top = (e.clientY - 20) + 'px';
});

updateCartCount();

function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = cart.length;
  }
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

const canvas = document.getElementById('product-canvas');
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
canvas.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(6, 3, 10);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x000000,
  metalness: 0.3,
  roughness: 0.4,
  clearcoat: 1.0,
  clearcoatRoughness: 0.2
});
const shoe = new THREE.Mesh(geometry, material);
scene.add(shoe);

const light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(5, 5, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0xA761FF, 1.5);
light2.position.set(-5, 3, 5);
scene.add(light2);

const light3 = new THREE.PointLight(0x00C8FF, 1.5);
light3.position.set(5, -3, 5);
scene.add(light3);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

camera.position.z = 15;

let isDragging = false;
let previousMouseX = 0;
let targetRotationY = 0;
let currentRotationY = 0;

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousMouseX = e.clientX;
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousMouseX;
    targetRotationY += deltaX * 0.01;
    previousMouseX = e.clientX;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});

function animate() {
  requestAnimationFrame(animate);

  if (!isDragging) {
    targetRotationY += 0.005;
  }

  currentRotationY += (targetRotationY - currentRotationY) * 0.1;
  shoe.rotation.y = currentRotationY;
  shoe.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;

  light2.position.x = Math.sin(Date.now() * 0.001) * 8;
  light3.position.x = Math.cos(Date.now() * 0.001) * 8;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

gsap.to('.product-detail-info', {
  opacity: 1,
  x: 0,
  duration: 1,
  delay: 0.3,
  ease: 'power3.out'
});

document.querySelectorAll('.color-option').forEach(option => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    option.classList.add('selected');

    const colorMap = {
      black: 0x000000,
      purple: 0xA761FF,
      blue: 0x00C8FF,
      pink: 0xFF6B9D
    };

    const selectedColor = option.dataset.color;
    gsap.to(material.color, {
      r: ((colorMap[selectedColor] >> 16) & 255) / 255,
      g: ((colorMap[selectedColor] >> 8) & 255) / 255,
      b: (colorMap[selectedColor] & 255) / 255,
      duration: 0.5
    });

    gsap.to(option, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  });
});

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    gsap.to(btn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  });
});

document.getElementById('qty-plus')?.addEventListener('click', () => {
  quantity++;
  document.getElementById('qty-value').textContent = quantity;

  gsap.to('#qty-plus', {
    scale: 0.8,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  });
});

document.getElementById('qty-minus')?.addEventListener('click', () => {
  if (quantity > 1) {
    quantity--;
    document.getElementById('qty-value').textContent = quantity;

    gsap.to('#qty-minus', {
      scale: 0.8,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  }
});

document.getElementById('add-to-cart')?.addEventListener('click', () => {
  const product = {
    id: Date.now(),
    name: 'Neon Runner X1',
    price: '₹4,999',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
    quantity: quantity
  };

  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  gsap.to('#add-to-cart', {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  });

  gsap.to('.cart-count', {
    scale: 1.5,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: 'back.out(2)'
  });
});

document.getElementById('buy-now')?.addEventListener('click', () => {
  const product = {
    id: Date.now(),
    name: 'Neon Runner X1',
    price: '₹4,999',
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80',
    quantity: quantity
  };

  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));

  gsap.to('#buy-now', {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      window.location.href = 'checkout.html';
    }
  });
});

gsap.utils.toArray('.detail-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: i * 0.1,
    scrollTrigger: {
      trigger: card,
      start: 'top 80%'
    }
  });
});

gsap.utils.toArray('.review-card').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: i * 0.1,
    scrollTrigger: {
      trigger: card,
      start: 'top 80%'
    }
  });
});

gsap.utils.toArray('.product-card-small').forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: i * 0.1,
    scrollTrigger: {
      trigger: card,
      start: 'top 80%'
    }
  });
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
