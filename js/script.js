document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuIcon.classList.toggle('active');
        });
    }




    // Cart System
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // DOM Elements
    const cartIcon = document.querySelector('.cart-icon');
    const cartPanel = document.querySelector('.cart-panel');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsEl = document.querySelector('.cart-items');
    const cartSubtotalEl = document.querySelector('.cart-subtotal');
    const cartCountEl = document.querySelector('.cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
  
    // Initialize
    updateCart();
  
    // Event Listeners for Cart Panel
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
  
    // Product Card Quantity Adjustment (for shop page)
    document.querySelectorAll('.product-item').forEach(product => {
      const minusBtn = product.querySelector('.quantity-btn.minus');
      const plusBtn = product.querySelector('.quantity-btn.plus');
      const quantityEl = product.querySelector('.quantity');
  
      if (minusBtn && plusBtn && quantityEl) {
        minusBtn.addEventListener('click', () => {
          let quantity = parseInt(quantityEl.textContent);
          if (quantity > 1) {
            quantityEl.textContent = quantity - 1;
          }
        });
  
        plusBtn.addEventListener('click', () => {
          let quantity = parseInt(quantityEl.textContent);
          quantityEl.textContent = quantity + 1;
        });
      }
    });
  
    // Add to Cart from Product Card
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        // Get quantity from the product card (assumes the quantity selector is right before the button)
        let quantityValue = 1;
        if(this.previousElementSibling) {
          const quantitySpan = this.previousElementSibling.querySelector('.quantity');
          if(quantitySpan) {
            quantityValue = parseInt(quantitySpan.textContent) || 1;
          }
        }
        const product = {
          name: this.dataset.product,
          price: parseFloat(this.dataset.price),
          image: this.dataset.image,
          quantity: quantityValue
        };
  
        // Check if already in cart
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
  
    // Cart Functions
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
          <img src="asssets/images/${item.image}" alt="${item.name}" class="cart-item-img">
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
      // Calculate totals
      let subtotal = 0;
      let itemCount = 0;
      
      cart.forEach(item => {
        subtotal += item.price * item.quantity;
        itemCount += item.quantity;
      });
  
      // Update UI
      cartSubtotalEl.textContent = `Rs ${subtotal.toLocaleString()}`;
      cartCountEl.textContent = itemCount;
  
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    // Checkout
    checkoutBtn.addEventListener('click', function() {
      if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
      }
      window.location.href = 'checkout.html';
    });
  
    // Notification
    function showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
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

const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuIcon.classList.toggle('active');
        });
    }



/*************************************************************************** */



document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuIcon.classList.toggle('active');
        });
    } else {
        console.error("Menu icon or navigation links not found in the DOM.");
    }
});





