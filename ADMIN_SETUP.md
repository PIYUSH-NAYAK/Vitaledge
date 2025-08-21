# Admin Setup Guide

This guide explains how to set up admin functionality for the Vitaledge application.

## Features

- **Admin Page**: A dedicated admin dashboard accessible at `/admin`
- **Custom Claims**: Set admin privileges for users via Firebase Custom Claims
- **Protected Routes**: Admin-only routes and navigation items
- **User Management**: Grant admin privileges to users by email

## Setting Up the First Admin

### Prerequisites
- Backend server must be running
- Firebase Admin SDK properly configured with service account credentials
- User must be registered in the system first

### Steps

1. **Register a user account** through the normal registration process at `/register`

2. **Set admin privileges** using the setup script:
   ```bash
   cd backend
   npm run setup-admin your-email@example.com
   ```

   Or run directly:
   ```bash
   cd backend
   node Utils/setupAdmin.js your-email@example.com
   ```

3. **Verify admin access**:
   - Log out and log back in to refresh the token
   - Navigate to `/admin` - you should see the admin dashboard
   - The "Admin" link should appear in the navigation menu

## Admin Functionality

### Admin Page (`/admin`)
- **Welcome Message**: "Hi Admin! 👋"
- **Grant Admin Privileges**: Set admin claims for other users by email
- **Current Admin Info**: View your admin status and details

### API Endpoints

The backend provides these admin endpoints:

- `POST /admin/set-custom-claim` - Set custom claims for a user
- `GET /admin/user-claims/:email` - Get user's custom claims
- `GET /admin/users` - List all users (admin only)

### Using the Admin Panel

1. **Access the Admin Page**: Navigate to `/admin` after logging in as an admin
2. **Grant Admin Access**: 
   - Enter a user's email address
   - Click "Set Admin Claim"
   - The user will need to log out and log back in to see admin features

## Security Notes

- All admin routes require authentication
- Admin endpoints verify the requesting user has admin claims
- Only existing admin users can grant admin privileges to others
- Users must refresh their tokens (log out/in) to see new privileges

## Troubleshooting

### "Access Denied" Error
- Verify the user has admin claims set
- Try logging out and logging back in to refresh the token
- Check the backend logs for authentication errors

### Admin Link Not Showing
- Ensure the user has logged out and back in after being granted admin privileges
- Check browser console for any JavaScript errors
- Verify the Firebase token includes the admin claim

### Backend Errors
- Ensure Firebase Admin SDK is properly initialized
- Check that all required environment variables are set
- Verify the Firebase service account has the necessary permissions

## Environment Variables

Make sure these are set in your backend `.env` file:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Development Notes

- The admin navigation item is conditionally rendered based on user's admin status
- Admin status is checked on every page load and user authentication change
- All admin routes are protected with the `ProtectedRoute` component
- Backend admin routes use Firebase Auth middleware for security
