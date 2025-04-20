// Sample product data
const products = [
    {
      id: 1,
      name: "Notebook Set (5 Pack)",
      description: "Set of 5 ruled notebooks, 200 pages each",
      price: 250,
      image: "js/image/books.png"
    },
    
    {
      id: 3,
      name: "Ballpoint Pens (10 Pack)",
      description: "Smooth writing blue ink pens",
      price: 120,
      image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?ixlib=rb-4.0.3"
    },
    
  ];
  
  // Cart functionality
  let cart = [];
  const cartIcon = document.getElementById('cartIcon');
  const cartCount = document.getElementById('cartCount');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const overlay = document.getElementById('overlay');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutModal = document.getElementById('checkoutModal');
  const backToCart = document.getElementById('backToCart');
  const confirmPayment = document.getElementById('confirmPayment');
  const thankYouModal = document.getElementById('thankYouModal');
  const closeThankYou = document.getElementById('closeThankYou');
  const productsContainer = document.getElementById('products');
  
  // Render products
  function renderProducts() {
    productsContainer.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product-card';
      productElement.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-price">₹${product.price.toFixed(2)}</div>
          <div class="product-actions">
            <div class="quantity-control">
              <button class="quantity-btn minus" data-id="${product.id}">-</button>
              <input type="number" class="quantity-input" value="1" min="1" data-id="${product.id}">
              <button class="quantity-btn plus" data-id="${product.id}">+</button>
            </div>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `;
      productsContainer.appendChild(productElement);
    });
  }
  
  // Update cart count
  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
  }
  
  // Update cart total
  function updateCartTotal() {
    const total = cart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product.price * item.quantity);
    }, 0);
    cartTotal.textContent = `₹${total.toFixed(2)}`;
  }
  
  // Render cart items
  function renderCartItems() {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
      cartItems.innerHTML = '<p>Your cart is empty</p>';
      return;
    }
  
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="cart-item-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-title">${product.name}</div>
          <div class="cart-item-price">₹${product.price.toFixed(2)}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn minus" data-id="${product.id}">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${product.id}">
            <button class="quantity-btn plus" data-id="${product.id}">+</button>
          </div>
        </div>
        <div class="remove-item" data-id="${product.id}">
          <i class="fas fa-trash"></i>
        </div>
      `;
      cartItems.appendChild(cartItemElement);
    });
  }
  
  // Add to cart
  function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }
    updateCartCount();
    renderCartItems();
    updateCartTotal();
  }
  
  // Remove from cart
  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCartItems();
    updateCartTotal();
  }
  
  // Update quantity in cart
  function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = parseInt(newQuantity);
      if (item.quantity < 1) {
        removeFromCart(productId);
      }
    }
    updateCartCount();
    updateCartTotal();
  }
  
  // Event listeners
  document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
  
    // Toggle cart modal
    cartIcon.addEventListener('click', () => {
      cartModal.classList.add('open');
      overlay.classList.add('active');
    });
  
    closeCart.addEventListener('click', () => {
      cartModal.classList.remove('open');
      overlay.classList.remove('active');
    });
  
    overlay.addEventListener('click', () => {
      cartModal.classList.remove('open');
      overlay.classList.remove('active');
    });
  
    // Product quantity controls
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('plus')) {
        const productId = parseInt(e.target.dataset.id);
        const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        input.value = parseInt(input.value) + 1;
      }
  
      if (e.target.classList.contains('minus')) {
        const productId = parseInt(e.target.dataset.id);
        const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        if (parseInt(input.value) > 1) {
          input.value = parseInt(input.value) - 1;
        }
      }
  
      if (e.target.classList.contains('add-to-cart')) {
        const productId = parseInt(e.target.dataset.id);
        const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
        addToCart(productId, parseInt(input.value));
      }
    });
  
    // Cart item controls
    cartItems.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
        const productId = parseInt(e.target.dataset.id || e.target.closest('.remove-item').dataset.id);
        removeFromCart(productId);
      }
  
      if (e.target.classList.contains('plus')) {
        const productId = parseInt(e.target.dataset.id);
        const input = e.target.parentElement.querySelector('.quantity-input');
        input.value = parseInt(input.value) + 1;
        updateQuantity(productId, input.value);
      }
  
      if (e.target.classList.contains('minus')) {
        const productId = parseInt(e.target.dataset.id);
        const input = e.target.parentElement.querySelector('.quantity-input');
        if (parseInt(input.value) > 1) {
          input.value = parseInt(input.value) - 1;
          updateQuantity(productId, input.value);
        }
      }
    });
  
    // Quantity input changes
    cartItems.addEventListener('change', (e) => {
      if (e.target.classList.contains('quantity-input')) {
        const productId = parseInt(e.target.dataset.id);
        updateQuantity(productId, e.target.value);
      }
    });
  
    // Checkout process
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      cartModal.classList.remove('open');
      checkoutModal.classList.add('active');
    });
  
    backToCart.addEventListener('click', () => {
      checkoutModal.classList.remove('active');
      cartModal.classList.add('open');
    });
  
    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
      method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
        method.querySelector('input').checked = true;
      });
    });
  
    // Confirm payment
    confirmPayment.addEventListener('click', () => {
      // In a real app, you would process payment here
      checkoutModal.classList.remove('active');
      overlay.classList.remove('active');
      thankYouModal.classList.add('active');
      overlay.classList.add('active');
      
      // Clear cart after successful donation
      cart = [];
      updateCartCount();
      renderCartItems();
      updateCartTotal();
    });
  
    closeThankYou.addEventListener('click', () => {
      thankYouModal.classList.remove('active');
      overlay.classList.remove('active');
    });
  });
