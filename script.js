const products = [
  {
    id: 1,
    name: "Iphone 16",
    category: "Mobile",
    price: 1149.99,
    stock: 10,
  },
  {
    id: 2,
    name: "Ipad Pro 5",
    category: "Tablet",
    price: 229.99,
    stock: 22,
  },
  {
    id: 3,
    name: "Logitech Keyboard",
    category: "Gaming",
    price: 849.99,
    stock: 14,
  },
  {
    id: 4,
    name: "Macbook Pro",
    category: "Laptop",
    price: 599.99,
    stock: 5,
  },
  {
    id: 5,
    name: "Omen Gaming chair",
    category: "Accessories",
    price: 479.99,
    stock: 9,
  },
  {
    id: 6,
    name: "Airpod 3",
    category: "Accessories",
    price: 69.99,
    stock: 35,
  },
  {
    id: 7,
    name: "Samsung White 10",
    category: "Mobile",
    price: 629.99,
    stock: 17,
  },
  {
    id: 8,
    name: "Logitech Gaming Mouse",
    category: "Gaming",
    price: 99.99,
    stock: 40,
  },
  {
    id: 9,
    name: "Sony Headphone",
    category: "Accessories",
    price: 259.99,
    stock: 13,
  },
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
              <div class="product-image">${product.icon}</div>
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
            <div class="product-detail-image">${product.icon}</div>
            <div>
                <h1>${product.name}</h1>
                <p class="product-detail-category">${product.category}</p>
                <span class="stock-status ${
                  product.stock > 0 ? "in-stock" : "out-of-stock"
                }">
                    ${
                      product.stock > 0
                        ? `✓ In Stock (${product.stock} available)`
                        : "✗ Out of Stock"
                    }
                </span>
                <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                <p class="product-detail-description">
                    Experience premium quality with the ${
                      product.name
                    }. This product features advanced technology, 
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
