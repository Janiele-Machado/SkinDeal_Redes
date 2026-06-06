// DOM Elements
const backBtn = document.getElementById('back-btn');
const shareBtn = document.getElementById('share-btn');
const buyBtn = document.getElementById('buy-btn');
const productImage = document.getElementById('product-image');
const gameIcon = document.getElementById('game-icon');
const steamIcon = document.getElementById('steam-icon');
const API_URL = '../api.php';

// Load product data from localStorage or use default
function loadProductData() {
    const savedProduct = localStorage.getItem('selectedProduct');
    
    if (savedProduct) {
        try {
            const product = JSON.parse(savedProduct);
            return {
                id: product.id,
                name: product.name || 'Bayonet - Crimson Web',
                game: product.game || 'Counter-Strike 2',
                exterior: 'Testado em Campo',
                description: 'Com design relativamente inalterado desde a segunda Guerra Mundial, a baioneta ainda tem um lugar em estratégias militares modernas. Esta arma foi pintada usando um hidrográfico de teia de aranha sobre um revestimento vermelho com camada de verniz.',
                priceSkindeal: product.price || 1250.50,
                priceAnnounced: (product.price || 1250.50) * 1.05, // 5% higher
                image: product.image || 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjuI7TDglRd4cJ5ntbN9J7yjRrs-UJoNmHxI4KQJAI9ZFvU-gC-xOfxxcjrYDw6lg/360fx360f',
                gameIcon: product.gameIcon || 'https://cdn.cloudflare.steamstatic.com/apps/730/header.jpg',
                steamIcon: 'https://steamcommunity-a.akamaihd.net/economy/image/IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdA2l_qgtoa2jmZWXYS04njOL-VA/360fx360f'
            };
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
        }
    }
    
    // Default product
    return {
        id: 1,
        name: 'Bayonet - Crimson Web',
        game: 'Counter-Strike 2',
        exterior: 'Testado em Campo',
        description: 'Com design relativamente inalterado desde a segunda Guerra Mundial, a baioneta ainda tem um lugar em estratégias militares modernas. Esta arma foi pintada usando um hidrográfico de teia de aranha sobre um revestimento vermelho com camada de verniz.',
        priceSkindeal: 1250.50,
        priceAnnounced: 1312.52,
        image: 'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpovbSsLQJf3qr3czxb49KzgL-KmsjuI7TDglRd4cJ5ntbN9J7yjRrs-UJoNmHxI4KQJAI9ZFvU-gC-xOfxxcjrYDw6lg/360fx360f',
        gameIcon: 'https://cdn.cloudflare.steamstatic.com/apps/730/header.jpg',
        steamIcon: 'https://steamcommunity-a.akamaihd.net/economy/image/IzMF03bi9WpSBq-S-ekoE33L-iLqGFHVaU25ZzQNQcXdA2l_qgtoa2jmZWXYS04njOL-VA/360fx360f'
    };
}

// Product data
let productData = loadProductData();

async function loadProductFromApi() {
    if (!productData.id) return;

    try {
        const response = await fetch(`${API_URL}?route=skin&id=${encodeURIComponent(productData.id)}`);
        const result = await response.json();

        if (result.success) {
            productData = {
                id: Number(result.skin.id),
                name: result.skin.name,
                game: result.skin.game,
                exterior: result.skin.exterior || productData.exterior,
                description: result.skin.description || productData.description,
                priceSkindeal: Number(result.skin.price),
                priceAnnounced: Number(result.skin.price) * 1.05,
                image: result.skin.image,
                gameIcon: result.skin.gameIcon,
                steamIcon: productData.steamIcon
            };
        }
    } catch (error) {
        console.warn('Usando produto local porque a API nao respondeu.', error);
    }
}

// Initialize page with product data
function initializePage() {
    // Set header title
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) {
        headerTitle.textContent = productData.name;
    }
    
    // Set product image
    if (productImage) {
        productImage.src = productData.image;
        productImage.alt = productData.name;
    }

    // Set game icon and name
    if (gameIcon) {
        gameIcon.src = productData.gameIcon;
        gameIcon.alt = productData.game;
    }
    
    const gameName = document.querySelector('.game-name');
    if (gameName) {
        gameName.textContent = productData.game;
    }
    
    // Set product name
    const productName = document.querySelector('.product-name');
    if (productName) {
        productName.textContent = productData.name;
    }
    
    // Set prices
    const priceValue = document.querySelector('.price-value');
    if (priceValue) {
        priceValue.textContent = `R$ ${productData.priceAnnounced.toFixed(2).replace('.', ',')}`;
    }
    
    const skindealPrice = document.querySelector('.skindeal-price');
    if (skindealPrice) {
        skindealPrice.textContent = `R$ ${productData.priceSkindeal.toFixed(2).replace('.', ',')}`;
    }
    
    const announcedPrice = document.querySelector('.announced-price');
    if (announcedPrice) {
        announcedPrice.textContent = `R$ ${productData.priceAnnounced.toFixed(2).replace('.', ',')}`;
    }

    // Set steam icon
    if (steamIcon) {
        steamIcon.src = productData.steamIcon;
    }
}

// Back button navigation
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'home.html';
    });
}

// Share button functionality
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: `${productData.name} - SkinDeal`,
            text: `Confira esta skin: ${productData.name} por R$ ${productData.priceSkindeal.toFixed(2)}`,
            url: window.location.href
        };

        try {
            // Check if Web Share API is supported
            if (navigator.share) {
                await navigator.share(shareData);
                showNotification('Compartilhado com sucesso!', 'success');
            } else {
                // Fallback: Copy URL to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showNotification('Link copiado para a área de transferência!', 'success');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Erro ao compartilhar:', err);
                showNotification('Erro ao compartilhar', 'error');
            }
        }
    });
}

// Buy button functionality
if (buyBtn) {
    buyBtn.addEventListener('click', () => {
        // Save product data for checkout page
        localStorage.setItem('selectedProduct', JSON.stringify({
            id: productData.id,
            name: productData.name,
            price: productData.priceSkindeal,
            image: productData.image,
            gameIcon: productData.gameIcon,
            game: productData.game
        }));
        
        // Redirect to checkout page
        window.location.href = 'finalizar-compra.html';
    });
}

// Update cart count
function updateCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Update cart badge if it exists
        const cartBadge = document.querySelector('.cart-count');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            if (totalItems > 0) {
                cartBadge.style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar contagem do carrinho:', error);
    }
}

// Show Notification Toast
function showNotification(message, type = 'info') {
    console.log(message);
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.textContent = message;
    
    const backgroundColor = type === 'error' ? '#d32f2f' : 
                           type === 'success' ? '#10355b' : '#10355b';
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background-color: ${backgroundColor};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 1100;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', 'Arial', sans-serif;
        max-width: 90%;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
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

// Image fallback handling
if (productImage) {
    productImage.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/350x200/6b6b6b/ffffff?text=Bayonet+Crimson+Web';
    });
}

if (gameIcon) {
    gameIcon.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/30/10355b/ffffff?text=CS2';
    });
}

if (steamIcon) {
    steamIcon.addEventListener('error', function() {
        this.src = '../Imagens do site/Image (Steam).png';
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to go back
    if (e.key === 'Escape') {
        window.location.href = 'home.html';
    }
    
    // Ctrl/Cmd + B to buy
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        buyBtn.click();
    }
    
    // Ctrl/Cmd + S to share
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        shareBtn.click();
    }
});

// Smooth scroll for sticky elements
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove shadow to header on scroll
    const header = document.querySelector('.header');
    if (scrollTop > 10) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Initialize page
window.addEventListener('DOMContentLoaded', async () => {
    await loadProductFromApi();
    initializePage();
    updateCartCount();
    console.log('Página de Compra carregada - Produto:', productData.name);
});

// Track page view
console.log('Comprar - Página carregada');
