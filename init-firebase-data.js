// This script initializes the Firebase database with sample property data
// Run this script once to populate your database

// Sample property data that matches our HTML properties
const sampleProperties = [
  {
    id: "1",
    title: "Beachfront apartment with sea view",
    location: "Mumbai, Maharashtra",
    category: "Beachfront",
    price: 82918,
    pricePerNight: 16584,
    dates: "12-17 May",
    rating: 4.93,
    image: "Images/img1.jpg",
    isFeatured: true,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Pool", "Beach access"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2
  },
  {
    id: "2",
    title: "Luxury loft in central location",
    location: "Delhi, NCR",
    category: "Luxury",
    price: 119139,
    pricePerNight: 23828,
    dates: "12-17 May",
    rating: 4.82,
    image: "Images/img2.jpg",
    isFeatured: true,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Workspace", "Gym"],
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 3
  },
  {
    id: "3",
    title: "Modern condo with city views",
    location: "Bangalore, Karnataka",
    category: "Design",
    price: 110527,
    pricePerNight: 22105,
    dates: "3-8 May",
    rating: 4.82,
    image: "Images/img3.avif",
    isFeatured: false,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Workspace", "City view"],
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    baths: 1
  },
  {
    id: "4",
    title: "Canal and city views",
    location: "Chennai, Tamil Nadu",
    category: "Amazing Views",
    price: 106649,
    pricePerNight: 21330,
    dates: "3-8 May",
    rating: 4.95,
    image: "Images/img4.avif",
    isFeatured: false,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Canal view", "Balcony"],
    maxGuests: 5,
    bedrooms: 2,
    beds: 3,
    baths: 2
  },
  {
    id: "5",
    title: "Heritage apartment in colonial building",
    location: "Kolkata, West Bengal",
    category: "Historical Homes",
    price: 136208,
    pricePerNight: 27242,
    dates: "23-28 Dec",
    rating: 4.85,
    image: "Images/img5.avif",
    isFeatured: true,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Historic building", "Garden"],
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2
  },
  {
    id: "6",
    title: "Spacious villa near Hussain Sagar",
    location: "Hyderabad, Telangana",
    category: "Luxe",
    price: 188227,
    pricePerNight: 37645,
    dates: "21-26 Jun",
    rating: 4.91,
    image: "Images/img6.jpg",
    isFeatured: false,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Pool", "Lake view"],
    maxGuests: 8,
    bedrooms: 4,
    beds: 6,
    baths: 4
  },
  {
    id: "7",
    title: "Mountain views",
    location: "Shimla, Himachal Pradesh",
    category: "Amazing Views",
    price: 139338,
    pricePerNight: 27868,
    dates: "9-14 Jul",
    rating: 4.88,
    image: "Images/img7.avif",
    isFeatured: false,
    amenities: ["Wifi", "Kitchen", "Fireplace", "Mountain view", "Hiking trails"],
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 1
  },
  {
    id: "8",
    title: "486 kilometres from Mumbai",
    location: "Pune, Maharashtra",
    category: "Design",
    price: 194044,
    pricePerNight: 38809,
    dates: "5-10 Dec",
    rating: 4.93,
    image: "Images/img8.avif",
    isFeatured: false,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Pool", "Garden"],
    maxGuests: 5,
    bedrooms: 3,
    beds: 3,
    baths: 2
  },
  {
    id: "9",
    title: "Beachfront villa in North Goa",
    location: "Goa",
    category: "Beachfront",
    price: 156780,
    pricePerNight: 31356,
    dates: "7-12 June",
    rating: 4.97,
    image: "Images/img9.jpg",
    isFeatured: false,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Beach access", "Pool"],
    maxGuests: 10,
    bedrooms: 5,
    beds: 7,
    baths: 5
  },
  {
    id: "10",
    title: "Waterfront home with backwater views",
    location: "Kochi, Kerala",
    category: "Amazing Views",
    price: 92500,
    pricePerNight: 18500,
    dates: "14-19 August",
    rating: 4.89,
    image: "Images/img1.avif",
    isFeatured: true,
    amenities: ["Wifi", "Kitchen", "Air conditioning", "Backwater view", "Boat dock"],
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 3
  }
];

// Wait for Firebase to be fully initialized
setTimeout(async () => {
  if (!window.firebase || !window.firebaseDB) {
    console.error("Firebase or Firestore not initialized yet");
    return;
  }

  console.log("Initializing database with sample data...");
  
  // Get a reference to the Firestore database
  const db = firebase.firestore();
  
  // Add each property to the database
  for (const property of sampleProperties) {
    try {
      // Check if property already exists to avoid duplicates
      const docRef = db.collection('properties').doc(property.id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        // Add timestamp fields
        const propertyWithTimestamp = {
          ...property,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add to database with specific ID
        await docRef.set(propertyWithTimestamp);
        console.log(`Added property: ${property.title}`);
      } else {
        console.log(`Property ${property.id} already exists, skipping...`);
      }
    } catch (error) {
      console.error(`Error adding property ${property.id}:`, error);
    }
  }
  
  console.log("Database initialization complete!");
}, 3000); // Wait 3 seconds for Firebase to initialize 