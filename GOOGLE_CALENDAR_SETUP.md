# Google Calendar Integration Setup

This guide explains how to set up Google Calendar integration for the DOOD? Material Science Learning Platform.

## Prerequisites

1. A Google Cloud Platform account
2. Access to Google Cloud Console
3. A Google Calendar account

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note down your project ID

### 2. Enable Google Calendar API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

### 3. Create Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key and add it to your `.env` file as `VITE_GOOGLE_API_KEY`
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Configure the consent screen if prompted
6. Choose "Web application" as the application type
7. Add your domain to "Authorized JavaScript origins" (e.g., `http://localhost:8081` for development)
8. Copy the Client ID and add it to your `.env` file as `VITE_GOOGLE_CLIENT_ID`

### 4. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "DOOD? Material Science Platform"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `https://www.googleapis.com/auth/calendar`
5. Add test users if in testing mode

### 5. Update Environment Variables

Add these variables to your `.env` file:

```env
# For Google Calendar integration
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

## Features

### 📤 Export to Google Calendar
- Exports your study schedule to Google Calendar
- Creates events with proper titles, descriptions, and time slots
- Color-codes events by type (Quiz: Blue, Exam: Red, Flashcards: Yellow)

### 📥 Import from Google Calendar
- Imports study-related events from your Google Calendar
- Filters events containing keywords like "study", "quiz", "exam", "material science"
- Displays imported events in the calendar view

### 🔄 Two-way Sync
- Combines export and import functionality
- Keeps your local calendar and Google Calendar in sync
- Shows sync status and last sync time

### 🔐 Secure Authentication
- Uses Google OAuth 2.0 for secure authentication
- No passwords stored - uses secure token-based access
- Users can sign in/out at any time

## Usage

1. Navigate to the Calendar page in the application
2. In the "Google Calendar Integration" section, click "Connect"
3. Sign in with your Google account and grant calendar permissions
4. Use the Export, Import, or Full Sync buttons as needed

## Troubleshooting

### Common Issues

**"Failed to sign in to Google Calendar"**
- Check that your OAuth Client ID is correct
- Ensure your domain is added to authorized origins
- Verify the OAuth consent screen is published

**"API Key not found"**
- Check that the Google Calendar API is enabled
- Verify your API key is correct in the `.env` file
- Ensure the API key has no domain restrictions conflicting with your setup

**"Calendar events not syncing"**
- Check internet connectivity
- Verify you have granted calendar permissions
- Try signing out and signing back in

### Development vs Production

For development:
- Add `http://localhost:8081` to authorized origins
- Use test users in OAuth consent screen

For production:
- Add your production domain to authorized origins
- Publish the OAuth consent screen for public use
- Consider using a custom domain with HTTPS

## Security Considerations

- API keys and Client IDs are safe to expose in frontend code
- OAuth tokens are handled securely by Google's libraries
- Users maintain full control over calendar access permissions
- The app only requests calendar access, not other Google services

## Cost Considerations

- Google Calendar API has generous free quotas (1,000,000 requests/day)
- Standard usage of this integration will stay well within free limits
- Monitor usage in Google Cloud Console if needed