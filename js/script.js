document.addEventListener('DOMContentLoaded', function() {
    console.log('Rumi Saffron loaded!');
    
    // Cart Logic
    let cart = [];
    
    // DOM Elements
    const cartModal = document.querySelector('.cart-modal');
    const cartOverlay = document.querySelector('.cart-modal-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartIcon = document.querySelector('.cart-icon');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.querySelector('.checkout-modal');
    const closeCheckoutBtn = document.querySelector('.close-checkout');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const quantityButtons = document.querySelectorAll('.quantity-btn');

    // Add to Cart Functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.getAttribute('data-product');
            const price = parseFloat(this.getAttribute('data-price'));
            const quantity = parseInt(this.closest('.product-item').querySelector('.quantity').textContent);
            
            // Check if item already exists in cart
            const existingItem = cart.find(item => item.product === product);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ product, price, quantity });
            }
            
            updateCart();
            showCartNotification(product);
        });
    });

    // Quantity Selectors
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quantityElement = this.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantityElement.textContent);
            
            if (this.classList.contains('minus') && quantity > 1) {
                quantity--;
            } else if (this.classList.contains('plus')) {
                quantity++;
            }
            
            quantityElement.textContent = quantity;
        });
    });

    // Cart Modal Controls
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckoutBtn.addEventListener('click', closeCheckout);

    // Cart Functions
    function openCart() {
        cartModal.classList.add('active');
        cartOverlay.classList.add('active');
        renderCartItems();
    }

    function closeCart() {
        cartModal.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    function openCheckout() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        checkoutModal.classList.add('active');
        document.getElementById('final-total').textContent = 
            document.getElementById('modal-cart-total').textContent;
    }

    function closeCheckout() {
        checkoutModal.classList.remove('active');
    }

    function renderCartItems() {
        const cartBody = document.querySelector('.cart-modal-body');
        cartBody.innerHTML = '';
        
        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            return;
        }
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="assets/images/${item.product.toLowerCase().replace(/\s+/g, '-')}.jpg" alt="${item.product}">
                <div class="cart-item-details">
                    <p class="cart-item-title">${item.product}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-item-remove" data-index="${index}">−</button>
                </div>
            `;
            cartBody.appendChild(cartItem);
        });

        // Add remove item functionality
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                cart.splice(index, 1);
                updateCart();
                renderCartItems();
                
                // Close cart if empty
                if (cart.length === 0) {
                    closeCart();
                }
            });
        });
    }

    function updateCart() {
        const cartCount = document.querySelector('.cart-count');
        const cartTotalAmount = document.getElementById('cart-total-amount');
        const modalCartTotal = document.getElementById('modal-cart-total');
        
        let total = 0;
        let itemCount = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            itemCount += item.quantity;
        });
        
        cartCount.textContent = itemCount;
        cartTotalAmount.textContent = total.toFixed(2);
        if (modalCartTotal) {
            modalCartTotal.textContent = total.toFixed(2);
        }
    }

    function showCartNotification(product) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <p>Added ${product} to cart</p>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Form Submission
    document.querySelector('.checkout-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Order placed successfully! Redirecting to payment...');
        // Reset cart
        cart = [];
        updateCart();
        renderCartItems();
        closeCheckout();
        closeCart();
    });
});