// Mobile menu toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
  document.getElementById('nav-menu').classList.toggle('show');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
      
      // Close mobile menu if open
      document.getElementById('nav-menu').classList.remove('show');
  });
});

// Form submission
document.getElementById('orderForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form values
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const quantity = document.getElementById('quantity').value;
  const product = document.getElementById('product').value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const location = document.getElementById('location').value;
  const notes = document.getElementById('notes').value;
  
  // Here you would typically send this data to a server
  // For demonstration, we'll just show an alert
  alert(`Thank you for your order, ${fullName}!\n\n` +
        `Product: ${product}\n` +
        `Quantity: ${quantity}\n` +
        `Payment Method: ${paymentMethod}\n\n` +
        `We'll send confirmation details to ${email} and contact you at ${phone}.\n` +
        `Delivery to: ${location}\n\n` +
        (notes ? `Your notes: ${notes}` : ''));
  
  // Reset form
  this.reset();
  
  // Scroll to top
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
});

// Update price when product changes
document.getElementById('product').addEventListener('change', function() {
  const product = this.value;
  let price = '';
  
  if (product === 'Wireless Headphones') {
      price = '$100.99';
  } else if (product === 'Smart Watch Pro') {
      price = '$50.00';
  } else if (product === 'Wireless Earbuds') {
      price = '$30.99';
  }
  
  if (price) {
      alert(`You've selected ${product} for ${price}`);
  }
});

// Chatbot functionality
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotWidget = document.querySelector('.chatbot-widget');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotMessages = document.querySelector('.chatbot-messages');
const chatbotInput = document.querySelector('.chatbot-input input');
const chatbotSend = document.querySelector('.chatbot-send');

chatbotToggle.addEventListener('click', () => {
    chatbotWidget.style.display = 'flex';
});

chatbotClose.addEventListener('click', () => {
    chatbotWidget.style.display = 'none';
});

chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message) {
        addMessage(message, 'user');
        chatbotInput.value = '';
        
        // Simulate bot response after 1 second
        setTimeout(() => {
            const responses = [
                "Thanks for your message! How can I assist you with your honey order?",
                "Our honey products are 100% natural. Would you like recommendations?",
                "For order inquiries, please visit our Products page.",
                "We offer free delivery for orders over GH₵100.",
                "You can pay via MoMo, credit card, or cash on delivery."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
        }, 1000);
    }
}

function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chatbot-message', sender);
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Shopping Cart functionality
const cartToggle = document.querySelector('.cart-toggle');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartClose = document.querySelector('.cart-close');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('#cart-total-amount');
const cartCount = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.btn');

let cart = [];

cartToggle.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

cartClose.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

addToCartButtons.forEach(button => {
    if (button.textContent.includes('Order Now') || button.textContent.includes('Add to Cart')) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('GH₵', '')),
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            addToCart(product);
        });
    }
});

function addToCart(product) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }
    
    updateCart();
    showCartNotification(product.name);
}

function updateCart() {
    // Update cart items display
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">GH₵${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">Qty: ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total and count
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            cart.splice(index, 1);
            updateCart();
        });
    });
}

function showCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${productName} added to cart!
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Cart functionality
const cartIcon = document.querySelector('.cart-icon');
const cartDropdown = document.querySelector('.cart-dropdown');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('#cart-total');
const cartCountElement = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');

// Remove the duplicate declaration
cart = JSON.parse(localStorage.getItem('cart')) || [];

// Toggle cart dropdown
cartIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle('active');
    updateCartDisplay();
});

// Close cart when clicking outside
document.addEventListener('click', (e) => {
    if (!cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
        cartDropdown.classList.remove('active');
    }
});

// Add to cart functionality
document.querySelectorAll('.btn').forEach(button => {
    if (button.textContent.includes('Add to Cart')) {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                name: productCard.querySelector('.product-title').textContent,
                price: parseFloat(productCard.querySelector('.product-price').textContent.replace(/[^0-9.]/g, '')),
                image: productCard.querySelector('img').src,
                quantity: 1
            };
            
            addToCart(product);
            
            // Visual feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '#e67e22';
            }, 2000);
        });
    }
});

function addToCart(product) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(product);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartDisplay();
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
    
    // Update cart items display
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">GH₵${(item.price * item.quantity).toFixed(2)}</div>
                <div>Qty: ${item.quantity}</div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Update total price
    cartTotalElement.textContent = totalPrice.toFixed(2);
    
    // Show/hide checkout button
    checkoutBtn.style.display = cart.length ? 'block' : 'none';
}

// Initialize cart display on page load
updateCartDisplay();

// Checkout button
checkoutBtn.addEventListener('click', () => {
    window.location.href = '#order';
    cartDropdown.classList.remove('active');
});

 // Star Rating Functionality
 const stars = document.querySelectorAll('.star-rating i');
 let currentRating = 0;
 
 stars.forEach(star => {
     star.addEventListener('click', () => {
         const rating = parseInt(star.getAttribute('data-rating'));
         currentRating = rating;
         
         stars.forEach((s, index) => {
             if (index < rating) {
                 s.classList.add('active');
                 s.classList.remove('far');
                 s.classList.add('fas');
             } else {
                 s.classList.remove('active');
                 s.classList.remove('fas');
                 s.classList.add('far');
             }
         });
     });
     
     star.addEventListener('mouseover', () => {
         const rating = parseInt(star.getAttribute('data-rating'));
         
         stars.forEach((s, index) => {
             if (index < rating) {
                 s.classList.add('hover');
             } else {
                 s.classList.remove('hover');
             }
         });
     });
     
     star.addEventListener('mouseout', () => {
         stars.forEach(s => s.classList.remove('hover'));
     });
 });
 
 // Form Submission
 document.getElementById('reviewForm').addEventListener('submit', function(e) {
     e.preventDefault();
     
     if (currentRating === 0) {
         alert('Please select a rating');
         return;
     }
     
     const name = document.getElementById('reviewName').value;
     const review = document.getElementById('reviewText').value;
     
     // Here you would typically send this data to your server
     alert(`Thank you for your review, ${name}!`);
     this.reset();
     
     // Reset stars
     stars.forEach(star => {
         star.classList.remove('fas', 'active');
         star.classList.add('far');
     });
     currentRating = 0;
 });