const searchInput = document.querySelector(".search-input");
const searchIcon = document.querySelector(".search-icon");
const productBoxes = Array.from(document.querySelectorAll(".shop-section .box"));
const cartButton = document.querySelector(".nav-cart");
const panelDeals = document.querySelector(".panel-deals");
const heroMessage = document.querySelector(".hero-msg p");
const heroLink = document.querySelector(".hero-msg a");
const backToTopButton = document.querySelector(".foot-panel1");

const defaultHeroMessage = 'You are on amazon.com. You can also shop on Amazon India for millions of products with fast local delivery. <a href="https://www.amazon.in/" target="_blank" rel="noreferrer">Click here to go to amazon.in</a>';
const defaultPanelDeals = panelDeals ? panelDeals.textContent.trim() : "";
const cartStorageKey = "amazonCloneCartItems";

let cartItems = loadCartItems();
let messageResetTimer = null;

initializeSearch();
initializeCart();
initializeHeroLink();
initializeBackToTop();

function initializeSearch() {
    if (!searchInput || !searchIcon || productBoxes.length === 0) {
        return;
    }

    searchIcon.tabIndex = 0;
    searchIcon.setAttribute("role", "button");
    searchIcon.setAttribute("aria-label", "Search products");

    searchIcon.addEventListener("click", applySearch);
    searchIcon.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            applySearch();
        }
    });

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            applySearch();
        }
    });

    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim() === "") {
            resetSearch();
        }
    });
}

function initializeCart() {
    if (!cartButton) {
        return;
    }

    cartButton.tabIndex = 0;
    cartButton.setAttribute("role", "button");
    updateCartCount();

    productBoxes.forEach((box) => {
        box.tabIndex = 0;
        box.setAttribute("role", "button");
        box.setAttribute("aria-label", `Add ${getProductName(box)} to cart`);

        box.addEventListener("click", () => addToCart(box));
        box.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                addToCart(box);
            }
        });
    });

    cartButton.addEventListener("click", showCartSummary);
    cartButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showCartSummary();
        }
    });
}

function initializeHeroLink() {
    if (!heroLink) {
        return;
    }

    heroLink.href = "https://www.amazon.in/";
    heroLink.target = "_blank";
    heroLink.rel = "noreferrer";
}

function initializeBackToTop() {
    if (!backToTopButton) {
        return;
    }

    backToTopButton.tabIndex = 0;
    backToTopButton.setAttribute("role", "button");

    backToTopButton.addEventListener("click", scrollToTop);
    backToTopButton.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            scrollToTop();
        }
    });
}

function applySearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        resetSearch();
        return;
    }

    let visibleCount = 0;

    productBoxes.forEach((box) => {
        const productText = box.textContent.toLowerCase();
        const isMatch = productText.includes(query);

        box.hidden = !isMatch;
        if (isMatch) {
            visibleCount += 1;
        }
    });

    if (!heroMessage) {
        return;
    }

    if (visibleCount === 0) {
        heroMessage.textContent = `No results found for "${searchInput.value.trim()}". Try gaming, home, fashion, or watch.`;
        return;
    }

    heroMessage.textContent = `Showing ${visibleCount} result${visibleCount === 1 ? "" : "s"} for "${searchInput.value.trim()}". Clear the search to see every category again.`;
}

function resetSearch() {
    productBoxes.forEach((box) => {
        box.hidden = false;
    });

    if (heroMessage) {
        heroMessage.innerHTML = defaultHeroMessage;
    }
}

function addToCart(box) {
    const productName = getProductName(box);

    cartItems.push(productName);
    saveCartItems();
    updateCartCount();
    showTemporaryMessage(`${productName} added to cart`);
}

function showCartSummary() {
    if (cartItems.length === 0) {
        showTemporaryMessage("Your cart is empty");
        return;
    }

    const uniqueItems = [...new Set(cartItems)];
    const summary = uniqueItems
        .map((item) => {
            const quantity = cartItems.filter((cartItem) => cartItem === item).length;
            return `${item} x${quantity}`;
        })
        .join("\n");

    window.alert(`Cart items:\n${summary}`);
}

function updateCartCount() {
    if (!cartButton) {
        return;
    }

    const itemCount = cartItems.length;
    cartButton.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Cart${itemCount > 0 ? ` (${itemCount})` : ""}`;
}

function showTemporaryMessage(message) {
    if (!panelDeals) {
        return;
    }

    panelDeals.textContent = message;

    window.clearTimeout(messageResetTimer);
    messageResetTimer = window.setTimeout(() => {
        panelDeals.textContent = defaultPanelDeals;
    }, 2200);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function getProductName(box) {
    const heading = box.querySelector("h2");
    return heading ? heading.textContent.trim() : "Item";
}

function loadCartItems() {
    try {
        const storedCartItems = localStorage.getItem(cartStorageKey);
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    } catch (error) {
        return [];
    }
}

function saveCartItems() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
}
