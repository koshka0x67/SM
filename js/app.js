// Global variables
let drinksData = [];
let favorites = JSON.parse(localStorage.getItem('starbucks-favorites')) || [];
let currentFilter = 'all';

// Load drinks data and initialize app
async function loadDrinks() {
    try {
        const response = await fetch('./data/drinks.json');
        const data = await response.json();
        drinksData = data.drinks;
        displayDrinks(drinksData);
    } catch (error) {
        console.error('Error loading drinks:', error);
        // Fallback if JSON fails to load
        displayErrorMessage();
    }
}

// Display drinks in grid
function displayDrinks(drinks) {
    const container = document.getElementById('drinks-container');
    container.innerHTML = '';

    drinks.forEach(drink => {
        const drinkCard = createDrinkCard(drink);
        container.appendChild(drinkCard);
    });
}

// Create individual drink card
function createDrinkCard(drink) {
    const card = document.createElement('div');
    card.className = 'drink-card';
    card.onclick = () => openDrinkModal(drink);

    const isFavorite = favorites.includes(drink.id);
    const heartIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
    const heartColor = isFavorite ? 'text-red-500' : 'text-gray-400';

    card.innerHTML = `
        <div class="relative">
            <img src="${drink.image}" alt="${drink.name}" class="drink-card-image" 
                 onerror="this.src='https://via.placeholder.com/300x200/161B22/00704A?text=Starbucks'">
            <button onclick="event.stopPropagation(); toggleFavorite(${drink.id})" 
                    class="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all duration-200">
                <i class="${heartIcon} ${heartColor} text-lg"></i>
            </button>
        </div>
        <h3 class="font-bold text-lg mb-2">${drink.name}</h3>
        <p class="text-gray-300 text-sm mb-3">${drink.description}</p>
        <div class="flex justify-between items-center">
            <span class="text-starbucks-green text-xs font-medium uppercase tracking-wide">
                ${drink.category.replace('_', ' & ')}
            </span>
            <button class="btn-primary text-sm py-1 px-3">
                View Recipe
            </button>
        </div>
    `;

    return card;
}

// Open drink detail modal
function openDrinkModal(drink) {
    const modal = document.getElementById('drink-modal');
    const modalContent = document.getElementById('modal-content');
    
    const isFavorite = favorites.includes(drink.id);
    const heartIcon = isFavorite ? 'fas fa-heart text-red-500' : 'far fa-heart text-gray-400';
    
    modalContent.innerHTML = `
        <div class="relative">
            <img src="${drink.image}" alt="${drink.name}" class="w-full h-64 object-cover rounded-t-xl"
                 onerror="this.src='https://via.placeholder.com/400x256/161B22/00704A?text=Starbucks'">
            <button onclick="closeModal()" 
                    class="absolute top-4 right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all duration-200">
                <i class="fas fa-times text-white text-lg"></i>
            </button>
        </div>
        
        <div class="p-6">
            <div class="flex items-start justify-between mb-4">
                <div>
                    <h2 class="text-2xl font-bold mb-2">${drink.name}</h2>
                    <span class="text-starbucks-green text-sm font-medium uppercase tracking-wide">
                        ${drink.category.replace('_', ' & ')}
                    </span>
                </div>
                <button onclick="toggleFavorite(${drink.id})" 
                        class="p-2 hover:scale-110 transition-transform duration-200">
                    <i class="${heartIcon} text-2xl"></i>
                </button>
            </div>
            
            <p class="text-gray-300 mb-6">${drink.description}</p>
            
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-3 text-starbucks-green">Ingredients</h3>
                <ul class="list-disc list-inside space-y-1 text-gray-300">
                    ${drink.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            
            <div class="mb-6">
                <h3 class="text-lg font-semibold mb-3 text-starbucks-green">How to Order</h3>
                <div class="bg-dark-bg p-4 rounded-lg border-l-4 border-starbucks-green">
                    <p class="text-gray-200">${drink.instructions}</p>
                </div>
            </div>
            
            <button onclick="closeModal()" class="btn-primary w-full py-3">
                Got it!
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('drink-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Toggle favorite status
function toggleFavorite(drinkId) {
    const index = favorites.indexOf(drinkId);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(drinkId);
    }
    
    localStorage.setItem('starbucks-favorites', JSON.stringify(favorites));
    
    // Refresh display
    if (currentFilter === 'favorites') {
        showFavorites();
    } else {
        displayDrinks(getFilteredDrinks());
    }
    
    // Update modal if open
    const modal = document.getElementById('drink-modal');
    if (!modal.classList.contains('hidden')) {
        const drink = drinksData.find(d => d.id === drinkId);
        if (drink) {
            openDrinkModal(drink);
        }
    }
}

// Filter drinks by category
function filterDrinks(category) {
    currentFilter = category;
    
    // Update filter button styles
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-starbucks-green');
        btn.classList.add('bg-gray-700');
    });
    
    event.target.classList.add('active', 'bg-starbucks-green');
    event.target.classList.remove('bg-gray-700');
    
    // Update navigation
    updateNavigation('all');
    
    const filtered = getFilteredDrinks();
    displayDrinks(filtered);
}

// Get filtered drinks
function getFilteredDrinks() {
    if (currentFilter === 'all') {
        return drinksData;
    }
    return drinksData.filter(drink => drink.category === currentFilter);
}

// Show all drinks
function showAllDrinks() {
    currentFilter = 'all';
    displayDrinks(drinksData);
    updateNavigation('all');
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-starbucks-green');
        btn.classList.add('bg-gray-700');
    });
    
    document.querySelector('.filter-btn').classList.add('active', 'bg-starbucks-green');
    document.querySelector('.filter-btn').classList.remove('bg-gray-700');
}

// Show favorites
function showFavorites() {
    currentFilter = 'favorites';
    const favoriteDrinks = drinksData.filter(drink => favorites.includes(drink.id));
    
    if (favoriteDrinks.length === 0) {
        displayNoFavorites();
    } else {
        displayDrinks(favoriteDrinks);
    }
    
    updateNavigation('favorites');
    
    // Reset filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-starbucks-green');
        btn.classList.add('bg-gray-700');
    });
}

// Display no favorites message
function displayNoFavorites() {
    const container = document.getElementById('drinks-container');
    container.innerHTML = `
        <div class="col-span-full text-center py-12">
            <i class="far fa-heart text-6xl text-gray-600 mb-4"></i>
            <h3 class="text-xl font-semibold mb-2 text-gray-400">No favorites yet</h3>
            <p class="text-gray-500">Start adding drinks to your favorites by clicking the heart icon!</p>
            <button onclick="showAllDrinks()" class="btn-primary mt-4">
                Browse Drinks
            </button>
        </div>
    `;
}

// Update navigation active state
function updateNavigation(active) {
    document.querySelectorAll('.nav-item').forEach(item => {
        const span = item.querySelector('span');
        const icon = item.querySelector('i');
        
        span.classList.remove('text-starbucks-green');
        span.classList.add('text-gray-400');
        icon.classList.remove('text-starbucks-green');
        icon.classList.add('nav-icon');
    });
    
    // Set active navigation item
    const navItems = document.querySelectorAll('.nav-item');
    let activeIndex = 0;
    
    if (active === 'favorites') activeIndex = 2;
    else if (active === 'all') activeIndex = 1;
    
    if (navItems[activeIndex]) {
        const span = navItems[activeIndex].querySelector('span');
        const icon = navItems[activeIndex].querySelector('i');
        
        span.classList.add('text-starbucks-green');
        span.classList.remove('text-gray-400');
        icon.classList.add('text-starbucks-green');
    }
}

// Display error message
function displayErrorMessage() {
    const container = document.getElementById('drinks-container');
    container.innerHTML = `
        <div class="col-span-full text-center py-12">
            <i class="fas fa-exclamation-triangle text-6xl text-yellow-500 mb-4"></i>
            <h3 class="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p class="text-gray-400">We couldn't load the secret menu drinks. Please try refreshing the page.</p>
            <button onclick="location.reload()" class="btn-primary mt-4">
                Refresh Page
            </button>
        </div>
    `;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadDrinks();
    
    // Close modal when clicking outside
    document.getElementById('drink-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Service worker registration (optional, for offline capability)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed');
        });
    });
}