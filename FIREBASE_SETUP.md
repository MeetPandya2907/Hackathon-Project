# Firebase Setup Guide for Airbnb Clone

This guide will walk you through setting up Firebase authentication for your Airbnb clone project.

## 1. Create a Firebase Account and Project

1. Go to [https://firebase.google.com/](https://firebase.google.com/) and sign in with your Google account.
2. Click on "Get started" and then "Add project".
3. Enter a name for your project (e.g., "Airbnb Clone").
4. Choose whether to enable Google Analytics for your project (recommended).
5. Accept the terms and click "Create project".
6. Wait for your project to be provisioned.

## 2. Set Up Firebase Web App

1. From your Firebase project dashboard, click on the Web icon (`</>`) to add a web app.
2. Register your app with a nickname (e.g., "Airbnb Clone Web").
3. Optionally set up Firebase Hosting if you plan to deploy your site with Firebase.
4. Click "Register app".
5. You will now see your Firebase configuration. It should look something like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

6. Copy this configuration as you'll need it for the next step.

## 3. Configure Your Project

Open the `firebase-auth.js` file in your project and make sure your Firebase configuration is correctly set:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## 4. Enable Authentication Methods

1. From your Firebase project console, go to "Authentication" in the left sidebar.
2. Click on the "Sign-in method" tab.
3. Enable the authentication methods you want to use:
   - Email/Password: Click on it, enable it, and save.
   - Google: Click on it, enable it, and configure it with your app's information.
   - Facebook: Requires creating a Facebook Developer app and configuring OAuth.
   - Apple: Requires an Apple Developer account and configuration.

## 5. Configure Authorized Domains

1. In the Firebase console, go to Authentication > Settings > Authorized Domains.
2. Add your website domain to the list of authorized domains.
3. During development, localhost should already be authorized.

## 6. Configure Social Login Providers (Optional)

### For Google Auth:
1. It's already configured when you enable it in Firebase Authentication.
2. Make sure you've added your domains to the authorized domains list.

### For Facebook Auth:
1. Go to [Facebook Developers](https://developers.facebook.com/) and create a new app.
2. Set up Facebook Login and get your App ID and App Secret.
3. In Firebase, add these credentials to the Facebook authentication provider.
4. Add your Firebase OAuth redirect URL to your Facebook app settings.

### For Apple Auth:
1. You need an Apple Developer account.
2. Create a new Service ID for your application.
3. Configure Sign in with Apple for your Service ID.
4. Add your Firebase OAuth redirect URL to your Apple service configurations.
5. Generate a key and upload it to Firebase.

## 7. Testing Authentication

1. Load your application and click on the "Log in" or "Sign up" button.
2. Try creating a new account with email and password.
3. Test the login functionality with the created account.
4. Test social logins if you've configured them.
5. Test logging out functionality.

## 8. Firebase Realtime Database/Firestore (Optional)

If you want to store user data:

1. Go to "Firestore Database" or "Realtime Database" in the Firebase console.
2. Create a new database and start in test mode (for development).
3. Create collections/documents to store user profiles and other data.
4. Set up security rules to protect your data:

```
// Example Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 9. Firebase Storage (Optional)

If you need to store user files like profile pictures:

1. Go to "Storage" in the Firebase console.
2. Initialize Storage and set up security rules.
3. Use the Firebase Storage SDK to upload and manage files.

## Troubleshooting

### Common Issues:

1. **Firebase not defined**: Make sure the Firebase scripts are properly loaded before using Firebase functions.
   - Solution: Check the browser console for any loading errors. Ensure your scripts are in the correct order.

2. **Authentication errors**: Check the browser console for specific error messages.
   - Solution: Common issues include incorrect Firebase config, unauthorized domains, or authentication methods not enabled.

3. **Social login issues**: 
   - Solution: Verify that you've properly configured the OAuth providers and redirect URIs.

4. **CORS errors**: 
   - Solution: Add your domain to the authorized domains list in Firebase Authentication settings.

5. **Module import errors**: 
   - If you see errors related to ES modules, make sure you're either:
     - Using Firebase via CDN (no import statements)
     - Properly setting up a module bundler (webpack, rollup, etc.)
   - Don't mix module imports with script tag loading

6. **Firebase script loading timeout**:
   - Solution: Increase the timeout in the initialization code or implement a more robust loading check.

7. **Multiple Firebase instances**:
   - Solution: Make sure you're not initializing Firebase multiple times.

## Notes on Different Firebase SDK Versions

1. **Firebase Web SDK v9 (Modular)**:
   - Uses ES modules: `import { getAuth } from "firebase/auth";`
   - Smaller bundle size due to tree-shaking
   - Requires a build step with a module bundler

2. **Firebase Web v9 Compat (Compatibility Layer)**:
   - Available via CDN: `firebase-app-compat.js`, `firebase-auth-compat.js`
   - Uses the older namespaced syntax: `firebase.auth()`
   - Easier to use for simple projects without a build step

Our implementation uses the v9 Compat version for simplicity and to avoid requiring a build system.

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/start)
- [Firebase Web SDK Reference](https://firebase.google.com/docs/reference/js)
- [Firebase Authentication Error Codes](https://firebase.google.com/docs/auth/admin/errors) 