
import { z } from 'zod';

// User role enum
export const userRoleSchema = z.enum(['admin', 'cashier']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  role: userRoleSchema,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Category schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Category = z.infer<typeof categorySchema>;

// Product schema
export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  category_id: z.number(),
  stock_quantity: z.number().int(),
  is_active: z.boolean(),
  image_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Product = z.infer<typeof productSchema>;

// Payment method enum
export const paymentMethodSchema = z.enum(['cash', 'card', 'digital_wallet']);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

// Transaction status enum
export const transactionStatusSchema = z.enum(['pending', 'completed', 'cancelled', 'refunded']);
export type TransactionStatus = z.infer<typeof transactionStatusSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.number(),
  cashier_id: z.number(),
  queue_number: z.number().nullable(),
  total_amount: z.number(),
  payment_method: paymentMethodSchema,
  status: transactionStatusSchema,
  notes: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Transaction = z.infer<typeof transactionSchema>;

// Transaction item schema
export const transactionItemSchema = z.object({
  id: z.number(),
  transaction_id: z.number(),
  product_id: z.number(),
  quantity: z.number().int(),
  unit_price: z.number(),
  total_price: z.number(),
  created_at: z.coerce.date()
});

export type TransactionItem = z.infer<typeof transactionItemSchema>;

// Queue status enum
export const queueStatusSchema = z.enum(['waiting', 'preparing', 'ready', 'completed', 'cancelled']);
export type QueueStatus = z.infer<typeof queueStatusSchema>;

// Queue schema
export const queueSchema = z.object({
  id: z.number(),
  queue_number: z.number(),
  transaction_id: z.number(),
  status: queueStatusSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Queue = z.infer<typeof queueSchema>;

// Store settings schema
export const storeSettingsSchema = z.object({
  id: z.number(),
  store_name: z.string(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  tax_rate: z.number(),
  currency: z.string(),
  logo_url: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type StoreSettings = z.infer<typeof storeSettingsSchema>;

// Input schemas for creating records
export const createUserInputSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleSchema,
  is_active: z.boolean().optional()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const createCategoryInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

export const createProductInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  price: z.number().positive(),
  category_id: z.number(),
  stock_quantity: z.number().int().nonnegative(),
  is_active: z.boolean().optional(),
  image_url: z.string().nullable().optional()
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export const createTransactionInputSchema = z.object({
  cashier_id: z.number(),
  payment_method: paymentMethodSchema,
  items: z.array(z.object({
    product_id: z.number(),
    quantity: z.number().int().positive()
  })),
  notes: z.string().nullable().optional()
});

export type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;

// Update schemas
export const updateUserInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: userRoleSchema.optional(),
  is_active: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const updateCategoryInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export type UpdateCategoryInput = z.infer<typeof updateCategoryInputSchema>;

export const updateProductInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  category_id: z.number().optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
  is_active: z.boolean().optional(),
  image_url: z.string().nullable().optional()
});

export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;

export const updateQueueStatusInputSchema = z.object({
  id: z.number(),
  status: queueStatusSchema
});

export type UpdateQueueStatusInput = z.infer<typeof updateQueueStatusInputSchema>;

export const updateStoreSettingsInputSchema = z.object({
  store_name: z.string().min(1).optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  tax_rate: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  logo_url: z.string().nullable().optional()
});

export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsInputSchema>;

// Auth schemas
export const loginInputSchema = z.object({
  username: z.string(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const changePasswordInputSchema = z.object({
  user_id: z.number(),
  current_password: z.string(),
  new_password: z.string().min(6)
});

export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;

// Analytics schemas
export const salesAnalyticsSchema = z.object({
  total_sales: z.number(),
  total_transactions: z.number(),
  average_order_value: z.number(),
  top_selling_products: z.array(z.object({
    product_id: z.number(),
    product_name: z.string(),
    total_quantity: z.number(),
    total_revenue: z.number()
  })),
  sales_by_payment_method: z.array(z.object({
    payment_method: paymentMethodSchema,
    count: z.number(),
    total_amount: z.number()
  })),
  hourly_sales: z.array(z.object({
    hour: z.number(),
    sales: z.number(),
    transactions: z.number()
  }))
});

export type SalesAnalytics = z.infer<typeof salesAnalyticsSchema>;

export const dateRangeInputSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export type DateRangeInput = z.infer<typeof dateRangeInputSchema>;
