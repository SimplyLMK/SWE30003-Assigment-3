const products = [{ 
    id: 1, 
    name: 'Gaming Laptop Pro', 
    category: 'computers', 
    price: 1299.99, 
    icon: '💻', 
    stock: 15 
},{ 
    id: 2, 
    name: 'Wireless Headphones', 
    category: 'audio', 
    price: 199.99, 
    icon: '🎧', 
    stock: 32 
},{ 
    id: 3, 
    name: 'Smartphone X', 
    category: 'phones', 
    price: 899.99, 
    icon: '📱', 
    stock: 0 
},{ 
    id: 4, 
    name: 'Gaming Console', 
    category: 'gaming', 
    price: 549.99, 
    icon: '🎮', 
    stock: 8 
},{ 
    id: 5, 
    name: '4K Monitor', 
    category: 'computers', 
    price: 449.99, 
    icon: '🖥️', 
    stock: 12 
},{ 
    id: 6, 
    name: 'Bluetooth Speaker', 
    category: 'audio', 
    price: 79.99, 
    icon: '🔊', 
    stock: 45 
},{ 
    id: 7, 
    name: 'Tablet Pro', 
    category: 'computers', 
    price: 699.99, 
    icon: '📱', 
    stock: 20 
},{ 
    id: 8, 
    name: 'Gaming Mouse', 
    category: 'gaming', 
    price: 89.99, 
    icon: '🖱️', 
    stock: 50 
},{ 
    id: 9, 
    name: 'Smart Watch', 
    category: 'phones', 
    price: 299.99, 
    icon: '⌚', 
    stock: 18 
},{ 
    id: 10, 
    name: 'Mechanical Keyboard', 
    category: 'gaming', 
    price: 149.99, 
    icon: '⌨️', 
    stock: 25 
},{ 
    id: 11, 
    name: 'Noise Cancelling Earbuds', 
    category: 'audio', 
    price: 249.99, 
    icon: '🎵', 
    stock: 30 
},{ 
    id: 12, 
    name: 'External SSD 1TB', 
    category: 'computers',
    price: 179.99, 
    icon: '💾', 
    stock: 40 
}];

// State management
let cart = [];
let currentUser = null;
let orders = [];
let isRegisterMode = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts('all');
    updateCartUI();
    checkLoginStatus();
});

// Load products
function loadProducts(category) {
    const grid = document.getElementById('productsGrid');
    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    grid.innerHTML = filteredProducts.map(product => `
                <div class="product-card fade-in">
                    <div class="product-image">${product.icon}</div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-category">${product.category}</p>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <div class="product-actions">
                            ${product.stock > 0
            ? `<button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>`
            : `<button class="btn-add-cart" disabled style="background: #ccc;">Out of Stock</button>`
        }
                            <button class="btn-view" onclick="viewProduct(${product.id})">View</button>
                        </div>
                    </div>
                </div>
            `).join('');
}

// Filter products
function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    loadProducts(category);
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert('Cannot add more items. Stock limit reached.');
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showNotification('Product added to cart!');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.icon}</div>
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <button onclick="removeFromCart(${item.id})" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                    </div>
                `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);

    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0 && newQuantity <= product.stock) {
            item.quantity = newQuantity;
        } else if (newQuantity > product.stock) {
            alert('Cannot add more items. Stock limit reached.');
        } else if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }
        updateCartUI();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');

    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// View product details
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    const mainContent = document.getElementById('mainContent');
    const productDetail = document.getElementById('productDetail');
    const productDetailContent = document.getElementById('productDetailContent');

    productDetailContent.innerHTML = `
                <div class="product-detail-image">${product.icon}</div>
                <div>
                    <h1>${product.name}</h1>
                    <p class="product-detail-category">${product.category}</p>
                    <span class="stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
                    </span>
                    <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                    <p class="product-detail-description">
                        Experience premium quality with the ${product.name}. This product features advanced technology, 
                        superior build quality, and exceptional performance. Perfect for both professionals and enthusiasts 
                        looking for reliable electronics that deliver outstanding results.
                    </p>
                    <div class="product-detail-actions">
                        ${product.stock > 0 ? `
                            <div class="quantity-selector">
                                <button onclick="updateDetailQuantity(-1)">-</button>
                                <span id="detailQuantity">1</span>
                                <button onclick="updateDetailQuantity(1)">+</button>
                            </div>
                            <button class="btn-primary" onclick="addToCartFromDetail(${product.id})">Add to Cart</button>
                        ` : `
                            <button class="btn-primary" disabled style="background: #ccc;">Out of Stock</button>
                        `}
                    </div>
                </div>
            `;

    mainContent.style.display = 'none';
    productDetail.classList.add('active');
    window.scrollTo(0, 0);
}

// Update detail quantity
function updateDetailQuantity(change) {
    const quantitySpan = document.getElementById('detailQuantity');
    const currentQuantity = parseInt(quantitySpan.textContent);
    const newQuantity = currentQuantity + change;

    if (newQuantity >= 1 && newQuantity <= 10) {
        quantitySpan.textContent = newQuantity;
    }
}

// Add to cart from detail
function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('detailQuantity').textContent);
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        if (cartItem.quantity + quantity <= product.stock) {
            cartItem.quantity += quantity;
        } else {
            alert(`Cannot add ${quantity} items. Only ${product.stock - cartItem.quantity} available.`);
            return;
        }
    } else {
        cart.push({ ...product, quantity });
    }

    updateCartUI();
    showNotification(`${quantity} item(s) added to cart!`);
    showHome();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: 15px 25px;
                border-radius: 5px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                z-index: 3000;
                animation: slideIn 0.3s ease-out;
            `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show/hide modals
function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showCheckoutModal() {
    if (!currentUser) {
        alert('Please login to checkout');
        showLoginModal();
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    toggleCart();
    document.getElementById('checkoutModal').classList.add('active');
}

// Toggle between login and register
function toggleAuthMode() {
    isRegisterMode = !isRegisterMode;
    const modalTitle = document.getElementById('modalTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const authToggleText = document.getElementById('authToggleText');
    const authToggleLink = document.getElementById('authToggleLink');
    const nameGroup = document.getElementById('nameGroup');
    const phoneGroup = document.getElementById('phoneGroup');

    if (isRegisterMode) {
        modalTitle.textContent = 'Register';
        authSubmitBtn.textContent = 'Register';
        authToggleText.textContent = 'Already have an account?';
        authToggleLink.textContent = 'Login';
        nameGroup.style.display = 'block';
        phoneGroup.style.display = 'block';
    } else {
        modalTitle.textContent = 'Login';
        authSubmitBtn.textContent = 'Login';
        authToggleText.textContent = "Don't have an account?";
        authToggleLink.textContent = 'Register';
        nameGroup.style.display = 'none';
        phoneGroup.style.display = 'none';
    }
}

// Handle authentication
function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (isRegisterMode) {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;

        // Simulate registration
        currentUser = { email, name, phone, isAdmin: email === 'admin@awe.com' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Registration successful!');
    } else {
        // Simulate login
        if (email === 'admin@awe.com') {
            currentUser = { email, name: 'Admin User', isAdmin: true };
        } else {
            currentUser = { email, name: 'Customer', isAdmin: false };
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Login successful!');
    }

    updateUserUI();
    closeModal('loginModal');
    document.getElementById('authForm').reset();
}

// Check login status
function checkLoginStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserUI();
    }
}

// Update user UI
function updateUserUI() {
    const welcomeUser = document.getElementById('welcomeUser');
    const loginBtn = document.getElementById('loginBtn');

    if (currentUser) {
        welcomeUser.textContent = `Welcome, ${currentUser.name}!`;
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = logout;
    } else {
        welcomeUser.textContent = 'Welcome to AWE Electronics!';
        loginBtn.textContent = 'Login';
        loginBtn.onclick = showLoginModal;
    }
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    showNotification('Logged out successfully');
    showHome();
}

// Process checkout
function processCheckout(event) {
    event.preventDefault();

    // Create order
    const order = {
        id: 'ORD' + Date.now(),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'processing',
        customer: currentUser.email
    };

    orders.push(order);

    // Update inventory
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    // Clear cart
    cart = [];
    updateCartUI();

    // Close modal and show success
    closeModal('checkoutModal');
    showNotification('Order placed successfully! Order ID: ' + order.id);

    // Redirect to orders
    setTimeout(() => showOrders(), 2000);
}

// Show orders
function showOrders() {
    if (!currentUser) {
        alert('Please login to view your orders');
        showLoginModal();
        return;
    }

    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');
    const orderList = document.getElementById('orderList');

    const userOrders = orders.filter(order => order.customer === currentUser.email);

    if (userOrders.length === 0) {
        orderList.innerHTML = '<p style="text-align: center; padding: 40px; color: #999;">No orders found</p>';
    } else {
        orderList.innerHTML = userOrders.map(order => `
                    <div class="order-item">
                        <div>
                            <div class="order-id">Order #${order.id}</div>
                            <div class="order-date">${order.date}</div>
                        </div>
                        <div>
                            ${order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                        </div>
                        <div style="text-align: right;">
                            <div class="order-status ${order.status}">${order.status}</div>
                            <div class="order-total">$${order.total.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('');
    }

    mainContent.style.display = 'none';
    productDetail.classList.remove('active');
    adminSection.classList.remove('active');
    orderHistory.classList.add('active');
    window.scrollTo(0, 0);
}

// Show home
function showHome() {
    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');

    mainContent.style.display = 'block';
    orderHistory.classList.remove('active');
    productDetail.classList.remove('active');
    adminSection.classList.remove('active');
    window.scrollTo(0, 0);
}

// Show admin
function showAdmin() {
    if (!currentUser || !currentUser.isAdmin) {
        alert('Admin access required');
        return;
    }

    const mainContent = document.getElementById('mainContent');
    const orderHistory = document.getElementById('orderHistory');
    const productDetail = document.getElementById('productDetail');
    const adminSection = document.getElementById('adminSection');

    mainContent.style.display = 'none';
    orderHistory.classList.remove('active');
    productDetail.classList.remove('active');
    adminSection.classList.add('active');

    showAdminTab('overview');
    window.scrollTo(0, 0);
}

// Show admin tab
function showAdminTab(tab) {
    // Update active tab
    document.querySelectorAll('.admin-nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const adminContent = document.getElementById('adminContent');

    switch (tab) {
        case 'overview':
            const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            const totalOrders = orders.length;
            const totalProducts = products.length;
            const lowStock = products.filter(p => p.stock < 10).length;

            adminContent.innerHTML = `
                        <h3>Dashboard Overview</h3>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-number">$${totalRevenue.toFixed(2)}</div>
                                <div class="stat-label">Total Revenue</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${totalOrders}</div>
                                <div class="stat-label">Total Orders</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${totalProducts}</div>
                                <div class="stat-label">Total Products</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${lowStock}</div>
                                <div class="stat-label">Low Stock Items</div>
                            </div>
                        </div>
                        <h3 style="margin-top: 30px;">Recent Orders</h3>
                        <div style="margin-top: 20px;">
                            ${orders.slice(-5).reverse().map(order => `
                                <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 10px;">
                                    <strong>Order #${order.id}</strong> - ${order.date} - $${order.total.toFixed(2)} - Status: ${order.status}
                                </div>
                            `).join('') || '<p>No orders yet</p>'}
                        </div>
                    `;
            break;

        case 'products':
            adminContent.innerHTML = `
                        <h3>Manage Products</h3>
                        <button class="btn-primary" style="margin-bottom: 20px;" onclick="alert('Add Product feature coming soon!')">Add New Product</button>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg-light);">
                                    <th style="padding: 10px; text-align: left;">Product</th>
                                    <th style="padding: 10px; text-align: left;">Category</th>
                                    <th style="padding: 10px; text-align: left;">Price</th>
                                    <th style="padding: 10px; text-align: left;">Stock</th>
                                    <th style="padding: 10px; text-align: left;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${products.map(product => `
                                    <tr style="border-bottom: 1px solid var(--border-color);">
                                        <td style="padding: 10px;">${product.icon} ${product.name}</td>
                                        <td style="padding: 10px;">${product.category}</td>
                                        <td style="padding: 10px;">$${product.price.toFixed(2)}</td>
                                        <td style="padding: 10px;">${product.stock}</td>
                                        <td style="padding: 10px;">
                                            <button onclick="alert('Edit feature coming soon!')" style="margin-right: 5px;">Edit</button>
                                            <button onclick="alert('Delete feature coming soon!')">Delete</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `;
            break;

        case 'inventory':
            adminContent.innerHTML = `
                        <h3>Inventory Management</h3>
                        <div style="margin-bottom: 20px;">
                            <h4>Low Stock Alert (Less than 10 units)</h4>
                            ${products.filter(p => p.stock < 10).map(product => `
                                <div style="padding: 15px; border: 1px solid var(--error-color); background: #fee; border-radius: 5px; margin-bottom: 10px;">
                                    <strong>${product.name}</strong> - Only ${product.stock} units remaining!
                                    <button style="float: right;" onclick="alert('Restock feature coming soon!')">Restock</button>
                                </div>
                            `).join('') || '<p>No low stock items</p>'}
                        </div>
                        <h4>All Products Stock</h4>
                        ${products.map(product => `
                            <div style="padding: 10px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 5px; display: flex; justify-content: space-between;">
                                <span>${product.icon} ${product.name}</span>
                                <span>Stock: ${product.stock}</span>
                            </div>
                        `).join('')}
                    `;
            break;

        case 'reports':
            const monthlyRevenue = orders.reduce((sum, order) => sum + order.total, 0);
            const avgOrderValue = orders.length > 0 ? monthlyRevenue / orders.length : 0;

            adminContent.innerHTML = `
                        <h3>Sales Reports</h3>
                        <div class="stats-grid" style="margin-bottom: 30px;">
                            <div class="stat-card">
                                <div class="stat-number">$${monthlyRevenue.toFixed(2)}</div>
                                <div class="stat-label">Monthly Revenue</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">$${avgOrderValue.toFixed(2)}</div>
                                <div class="stat-label">Average Order Value</div>
                            </div>
                        </div>
                        <h4>Sales by Category</h4>
                        <div style="margin-top: 20px;">
                            ${['computers', 'phones', 'audio', 'gaming'].map(category => {
                const categoryProducts = products.filter(p => p.category === category);
                const categorySales = orders.reduce((sum, order) => {
                    return sum + order.items
                        .filter(item => categoryProducts.find(p => p.id === item.id))
                        .reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
                }, 0);

                return `
                                    <div style="padding: 10px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 5px;">
                                        <strong>${category.charAt(0).toUpperCase() + category.slice(1)}</strong>: $${categorySales.toFixed(2)}
                                    </div>
                                `;
            }).join('')}
                        </div>
                        <button class="btn-primary" style="margin-top: 20px;" onclick="alert('Export to CSV feature coming soon!')">Export Report</button>
                    `;
            break;
    }
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS animation keyframes
const style = document.createElement('style');
style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);