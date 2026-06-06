// SVG Paths
const svgPaths = {
    p22b32180: "M5.33333 14.6667C5.70152 14.6667 6 14.3682 6 14C6 13.6318 5.70152 13.3333 5.33333 13.3333C4.96514 13.3333 4.66667 13.6318 4.66667 14C4.66667 14.3682 4.96514 14.6667 5.33333 14.6667Z",
    pceec000: "M12.6667 14.6667C13.0349 14.6667 13.3333 14.3682 13.3333 14C13.3333 13.6318 13.0349 13.3333 12.6667 13.3333C12.2985 13.3333 12 13.6318 12 14C12 14.3682 12.2985 14.6667 12.6667 14.6667Z",
    p35e3f800: "M1.36666 1.36666H2.69999L4.47333 9.64666C4.53838 9.9499 4.70711 10.221 4.95047 10.4132C5.19383 10.6055 5.4966 10.7069 5.80666 10.7H12.3267C12.6301 10.6995 12.9243 10.5955 13.1607 10.4052C13.397 10.2149 13.5614 9.94968 13.6267 9.65332L14.7267 4.69999H3.41333"
};

const API_URL = '../api.php';

// Products Data
let products = [
    { id: 1, name: "Pistola Dourada", price: 400.00, image: "../Imagens do site/Image%20(Product).png", gameIcon: "../Imagens do site/Image%20(Game)%20(3).png" },
    { id: 2, name: "Luvas Vermelhas", price: 1250.00, image: "../Imagens%20do%20site/Image%20(Product)%20(1).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png" },
    { id: 3, name: "Bayonet - Crimson Web", price: 2375.00, image: "../Imagens%20do%20site/Image%20(Product)%20(2).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png", featured: true },
    { id: 4, name: "AK-47 Colorida", price: 285.00, image: "../Imagens%20do%20site/Image%20(Product)%20(3).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png" },
    { id: 5, name: "M4A4 Roxa", price: 2185.00, image: "../Imagens%20do%20site/Image%20(Product)%20(4).png", gameIcon: "../Imagens%20do%20site/Rust.png" },
    { id: 6, name: "Karambit", price: 756.00, image: "../Imagens%20do%20site/Image%20(Product)%20(5).png", gameIcon: "../Imagens%20do%20site/dota.jpg" },
    { id: 7, name: "Pistola Bronze", price: 400.00, image: "../Imagens%20do%20site/Image%20(Product).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(3).png" },
    { id: 8, name: "Luvas Rosas", price: 1249.00, image: "../Imagens%20do%20site/Image%20(Product)%20(1).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png" },
    { id: 9, name: "Faca Vermelha", price: 2374.00, image: "../Imagens%20do%20site/Image%20(Product)%20(2).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png" },
    { id: 10, name: "AK-47 Roxa", price: 285.00, image: "../Imagens%20do%20site/Image%20(Product)%20(3).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png" },
    { id: 11, name: "Karambit Fade", price: 400.00, image: "../Imagens%20do%20site/Image%20(Product).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(3).png" },
    { id: 12, name: "Luvas Sport", price: 1265.00, image: "../Imagens%20do%20site/Image%20(Product)%20(1).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png" },
    { id: 13, name: "Adaga Stiletto", price: 2378.00, image: "../Imagens%20do%20site/Image%20(Product)%20(2).png", gameIcon: "../Imagens%20do%20site/Image%20(Game)%20(2).png" }
];

// State
let cart = [];
let favorites = [];
let searchTerm = '';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const profileBtn = document.querySelector('.nav-btn:last-of-type');

// Profile button navigation
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });
}

// Create Cart Icon SVG
function createCartIconSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "cart-icon");
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("preserveAspectRatio", "none");
    
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("clip-path", "url(#clip0_1_423)");
    
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", svgPaths.p22b32180);
    path1.setAttribute("stroke", "white");
    path1.setAttribute("stroke-linecap", "round");
    path1.setAttribute("stroke-linejoin", "round");
    path1.setAttribute("stroke-width", "1.33333");
    
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", svgPaths.pceec000);
    path2.setAttribute("stroke", "white");
    path2.setAttribute("stroke-linecap", "round");
    path2.setAttribute("stroke-linejoin", "round");
    path2.setAttribute("stroke-width", "1.33333");
    
    const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path3.setAttribute("d", svgPaths.p35e3f800);
    path3.setAttribute("stroke", "white");
    path3.setAttribute("stroke-linecap", "round");
    path3.setAttribute("stroke-linejoin", "round");
    path3.setAttribute("stroke-width", "1.33333");
    
    g.appendChild(path1);
    g.appendChild(path2);
    g.appendChild(path3);
    
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clipPath.setAttribute("id", "clip0_1_423");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("fill", "white");
    rect.setAttribute("width", "16");
    rect.setAttribute("height", "16");
    clipPath.appendChild(rect);
    defs.appendChild(clipPath);
    
    svg.appendChild(g);
    svg.appendChild(defs);
    
    return svg;
}



// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    
    const isFavorite = favorites.includes(product.id);
    
    card.innerHTML = `
        <img 
            src="../Imagens%20do%20site/Image%20(Info)%20(1).png" 
            alt="Info" 
            class="product-info-icon"
        >
        
        <img 
            src="${product.gameIcon}" 
            alt="Game" 
            class="product-game-icon"
        >
        
        <div class="product-image-container">
            <img 
                src="${product.image}" 
                alt="${product.name}" 
                class="product-image"
            >
        </div>
        
        <div class="product-price">
            R$ ${product.price.toFixed(2).replace('.', ',')}
        </div>
        
        <div class="product-buttons">
            <button class="buy-btn" data-product-id="${product.id}">
                <span>Comprar</span>
            </button>
            
            
        </div>
    `;
    
    // Add cart icon to buy button
    const buyBtn = card.querySelector('.buy-btn');
    buyBtn.insertBefore(createCartIconSVG(), buyBtn.firstChild);
    
    
    
    return card;
}

// Render Products
function renderProducts() {
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    productsGrid.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
    
    // Add event listeners
    addEventListeners();
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}?route=skins&search=${encodeURIComponent(searchTerm)}`);
        const result = await response.json();

        if (result.success) {
            products = result.skins.map((skin) => ({
                id: Number(skin.id),
                name: skin.name,
                price: Number(skin.price),
                image: skin.image,
                gameIcon: skin.gameIcon,
                game: skin.game,
                description: skin.description,
                exterior: skin.exterior
            }));
        }
    } catch (error) {
        console.warn('Usando produtos locais porque a API nao respondeu.', error);
    }

    renderProducts();
}

// Add Event Listeners
function addEventListeners() {
    // Buy buttons
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.productId);
            handleBuyClick(productId);
        });
    });
    
    
}

// Handle Buy Click - Navigate to purchase page
function handleBuyClick(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Save product data to localStorage for the purchase page
    localStorage.setItem('selectedProduct', JSON.stringify({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        gameIcon: product.gameIcon,
        game: product.game || (product.name.includes('CS') || product.name.includes('AK') || product.name.includes('Bayonet') ? 'Counter-Strike 2' : 'Outros Jogos'),
        description: product.description,
        exterior: product.exterior
    }));
    
    // Navigate to purchase page
    window.location.href = 'comprar.html';
}

// Add to Cart
function addToCart(productId) {
    cart.push(productId);
    updateCartCount();
    
    // Visual feedback
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} adicionado ao carrinho!`);
}

// Toggle Favorite
function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
    } else {
        favorites.push(productId);
    }
    
    // Re-render to update favorite icon
    renderProducts();
}

// Update Cart Count
function updateCartCount() {
    if (!cartCount) return;

    const count = cart.length;
    cartCount.textContent = count;
    
    if (count > 0) {
        cartCount.classList.add('active');
    } else {
        cartCount.classList.remove('active');
    }
}

// Show Notification
function showNotification(message) {
    // Simple console notification (you can enhance this with a toast notification)
    console.log(message);
    
    // Optional: Create a simple toast
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: #10355b;
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// Add CSS animations for toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Search Input Event Listener
searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    loadProducts();
});

// Initialize
loadProducts();
updateCartCount();
