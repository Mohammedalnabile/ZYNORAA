// Zynora Platform - Type Definitions

// ============================================
// Image Types
// ============================================

export interface ProductImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  alt: string;
  order: number;
  uploadedAt: string;
}

export interface ImageUploadResult {
  success: boolean;
  image?: ProductImage;
  error?: string;
}

export interface ImageUploadProgress {
  imageId: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

// ============================================
// Payment Types
// ============================================

export type PaymentMethod = 'edahabia' | 'cash' | 'ccp';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'held_in_escrow' 
  | 'released' 
  | 'refunded' 
  | 'failed'
  | 'cancelled';

export type EscrowStatus = 
  | 'awaiting_payment' 
  | 'payment_received' 
  | 'awaiting_delivery' 
  | 'delivery_confirmed' 
  | 'released_to_seller' 
  | 'refunded_to_buyer'
  | 'disputed';

export interface EdahabiaCardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: 'DZD';
  method: PaymentMethod;
  status: PaymentStatus;
  escrowStatus: EscrowStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  cardDetails?: EdahabiaCardDetails;
}

export interface PaymentResponse {
  success: boolean;
  transaction?: PaymentTransaction;
  error?: string;
  errorCode?: string;
}

export interface EscrowDetails {
  transactionId: string;
  status: EscrowStatus;
  amount: number;
  heldAt?: string;
  releaseConditions: string[];
  buyer: {
    id: string;
    name: string;
  };
  seller: {
    id: string;
    name: string;
  };
  expectedDeliveryDate?: string;
  deliveryConfirmedAt?: string;
  releasedAt?: string;
}

// ============================================
// Offer Types (Extended)
// ============================================

export interface SellerOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  requestId: string;
  price: number;
  deliveryTime: string;
  description: string;
  images: ProductImage[];
  trustScore: number;
  rating: number;
  totalReviews: number;
  createdAt: string;
  expiresAt?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface CreateOfferPayload {
  requestId: string;
  price: number;
  deliveryTime: string;
  description: string;
  note?: string;
  images: string[]; // Image URLs
}

// ============================================
// Order Types
// ============================================

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  driverId?: string;
  offer: SellerOffer;
  payment?: PaymentTransaction;
  status: 'pending' | 'paid' | 'preparing' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
