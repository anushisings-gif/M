gsap.registerPlugin(ScrollTrigger);

let cursor = document.getElementById('cursor');
let cursorGlow = document.getElementById('cursor-glow');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let allProducts = [];

updateCartCount();

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorGlow.style.left = (e.clientX - 20) + 'px';
  cursorGlow.style.top = (e.clientY - 20) + 'px';
});

gsap.to('.page-title', {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power3.out'
});

gsap.to('.page-subtitle', {
  opacity: 1,
  y: 0,
  duration: 0.8,
  delay: 0.2,
  ease: 'power3.out'
});

allProducts = Array.from(document.querySelectorAll('.product-card'));

allProducts.forEach((card, i) => {
  gsap.to(card, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay: i * 0.05,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: card,
      start: 'top 85%'
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

document.querySelectorAll('[data-category]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    filterProducts(category);

    gsap.to(btn, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  });
});

document.querySelectorAll('[data-sort]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-sort]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const sortBy = btn.dataset.sort;
    sortProducts(sortBy);
  });
});

const priceMin = document.getElementById('price-min');
const priceMax = document.getElementById('price-max');
const priceValue = document.getElementById('price-value');

function updatePriceRange() {
  const min = parseInt(priceMin.value);
  const max = parseInt(priceMax.value);

  if (min > max) {
    priceMin.value = max;
  }

  if (max < min) {
    priceMax.value = min;
  }

  priceValue.textContent = `${priceMin.value} - ${priceMax.value}`;
  filterByPrice(parseInt(priceMin.value), parseInt(priceMax.value));
}

priceMin.addEventListener('input', updatePriceRange);
priceMax.addEventListener('input', updatePriceRange);

function filterProducts(category) {
  allProducts.forEach(card => {
    const cardCategory = card.dataset.category;

    if (category === 'all' || cardCategory === category) {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        display: 'block',
        onComplete: () => {
          card.style.display = 'block';
        }
      });
    } else {
      gsap.to(card, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        onComplete: () => {
          card.style.display = 'none';
        }
      });
    }
  });

  updateProductCount();
}

function sortProducts(sortBy) {
  const container = document.getElementById('products-container');
  const products = Array.from(container.querySelectorAll('.product-card'));

  products.sort((a, b) => {
    if (sortBy === 'price-low') {
      return parseInt(a.dataset.price) - parseInt(b.dataset.price);
    } else if (sortBy === 'price-high') {
      return parseInt(b.dataset.price) - parseInt(a.dataset.price);
    } else if (sortBy === 'new') {
      return (b.dataset.new === 'true' ? 1 : 0) - (a.dataset.new === 'true' ? 1 : 0);
    }
    return 0;
  });

  products.forEach((product, i) => {
    gsap.to(product, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      delay: i * 0.02,
      onComplete: () => {
        container.appendChild(product);
        gsap.to(product, {
          opacity: 1,
          y: 0,
          duration: 0.4
        });
      }
    });
  });
}

function filterByPrice(min, max) {
  allProducts.forEach(card => {
    const price = parseInt(card.dataset.price);

    if (price >= min && price <= max) {
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        display: 'block',
        onComplete: () => {
          card.style.display = 'block';
        }
      });
    } else {
      gsap.to(card, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        onComplete: () => {
          card.style.display = 'none';
        }
      });
    }
  });

  updateProductCount();
}

function updateProductCount() {
  setTimeout(() => {
    const visible = allProducts.filter(card => card.style.display !== 'none').length;
    const countEl = document.getElementById('results-count');

    gsap.to(countEl, {
      innerText: visible,
      duration: 0.5,
      snap: { innerText: 1 },
      ease: 'power2.out'
    });
  }, 100);
}

document.querySelectorAll('.btn-add-cart').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const card = btn.closest('.product-card');
    const productName = card.querySelector('.product-name').textContent;
    const productPrice = card.querySelector('.product-price').textContent;
    const productImage = card.querySelector('.product-image img').src;

    cart.push({
      id: Date.now(),
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
      repeat: 1
    });

    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
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

const modal = document.getElementById('quick-view-modal');
const modalOverlay = modal.querySelector('.modal-overlay');
const modalClose = modal.querySelector('.modal-close');

document.querySelectorAll('.quick-view').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const card = btn.closest('.product-card');
    const img = card.querySelector('.product-image img').src;
    const name = card.querySelector('.product-name').textContent;
    const desc = card.querySelector('.product-desc').textContent;
    const price = card.querySelector('.product-price').textContent;

    document.getElementById('modal-img').src = img;
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('modal-price').textContent = price;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  gsap.to(modal.querySelector('.modal-content'), {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    onComplete: () => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.querySelectorAll('.color-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');

    gsap.to(opt, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  });
});

document.querySelectorAll('.size-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');

    gsap.to(opt, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });
  });
});

document.querySelector('.btn-add-modal')?.addEventListener('click', () => {
  const name = document.getElementById('modal-name').textContent;
  const price = document.getElementById('modal-price').textContent;
  const img = document.getElementById('modal-img').src;

  cart.push({
    id: Date.now(),
    name: name,
    price: price,
    image: img,
    quantity: 1
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();

  gsap.to('.btn-add-modal', {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  });

  setTimeout(closeModal, 500);
});
