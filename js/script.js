document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const menuIcon = document.querySelector('.menu-icon');
  const mobileNav = document.querySelector('.mobile-nav');
  const closeMobileNav = document.querySelector('.close-mobile-nav');

  if (menuIcon && mobileNav) {
    menuIcon.addEventListener('click', function(e) {
      e.stopPropagation();
      mobileNav.classList.add('active');
    });
  }

  if (closeMobileNav && mobileNav) {
    closeMobileNav.addEventListener('click', function() {
      mobileNav.classList.remove('active');
    });
  }

  document.addEventListener('click', function(e) {
    if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !menuIcon.contains(e.target)) {
      mobileNav.classList.remove('active');
    }
  });

  // Cart System
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
      const product = {
        name: this.dataset.product,
        price: parseFloat(this.dataset.price),
        image: this.dataset.image,
        quantity: 1
      };
      const existingItem = cart.find(item => item.name === product.name);
      if (existingItem) {
        existingItem.quantity += 1;
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
        <img src="asssets/images/${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <p class="cart-item-price">Rs ${(item.price * item.quantity).toLocaleString()}</p>
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

  // Checkout Modal
  checkoutBtn.addEventListener('click', function() {
    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'error');
      return;
    }
    document.getElementById('checkoutModal').classList.add('active');
  });

  const closeCheckout = document.querySelector('.close-checkout');
  if (closeCheckout) {
    closeCheckout.addEventListener('click', function() {
      document.getElementById('checkoutModal').classList.remove('active');
    });
  }

  // Form Submission
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      const cartDataInput = document.getElementById('cart-data');
      cartDataInput.value = formatCartForEmail(cart);
      // Form submits naturally to Formspree
      setTimeout(() => {
        cart = [];
        updateCart();
        renderCartItems();
        document.getElementById('checkoutModal').classList.remove('active');
        showNotification('Order submitted successfully!');
      }, 500); // Delay to allow submission
    });
  }

  function formatCartForEmail(cart) {
    let items = cart.map(item => `${item.name} x ${item.quantity} - Rs ${item.price * item.quantity}`);
    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return `Items:\n${items.join('\n')}\nTotal: Rs ${total}`;
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
    }, 1000);
  }
});

// Toggle Payment Options
function togglePaymentOptions() {
  const onlineOptions = document.getElementById('online-payment-options');
  const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
  onlineOptions.style.display = selectedMethod === 'online' ? 'block' : 'none';
}


document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".product-item").forEach((item) => {
    const minusBtn = item.querySelector(".quantity-btn.minus");
    const plusBtn = item.querySelector(".quantity-btn.plus");
    const quantitySpan = item.querySelector(".quantity");

    minusBtn.addEventListener("click", function () {
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;
      }
    });

    plusBtn.addEventListener("click", function () {
      let quantity = parseInt(quantitySpan.textContent);
      quantity++;
      quantitySpan.textContent = quantity;
    });
  });
});







// CHAT IMPLEMENTATION
document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot');
  const chatSend = document.getElementById('chat-send');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  // Make sure all elements exist before proceeding
  if (!chatbotToggle || !chatbotWindow || !chatSend || !chatInput || !chatMessages) {
    console.error('Chat elements not found');
    return;
  }

  // Initialize with first message
  if (chatMessages.innerHTML === '') {
    chatMessages.innerHTML = "<p><strong>Rumi:</strong> Greetings! I'm Rumi, your expert assistant. How can I help you with our premium saffron and honey products?</p>";
  }

  chatbotToggle.addEventListener('click', function() {
    chatbotWindow.style.display = chatbotWindow.style.display === 'none' ? 'block' : 'none';
  });

  async function sendMessage() {
    try {
      const userMessage = chatInput.value.trim();
      if (!userMessage) return;

      // Add user message
      chatMessages.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
      
      // Create loading indicator
      const loadingElem = document.createElement('p');
      loadingElem.className = 'loading';
      loadingElem.textContent = 'Loading...';
      chatMessages.appendChild(loadingElem);
      
      // Clear input and scroll to bottom
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Check if window.getChatbotResponse exists
      if (typeof window.getChatbotResponse === 'function') {
        const botResponse = await window.getChatbotResponse(userMessage);
        loadingElem.remove();
        chatMessages.innerHTML += `<p><strong>Rumi:</strong> ${botResponse}</p>`;
      } else {
        loadingElem.remove();
        chatMessages.innerHTML += `<p><strong>Rumi:</strong> Sorry, the chatbot service is not available right now.</p>`;
        console.error('getChatbotResponse function not found');
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      const loadingElem = document.querySelector('.loading');
      if (loadingElem) loadingElem.remove();
      chatMessages.innerHTML += `<p><strong>Rumi:</strong> Sorry, something went wrong with my response.</p>`;
    } finally {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  chatSend.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});