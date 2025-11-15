let cursor = document.getElementById('cursor');
let cursorGlow = document.getElementById('cursor-glow');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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

gsap.set('.page-title', { opacity: 0, y: 50 });
gsap.set('.page-subtitle', { opacity: 0, y: 30 });

function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (countEl) {
    countEl.textContent = cart.length;
  }
}

function renderCart() {
  const cartItemsEl = document.getElementById('cart-items');
  const emptyCartEl = document.getElementById('empty-cart');
  const cartLayout = document.querySelector('.cart-layout');

  if (cart.length === 0) {
    cartLayout.style.display = 'none';
    emptyCartEl.style.display = 'block';

    gsap.from(emptyCartEl, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });
    return;
  }

  cartLayout.style.display = 'grid';
  emptyCartEl.style.display = 'none';
  cartItemsEl.innerHTML = '';

  cart.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price}</div>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control">
          <button class="qty-btn qty-minus" data-index="${index}">−</button>
          <span class="qty-display">${item.quantity || 1}</span>
          <button class="qty-btn qty-plus" data-index="${index}">+</button>
        </div>
        <button class="btn-remove" data-index="${index}">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(itemEl);

    gsap.to(itemEl, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: 'power3.out'
    });
  });

  attachCartEvents();
  updateSummary();
}

function attachCartEvents() {
  document.querySelectorAll('.qty-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      cart[index].quantity = (cart[index].quantity || 1) + 1;
      localStorage.setItem('cart', JSON.stringify(cart));

      gsap.to(btn, {
        scale: 0.8,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });

      renderCart();
    });
  });

  document.querySelectorAll('.qty-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));

        gsap.to(btn, {
          scale: 0.8,
          duration: 0.1,
          yoyo: true,
          repeat: 1
        });

        renderCart();
      }
    });
  });

  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      const itemEl = btn.closest('.cart-item');

      gsap.to(itemEl, {
        opacity: 0,
        x: -100,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          cart.splice(index, 1);
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartCount();
          renderCart();
        }
      });
    });
  });
}

function updateSummary() {
  let subtotal = 0;

  cart.forEach(item => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ''));
    const quantity = item.quantity || 1;
    subtotal += price * quantity;
  });

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const subtotalEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totalEl = document.getElementById('total');

  gsap.to(subtotalEl, {
    innerText: subtotal,
    duration: 0.5,
    snap: { innerText: 1 },
    ease: 'power2.out',
    onUpdate: function() {
      subtotalEl.textContent = '₹' + Math.round(this.targets()[0].innerText).toLocaleString('en-IN');
    }
  });

  gsap.to(taxEl, {
    innerText: tax,
    duration: 0.5,
    snap: { innerText: 1 },
    ease: 'power2.out',
    onUpdate: function() {
      taxEl.textContent = '₹' + Math.round(this.targets()[0].innerText).toLocaleString('en-IN');
    }
  });

  gsap.to(totalEl, {
    innerText: total,
    duration: 0.5,
    snap: { innerText: 1 },
    ease: 'power2.out',
    onUpdate: function() {
      totalEl.textContent = '₹' + Math.round(this.targets()[0].innerText).toLocaleString('en-IN');
    }
  });
}

document.getElementById('checkout-btn')?.addEventListener('click', () => {
  gsap.to('#checkout-btn', {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete: () => {
      window.location.href = 'checkout.html';
    }
  });
});

updateCartCount();
renderCart();
