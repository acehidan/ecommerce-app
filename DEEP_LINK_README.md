# Deep Link Setup for komin-diy App

## Overview
This app now supports deep linking with the custom URL scheme `komin-diy://`. The main deep link implemented is `komin-diy://payment_result` which handles payment callbacks.

## Configuration

### 1. App Configuration
The deep link scheme is already configured in `app.json`:
```json
{
  "expo": {
    "scheme": "komin-diy"
  }
}
```

### 2. Route Setup
- **Payment Result Route**: `/payment_result` - Handles payment callback with parameters
- **Test Route**: `/deep-link-test` - Testing interface for deep links

## Usage

### Deep Link Format
```
komin-diy://payment_result?status=STATUS&transaction_id=ID&amount=AMOUNT&message=MESSAGE
```

### Parameters
- `status` (required): Payment status - `success`, `failed`, or `pending`
- `transaction_id` (optional): Transaction identifier
- `amount` (optional): Payment amount
- `message` (optional): Additional message

### Example URLs

#### Successful Payment
```
komin-diy://payment_result?status=success&transaction_id=TXN123456&amount=99.99&message=Payment completed successfully
```

#### Failed Payment
```
komin-diy://payment_result?status=failed&transaction_id=TXN123456&amount=99.99&message=Payment failed due to insufficient funds
```

#### Pending Payment
```
komin-diy://payment_result?status=pending&transaction_id=TXN123456&amount=99.99&message=Payment is being processed
```

#### Basic Link
```
komin-diy://payment_result
```

## Implementation Details

### Files Created/Modified

1. **`app/payment_result.jsx`** - Main payment result screen
   - Handles deep link parameters
   - Shows appropriate UI based on payment status
   - Auto-redirects to home after 3 seconds

2. **`services/utils/deepLinkUtils.js`** - Utility functions
   - `generatePaymentResultLink()` - Generate deep link URLs
   - `openDeepLink()` - Open deep links programmatically
   - `testDeepLinkSupport()` - Test if app can handle deep links
   - `EXAMPLE_LINKS` - Pre-configured example links

3. **`app/deep-link-test.jsx`** - Testing interface
   - Visual testing of different deep link scenarios
   - Shows generated URLs
   - Test buttons for each scenario

4. **`app/_layout.jsx`** - Updated to include new routes

### Using the Utility Functions

```javascript
import { generatePaymentResultLink, openDeepLink } from '../services/utils/deepLinkUtils';

// Generate a payment result link
const link = generatePaymentResultLink({
  status: 'success',
  transaction_id: 'TXN123456',
  amount: '99.99',
  message: 'Payment completed successfully'
});

// Open the link
await openDeepLink(link);
```

## Testing

### Method 1: Using the Test Interface
1. Navigate to `/deep-link-test` in your app
2. Use the test buttons to trigger different payment scenarios
3. The app will open the payment result screen with the appropriate parameters

### Method 2: Manual Testing
1. Install the app on a device/simulator
2. Use the following commands:

#### iOS Simulator
```bash
xcrun simctl openurl booted "komin-diy://payment_result?status=success&transaction_id=TXN123456&amount=99.99"
```

#### Android Emulator
```bash
adb shell am start -W -a android.intent.action.VIEW -d "komin-diy://payment_result?status=success&transaction_id=TXN123456&amount=99.99" com.komin.diy
```

#### Physical Device
Create a QR code or use a notes app with the deep link URL and tap on it.

### Method 3: Browser Testing
You can also test by entering the deep link URL directly in a mobile browser:
```
komin-diy://payment_result?status=success&transaction_id=TXN123456&amount=99.99
```

## Payment Result Screen Behavior

- **Status Display**: Shows appropriate icon and color based on payment status
- **Parameter Display**: Shows transaction ID, amount, and message if provided
- **Auto-redirect**: Automatically redirects to home screen after 3 seconds
- **Manual Navigation**: User can manually tap "Back to Home" to return immediately

## Integration with Payment Gateways

When integrating with payment gateways, configure the callback URL to:
```
komin-diy://payment_result
```

The payment gateway should append the relevant parameters to this URL based on the payment outcome.

## Troubleshooting

### Deep Link Not Working
1. Ensure the app is installed (deep links don't work without the app)
2. Check that the scheme `komin-diy` is correctly configured in `app.json`
3. For iOS, ensure the scheme is added to Info.plist
4. For Android, ensure intent filters are properly configured

### Parameters Not Showing
1. Check that parameters are properly URL-encoded
2. Verify parameter names match exactly (`status`, `transaction_id`, `amount`, `message`)
3. Check console logs for parameter parsing

### Auto-redirect Issues
1. The auto-redirect uses a 3-second timer
2. Navigation uses `router.replace()` to prevent going back to the payment result screen
3. Check for any navigation errors in the console

## Security Considerations

- Validate all incoming parameters from deep links
- Sanitize user input before displaying
- Consider adding authentication checks if sensitive information is displayed
- Use HTTPS for any server-side callbacks that redirect to deep links
