let cursor = document.getElementById('cursor');
let cursorGlow = document.getElementById('cursor-glow');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentStep = 1;

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

gsap.set('.page-title', { opacity: 0, y: 50 });

document.querySelectorAll('.payment-method').forEach(method => {
  method.addEventListener('click', () => {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
    method.classList.add('active');

    const methodType = method.dataset.method;

    document.querySelectorAll('.payment-details').forEach(detail => {
      detail.style.display = 'none';
    });

    document.getElementById(`${methodType}-details`).style.display = 'block';

    gsap.fromTo(`#${methodType}-details`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4 }
    );
  });
});

document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const nextStep = parseInt(btn.dataset.next);
    goToStep(nextStep);
  });
});

document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    const prevStep = parseInt(btn.dataset.back);
    goToStep(prevStep);
  });
});

function goToStep(step) {
  const currentSection = document.getElementById(`section-${currentStep}`);
  const nextSection = document.getElementById(`section-${step}`);

  gsap.to(currentSection, {
    opacity: 0,
    x: step > currentStep ? -50 : 50,
    duration: 0.3,
    onComplete: () => {
      currentSection.style.display = 'none';
      nextSection.style.display = 'block';

      gsap.fromTo(nextSection,
        { opacity: 0, x: step > currentStep ? 50 : -50 },
        { opacity: 1, x: 0, duration: 0.4 }
      );
    }
  });

  updateProgressBar(step);
  currentStep = step;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar(step) {
  document.querySelectorAll('.progress-step').forEach((stepEl, index) => {
    if (index + 1 < step) {
      stepEl.classList.add('completed');
      stepEl.classList.remove('active');
    } else if (index + 1 === step) {
      stepEl.classList.add('active');
      stepEl.classList.remove('completed');
    } else {
      stepEl.classList.remove('active', 'completed');
    }
  });
}

function renderOrderSummary() {
  const summaryItemsEl = document.getElementById('summary-items');
  summaryItemsEl.innerHTML = '';

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'summary-item';
    itemEl.innerHTML = `
      <div class="summary-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-qty">Qty: ${item.quantity || 1}</div>
        <div class="summary-item-price">${item.price}</div>
      </div>
    `;
    summaryItemsEl.appendChild(itemEl);
  });

  updateSummaryTotals();
}

function updateSummaryTotals() {
  let subtotal = 0;

  cart.forEach(item => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ''));
    const quantity = item.quantity || 1;
    subtotal += price * quantity;
  });

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  document.getElementById('summary-subtotal').textContent = '₹' + subtotal.toLocaleString('en-IN');
  document.getElementById('summary-tax').textContent = '₹' + tax.toLocaleString('en-IN');
  document.getElementById('summary-total').textContent = '₹' + total.toLocaleString('en-IN');
}

document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const orderId = Math.floor(10000 + Math.random() * 90000);
  document.getElementById('order-id').textContent = orderId;

  const modal = document.getElementById('success-modal');
  modal.classList.add('active');

  gsap.to('.btn-place-order', {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1
  });

  localStorage.removeItem('cart');
  cart = [];

  setTimeout(() => {
    gsap.to('.success-animation', {
      scale: 1.1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: 'elastic.out(1, 0.5)'
    });
  }, 600);
});

document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('focus', (e) => {
    gsap.to(e.target, {
      scale: 1.02,
      duration: 0.2
    });
  });

  input.addEventListener('blur', (e) => {
    gsap.to(e.target, {
      scale: 1,
      duration: 0.2
    });
  });

  input.addEventListener('input', (e) => {
    if (e.target.value.length > 0) {
      gsap.to(e.target, {
        borderColor: 'var(--purple)',
        duration: 0.2
      });
    }
  });
});

renderOrderSummary();
