document.addEventListener('DOMContentLoaded', function() {
  // MOBILE MENU TOGGLE
  const menuIcon = document.querySelector('.menu-icon');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMobileNav = document.querySelector('.close-mobile-nav');

  if (menuIcon && mobileNav) {
    menuIcon.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      mobileNav.classList.add('active');
    });
  } else {
    console.error("Menu icon or mobile nav not found.");
  }

  if (closeMobileNav && mobileNav) {
    closeMobileNav.addEventListener('click', function() {
      mobileNav.classList.remove('active');
    });
  }

  // Close mobile nav when clicking outside
  document.addEventListener('click', function(e) {
    if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !menuIcon.contains(e.target)) {
      mobileNav.classList.remove('active');
    }
  });
  // CART SYSTEM
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartIcon = document.querySelector('.cart-icon');
  const cartPanel = document.querySelector('.cart-panel');
  const cartOverlay = document.querySelector('.cart-overlay');
  const closeCartBtn = document.querySelector('.close-cart');
  const cartItemsEl = document.querySelector('.cart-items');
  const cartSubtotalEl = document.querySelector('.cart-subtotal');
  const cartCountEl = document.querySelector('.cart-count');
  const checkoutBtn = document.querySelector('.checkout-btn');

  updateCart();

  cartIcon.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
      let quantityValue = 1;
      const quantitySpan = this.previousElementSibling && this.previousElementSibling.querySelector('.quantity');
      if (quantitySpan) {
        quantityValue = parseInt(quantitySpan.textContent) || 1;
      }
      const product = {
        name: this.dataset.product,
        price: parseFloat(this.dataset.price),
        image: this.dataset.image,
        quantity: quantityValue
      };
      const existingItem = cart.find(item => item.name === product.name);
      if (existingItem) {
        existingItem.quantity += product.quantity;
      } else {
        cart.push(product);
      }
      updateCart();
      showNotification(`${product.name} added to cart`);
    });
  });

  function openCart() {
    cartPanel.classList.add('active');
    cartOverlay.classList.add('active');
    renderCartItems();
  }

  function closeCart() {
    cartPanel.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  function renderCartItems() {
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }
    cart.forEach((item, index) => {
      const cartItemEl = document.createElement('div');
      cartItemEl.className = 'cart-item';
      cartItemEl.innerHTML = `
        <img src="assets/images/${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <p class="cart-item-price">Rs ${item.price.toLocaleString()}</p>
          <div class="cart-item-actions">
            <div class="quantity-adjuster">
              <button class="quantity-btn minus" data-index="${index}">-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(cartItemEl);
    });
    attachCartEventListeners();
  }

  function attachCartEventListeners() {
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }
        updateCart();
        renderCartItems();
      });
    });
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        cart[index].quantity++;
        updateCart();
        renderCartItems();
      });
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = this.dataset.index;
        cart.splice(index, 1);
        updateCart();
        renderCartItems();
      });
    });
  }

  function updateCart() {
    let subtotal = 0;
    let itemCount = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      itemCount += item.quantity;
    });
    cartSubtotalEl.textContent = `Rs ${subtotal.toLocaleString()}`;
    cartCountEl.textContent = itemCount;
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'error');
      return;
    }
    document.getElementById('checkout-modal').classList.add('active');
  });

  // Checkout Modal close
  const closeCheckout = document.querySelector('.close-checkout');
  if (closeCheckout) {
    closeCheckout.addEventListener('click', function() {
      document.getElementById('checkout-modal').classList.remove('active');
    });
  }

  // Handle Checkout Form submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Clear the cart and notify the user
      cart = [];
      updateCart();
      renderCartItems();
      document.getElementById('checkout-modal').classList.remove('active');
      showNotification('Order submitted successfully!');
    });
  }

  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = type === 'error' ? 'var(--red)' : 'var(--gold)';
    notification.style.color = 'var(--black)';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1200';
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
});
