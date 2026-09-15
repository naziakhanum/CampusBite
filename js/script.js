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
   ADD TO CART
   ========================================= */

function addToCart(id) {

    const item = foodItems.find(
        food => food.id === id
    );

    if (!item) {
        return;
    }


    const existingItem = cart.find(
        food => food.id === id
    );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            ...item,
            quantity: 1
        });

    }


    saveCart();

    updateCartCount();


    alert(
        item.name + " added to your cart!"
    );

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
        (total, item) =>
            total + item.quantity,
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
                        onclick="changeQuantity(
                            ${item.id},
                            -1
                        )">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        type="button"
                        onclick="changeQuantity(
                            ${item.id},
                            1
                        )">
                        +
                    </button>

                </div>


                <strong class="cart-item-price">

                    ₹${item.price * item.quantity}

                </strong>


                <button
                    type="button"
                    class="remove-button"
                    onclick="removeFromCart(
                        ${item.id}
                    )">

                    Remove

                </button>

            </div>

        `;


        cartItemsContainer.appendChild(
            cartItem
        );

    });


    updateCartSummary();

}


/* =========================================
   CHANGE QUANTITY
   ========================================= */

function changeQuantity(id, change) {

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
        (total, item) =>
            total + item.quantity,
        0
    );


    const subtotal = cart.reduce(
        (total, item) =>
            total +
            (item.price * item.quantity),
        0
    );


    const itemCountElement =
        document.getElementById(
            "cart-item-count"
        );


    const summaryItemCount =
        document.getElementById(
            "summary-item-count"
        );


    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );


    const totalElement =
        document.getElementById(
            "cart-total"
        );


    if (itemCountElement) {

        itemCountElement.textContent =
            itemCount +
            (itemCount === 1
                ? " item"
                : " items");

    }


    if (summaryItemCount) {

        summaryItemCount.textContent =
            itemCount;

    }


    if (subtotalElement) {

        subtotalElement.textContent =
            subtotal;

    }


    if (totalElement) {

        totalElement.textContent =
            subtotal;

    }

}


/* =========================================
   SEARCH MENU
   ========================================= */

function searchMenu() {

    const searchInput =
        document.getElementById(
            "menu-search"
        );


    if (!searchInput) {
        return;
    }


    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(
            ".food-card"
        );


    cards.forEach(card => {

        const foodName =
            card.querySelector("h3");


        if (!foodName) {
            return;
        }


        const name =
            foodName.textContent
                .toLowerCase();


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
        document.querySelectorAll(
            ".food-card"
        );


    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(button => {

        button.classList.remove("active");

    });


    buttons.forEach(button => {

        const buttonText =
            button.textContent
                .trim()
                .toLowerCase();


        if (
            buttonText === category ||
            (
                category === "all" &&
                buttonText === "all"
            )
        ) {

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

    if (cart.length === 0) {

        alert(
            "Please add items to your cart first."
        );

        return;

    }


    const nameInput =
        document.getElementById(
            "customer-name"
        );


    const classInput =
        document.getElementById(
            "customer-class"
        );


    const name =
        nameInput.value.trim();


    const studentClass =
        classInput.value.trim();


    const pickup =
        document.querySelector(
            'input[name="pickup-time"]:checked'
        );


    if (name === "") {

        alert(
            "Please enter your name."
        );

        nameInput.focus();

        return;

    }


    if (studentClass === "") {

        alert(
            "Please enter your class / section."
        );

        classInput.focus();

        return;

    }


    if (!pickup) {

        alert(
            "Please select a pickup time."
        );

        return;

    }


    const total = cart.reduce(
        (sum, item) =>
            sum +
            (item.price * item.quantity),
        0
    );


    /* Generate Order ID */

    const orderId =
        "CB" +
        Math.floor(
            1000 + Math.random() * 9000
        );


    document.getElementById(
        "order-id"
    ).textContent = orderId;


    document.getElementById(
        "confirmed-pickup"
    ).textContent = pickup.value;


    document.getElementById(
        "confirmed-total"
    ).textContent = total;


    /* Show success modal */

    const modal =
        document.getElementById(
            "order-modal"
        );


    modal.style.display = "flex";


    /* Clear cart */

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


        const searchInput =
            document.getElementById(
                "menu-search"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchMenu
            );

        }

    }
);