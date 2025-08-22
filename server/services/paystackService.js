import axios from 'axios';

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.publicKey = process.env.PAYSTACK_PUBLIC_KEY;
    this.baseURL = 'https://api.paystack.co';
  }

  // Initialize payment transaction
  async initializeTransaction(email, amount, reference, callbackUrl) {
    try {
      const response = await axios.post(
        `${this.baseURL}/transaction/initialize`,
        {
          email,
          amount: amount * 100, // Convert to kobo (smallest currency unit)
          reference,
          callback_url: callbackUrl,
          currency: 'NGN',
          metadata: {
            custom_fields: [
              {
                display_name: 'Registration Fee',
                variable_name: 'registration_fee',
                value: 'MECE Registration'
              }
            ]
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data.data,
        message: 'Transaction initialized successfully'
      };
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to initialize transaction'
      };
    }
  }

  // Verify payment transaction
  async verifyTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/verify/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      const transaction = response.data.data;
      
      return {
        success: true,
        data: transaction,
        message: 'Transaction verified successfully',
        isSuccessful: transaction.status === 'success',
        amount: transaction.amount / 100, // Convert from kobo to naira
        reference: transaction.reference,
        gateway_response: transaction.gateway_response
      };
    } catch (error) {
      console.error('Paystack verification error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to verify transaction'
      };
    }
  }

  // Get transaction details
  async getTransaction(reference) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction/${reference}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Paystack get transaction error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get transaction'
      };
    }
  }

  // List all transactions
  async listTransactions(page = 1, perPage = 50) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transaction?page=${page}&perPage=${perPage}`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      return {
        success: true,
        data: response.data.data,
        meta: response.data.meta
      };
    } catch (error) {
      console.error('Paystack list transactions error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to list transactions'
      };
    }
  }

  // Generate unique reference
  generateReference() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `MECE_${timestamp}_${random}`.toUpperCase();
  }

  // Validate amount (must be 8550 NGN)
  validateAmount(amount) {
    const requiredAmount = 8550;
    if (amount !== requiredAmount) {
      return {
        valid: false,
        error: `Amount must be exactly ₦${requiredAmount.toLocaleString()}`
      };
    }
    return { valid: true };
  }
}

export default PaystackService;
