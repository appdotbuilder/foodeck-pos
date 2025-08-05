
import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  numeric, 
  integer, 
  boolean,
  pgEnum,
  uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'cashier']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'card', 'digital_wallet']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'cancelled', 'refunded']);
export const queueStatusEnum = pgEnum('queue_status', ['waiting', 'preparing', 'ready', 'completed', 'cancelled']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Categories table
export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Products table
export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  category_id: integer('category_id').notNull().references(() => categoriesTable.id),
  stock_quantity: integer('stock_quantity').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  image_url: text('image_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Transactions table
export const transactionsTable = pgTable('transactions', {
  id: serial('id').primaryKey(),
  cashier_id: integer('cashier_id').notNull().references(() => usersTable.id),
  queue_number: integer('queue_number'),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  status: transactionStatusEnum('status').notNull().default('pending'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Transaction items table
export const transactionItemsTable = pgTable('transaction_items', {
  id: serial('id').primaryKey(),
  transaction_id: integer('transaction_id').notNull().references(() => transactionsTable.id),
  product_id: integer('product_id').notNull().references(() => productsTable.id),
  quantity: integer('quantity').notNull(),
  unit_price: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  total_price: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Queue table
export const queueTable = pgTable('queue', {
  id: serial('id').primaryKey(),
  queue_number: integer('queue_number').notNull(),
  transaction_id: integer('transaction_id').notNull().references(() => transactionsTable.id),
  status: queueStatusEnum('status').notNull().default('waiting'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  queueNumberIdx: uniqueIndex('queue_number_date_idx').on(table.queue_number, table.created_at),
}));

// Store settings table
export const storeSettingsTable = pgTable('store_settings', {
  id: serial('id').primaryKey(),
  store_name: text('store_name').notNull(),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  tax_rate: numeric('tax_rate', { precision: 5, scale: 4 }).notNull().default('0.0000'),
  currency: text('currency').notNull().default('USD'),
  logo_url: text('logo_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  transactions: many(transactionsTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  products: many(productsTable),
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
  category: one(categoriesTable, {
    fields: [productsTable.category_id],
    references: [categoriesTable.id],
  }),
  transactionItems: many(transactionItemsTable),
}));

export const transactionsRelations = relations(transactionsTable, ({ one, many }) => ({
  cashier: one(usersTable, {
    fields: [transactionsTable.cashier_id],
    references: [usersTable.id],
  }),
  items: many(transactionItemsTable),
  queue: one(queueTable),
}));

export const transactionItemsRelations = relations(transactionItemsTable, ({ one }) => ({
  transaction: one(transactionsTable, {
    fields: [transactionItemsTable.transaction_id],
    references: [transactionsTable.id],
  }),
  product: one(productsTable, {
    fields: [transactionItemsTable.product_id],
    references: [productsTable.id],
  }),
}));

export const queueRelations = relations(queueTable, ({ one }) => ({
  transaction: one(transactionsTable, {
    fields: [queueTable.transaction_id],
    references: [transactionsTable.id],
  }),
}));

// Export all tables for relation queries
export const tables = {
  users: usersTable,
  categories: categoriesTable,
  products: productsTable,
  transactions: transactionsTable,
  transactionItems: transactionItemsTable,
  queue: queueTable,
  storeSettings: storeSettingsTable,
};
