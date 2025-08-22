# Paystack Payment Integration Guide

This guide explains how the Paystack payment gateway is integrated into the MECE application.

## Overview

The application now includes a Paystack payment gateway that requires users to pay a ₦8,550 registration fee before they can submit their registration form. This ensures that only serious applicants complete the registration process.

## Features

- **Payment Required**: Users must complete payment before form submission
- **Secure Processing**: All payments are processed through Paystack's secure platform
- **Admin Management**: Admins can configure Paystack API keys through the dashboard
- **Payment Tracking**: All payment transactions are logged and can be monitored

## How It Works

### 1. User Flow
1. User fills out the registration form
2. User clicks "Pay ₦8,550 Registration Fee" button
3. User is redirected to Paystack's secure payment page
4. After successful payment, user returns to the registration form
5. Form is unlocked and user can submit their registration

### 2. Payment Process
1. **Initialize Payment**: Frontend calls `/api/payments/initialize` with user email and amount
2. **Paystack Redirect**: User is redirected to Paystack's payment page
3. **Payment Completion**: User completes payment on Paystack
4. **Callback**: Paystack redirects user back with success/failure status
5. **Form Unlock**: Registration form is unlocked for submission

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Paystack Configuration
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

### Getting Paystack API Keys

1. **Sign Up**: Create an account at [paystack.com](https://paystack.com)
2. **Dashboard**: Log into your Paystack dashboard
3. **API Keys**: Navigate to Settings > API Keys & Webhooks
4. **Copy Keys**: Copy your public and secret keys
5. **Environment**: Add them to your `.env` file

## API Endpoints

### Payment Endpoints

- `POST /api/payments/initialize` - Initialize payment transaction
- `POST /api/payments/verify` - Verify payment transaction
- `GET /api/payments/:reference` - Get payment details
- `GET /api/payments` - Get all payments
- `GET /api/payments/config` - Get payment configuration

### Admin Endpoints

- `GET /api/admin/paystack-settings` - Get current Paystack settings
- `POST /api/admin/paystack-settings` - Update Paystack settings

## Admin Dashboard

### Paystack Integration Tab

The admin dashboard now includes a "Paystack Integration" tab where admins can:

1. **View Status**: See if Paystack is properly configured
2. **Configure Keys**: Enter public and secret API keys
3. **Monitor**: Check payment gateway status
4. **Troubleshoot**: Get configuration instructions

### Accessing the Tab

1. Log into the admin dashboard
2. Navigate to "Paystack Integration" in the sidebar
3. Configure your API keys
4. Restart the server after updating keys

## Frontend Components

### Payment Section

The registration form now includes a payment section (Section F) that:

- Shows the ₦8,550 fee requirement
- Provides a payment button
- Displays payment status
- Locks form submission until payment is complete

### Payment Button

The payment button:
- Validates email address is entered
- Initializes payment with Paystack
- Redirects to secure payment page
- Handles payment errors gracefully

## Database Schema

### Payments Table

The application creates a `payments` table to track:

- Payment amount and currency
- Payment method (paystack)
- Reference number
- Payment status
- Timestamps

### Schema

```sql
CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'NGN',
  payment_method TEXT NOT NULL,
  payment_id TEXT NOT NULL,
  reference TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);
```

## Security Features

### API Key Protection

- Secret keys are never exposed to the frontend
- All payment operations are server-side
- Environment variables are used for sensitive data

### Payment Validation

- Amount is validated (must be exactly ₦8,550)
- Email validation before payment initiation
- Secure callback handling

## Testing

### Test Mode

1. Use Paystack test keys for development
2. Test payments won't charge real money
3. Use test card numbers provided by Paystack

### Test Cards

Paystack provides test card numbers:
- **Success**: 4084 0840 8408 4081
- **Declined**: 4084 0840 8408 4082
- **3D Secure**: 4084 0840 8408 4083

## Production Deployment

### Environment Setup

1. **Get Live Keys**: Switch to Paystack live API keys
2. **Update Environment**: Update `.env` file with live keys
3. **Restart Server**: Restart the application server
4. **Test Live**: Verify payments work in production

### SSL Requirements

- HTTPS is required for live payments
- Ensure your domain has valid SSL certificate
- Update callback URLs to use HTTPS

## Troubleshooting

### Common Issues

1. **Payment Not Initializing**
   - Check API keys are correct
   - Verify server is running
   - Check environment variables

2. **Payment Verification Fails**
   - Check Paystack dashboard for transaction status
   - Verify callback URLs are correct
   - Check server logs for errors

3. **Form Not Unlocking**
   - Verify payment was successful
   - Check callback handling
   - Clear browser cache if needed

### Debug Steps

1. **Check Server Logs**: Look for payment-related errors
2. **Verify API Keys**: Ensure keys are correct and active
3. **Test Endpoints**: Use Postman or similar to test API
4. **Check Database**: Verify payment records are created

## Support

### Paystack Support

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack Support](https://paystack.com/support)
- [API Reference](https://paystack.com/docs/api)

### Application Support

For issues with the integration:
1. Check server logs
2. Verify configuration
3. Test with Paystack test keys
4. Contact development team

## Updates and Maintenance

### Regular Tasks

1. **Monitor Payments**: Check payment success rates
2. **Update Keys**: Rotate API keys periodically
3. **Review Logs**: Monitor for payment errors
4. **Test Integration**: Regular testing of payment flow

### Version Updates

Keep the application updated to ensure:
- Security patches are applied
- New Paystack features are available
- Compatibility is maintained
