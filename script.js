const products = [
  {
    id: 1,
    name: "Ultrabook Z5",
    category: "computers",
    price: 1149.99,
    icon: "🧮",
    stock: 10,
    image: "images/1.jpeg",
  },
  {
    id: 2,
    name: "Surround Sound Bar",
    category: "audio",
    price: 229.99,
    icon: "📢",
    stock: 22,
    image: "images/2.jpeg",
  },
  {
    id: 3,
    name: "Pixel Nova 2",
    category: "phones",
    price: 849.99,
    icon: "📲",
    stock: 14,
    image: "images/3.jpeg",
  },
  {
    id: 4,
    name: "NextGen Console X",
    category: "gaming",
    price: 599.99,
    icon: "🕹️",
    stock: 5,
    image: "images/4.jpeg",
  },
  {
    id: 5,
    name: "Curved UHD Monitor",
    category: "computers",
    price: 479.99,
    icon: "🖲️",
    stock: 9,
    image: "images/5.jpeg",
  },
  {
    id: 6,
    name: "Portable Bass Cube",
    category: "audio",
    price: 69.99,
    icon: "📻",
    stock: 35,
    image: "images/6.jpeg",
  },
  {
    id: 7,
    name: "EdgeTab 11",
    category: "computers",
    price: 629.99,
    icon: "📝",
    stock: 17,
    image: "images/7.jpeg",
  },
  {
    id: 8,
    name: "Precision Gaming Mouse",
    category: "gaming",
    price: 99.99,
    icon: "🖲️",
    stock: 40,
    image: "images/8.jpeg",
  },
  {
    id: 9,
    name: "Fitness Tracker FitX",
    category: "phones",
    price: 259.99,
    icon: "⏱️",
    stock: 13,
    image: "images/9.jpeg",
  },
  {
    id: 10,
    name: "RGB Mechanical Keys",
    category: "gaming",
    price: 139.99,
    icon: "🎮",
    stock: 28,
    image: "images/10.jpeg",
  },
  {
    id: 11,
    name: "True Wireless Pods",
    category: "audio",
    price: 189.99,
    icon: "🎧",
    stock: 33,
    image: "images/11.jpeg",
  },
  {
    id: 12,
    name: "NVMe SSD 2TB",
    category: "computers",
    price: 219.99,
    icon: "🗃️",
    stock: 27,
    image: "images/12.jpeg",
  },
  {
    id: 13,
    name: "AI Assistant Speaker",
    category: "audio",
    price: 129.99,
    icon: "🗣️",
    stock: 20,
    image: "images/13.jpeg",
  },
  {
    id: 14,
    name: "Workstation Tower X",
    category: "computers",
    price: 1599.99,
    icon: "🖧",
    stock: 6,
    image: "images/14.jpeg",
  },
  {
    id: 15,
    name: "VR Headset VisionX",
    category: "gaming",
    price: 499.99,
    icon: "🥽",
    stock: 10,
    image: "images/15.jpeg",
  }
];



// State management
let cart = [];
let currentUser = null;
let orders = [];
let isRegisterMode = false;

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  load_products("all");
  update_cart_UI();
  check_login_status();
});

// Load products
function load_products(category) {
  const grid = document.getElementById("productsGrid");
  let filteredProducts =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  // Sort: favorites first
  filteredProducts.sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    return bFav - aFav;
  });

  grid.innerHTML = filteredProducts
    .map(
      (product) => `
            <div class="product-card fade-in">

              <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-thumbnail" />
              </div>

              <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-category">${product.category}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                  <button onclick="toggleFavorite(${product.id})">
                    ${favorites.includes(product.id) ? "⭐" : "☆"}
                  </button>
                  ${
                    product.stock > 0
                      ? `<button class="btn-add-cart" onclick="add_to_cart(${product.id})">Add to Cart</button>`
                      : `<button class="btn-add-cart" disabled style="background: #ccc;">Out of Stock</button>`
                  }
                  <button class="btn-view" onclick="view_products(${
                    product.id
                  })">View</button>
                </div>
              </div>
            </div>
          `
    )
    .join("");
}

// Filter products
function filter_products(category) {
  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  load_products(category);
}

// Add to cart
function add_to_cart(productId) {
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity++;
    } else {
      alert("Cannot add more items. Stock limit reached.");
      return;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  update_cart_UI();
  show_notification("Product added to cart!");
}

// Update cart UI
function update_cart_UI() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update cart items
  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align: center; color: #999;">Your cart is empty</p>';
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
            <div class="cart-item">
                <div class="cart-item-image">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateCartItem(${
                          item.id
                        }, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItem(${
                          item.id
                        }, 1)">+</button>
                    </div>
                </div>
                <button onclick="remove_from_cart(${
                  item.id
                })" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
            </div>
          `
      )
      .join("");
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update quantity
function updateCartItem(productId, change) {
  const cartItem = cart.find((item) => item.id === productId);
  const product = products.find((p) => p.id === productId);

  if (!cartItem || !product) return;

  const newQuantity = cartItem.quantity + change;

  if (newQuantity > 0 && newQuantity <= product.stock) {
    cartItem.quantity = newQuantity;
  } else if (newQuantity <= 0) {
    remove_from_cart(productId);
    return;
  } else {
    alert("Cannot exceed available stock.");
    return;
  }

  update_cart_UI();
}

// Remove from cart
function remove_from_cart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  update_cart_UI();
}

// Toggle cart
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  const overlay = document.getElementById("overlay");

  cartSidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

// View product details
function view_products(productId) {
  const product = products.find((p) => p.id === productId);
  const mainContent = document.getElementById("mainContent");
  const productDetail = document.getElementById("productDetail");
  const productDetailContent = document.getElementById("productDetailContent");

productDetailContent.innerHTML = `
    <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" />
    </div>
    <div>
        <h1>${product.name}</h1>
        <p class="product-detail-category">${product.category}</p>
        <span class="stock-status ${product.stock > 0 ? "in-stock" : "out-of-stock"}">
            ${product.stock > 0 ? `✓ In Stock (${product.stock} available)` : "✗ Out of Stock"}
        </span>
        <p class="product-detail-price">$${product.price.toFixed(2)}</p>
        <p class="product-detail-description">
            Experience premium quality with the ${product.name}. This product features advanced technology, 
            superior build quality, and exceptional performance. Perfect for both professionals and enthusiasts 
            looking for reliable electronics that deliver outstanding results.
        </p>
        <div class="product-detail-actions">
            ${
              product.stock > 0
                ? `
                <div class="quantity-selector">
                    <button onclick="update_detail_quantity(-1)">-</button>
                    <span id="detailQuantity">1</span>
                    <button onclick="update_detail_quantity(1)">+</button>
                </div>
                <button class="btn-primary" onclick="add_to_cartFromDetail(${product.id})">Add to Cart</button>
            `
                : `
                <button class="btn-primary" disabled style="background: #ccc;">Out of Stock</button>
            `
            }
        </div>
    </div>
`;


  mainContent.style.display = "none";
  productDetail.classList.add("active");
  window.scrollTo(0, 0);
}
function update_detail_quantity(change) {
  const quantitySpan = document.getElementById("detailQuantity");
  const currentQuantity = parseInt(quantitySpan.textContent);
  const newQuantity = currentQuantity + change;

  if (newQuantity >= 1 && newQuantity <= 10) {
    quantitySpan.textContent = newQuantity;
  }
}

// Update detail quantity
function update_quantities(change) {
  const quantitySpan = document.getElementById("detailQuantity");
  const currentQuantity = parseInt(quantitySpan.textContent);
  const newQuantity = currentQuantity + change;

  if (newQuantity >= 1 && newQuantity <= 10) {
    quantitySpan.textContent = newQuantity;
  }
}

// petition for removal because its too similar to update_quantities   ####
// Add to cart from detail
function add_to_cartFromDetail(productId) {
  const quantity = parseInt(
    document.getElementById("detailQuantity").textContent
  );
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    if (cartItem.quantity + quantity <= product.stock) {
      cartItem.quantity += quantity;
    } else {
      alert(
        `Cannot add ${quantity} items. Only ${
          product.stock - cartItem.quantity
        } available.`
      );
      return;
    }
  } else {
    cart.push({ ...product, quantity });
  }

  update_cart_UI();
  show_notification(`${quantity} item(s) added to cart!`);
}

// Show notification
function show_notification(message) {
  const notification = document.createElement("div");
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
    notification.style.animation = "fadeOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Show/hide modals
function show_login() {
  document.getElementById("loginModal").classList.add("active");
}

function close_modal(modalId) {
  document.getElementById(modalId).classList.remove("active");
}

function show_checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  toggleCart();
  document.getElementById("checkoutModal").classList.add("active");
}

// Toggle between login and register
function toggle_auth_mode() {
  isRegisterMode = !isRegisterMode;
  const modalTitle = document.getElementById("modalTitle");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const authToggleText = document.getElementById("authToggleText");
  const authToggleLink = document.getElementById("authToggleLink");
  const nameGroup = document.getElementById("nameGroup");
  const phoneGroup = document.getElementById("phoneGroup");

  if (isRegisterMode) {
    modalTitle.textContent = "Register";
    authSubmitBtn.textContent = "Register";
    authToggleText.textContent = "Already have an account?";
    authToggleLink.textContent = "Login";
    nameGroup.style.display = "block";
    phoneGroup.style.display = "block";
  } else {
    modalTitle.textContent = "Login";
    authSubmitBtn.textContent = "Login";
    authToggleText.textContent = "Don't have an account?";
    authToggleLink.textContent = "Register";
    nameGroup.style.display = "none";
    phoneGroup.style.display = "none";
  }
}

// Handle authentication
function handle_auth(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (isRegisterMode) {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;

    // Simulate registration
    currentUser = { email, name, phone, isAdmin: email === "admin@awe.com" };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    show_notification("Registration successful!");
  } else {
    // Simulate login
    if (email === "admin@awe.com") {
      currentUser = { email, name: "Admin User", isAdmin: true };
    } else {
      currentUser = { email, name: "Customer", isAdmin: false };
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    show_notification("Login successful!");
  }

  update_ui();
  close_modal("loginModal");
  document.getElementById("authForm").reset();
}

// Check login status
function check_login_status() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    update_ui();
  }
}

// Update user UI
function update_ui() {
  const welcomeUser = document.getElementById("welcomeUser");
  const loginBtn = document.getElementById("loginBtn");

  if (currentUser) {
    welcomeUser.textContent = `Welcome, ${currentUser.name}!`;
    loginBtn.textContent = "Logout";
    loginBtn.onclick = logout;
  } else {
    welcomeUser.textContent = "Welcome to AWE Electronics!";
    loginBtn.textContent = "Login";
    loginBtn.onclick = show_login;
  }
}

// Logout
function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  update_ui();
  show_notification("Logged out successfully");
  show_home();
}

// Process checkout
function processCheckout(event) {
  event.preventDefault();

  const email = document.getElementById("checkoutEmail").value;
  const phone = document.getElementById("checkoutPhone").value;

  const order = {
    id: "ORD" + Date.now(),
    date: new Date().toLocaleDateString(),
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "processing",
    customer: email, // Use entered email as customer ID for guest
    contact: {
      email,
      phone,
      address: document.getElementById("address").value,
      suburb: document.getElementById("suburb").value,
      postcode: document.getElementById("postcode").value,
      state: document.getElementById("state").value,
    },
  };

  orders.push(order);

  // Decrease stock
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    if (product) product.stock -= item.quantity;
  });

  cart = [];
  update_cart_UI();

  close_modal("checkoutModal");

  show_notification(`✅ Payment Successful! Order #${order.id}`);
  setTimeout(() => show_orders(), 2000);
}

// Show orders

function show_orders() {
  const mainContent = document.getElementById("mainContent");
  const orderHistory = document.getElementById("orderHistory");
  const productDetail = document.getElementById("productDetail");
  const adminSection = document.getElementById("adminSection");
  const orderList = document.getElementById("orderList");

  const userOrders = orders;

  if (userOrders.length === 0) {
    orderList.innerHTML =
      '<p style="text-align: center; padding: 40px; color: #999;">No orders found</p>';
  } else {
    orderList.innerHTML = userOrders
      .map((order) => {
        const itemsHtml = order.items
          .map(
            (item) => `
            <li>${item.icon} ${item.name} × ${item.quantity} — $${(
              item.price * item.quantity
            ).toFixed(2)}</li>
          `
          )
          .join("");

        return `
            <div class="order-card" style="border: 1px solid #ccc; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <h3>Order #${order.id}</h3>
              <p><strong>Date:</strong> ${order.date}</p>
              <p><strong>Email:</strong> ${order.customer}</p>
              <p><strong>Phone:</strong> ${order.contact.phone || "N/A"}</p>
              <p><strong>Delivery Address:</strong> ${
                order.contact.address || "N/A"
              }, ${order.contact.suburb || ""} ${
          order.contact.postcode || ""
        }, ${order.contact.state || ""}</p>
              <p><strong>Status:</strong> <span class="order-status ${
                order.status
              }">${order.status}</span></p>
              <ul style="margin-top: 10px; margin-bottom: 10px;">
                ${itemsHtml}
              </ul>
              <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
            </div>
          `;
      })
      .join("");
  }

  mainContent.style.display = "none";
  productDetail.classList.remove("active");
  adminSection.classList.remove("active");
  orderHistory.classList.add("active");
  window.scrollTo(0, 0);
}

// Show home
function show_home() {
  const mainContent = document.getElementById("mainContent");
  const orderHistory = document.getElementById("orderHistory");
  const productDetail = document.getElementById("productDetail");
  const adminSection = document.getElementById("adminSection");

  mainContent.style.display = "block";
  orderHistory.classList.remove("active");
  productDetail.classList.remove("active");
  adminSection.classList.remove("active");
  window.scrollTo(0, 0);
}

// Show admin
function show_admin() {
  if (!currentUser || !currentUser.isAdmin) {
    alert("Admin access required");
    return;
  }

  const mainContent = document.getElementById("mainContent");
  const orderHistory = document.getElementById("orderHistory");
  const productDetail = document.getElementById("productDetail");
  const adminSection = document.getElementById("adminSection");

  mainContent.style.display = "none";
  orderHistory.classList.remove("active");
  productDetail.classList.remove("active");
  adminSection.classList.add("active");

  show_adminTab("overview");
  window.scrollTo(0, 0);
}

// Show admin tab
function show_adminTab(tab) {
  // Update active tab
  document.querySelectorAll(".admin-nav-item").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  const adminContent = document.getElementById("adminContent");

  switch (tab) {
    case "overview":
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const lowStock = products.filter((p) => p.stock < 10).length;

      adminContent.innerHTML = `
                            <h3>Dashboard Overview</h3>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-number">$${totalRevenue.toFixed(
                                      2
                                    )}</div>
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
                                ${
                                  orders
                                    .slice(-5)
                                    .reverse()
                                    .map(
                                      (order) => `
                                    <div style="padding: 15px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 10px;">
                                        <strong>Order #${order.id}</strong> - ${
                                        order.date
                                      } - $${order.total.toFixed(
                                        2
                                      )} - Status: ${order.status}
                                    </div>
                                `
                                    )
                                    .join("") || "<p>No orders yet</p>"
                                }
                            </div>
                        `;
      break;

    case "products":
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
                                    ${products
                                      .map(
                                        (product) => `
                                        <tr style="border-bottom: 1px solid var(--border-color);">
                                            <td style="padding: 10px;">${
                                              product.icon
                                            } ${product.name}</td>
                                            <td style="padding: 10px;">${
                                              product.category
                                            }</td>
                                            <td style="padding: 10px;">$${product.price.toFixed(
                                              2
                                            )}</td>
                                            <td style="padding: 10px;">${
                                              product.stock
                                            }</td>
                                            <td style="padding: 10px;">
                                                <button onclick="alert('Edit feature coming soon!')" style="margin-right: 5px;">Edit</button>
                                                <button onclick="alert('Delete feature coming soon!')">Delete</button>
                                            </td>
                                        </tr>
                                    `
                                      )
                                      .join("")}
                                </tbody>
                            </table>
                        `;
      break;

    case "inventory":
      adminContent.innerHTML = `
                            <h3>Inventory Management</h3>
                            <div style="margin-bottom: 20px;">
                                <h4>Low Stock Alert (Less than 10 units)</h4>
                                ${
                                  products
                                    .filter((p) => p.stock < 10)
                                    .map(
                                      (product) => `
                                    <div style="padding: 15px; border: 1px solid var(--error-color); background: #fee; border-radius: 5px; margin-bottom: 10px;">
                                        <strong>${product.name}</strong> - Only ${product.stock} units remaining!
                                        <button style="float: right;" onclick="alert('Restock feature coming soon!')">Restock</button>
                                    </div>
                                `
                                    )
                                    .join("") || "<p>No low stock items</p>"
                                }
                            </div>
                            <h4>All Products Stock</h4>
                            ${products
                              .map(
                                (product) => `
                                <div style="padding: 10px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 5px; display: flex; justify-content: space-between;">
                                    <span>${product.icon} ${product.name}</span>
                                    <span>Stock: ${product.stock}</span>
                                </div>
                            `
                              )
                              .join("")}
                        `;
      break;

    case "reports":
      const monthlyRevenue = orders.reduce(
        (sum, order) => sum + order.total,
        0
      );
      const avgOrderValue =
        orders.length > 0 ? monthlyRevenue / orders.length : 0;

      adminContent.innerHTML = `
                            <h3>Sales Reports</h3>
                            <div class="stats-grid" style="margin-bottom: 30px;">
                                <div class="stat-card">
                                    <div class="stat-number">$${monthlyRevenue.toFixed(
                                      2
                                    )}</div>
                                    <div class="stat-label">Monthly Revenue</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-number">$${avgOrderValue.toFixed(
                                      2
                                    )}</div>
                                    <div class="stat-label">Average Order Value</div>
                                </div>
                            </div>
                            <h4>Sales by Category</h4>
                            <div style="margin-top: 20px;">
                                ${["computers", "phones", "audio", "gaming"]
                                  .map((category) => {
                                    const categoryProducts = products.filter(
                                      (p) => p.category === category
                                    );
                                    const categorySales = orders.reduce(
                                      (sum, order) => {
                                        return (
                                          sum +
                                          order.items
                                            .filter((item) =>
                                              categoryProducts.find(
                                                (p) => p.id === item.id
                                              )
                                            )
                                            .reduce(
                                              (itemSum, item) =>
                                                itemSum +
                                                item.price * item.quantity,
                                              0
                                            )
                                        );
                                      },
                                      0
                                    );

                                    return `
                                        <div style="padding: 10px; border: 1px solid var(--border-color); border-radius: 5px; margin-bottom: 5px;">
                                            <strong>${
                                              category.charAt(0).toUpperCase() +
                                              category.slice(1)
                                            }</strong>: $${categorySales.toFixed(
                                      2
                                    )}
                                        </div>
                                    `;
                                  })
                                  .join("")}
                            </div>
                            <button class="btn-primary" style="margin-top: 20px;" onclick="alert('Export to CSV feature coming soon!')">Export Report</button>
                        `;
      break;
  }
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add CSS animation keyframes
const style = document.createElement("style");
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
function toggleFavorite(productId) {
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
  } else {
    favorites.push(productId);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  load_products("all"); // Re-render to reflect change
}
