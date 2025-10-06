# Starbucks Secret Menu

A responsive mobile-first website showcasing the Starbucks secret menu drinks with an elegant dark aesthetic.

## Features

- **Responsive Design**: Mobile-first approach with clean grid layout for desktop
- **Dark Theme**: Elegant black background with Starbucks green accents
- **Interactive Cards**: Smooth hover transitions and card animations
- **Favorites System**: Save favorite drinks using localStorage
- **Filter System**: Filter drinks by category (Coffee, Frappuccino, Tea & Refreshers)
- **Detailed Views**: Modal with ingredients and ordering instructions
- **Sticky Navigation**: Bottom navigation bar for easy mobile access

## Technologies Used

- **HTML5**: Semantic markup structure
- **CSS3**: Custom CSS with CSS variables for theming
- **JavaScript**: Vanilla JS for interactivity and data management
- **Font Awesome**: Icons for navigation and UI elements
- **Inter Font**: Modern, clean typography

## Project Structure

```
starbucks-secret-menu/
├── index.html              # Main homepage
├── css/
│   ├── input.css           # Tailwind CSS input file
│   └── output.css          # Compiled CSS with utilities
├── js/
│   └── app.js              # Main JavaScript functionality
├── data/
│   └── drinks.json         # Drinks data with ingredients and instructions
├── assets/
│   └── images/             # Image assets directory
├── package.json            # npm configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation
```

## Getting Started

1. Clone or download the project
2. Open `index.html` in your web browser
3. No build process required - everything runs client-side!

## Features Overview

### Drink Cards
- Clean, modern design with rounded corners
- Hover effects with smooth scaling
- Favorite button with heart icon
- Category badges
- Fallback placeholder images

### Modal Details
- Full-screen ingredient list
- Step-by-step ordering instructions
- Large drink image
- Easy-to-read typography
- Keyboard navigation support (ESC to close)

### Navigation
- Sticky bottom navigation for mobile
- Three main sections: Home, All Drinks, Favorites
- Visual feedback for active sections
- Smooth transitions

### Favorites System
- Click heart icon to add/remove favorites
- Persistent storage using localStorage
- Dedicated favorites view
- Empty state with call-to-action

## Customization

The design uses CSS custom properties for easy theming:

```css
:root {
  --starbucks-green: #00704A;
  --starbucks-light-green: #00A862;
  --dark-bg: #0D1117;
  --card-bg: #161B22;
}
```

## Browser Support

- Modern browsers with ES6+ support
- Mobile responsive design
- Touch-friendly interface

## License

This project is for educational purposes and demonstration only.