# Google Calendar Integration Troubleshooting

## Current Issue: Infinite Loading Spinner

The most common cause of the spinning circle is a CORS/OAuth configuration issue.

## Quick Fix Steps:

### 1. Check Google Cloud Console OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID
4. Click "Edit"
5. Under "Authorized JavaScript origins", ensure you have:
   - `http://localhost:8081`
   - `http://127.0.0.1:8081`
   - Your production domain (if applicable)

### 2. Verify API Key Restrictions

1. In the same "Credentials" section, find your API Key
2. Click "Edit"
3. Under "Application restrictions", choose "HTTP referrers"
4. Add these referrers:
   - `localhost:8081/*`
   - `127.0.0.1:8081/*`
   - Your production domain/*

### 3. Check Browser Console

Open browser Developer Tools (F12) and check the Console tab for errors:

- **CORS errors**: Fix OAuth origins as above
- **API Key errors**: Check API key restrictions
- **Network errors**: Check internet connectivity
- **Timeout errors**: May indicate network or server issues

### 4. Test API Keys

Check if your API keys are working by testing them manually:

```bash
# Test API Key (replace YOUR_API_KEY)
curl "https://www.googleapis.com/calendar/v3/calendars/primary?key=YOUR_API_KEY"
```

### 5. Common Error Messages

**"Origin http://localhost:8081 is not allowed by Access-Control-Allow-Origin"**
- Solution: Add `http://localhost:8081` to authorized origins

**"API key not valid"**
- Solution: Check API key restrictions or regenerate the key

**"redirect_uri_mismatch"**
- Solution: Add the correct redirect URI to OAuth client

## Temporary Workaround

If you need to test without Google Calendar integration:

1. Set the API keys to dummy values in `.env`:
```env
VITE_GOOGLE_API_KEY=disabled
VITE_GOOGLE_CLIENT_ID=disabled
```

2. The app will detect this and show a "Setup Required" message instead of loading indefinitely.

## Production Deployment

For production:
1. Add your production domain to authorized origins
2. Remove localhost entries from production OAuth client
3. Consider using environment-specific API keys

## Additional Notes

- Changes to OAuth settings may take a few minutes to take effect
- Clear browser cache if issues persist
- Ensure Google Calendar API is enabled in your project