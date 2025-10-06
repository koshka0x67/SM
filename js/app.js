// Global variables
let drinksData = []
const favorites = JSON.parse(localStorage.getItem("starbucks-favorites")) || []
let currentFilter = "all"

// Load drinks data and initialize app
async function loadDrinks() {
  try {
    const response = await fetch("./data/drinks.json")
    const data = await response.json()
    drinksData = data.drinks
    displayDrinks(drinksData)
  } catch (error) {
    console.error("Error loading drinks:", error)
    displayErrorMessage()
  }
}

// Display drinks in grid
function displayDrinks(drinks) {
  const container = document.getElementById("drinks-container")
  const fragment = document.createDocumentFragment()

  drinks.forEach((drink) => {
    const drinkCard = createDrinkCard(drink)
    fragment.appendChild(drinkCard)
  })

  container.innerHTML = ""
  container.appendChild(fragment)
}

// Create individual drink card
function createDrinkCard(drink) {
  const card = document.createElement("div")
  card.className = "drink-card"
  card.onclick = () => openDrinkModal(drink)

  const isFavorite = favorites.includes(drink.id)
  const heartClass = isFavorite ? "fas fa-heart" : "far fa-heart"
  const favoriteClass = isFavorite ? "is-favorite" : ""

  card.innerHTML = `
        <div class="drink-card-image-wrapper">
            <img src="${drink.image}" alt="${drink.name}" class="drink-card-image" 
                 onerror="this.src='https://via.placeholder.com/400x300/0A0E13/00A862?text=${encodeURIComponent(drink.name)}'">
            <button onclick="event.stopPropagation(); toggleFavorite(${drink.id})" 
                    class="favorite-btn ${favoriteClass}" data-drink-id="${drink.id}">
                <i class="${heartClass}"></i>
            </button>
        </div>
        <div class="drink-card-content">
            <h3 class="drink-card-title">${drink.name}</h3>
            <p class="drink-card-description">${drink.description}</p>
            <div class="drink-card-footer">
                <span class="drink-category">${drink.category.replace("_", " & ")}</span>
                <button class="view-recipe-btn">View Recipe</button>
            </div>
        </div>
    `

  return card
}

// Open drink detail modal
function openDrinkModal(drink) {
  const modal = document.getElementById("drink-modal")
  const modalInner = document.getElementById("modal-inner")

  const isFavorite = favorites.includes(drink.id)
  const heartClass = isFavorite ? "fas fa-heart" : "far fa-heart"
  const favoriteClass = isFavorite ? "is-favorite" : ""

  modalInner.innerHTML = `
        <div class="modal-image-wrapper">
            <img src="${drink.image}" alt="${drink.name}" class="modal-image"
                 onerror="this.src='https://via.placeholder.com/600x400/0A0E13/00A862?text=${encodeURIComponent(drink.name)}'">
            <button onclick="closeModal()" class="modal-close-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="modal-body">
            <div class="modal-header">
                <div class="modal-title-group">
                    <h2 class="modal-title">${drink.name}</h2>
                    <span class="modal-category">${drink.category.replace("_", " & ")}</span>
                </div>
                <button onclick="toggleFavorite(${drink.id})" 
                        class="modal-favorite-btn ${favoriteClass}" data-drink-id="${drink.id}">
                    <i class="${heartClass}"></i>
                </button>
            </div>
            
            <p class="modal-description">${drink.description}</p>
            
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-list-ul"></i>
                    Ingredients
                </h3>
                <ul class="ingredients-list">
                    ${drink.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
                </ul>
            </div>
            
            <div class="modal-section">
                <h3 class="modal-section-title">
                    <i class="fas fa-clipboard-list"></i>
                    How to Order
                </h3>
                <div class="instructions-box">
                    <p class="instructions-text">${drink.instructions}</p>
                </div>
            </div>
            
            <button onclick="closeModal()" class="modal-action-btn">
                Got it!
            </button>
        </div>
    `

  modal.classList.add("show")
  document.body.style.overflow = "hidden"

  // Animate modal entrance
  setTimeout(() => {
    modal.querySelector(".modal-content").style.transform = "scale(1)"
  }, 10)
}

// Close modal
function closeModal() {
  const modal = document.getElementById("drink-modal")
  modal.classList.remove("show")
  document.body.style.overflow = "auto"
}

// Toggle favorite status
function toggleFavorite(drinkId) {
  const index = favorites.indexOf(drinkId)

  if (index > -1) {
    favorites.splice(index, 1)
  } else {
    favorites.push(drinkId)
  }

  localStorage.setItem("starbucks-favorites", JSON.stringify(favorites))
  updateFavoriteButtons(drinkId)

  if (currentFilter === "favorites") {
    showFavorites()
  }
}

// Update favorite buttons
function updateFavoriteButtons(drinkId) {
  const isFavorite = favorites.includes(drinkId)
  const heartClass = isFavorite ? "fas fa-heart" : "far fa-heart"
  const favoriteClass = isFavorite ? "is-favorite" : ""

  const buttons = document.querySelectorAll(`[data-drink-id="${drinkId}"]`)
  buttons.forEach((button) => {
    const icon = button.querySelector("i")
    if (icon) {
      icon.className = heartClass
    }

    if (isFavorite) {
      button.classList.add("is-favorite")
    } else {
      button.classList.remove("is-favorite")
    }
  })
}

// Show all drinks
function showAllDrinks() {
  currentFilter = "all"
  displayDrinks(drinksData)
  updateNavigation("home")
}

// Show favorites
function showFavorites() {
  currentFilter = "favorites"
  const favoriteDrinks = drinksData.filter((drink) => favorites.includes(drink.id))

  if (favoriteDrinks.length === 0) {
    displayNoFavorites()
  } else {
    displayDrinks(favoriteDrinks)
  }

  updateNavigation("favorites")
}

// Display no favorites message
function displayNoFavorites() {
  const container = document.getElementById("drinks-container")
  container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="far fa-heart"></i>
            </div>
            <h3 class="empty-state-title">No favorites yet</h3>
            <p class="empty-state-description">Start adding drinks to your favorites by tapping the heart icon!</p>
            <button onclick="showAllDrinks()" class="empty-state-btn">
                Browse Drinks
            </button>
        </div>
    `
}

// Update navigation active state
function updateNavigation(active) {
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  const activeItem = document.querySelector(`.nav-item[data-nav="${active}"]`)
  if (activeItem) {
    activeItem.classList.add("active")
  }
}

// Display error message
function displayErrorMessage() {
  const container = document.getElementById("drinks-container")
  container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 class="empty-state-title">Oops! Something went wrong</h3>
            <p class="empty-state-description">We couldn't load the secret menu drinks. Please try refreshing the page.</p>
            <button onclick="location.reload()" class="empty-state-btn">
                Refresh Page
            </button>
        </div>
    `
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadDrinks()

  // Close modal when clicking outside
  document.getElementById("drink-modal").addEventListener("click", function (e) {
    if (e.target === this || e.target.classList.contains("modal-wrapper")) {
      closeModal()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
    }
  })
})
