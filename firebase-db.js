// Firebase Database Client
const firebaseConfig = {
  apiKey: "AIzaSyD1wQrOUiUQWmFc3XNIgwEJOkp82NvHQhA",
  authDomain: "airbnb-clone-e6275.firebaseapp.com",
  projectId: "airbnb-clone-e6275",
  storageBucket: "airbnb-clone-e6275.firebasestorage.app",
  messagingSenderId: "711426320432",
  appId: "1:711426320432:web:c5e576e1543c74b18ee5f5",
  measurementId: "G-55LM2QH1FT"
};

// Initialize Firebase Database
function initializeFirebaseDB() {
  if (!window.firebaseDB) {
    // Make sure Firebase app is loaded first
    if (!window.firebase) {
      // Load Firebase app if not already loaded
      const appScript = document.createElement('script');
      appScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
      appScript.onload = () => {
        // Initialize Firebase app first
        if (!firebase.apps.length) {
          window.firebase.initializeApp(firebaseConfig);
        }
        
        // Then load Firestore
        const firestoreScript = document.createElement('script');
        firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
        firestoreScript.onload = () => {
          window.firebaseDB = firebase.firestore();
          console.log('Firebase Firestore initialized');
          
          // After DB is initialized, set up any initial data or listeners
          setupListeners();
        };
        document.head.appendChild(firestoreScript);
      };
      document.head.appendChild(appScript);
    } else {
      // Firebase app already loaded, just load Firestore
      const firestoreScript = document.createElement('script');
      firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
      firestoreScript.onload = () => {
        window.firebaseDB = firebase.firestore();
        console.log('Firebase Firestore initialized');
        
        // After DB is initialized, set up any initial data or listeners
        setupListeners();
      };
      document.head.appendChild(firestoreScript);
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeFirebaseDB);

// Set up any real-time listeners
function setupListeners() {
  // Listen for authentication state to sync with user data
  if (window.firebase && window.firebase.auth && window.firebaseDB) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, set up user-specific data listeners
        loadUserFavorites(user.uid);
      }
    });
  }
}

// CRUD Operations for Properties

// Create a new property listing
async function createProperty(propertyData) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    const propertyRef = await firebaseDB.collection('properties').add({
      ...propertyData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Property created with ID:', propertyRef.id);
    return { success: true, id: propertyRef.id };
  } catch (error) {
    console.error('Error creating property:', error.message);
    return { success: false, message: error.message };
  }
}

// Get a specific property by ID
async function getProperty(propertyId) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    const doc = await firebaseDB.collection('properties').doc(propertyId).get();
    
    if (doc.exists) {
      const propertyData = { id: doc.id, ...doc.data() };
      return { success: true, property: propertyData };
    } else {
      return { success: false, message: "Property not found" };
    }
  } catch (error) {
    console.error('Error getting property:', error.message);
    return { success: false, message: error.message };
  }
}

// Get all properties with optional filtering
async function getProperties(filters = {}) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    let query = firebaseDB.collection('properties');
    
    // Apply filters if provided
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    
    if (filters.minPrice) {
      query = query.where('price', '>=', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query = query.where('price', '<=', filters.maxPrice);
    }
    
    const snapshot = await query.get();
    const properties = [];
    
    snapshot.forEach(doc => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, properties };
  } catch (error) {
    console.error('Error getting properties:', error.message);
    return { success: false, message: error.message };
  }
}

// Update an existing property
async function updateProperty(propertyId, propertyData) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    await firebaseDB.collection('properties').doc(propertyId).update({
      ...propertyData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Property updated:', propertyId);
    return { success: true };
  } catch (error) {
    console.error('Error updating property:', error.message);
    return { success: false, message: error.message };
  }
}

// Delete a property
async function deleteProperty(propertyId) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    await firebaseDB.collection('properties').doc(propertyId).delete();
    
    console.log('Property deleted:', propertyId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting property:', error.message);
    return { success: false, message: error.message };
  }
}

// User Favorites Functions

// Add a property to user's favorites
async function addToFavorites(userId, propertyId) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    await firebaseDB.collection('users').doc(userId).collection('favorites').doc(propertyId).set({
      propertyId,
      addedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('Added to favorites:', propertyId);
    return { success: true };
  } catch (error) {
    console.error('Error adding to favorites:', error.message);
    return { success: false, message: error.message };
  }
}

// Remove a property from user's favorites
async function removeFromFavorites(userId, propertyId) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    await firebaseDB.collection('users').doc(userId).collection('favorites').doc(propertyId).delete();
    
    console.log('Removed from favorites:', propertyId);
    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error.message);
    return { success: false, message: error.message };
  }
}

// Get user's favorite properties
async function getUserFavorites(userId) {
  try {
    if (!window.firebaseDB) {
      return { success: false, message: "Firebase DB not initialized yet" };
    }
    
    const snapshot = await firebaseDB.collection('users').doc(userId).collection('favorites').get();
    const favorites = [];
    
    snapshot.forEach(doc => {
      favorites.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, favorites };
  } catch (error) {
    console.error('Error getting favorites:', error.message);
    return { success: false, message: error.message };
  }
}

// Set up real-time listener for user favorites
function loadUserFavorites(userId) {
  if (!window.firebaseDB) {
    console.error("Firebase DB not initialized yet");
    return;
  }
  
  // Listen for changes in user's favorites
  const unsubscribe = firebaseDB.collection('users').doc(userId).collection('favorites')
    .onSnapshot((snapshot) => {
      const favorites = [];
      snapshot.forEach(doc => {
        favorites.push({ id: doc.id, ...doc.data() });
      });
      
      // Update UI with favorites
      updateFavoritesUI(favorites);
      
      // Store favorites in local state
      window.userFavorites = favorites;
    }, (error) => {
      console.error("Error listening for favorites:", error);
    });
    
  // Store the unsubscribe function to stop listening when needed
  window.unsubscribeFavorites = unsubscribe;
}

// Update UI to show favorite properties
function updateFavoritesUI(favorites) {
  // Find all property cards
  const propertyCards = document.querySelectorAll('.property');
  const favoriteIds = favorites.map(fav => fav.propertyId || fav.id);
  
  // Update the UI to show which properties are favorites
  propertyCards.forEach(card => {
    const propertyId = card.dataset.id;
    const favoriteIcon = card.querySelector('.property-favorite');
    
    if (favoriteIcon) {
      if (favoriteIds.includes(propertyId)) {
        favoriteIcon.classList.add('active');
        favoriteIcon.innerHTML = '❤️'; // Full heart
      } else {
        favoriteIcon.classList.remove('active');
        favoriteIcon.innerHTML = '♡'; // Empty heart
      }
    }
  });
}

// Toggle favorite status when user clicks on heart icon
function setupFavoriteToggle() {
  document.addEventListener('click', async (event) => {
    const favoriteIcon = event.target.closest('.property-favorite');
    if (!favoriteIcon) return;
    
    const propertyCard = favoriteIcon.closest('.property');
    if (!propertyCard) return;
    
    const propertyId = propertyCard.dataset.id;
    if (!propertyId) return;
    
    const user = firebase.auth().currentUser;
    if (!user) {
      // If user is not logged in, show login prompt
      alert('Please log in to save favorites');
      const loginModal = document.getElementById('loginModal');
      if (loginModal) loginModal.style.display = 'flex';
      return;
    }
    
    const isFavorite = favoriteIcon.classList.contains('active');
    
    if (isFavorite) {
      // Remove from favorites
      const result = await removeFromFavorites(user.uid, propertyId);
      if (result.success) {
        favoriteIcon.classList.remove('active');
        favoriteIcon.innerHTML = '♡'; // Empty heart
      }
    } else {
      // Add to favorites
      const result = await addToFavorites(user.uid, propertyId);
      if (result.success) {
        favoriteIcon.classList.add('active');
        favoriteIcon.innerHTML = '❤️'; // Full heart
      }
    }
  });
}

// Initialize favorite toggle functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', setupFavoriteToggle);

// Export functions for external use
window.firebaseDB = {
  createProperty,
  getProperty,
  getProperties,
  updateProperty,
  deleteProperty,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites
}; 