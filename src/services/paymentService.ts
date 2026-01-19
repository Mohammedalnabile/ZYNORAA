// Zynora Platform - Payment Service
// Handles Carte Edahabia and other payment methods

// API import - uncomment when backend is ready
// import { api } from './api';
import type {
  PaymentRequest,
  PaymentResponse,
  PaymentTransaction,
  EscrowDetails,
  EscrowStatus,
  ApiResponse,
  EdahabiaCardDetails,
} from '../types';

// ============================================
// Carte Edahabia Payment Integration
// ============================================

/**
 * Validate Carte Edahabia card number format
 * Edahabia cards typically start with 6033 and are 16 digits
 */
export function validateEdahabiaCard(cardNumber: string): {
  valid: boolean;
  error?: string;
  errorKey?: string;
} {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{16}$/.test(cleanNumber)) {
    return {
      valid: false,
      error: 'Card number must be 16 digits',
      errorKey: 'payment.error.invalidCardNumber',
    };
  }

  // Edahabia cards typically start with 6033
  if (!cleanNumber.startsWith('6033')) {
    return {
      valid: false,
      error: 'Please enter a valid Carte Edahabia number',
      errorKey: 'payment.error.notEdahabia',
    };
  }

  // Luhn algorithm validation
  if (!luhnCheck(cleanNumber)) {
    return {
      valid: false,
      error: 'Invalid card number',
      errorKey: 'payment.error.invalidCard',
    };
  }

  return { valid: true };
}

/**
 * Validate expiry date
 */
export function validateExpiryDate(expiry: string): {
  valid: boolean;
  error?: string;
  errorKey?: string;
} {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) {
    return {
      valid: false,
      error: 'Invalid format (MM/YY)',
      errorKey: 'payment.error.invalidExpiry',
    };
  }

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;

  if (month < 1 || month > 12) {
    return {
      valid: false,
      error: 'Invalid month',
      errorKey: 'payment.error.invalidMonth',
    };
  }

  const now = new Date();
  const expDate = new Date(year, month);
  
  if (expDate < now) {
    return {
      valid: false,
      error: 'Card has expired',
      errorKey: 'payment.error.expired',
    };
  }

  return { valid: true };
}

/**
 * Validate CVV
 */
export function validateCVV(cvv: string): {
  valid: boolean;
  error?: string;
  errorKey?: string;
} {
  if (!/^\d{3}$/.test(cvv)) {
    return {
      valid: false,
      error: 'CVV must be 3 digits',
      errorKey: 'payment.error.invalidCVV',
    };
  }

  return { valid: true };
}

/**
 * Validate all card details
 */
export function validateCardDetails(details: EdahabiaCardDetails): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const cardValidation = validateEdahabiaCard(details.cardNumber);
  if (!cardValidation.valid) {
    errors.cardNumber = cardValidation.error!;
  }

  const expiryValidation = validateExpiryDate(details.expiryDate);
  if (!expiryValidation.valid) {
    errors.expiryDate = expiryValidation.error!;
  }

  const cvvValidation = validateCVV(details.cvv);
  if (!cvvValidation.valid) {
    errors.cvv = cvvValidation.error!;
  }

  if (!details.cardHolderName.trim()) {
    errors.cardHolderName = 'Cardholder name is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Luhn algorithm for card number validation
 */
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Format card number for display (add spaces)
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 16);
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

/**
 * Format expiry date (MM/YY)
 */
export function formatExpiryDate(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 4);
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  }
  return cleaned;
}

// ============================================
// Payment API Functions
// ============================================

/**
 * Initiate a payment with Carte Edahabia
 */
export async function initiateEdahabiaPayment(
  request: PaymentRequest
): Promise<PaymentResponse> {
  try {
    // TODO: Replace with actual API call to payment gateway
    // const response = await api.post<PaymentResponse>('/payments/edahabia', request);
    
    // Simulate payment processing
    const response = await simulatePayment(request);
    return response;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
      errorCode: 'PAYMENT_ERROR',
    };
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(
  transactionId: string
): Promise<ApiResponse<PaymentTransaction>> {
  try {
    // TODO: Replace with actual API call
    // return await api.get(`/payments/${transactionId}`);
    
    // Simulate status check
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id: transactionId,
        orderId: 'order_123',
        amount: 5000,
        currency: 'DZD',
        method: 'edahabia',
        status: 'held_in_escrow',
        escrowStatus: 'awaiting_delivery',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get status',
    };
  }
}

/**
 * Get escrow details for an order
 */
export async function getEscrowDetails(
  orderId: string
): Promise<ApiResponse<EscrowDetails>> {
  try {
    // TODO: Replace with actual API call
    // return await api.get(`/escrow/${orderId}`);
    
    // Simulate escrow details
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        transactionId: `txn_${orderId}`,
        status: 'awaiting_delivery',
        amount: 5000,
        heldAt: new Date().toISOString(),
        releaseConditions: [
          'Delivery confirmed by buyer',
          'No dispute within 24 hours',
        ],
        buyer: { id: 'buyer_1', name: 'Mohammed' },
        seller: { id: 'seller_1', name: 'Tech Store' },
        expectedDeliveryDate: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get escrow details',
    };
  }
}

/**
 * Confirm delivery (releases escrow)
 */
export async function confirmDelivery(
  orderId: string
): Promise<ApiResponse<EscrowDetails>> {
  try {
    // TODO: Replace with actual API call
    // return await api.post(`/escrow/${orderId}/confirm`);
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        transactionId: `txn_${orderId}`,
        status: 'released_to_seller',
        amount: 5000,
        heldAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        releaseConditions: [],
        buyer: { id: 'buyer_1', name: 'Mohammed' },
        seller: { id: 'seller_1', name: 'Tech Store' },
        deliveryConfirmedAt: new Date().toISOString(),
        releasedAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm delivery',
    };
  }
}

/**
 * Request refund (dispute)
 */
export async function requestRefund(
  orderId: string,
  _reason: string
): Promise<ApiResponse<EscrowDetails>> {
  try {
    // TODO: Replace with actual API call
    // return await api.post(`/escrow/${orderId}/refund`, { reason });
    
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        transactionId: `txn_${orderId}`,
        status: 'disputed',
        amount: 5000,
        heldAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        releaseConditions: [],
        buyer: { id: 'buyer_1', name: 'Mohammed' },
        seller: { id: 'seller_1', name: 'Tech Store' },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to request refund',
    };
  }
}

// ============================================
// Mock Implementation (Remove when backend ready)
// ============================================

/**
 * Simulate payment for development
 * TODO: Remove when backend is integrated
 */
async function simulatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate random success/failure (90% success rate)
  const isSuccess = Math.random() > 0.1;

  if (!isSuccess) {
    return {
      success: false,
      error: 'Payment declined. Please check your card details.',
      errorCode: 'CARD_DECLINED',
    };
  }

  const transaction: PaymentTransaction = {
    id: `txn_${Date.now()}`,
    orderId: request.orderId,
    amount: request.amount,
    currency: 'DZD',
    method: request.method,
    status: 'held_in_escrow',
    escrowStatus: 'awaiting_delivery',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    transaction,
  };
}

/**
 * Get escrow status label
 */
export function getEscrowStatusInfo(status: EscrowStatus): {
  label: string;
  labelKey: string;
  color: string;
  icon: string;
} {
  const statusMap: Record<EscrowStatus, { label: string; labelKey: string; color: string; icon: string }> = {
    awaiting_payment: {
      label: 'Awaiting Payment',
      labelKey: 'escrow.status.awaitingPayment',
      color: '#F59E0B',
      icon: 'clock',
    },
    payment_received: {
      label: 'Payment Received',
      labelKey: 'escrow.status.paymentReceived',
      color: '#10B981',
      icon: 'check',
    },
    awaiting_delivery: {
      label: 'Awaiting Delivery',
      labelKey: 'escrow.status.awaitingDelivery',
      color: '#3B82F6',
      icon: 'truck',
    },
    delivery_confirmed: {
      label: 'Delivery Confirmed',
      labelKey: 'escrow.status.deliveryConfirmed',
      color: '#10B981',
      icon: 'check-circle',
    },
    released_to_seller: {
      label: 'Released to Seller',
      labelKey: 'escrow.status.releasedToSeller',
      color: '#2D6A4F',
      icon: 'check-circle-2',
    },
    refunded_to_buyer: {
      label: 'Refunded',
      labelKey: 'escrow.status.refunded',
      color: '#6B7280',
      icon: 'rotate-ccw',
    },
    disputed: {
      label: 'Disputed',
      labelKey: 'escrow.status.disputed',
      color: '#EF4444',
      icon: 'alert-triangle',
    },
  };

  return statusMap[status] || statusMap.awaiting_payment;
}
