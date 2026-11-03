/* =========================================
   CAMPUSBITE - SCRIPT.JS
   ========================================= */


/* =========================================
   FOOD DATA
   ========================================= */

   const foodItems = [
    {
        id: 1,
        name: "Veg Sandwich",
        price: 50,
        category: "snacks",
        image: "images/sandwich.jpg"
    },
    {
        id: 2,
        name: "Veg Biryani",
        price: 80,
        category: "meals",
        image: "images/biryani.jpg"
    },
    {
        id: 3,
        name: "Samosa",
        price: 20,
        category: "snacks",
        image: "images/samosa.jpg"
    },
    {
        id: 4,
        name: "Masala Dosa",
        price: 60,
        category: "snacks",
        image: "images/masala-dosa.jpg"
    },
    {
        id: 5,
        name: "Veg Fried Rice",
        price: 70,
        category: "meals",
        image: "images/fried-rice.jpg"
    },
    {
        id: 6,
        name: "Fresh Juice",
        price: 40,
        category: "beverages",
        image: "images/juice.jpg"
    },
    {
        id: 7,
        name: "Cold Coffee",
        price: 50,
        category: "beverages",
        image: "images/cold-coffee.jpg"
    },
    {
        id: 8,
        name: "French Fries",
        price: 50,
        category: "snacks",
        image: "images/fries.jpg"
    },
    {
        id: 9,
        name: "Coffee",
        price: 20,
        category: "beverages",
        image: "images/coffee.jpg"
    },
    {
        id: 10,
        name: "Tea",
        price: 15,
        category: "beverages",
        image: "images/tea.jpg"
    },
    {
        id: 11,
        name: "Idli",
        price: 40,
        category: "snacks",
        image: "images/idli.jpg"
    },
    {
        id: 12,
        name: "Ice Cream",
        price: 30,
        category: "snacks",
        image: "images/icecream.jpg"
    }
];


/* =========================================
   LOAD CART
   ========================================= */

let cart = JSON.parse(
    localStorage.getItem("campusBiteCart")
) || [];


/* =========================================
   SAVE CART
   ========================================= */

function saveCart() {

    localStorage.setItem(
        "campusBiteCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   CUSTOM ADD TO CART POPUP
   ========================================= */

   let pendingFoodId = null;


   // Open popup
   
   function addToCart(id) {

    if (!isFoodAvailable(id)) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }
   
    const item = [...foodItems, ...getCustomFoodItems()]
    .find(food => food.id === id);
   
       if (!item) return;
   
       const existingItem = cart.find(food => food.id === id);
   
       // If item already exists, increase quantity directly
       if (existingItem) {
   
           existingItem.quantity++;
   
           saveCart();
           updateCartCount();
           updateMenuQuantityControls();
   
           return;
       }
   
       // Remember which food the user selected
       pendingFoodId = id;
   
       // Display food name in popup
       document.getElementById("popup-food-message").textContent =
           "Would you like to add " + item.name + " to your cart?";
   
       // Show custom popup
       document.getElementById("add-cart-popup").style.display = "flex";
   
   }
   
   
   // Confirm adding item
   
   function confirmAddToCart() {

    if (pendingFoodId === null) return;

    if (!isFoodAvailable(pendingFoodId)) {
        closeAddToCartPopup();
        alert("Sorry, this item is currently out of stock.");
        return;
    }

    const item = [...foodItems, ...getCustomFoodItems()]
        .find(food => food.id === pendingFoodId);

    if (!item) return;

    const existingItem = cart.find(food => food.id === pendingFoodId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    closeAddToCartPopup();
    updateMenuQuantityControls();
}
   
   
   // Close popup
   
   function closeAddToCartPopup() {
   
       document.getElementById("add-cart-popup").style.display = "none";
   
       pendingFoodId = null;
   
   }
   
   
   /* =========================================
      MENU QUANTITY CONTROLS
      ========================================= */
   
   // Increase or decrease quantity from menu
   
   function changeMenuQuantity(id, change) {

    if (change > 0 && !isFoodAvailable(id)) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }
   
       const item = cart.find(food => food.id === id);
   
       if (!item) return;
   
       item.quantity += change;
   
       if (item.quantity <= 0) {
   
           cart = cart.filter(food => food.id !== id);
   
       }
   
       saveCart();
   
       updateCartCount();
   
       updateMenuQuantityControls();
   
   }
   
   
   // Update menu buttons according to cart quantities
   
   function updateMenuQuantityControls() {
   
       const foodCards = document.querySelectorAll(".food-card");
   
       foodCards.forEach(card => {
   
           const addButton = card.querySelector(
               'button[onclick^="addToCart"]'
           );
   
           if (addButton) {
   
               const match = addButton
                   .getAttribute("onclick")
                   .match(/\d+/);
   
               if (match) {
                   card.dataset.foodId = match[0];
               }
   
           }
   
           const id = Number(card.dataset.foodId);
   
           if (!id) return;
   
           const item = cart.find(food => food.id === id);
   
           let quantityControl = card.querySelector(
               ".menu-quantity-control"
           );
   
           if (item) {
   
               if (!quantityControl) {
   
                   const button = card.querySelector(
                       'button[onclick^="addToCart"]'
                   );
   
                   if (button) {
   
                       button.style.display = "none";
   
                       quantityControl = document.createElement("div");
   
                       quantityControl.className = "menu-quantity-control";
   
                       button.insertAdjacentElement(
                           "afterend",
                           quantityControl
                       );
   
                   }
   
               }
   
               if (quantityControl) {
   
                   quantityControl.innerHTML = `
                       <button
                           type="button"
                           onclick="changeMenuQuantity(${id}, -1)">
                           −
                       </button>
   
                       <span>${item.quantity}</span>
   
                       <button
                           type="button"
                           onclick="changeMenuQuantity(${id}, 1)">
                           +
                       </button>
                   `;
   
               }
   
           } else {
   
               if (quantityControl) {
                   quantityControl.remove();
               }
   
               const button = card.querySelector(
                   'button[onclick^="addToCart"]'
               );
   
               if (button) {
                   button.style.display = "";
               }
   
           }
   
       });
   
   }
/* =========================================
   UPDATE CART COUNT
   ========================================= */

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = totalItems;

}


/* =========================================
   DISPLAY CART
   ========================================= */

function displayCart() {

    const cartItemsContainer =
        document.getElementById("cart-items");

    const emptyCart =
        document.getElementById("empty-cart");

    const cartContent =
        document.getElementById("cart-content");

    if (
        !cartItemsContainer ||
        !emptyCart ||
        !cartContent
    ) {
        return;
    }

    if (cart.length === 0) {

        emptyCart.style.display = "block";
        cartContent.style.display = "none";

        updateCartCount();

        return;
    }

    emptyCart.style.display = "none";
    cartContent.style.display = "grid";

    cartItemsContainer.innerHTML = "";

    cart.forEach(item => {

        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>

            <div class="cart-item-details">

                <span class="food-category">
                    ${item.category}
                </span>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price} each
                </p>

            </div>

            <div class="cart-item-actions">

                <div class="quantity-control">

                    <button
                        type="button"
                        onclick="changeQuantity(${item.id}, -1)">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeQuantity(${item.id}, 1)">
                        +
                    </button>

                </div>

                <strong class="cart-item-price">
                    ₹${item.price * item.quantity}
                </strong>

                <button
                    type="button"
                    class="remove-button"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>

            </div>

        `;

        cartItemsContainer.appendChild(cartItem);

    });

    updateCartSummary();

}


/* =========================================
   CHANGE CART QUANTITY
   ========================================= */

function changeQuantity(id, change) {


    if (change > 0 && !isFoodAvailable(id)) {
        alert("Sorry, this item is currently out of stock.");
        return;
    }

    const item = cart.find(
        food => food.id === id
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {

        cart = cart.filter(
            food => food.id !== id
        );

    }

    saveCart();

    displayCart();

    updateCartCount();

}


/* =========================================
   REMOVE FROM CART
   ========================================= */

function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    saveCart();

    displayCart();

    updateCartCount();

}


/* =========================================
   CART SUMMARY
   ========================================= */

function updateCartSummary() {

    const itemCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) =>
            total + (item.price * item.quantity),
        0
    );

    const itemCountElement =
        document.getElementById("cart-item-count");

    const summaryItemCount =
        document.getElementById("summary-item-count");

    const subtotalElement =
        document.getElementById("cart-subtotal");

    const totalElement =
        document.getElementById("cart-total");

    if (itemCountElement) {

        itemCountElement.textContent =
            itemCount +
            (itemCount === 1 ? " item" : " items");

    }

    if (summaryItemCount) {
        summaryItemCount.textContent = itemCount;
    }

    if (subtotalElement) {
        subtotalElement.textContent = subtotal;
    }

    if (totalElement) {
        totalElement.textContent = subtotal;
    }

}


/* =========================================
   SEARCH MENU
   ========================================= */

function searchMenu() {

    const searchInput =
        document.getElementById("menu-search");

    if (!searchInput) {
        return;
    }

    const searchValue =
        searchInput.value.toLowerCase().trim();

    const cards =
        document.querySelectorAll(".food-card");

    cards.forEach(card => {

        const foodName =
            card.querySelector("h3");

        if (!foodName) {
            return;
        }

        const name =
            foodName.textContent.toLowerCase();

        const category =
            card.dataset.category
                ? card.dataset.category.toLowerCase()
                : "";

        if (
            name.includes(searchValue) ||
            category.includes(searchValue)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


/* =========================================
   FILTER MENU
   ========================================= */

function filterMenu(category) {

    const cards =
        document.querySelectorAll(".food-card");

    const buttons =
        document.querySelectorAll(".filter-button");

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    buttons.forEach(button => {

        const buttonText =
            button.textContent.trim().toLowerCase();

        if (buttonText === category) {
            button.classList.add("active");
        }

    });

    cards.forEach(card => {

        const cardCategory =
            card.dataset.category;

        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


/* =========================================
   PLACE ORDER
   ========================================= */

function placeOrder() {

    const unavailableItems = cart.filter(
        item => !isFoodAvailable(item.id)
    );
    
    if (unavailableItems.length > 0) {
        alert("Some items in your cart are now out of stock. Please remove them before placing your order.");
        return;
    }

    if (cart.length === 0) {

        alert("Please add items to your cart first.");

        return;
    }

    const nameInput =
        document.getElementById("customer-name");

    const classInput =
        document.getElementById("customer-class");

    const phoneInput =
        document.getElementById("customer-phone");

    const name = nameInput.value.trim();

    const studentClass = classInput.value.trim();

    const phone = phoneInput.value.trim();

    const pickup = document.querySelector(
        'input[name="pickup-time"]:checked'
    );

    const payment = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (name === "") {

        alert("Please enter your name.");

        nameInput.focus();

        return;
    }

    if (studentClass === "") {

        alert("Please enter your class / section.");

        classInput.focus();

        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {

        alert("Please enter a valid 10-digit phone number.");

        phoneInput.focus();

        return;
    }

    if (!pickup) {

        alert("Please select a pickup time.");

        return;
    }

    if (!payment) {

        alert("Please select a payment method.");

        return;
    }

    const total = cart.reduce(
        (sum, item) =>
            sum + (item.price * item.quantity),
        0
    );

    const orderId = "CB" + Date.now();

    const order = {

        orderId: orderId,

        customerName: name,

        studentClass: studentClass,

        phone: phone,

        items: cart.map(item => ({ ...item })),

        total: total,

        pickupTime: pickup.value,

        paymentMethod: payment.value,

        status: "Order Placed",

        orderDate: new Date().toLocaleString()

    };

    let orders = JSON.parse(
        localStorage.getItem("campusBiteOrders")
    ) || [];

    orders.unshift(order);

    localStorage.setItem(
        "campusBiteOrders",
        JSON.stringify(orders)
    );

    document.getElementById("order-id").textContent = orderId;

    document.getElementById("confirmed-pickup").textContent =
        pickup.value;

    document.getElementById("confirmed-total").textContent =
        total;

    const modal =
        document.getElementById("order-modal");

    modal.style.display = "flex";

    cart = [];

    saveCart();

    updateCartCount();

}


/* =========================================
   PAGE LOAD
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        displayCart();

        updateMenuQuantityControls();

        const searchInput =
            document.getElementById("menu-search");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchMenu
            );

        }

    }
);


/* =========================================
   MY ORDERS PAGE
   ========================================= */

// GET SAVED ORDERS

function getOrders() {

    return JSON.parse(
        localStorage.getItem("campusBiteOrders")
    ) || [];

}


// ESCAPE HTML

function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]
    );

}


// GET STATUS CLASS

function getStatusClass(status) {

    const value = String(status || "")
        .toLowerCase();

    if (value.includes("prepar")) {
        return "status-preparing";
    }

    if (value.includes("ready")) {
        return "status-ready";
    }

    if (value.includes("complet")) {
        return "status-completed";
    }

    if (value.includes("cancel")) {
        return "status-cancelled";
    }

    return "status-placed";

}


// DISPLAY ORDERS

function displayOrders() {

    const ordersContainer =
        document.getElementById("orders-list");

    if (!ordersContainer) {
        return;
    }

    const orders = getOrders();

    if (orders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">🍽️</div>

                <h2>No Orders Yet</h2>

                <p>
                    You haven't placed any orders.
                    Explore our menu and order your favourite food!
                </p>

                <a href="menu.html" class="menu-btn">
                    Explore Menu
                </a>

            </div>
        `;

        return;
    }

    ordersContainer.innerHTML = orders.map(
        (order, index) => {

            const status =
                order.status || "Order Placed";

            const itemsHTML = (order.items || []).map(item => `

                <div class="food-item">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                        onerror="this.style.display='none'"
                    >

                    <div class="food-item-details">

                        <h3>${escapeHTML(item.name)}</h3>

                        <p>
                            ₹${Number(item.price) || 0}
                            × ${Number(item.quantity) || 0}
                        </p>

                    </div>

                    <div class="food-item-price">
                        ₹${(Number(item.price) || 0) *
                            (Number(item.quantity) || 0)}
                    </div>

                </div>

            `).join("");

            const canCancel =
                !String(status).toLowerCase().includes("complet") &&
                !String(status).toLowerCase().includes("cancel");

            return `

                <div class="order-card">

                    <div class="order-top">

                        <div>

                            <div class="order-id">
                                Order #${escapeHTML(order.orderId)}
                            </div>

                            <div class="order-date">
                                ${escapeHTML(order.orderDate)}
                            </div>

                        </div>

                        <span class="status ${getStatusClass(status)}">
                            ${escapeHTML(status)}
                        </span>

                    </div>

                    <div class="order-items">
                        ${itemsHTML}
                    </div>

                    <div class="order-info">

                        <div>
                            <p>Customer</p>
                            <strong>
                                ${escapeHTML(order.customerName)}
                            </strong>
                        </div>

                        <div>
                            <p>Class / Section</p>
                            <strong>
                                ${escapeHTML(order.studentClass)}
                            </strong>
                        </div>

                        <div>
                            <p>Pickup Time</p>
                            <strong>
                                ${escapeHTML(order.pickupTime)}
                            </strong>
                        </div>

                        <div>
                            <p>Payment Method</p>
                            <strong>
                                ${escapeHTML(order.paymentMethod)}
                            </strong>
                        </div>

                    </div>

                    <div class="order-bottom">

                        <div class="total-amount">
                            Total: ₹${Number(order.total) || 0}
                        </div>

                        ${
                            canCancel
                            ? `
                                <button
                                    type="button"
                                    class="cancel-btn"
                                    onclick="cancelOrder(${index})"
                                >
                                    Cancel Order
                                </button>
                            `
                            : ""
                        }

                    </div>

                </div>

            `;

        }

    ).join("");

}


// CANCEL ORDER

function cancelOrder(index) {

    const confirmed = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
        return;
    }

    const orders = getOrders();

    if (!orders[index]) {
        return;
    }

    const status = String(orders[index].status || "")
        .toLowerCase();

    if (
        status.includes("complet") ||
        status.includes("cancel")
    ) {

        alert("This order cannot be cancelled.");

        return;
    }

    orders[index].status = "Cancelled";

    localStorage.setItem(
        "campusBiteOrders",
        JSON.stringify(orders)
    );

    displayOrders();

    alert("Your order has been cancelled.");

}


// INITIALIZE MY ORDERS PAGE

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayOrders();

    }
);


/* =========================================
   ADMIN DASHBOARD
   ========================================= */

function renderAdminOrders() {

    const summary =
        document.getElementById("admin-summary");

    if (!summary) {
        return;
    }

    const orders = JSON.parse(
        localStorage.getItem("campusBiteOrders")
    ) || [];

    const activeOrders = orders.filter(order =>
        ["Order Placed", "Preparing", "Ready for Pickup"].includes(order.status)
    );

    const completedOrders = orders.filter(
        order => order.status === "Completed"
    );

    const cancelledOrders = orders.filter(
        order => order.status === "Cancelled"
    );

    const placed = orders.filter(
        order => order.status === "Order Placed"
    ).length;

    const preparing = orders.filter(
        order => order.status === "Preparing"
    ).length;

    const ready = orders.filter(
        order => order.status === "Ready for Pickup"
    ).length;

    summary.innerHTML = `

        <div class="admin-stat">
            <p>Total Orders</p>
            <h3>${orders.length}</h3>
        </div>

        <div class="admin-stat">
            <p>New Orders</p>
            <h3>${placed}</h3>
        </div>

        <div class="admin-stat">
            <p>Preparing</p>
            <h3>${preparing}</h3>
        </div>

        <div class="admin-stat">
            <p>Ready for Pickup</p>
            <h3>${ready}</h3>
        </div>

    `;

    document.getElementById("active-orders-count").textContent =
        `(${activeOrders.length})`;

    document.getElementById("completed-orders-count").textContent =
        `(${completedOrders.length})`;

    document.getElementById("cancelled-orders-count").textContent =
        `(${cancelledOrders.length})`;

    displayAdminOrderSection(
        "admin-active-orders",
        activeOrders,
        "No active orders."
    );

    displayAdminOrderSection(
        "admin-completed-orders",
        completedOrders,
        "No completed orders yet."
    );

    displayAdminOrderSection(
        "admin-cancelled-orders",
        cancelledOrders,
        "No cancelled orders."
    );

}


// DISPLAY ADMIN ORDER CARDS

function displayAdminOrderSection(
    elementId,
    orders,
    emptyMessage
) {

    const container =
        document.getElementById(elementId);

    if (!container) {
        return;
    }

    if (orders.length === 0) {

        container.innerHTML = `
            <div class="admin-empty">
                <p>${emptyMessage}</p>
            </div>
        `;

        return;
    }

    container.innerHTML = orders.slice().reverse().map(order => {

        const itemsHTML = (order.items || []).map(item => `

            <p>
                ${escapeHTML(item.name)} × ${Number(item.quantity) || 0}
                — ₹${(Number(item.price) || 0) *
                    (Number(item.quantity) || 0)}
            </p>

        `).join("");

        const terminal = ["Completed", "Cancelled"].includes(order.status);

        return `

            <div class="admin-order-card">

                <div class="admin-order-top">

                    <div>
                        <h3>${escapeHTML(order.orderId)}</h3>
                        <small>${escapeHTML(order.orderDate)}</small>
                    </div>

                    <span class="status ${getStatusClass(order.status)}">
                        ${escapeHTML(order.status)}
                    </span>

                </div>

                <div class="admin-order-details">

                    <p><strong>Student:</strong> ${escapeHTML(order.customerName)}</p>

                    <p><strong>Class:</strong> ${escapeHTML(order.studentClass)}</p>

                    <p><strong>Phone:</strong> ${escapeHTML(order.phone)}</p>

                    <p><strong>Pickup Time:</strong> ${escapeHTML(order.pickupTime)}</p>

                    <p><strong>Payment:</strong> ${escapeHTML(order.paymentMethod)}</p>

                </div>

                <div class="admin-order-items">

                    <strong>Ordered Items</strong>

                    ${itemsHTML}

                </div>

                <div class="admin-order-bottom">

                    <strong>
                        Total: ₹${(Number(order.total) || 0).toFixed(2)}
                    </strong>

                    <div class="admin-status-control">

                        <label for="status-${escapeHTML(order.orderId)}">
                            Order Status:
                        </label>

                        <select
                            id="status-${escapeHTML(order.orderId)}"
                            onchange="updateAdminOrderStatus('${escapeHTML(order.orderId)}', this.value)"
                            ${terminal ? "disabled" : ""}
                        >

                            <option value="Order Placed"
                                ${order.status === "Order Placed" ? "selected" : ""}>
                                Order Placed
                            </option>

                            <option value="Preparing"
                                ${order.status === "Preparing" ? "selected" : ""}>
                                Preparing
                            </option>

                            <option value="Ready for Pickup"
                                ${order.status === "Ready for Pickup" ? "selected" : ""}>
                                Ready for Pickup
                            </option>

                            <option value="Completed"
                                ${order.status === "Completed" ? "selected" : ""}>
                                Completed
                            </option>

                            <option value="Cancelled"
                                ${order.status === "Cancelled" ? "selected" : ""}>
                                Cancelled
                            </option>

                        </select>

                    </div>

                </div>

            </div>

        `;

    }).join("");

}


// UPDATE ORDER STATUS

function updateAdminOrderStatus(orderId, newStatus) {

    const orders = JSON.parse(
        localStorage.getItem("campusBiteOrders")
    ) || [];

    const order = orders.find(
        item => item.orderId === orderId
    );

    if (!order) {
        return;
    }

    if (["Completed", "Cancelled"].includes(order.status)) {

        alert("This order is already closed.");

        renderAdminOrders();

        return;
    }

    order.status = newStatus;

    localStorage.setItem(
        "campusBiteOrders",
        JSON.stringify(orders)
    );

    renderAdminOrders();

    alert("Order status updated successfully!");

}


// LOAD AND AUTOMATICALLY UPDATE ADMIN DASHBOARD

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderAdminOrders();

    }
);


// LISTEN FOR CHANGES MADE IN OTHER BROWSER TABS

window.addEventListener(
    "storage",
    function (event) {

        if (event.key === "campusBiteOrders") {
            renderAdminOrders();
        }

    }
);


/* =========================================
   CAMPUSBITE ADMIN LOGIN
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const loginForm =
            document.getElementById("adminLoginForm");

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    const username =
                        document.getElementById("adminUsername").value.trim();

                    const password =
                        document.getElementById("adminPassword").value;

                    const errorMessage =
                        document.getElementById("loginError");

                    const correctUsername = "admin";

                    const correctPassword = "campusbite123";

                    if (
                        username === correctUsername &&
                        password === correctPassword
                    ) {

                        sessionStorage.setItem(
                            "campusBiteAdminLoggedIn",
                            "true"
                        );

                        window.location.href = "admin.html";

                    } else {

                        errorMessage.textContent =
                            "Invalid username or password. Please try again.";

                    }

                }
            );

        }

        // Protect Admin Dashboard

        const adminDashboard =
            document.getElementById("admin-summary");

        if (
            adminDashboard &&
            sessionStorage.getItem("campusBiteAdminLoggedIn") !== "true"
        ) {

            window.location.href = "admin-login.html";

        }

    }
);


/* =========================================
   ADMIN LOGOUT
   ========================================= */

function adminLogout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
        return;
    }

    sessionStorage.removeItem(
        "campusBiteAdminLoggedIn"
    );

    window.location.replace("admin-login.html");

}

/* =========================================
   CAMPUSBITE FOOD MANAGEMENT
   ========================================= */

   const FOOD_AVAILABILITY_KEY = "campusBiteFoodAvailability";
   const CUSTOM_FOOD_KEY = "campusBiteCustomFood";
   const FOOD_OVERRIDES_KEY = "campusBiteFoodOverrides";
   const DELETED_FOOD_KEY = "campusBiteDeletedFood";
   
   
   // GET SAVED DATA
   
   function getFoodAvailability() {
       return JSON.parse(localStorage.getItem(FOOD_AVAILABILITY_KEY)) || {};
   }
   
   function getCustomFoodItems() {
       return JSON.parse(localStorage.getItem(CUSTOM_FOOD_KEY)) || [];
   }
   
   function getFoodOverrides() {
       return JSON.parse(localStorage.getItem(FOOD_OVERRIDES_KEY)) || {};
   }
   
   function getDeletedFoodItems() {
       return JSON.parse(localStorage.getItem(DELETED_FOOD_KEY)) || [];
   }
   
   
   // GET ALL FOOD ITEMS
   
   function getAllFoodItems() {
       const overrides = getFoodOverrides();
       const deleted = getDeletedFoodItems();
   
       const originalItems = foodItems
           .filter(item => !deleted.includes(item.id))
           .map(item => ({
               ...item,
               ...(overrides[item.id] || {})
           }));
   
       const customItems = getCustomFoodItems()
           .filter(item => !deleted.includes(item.id));
   
       return [...originalItems, ...customItems];
   }
   
   
   // CHECK AVAILABILITY
   
   function isFoodAvailable(id) {
       return getFoodAvailability()[id] !== false;
   }
   
   
   // SAVE CUSTOM FOOD ITEMS
   
   function saveCustomFoodItems(items) {
       localStorage.setItem(CUSTOM_FOOD_KEY, JSON.stringify(items));
   }
   
   
   // SAVE FOOD OVERRIDES
   
   function saveFoodOverrides(items) {
       localStorage.setItem(FOOD_OVERRIDES_KEY, JSON.stringify(items));
   }
   
   
   // DISPLAY FOOD MANAGEMENT
   
   function renderFoodManagement() {
       const container = document.getElementById("admin-food-list");
   
       if (!container) return;
   
       const availability = getFoodAvailability();
       const allItems = getAllFoodItems();
   
       if (allItems.length === 0) {
           container.innerHTML = "<p>No food items available.</p>";
           return;
       }
   
       container.innerHTML = allItems.map(item => {
           const available = availability[item.id] !== false;
   
           return `
               <div class="food-management-card">
   
                   <div>
                       <h3>${escapeHTML(item.name)}</h3>
   
                       <p>
                           ₹${Number(item.price)}
                           · ${escapeHTML(item.category)}
                       </p>
                   </div>
   
                   <div class="food-management-actions">
   
                       <button
                           type="button"
                           class="food-availability-btn ${available ? "available" : "unavailable"}"
                           onclick="toggleFoodAvailability(${item.id})">
   
                           ${available ? "Available" : "Out of Stock"}
   
                       </button>
   
                       <button
                           type="button"
                           class="food-edit-btn"
                           onclick="editFoodItem(${item.id})">
   
                           Edit
   
                       </button>
   
                       <button
                           type="button"
                           class="food-delete-btn"
                           onclick="deleteFoodItem(${item.id})">
   
                           Delete
   
                       </button>
   
                   </div>
   
               </div>
           `;
       }).join("");
   }
   
   
   // ADD NEW FOOD ITEM
   
   function addNewFoodItem(event) {
       event.preventDefault();
   
       const name = document.getElementById("food-name").value.trim();
       const price = Number(document.getElementById("food-price").value);
       const category = document.getElementById("food-category").value;
       const image = document.getElementById("food-image").value.trim();
   
       if (!name || !Number.isFinite(price) || price <= 0 || !category) {
           alert("Please enter valid food details.");
           return;
       }
   
       const newItem = {
           id: Date.now(),
           name,
           price,
           category: category.toLowerCase(),
           image: image || "images/food-placeholder.jpg"
       };
   
       const customItems = getCustomFoodItems();
   
       customItems.push(newItem);
   
       saveCustomFoodItems(customItems);
   
       document.getElementById("add-food-form").reset();
   
       renderFoodManagement();
   
       alert("Food item added successfully!");
   }
   
   
   // EDIT FOOD ITEM
   
   function editFoodItem(id) {
       const item = getAllFoodItems().find(food => food.id === id);
   
       if (!item) return;
   
       const name = prompt("Enter food name:", item.name);
   
       if (name === null) return;
   
       if (!name.trim()) {
           alert("Food name cannot be empty.");
           return;
       }
   
       const priceInput = prompt("Enter food price:", item.price);
   
       if (priceInput === null) return;
   
       const price = Number(priceInput);
   
       if (!Number.isFinite(price) || price <= 0) {
           alert("Please enter a valid price.");
           return;
       }
   
       const category = prompt(
           "Enter category (snacks, meals, beverages, desserts):",
           item.category
       );
   
       if (category === null) return;
   
       const validCategories = ["snacks", "meals", "beverages", "desserts"];
   
       if (!validCategories.includes(category.trim().toLowerCase())) {
           alert("Please enter a valid category.");
           return;
       }
   
       const image = prompt("Enter image URL or image path:", item.image);
   
       if (image === null) return;
   
       const updatedItem = {
           ...item,
           name: name.trim(),
           price,
           category: category.trim().toLowerCase(),
           image: image.trim() || "images/food-placeholder.jpg"
       };
   
       const customItems = getCustomFoodItems();
       const customIndex = customItems.findIndex(food => food.id === id);
   
       if (customIndex !== -1) {
           customItems[customIndex] = updatedItem;
           saveCustomFoodItems(customItems);
       } else {
           const overrides = getFoodOverrides();
           overrides[id] = {
               name: updatedItem.name,
               price: updatedItem.price,
               category: updatedItem.category,
               image: updatedItem.image
           };
           saveFoodOverrides(overrides);
       }
   
       // Update existing cart item details
       cart = cart.map(cartItem =>
           cartItem.id === id
               ? { ...cartItem, ...updatedItem }
               : cartItem
       );
   
       saveCart();
   
       renderFoodManagement();
       renderCustomFoodItems();
       updateMenuFoodItems();
   
       alert("Food item updated successfully!");
   }
   
   
   // DELETE FOOD ITEM
   
   function deleteFoodItem(id) {
       const item = getAllFoodItems().find(food => food.id === id);
   
       if (!item) return;
   
       const confirmed = confirm(
           "Are you sure you want to delete " + item.name + "?"
       );
   
       if (!confirmed) return;
   
       const customItems = getCustomFoodItems()
           .filter(food => food.id !== id);
   
       saveCustomFoodItems(customItems);
   
       const deleted = getDeletedFoodItems();
   
       if (!deleted.includes(id)) {
           deleted.push(id);
       }
   
       localStorage.setItem(DELETED_FOOD_KEY, JSON.stringify(deleted));
   
       // Remove the deleted food from the cart
       cart = cart.filter(food => food.id !== id);
   
       saveCart();
   
       renderFoodManagement();
       renderCustomFoodItems();
       updateMenuFoodItems();
       updateMenuQuantityControls();
       updateCartCount();
       displayCart();
   
       alert("Food item deleted successfully!");
   }
   
   
   // TOGGLE FOOD AVAILABILITY
   
   function toggleFoodAvailability(id) {
       const availability = getFoodAvailability();
   
       availability[id] = availability[id] === false;
   
       localStorage.setItem(
           FOOD_AVAILABILITY_KEY,
           JSON.stringify(availability)
       );
   
       renderFoodManagement();
       updateFoodAvailabilityOnMenu();
   }
   
   
   // UPDATE ORIGINAL MENU CARDS
   
   function updateMenuFoodItems() {
       const overrides = getFoodOverrides();
       const deleted = getDeletedFoodItems();
   
       document.querySelectorAll(".food-card").forEach(card => {
           const button = card.querySelector('button[onclick^="addToCart"]');
           if (!button) return;
   
           const match = button.getAttribute("onclick").match(/\d+/);
           if (!match) return;
   
           const id = Number(match[0]);
           const item = getAllFoodItems().find(food => food.id === id);
   
           if (!item || deleted.includes(id)) {
               card.remove();
               return;
           }
   
           card.dataset.foodId = id;
           card.dataset.category = item.category;
   
           const heading = card.querySelector("h3");
           const category = card.querySelector(".food-category");
           const image = card.querySelector(".menu-food-image img");
           const price = card.querySelector(".food-bottom strong");
   
           if (heading) heading.textContent = item.name;
           if (category) category.textContent = item.category;
           if (image) {
               image.src = item.image;
               image.alt = item.name;
           }
           if (price) price.textContent = "₹" + item.price;
       });
   }
   
   
   // UPDATE AVAILABILITY ON MENU
   
   function updateFoodAvailabilityOnMenu() {
       const availability = getFoodAvailability();
   
       document.querySelectorAll(".food-card").forEach(card => {
           const id = Number(card.dataset.foodId);
           if (!id) return;
   
           const addButton = card.querySelector(
               'button[onclick^="addToCart"]'
           );
   
           if (!addButton) return;
   
           let stockLabel = card.querySelector(".stock-status");
   
           if (availability[id] === false) {
               if (!stockLabel) {
                   stockLabel = document.createElement("p");
                   stockLabel.className = "stock-status";
   
                   const info = card.querySelector(".menu-food-info");
                   if (info) info.appendChild(stockLabel);
               }
   
               stockLabel.textContent = "Out of Stock";
               addButton.disabled = true;
               addButton.textContent = "Out of Stock";
               addButton.style.display = "";
   
               const quantityControl = card.querySelector(".menu-quantity-control");
   
               if (quantityControl) {
                   quantityControl.style.display = "none";
               }
           } else {
               if (stockLabel) stockLabel.remove();
   
               addButton.disabled = false;
               addButton.textContent = "+ Add";
   
               updateMenuQuantityControls();
           }
       });
   }
   
   
   // DISPLAY CUSTOM FOOD ITEMS ON MENU
   
   function renderCustomFoodItems() {
       const foodGrid = document.getElementById("food-grid");
   
       if (!foodGrid) return;
   
       foodGrid.querySelectorAll(".custom-food-card").forEach(card => {
           card.remove();
       });
   
       getAllFoodItems()
           .filter(item => !foodItems.some(original => original.id === item.id))
           .forEach(item => {
               const card = document.createElement("div");
   
               card.className = "food-card custom-food-card";
               card.dataset.category = item.category;
               card.dataset.foodId = item.id;
   
               card.innerHTML = `
                   <div class="menu-food-image">
                       <img src="${escapeHTML(item.image)}"
                            alt="${escapeHTML(item.name)}"
                            onerror="this.style.display='none'">
                   </div>
   
                   <div class="menu-food-info">
   
                       <span class="food-category">
                           ${escapeHTML(item.category)}
                       </span>
   
                       <h3>${escapeHTML(item.name)}</h3>
   
                       <p>Freshly prepared for you.</p>
   
                       <div class="food-bottom">
                           <strong>₹${Number(item.price)}</strong>
   
                           <button type="button"
                               onclick="addToCart(${Number(item.id)})">
                               + Add
                           </button>
                       </div>
   
                   </div>
               `;
   
               foodGrid.appendChild(card);
           });
   
       updateMenuQuantityControls();
       updateFoodAvailabilityOnMenu();
   }
   
   
   // UPDATE WHEN OTHER TABS CHANGE FOOD DATA
   
   window.addEventListener("storage", function(event) {
       const foodKeys = [
           CUSTOM_FOOD_KEY,
           FOOD_AVAILABILITY_KEY,
           FOOD_OVERRIDES_KEY,
           DELETED_FOOD_KEY
       ];
   
       if (foodKeys.includes(event.key)) {
           renderFoodManagement();
           updateMenuFoodItems();
           renderCustomFoodItems();
           updateFoodAvailabilityOnMenu();
           updateMenuQuantityControls();
       }
   });
   
   
   // INITIALIZE FOOD MANAGEMENT
   
   document.addEventListener("DOMContentLoaded", function() {
       const form = document.getElementById("add-food-form");
   
       if (form) {
           form.addEventListener("submit", addNewFoodItem);
       }
   
       renderFoodManagement();
       updateMenuFoodItems();
       renderCustomFoodItems();
       updateFoodAvailabilityOnMenu();
   });