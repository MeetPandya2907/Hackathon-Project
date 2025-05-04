# Fixing Google Sign-In in Firebase

This guide will help you properly configure Google Authentication in your Firebase project to fix the "auth/configuration-not-found" error.

## Step 1: Enable Google Authentication in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/) and select your project "airbnb-clone-e6275"
2. In the left sidebar, click on **Authentication**
3. Click on the **Sign-in method** tab
4. Find **Google** in the list of providers and click on it
5. Toggle the **Enable** switch to **ON**
6. Enter a **Project support email** (your email address)
7. Click **Save**

## Step 2: Configure OAuth Consent Screen (if not already done)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure the correct project is selected (it should be the same Firebase project)
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Choose **External** user type (unless you have a Google Workspace organization)
5. Fill in the required information:
   - App name: "Airbnb Clone"
   - User support email: your email address
   - Developer contact information: your email address
6. Click **Save and Continue**
7. For scopes, add "email" and "profile"
8. Click **Save and Continue**
9. Add test users if needed (you can add your own email)
10. Click **Save and Continue**

## Step 3: Set up Authorized Domains in Firebase

1. Go back to Firebase Console > Authentication > Settings
2. Go to the **Authorized domains** tab
3. Make sure your domains are listed. During development, "localhost" should already be there
4. Add any other domains where you're hosting your app

## Step 4: Configure OAuth Redirect URI

1. Go to Google Cloud Console > APIs & Services > Credentials
2. Look for the OAuth 2.0 Client ID associated with your Firebase project
3. Click on it to edit
4. Under "Authorized JavaScript origins", make sure you have:
   - http://localhost
   - http://localhost:5000 (or whatever port you're using)
   - Your production domain (if any)
5. Under "Authorized redirect URIs", make sure you have:
   - https://airbnb-clone-e6275.firebaseapp.com/__/auth/handler
   - Your production domain's redirect URI
6. Click **Save**

## Step 5: Test Your Google Sign-In

After completing the above steps, try signing in with Google again. The error should be resolved.

## Troubleshooting

If you're still having issues:

1. **Check Browser Console**: Look for specific error messages
2. **Verify Project Configuration**: Make sure all steps above are completed correctly
3. **Check for Typos**: Ensure domain names are entered correctly
4. **Clear Browser Cache**: Sometimes old configurations can be cached
5. **Try Incognito Mode**: This can help identify if browser extensions are causing issues

## Common Errors

- **auth/configuration-not-found**: Google authentication is not properly configured in Firebase
- **auth/popup-blocked**: Browser is blocking the popup, check popup blocker settings
- **auth/popup-closed-by-user**: User closed the Google login popup before completing sign-in
- **auth/unauthorized-domain**: The domain you're hosting on is not authorized in Firebase 