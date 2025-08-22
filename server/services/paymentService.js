import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  constructor() {
    this.stripe = stripe;
  }

  // Create a payment intent for a submission
  async createPaymentIntent(amount, currency = 'USD', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: amount,
        currency: currency
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Confirm a payment
  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          status: 'succeeded',
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency
        };
      } else if (paymentIntent.status === 'requires_payment_method') {
        return {
          success: false,
          status: 'requires_payment_method',
          error: 'Payment method required'
        };
      } else {
        return {
          success: false,
          status: paymentIntent.status,
          error: 'Payment not completed'
        };
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get payment details
  async getPaymentDetails(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        paymentIntent: paymentIntent
      };
    } catch (error) {
      console.error('Error getting payment details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Refund a payment
  async refundPayment(paymentIntentId, amount = null) {
    try {
      const refundParams = {
        payment_intent: paymentIntentId
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundParams);
      
      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      };
    } catch (error) {
      console.error('Error refunding payment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a customer (for future payments)
  async createCustomer(email, name) {
    try {
      const customer = await this.stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          source: 'mece_website'
        }
      });

      return {
        success: true,
        customerId: customer.id,
        customer: customer
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer details
  async getCustomer(customerId) {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return {
        success: true,
        customer: customer
      };
    } catch (error) {
      console.error('Error getting customer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List customer payments
  async getCustomerPayments(customerId, limit = 10) {
    try {
      const paymentIntents = await this.stripe.paymentIntents.list({
        customer: customerId,
        limit: limit
      });

      return {
        success: true,
        payments: paymentIntents.data
      };
    } catch (error) {
      console.error('Error getting customer payments:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate application fee (if you want to take a cut)
  calculateApplicationFee(amount, percentage = 0.029, fixed = 0.30) {
    const percentageFee = amount * percentage;
    const totalFee = percentageFee + fixed;
    return Math.round(totalFee * 100); // Return in cents
  }

  // Validate payment amount
  validatePaymentAmount(amount, minAmount = 1, maxAmount = 10000) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return {
        valid: false,
        error: 'Invalid amount format'
      };
    }

    if (amount < minAmount) {
      return {
        valid: false,
        error: `Amount must be at least $${minAmount}`
      };
    }

    if (amount > maxAmount) {
      return {
        valid: false,
        error: `Amount cannot exceed $${maxAmount}`
      };
    }

    return {
      valid: true,
      amount: amount
    };
  }
}

export default PaymentService;
