
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  loginInputSchema,
  createUserInputSchema,
  updateUserInputSchema,
  changePasswordInputSchema,
  createCategoryInputSchema,
  updateCategoryInputSchema,
  createProductInputSchema,
  updateProductInputSchema,
  createTransactionInputSchema,
  updateQueueStatusInputSchema,
  updateStoreSettingsInputSchema,
  dateRangeInputSchema
} from './schema';

// Import handlers
import { loginUser, getUserById } from './handlers/auth';
import { createUser, getUsers, updateUser, deleteUser, changePassword } from './handlers/users';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from './handlers/categories';
import { 
  createProduct, 
  getProducts, 
  getActiveProducts, 
  getProductById, 
  getProductsByCategory, 
  updateProduct, 
  deleteProduct,
  updateProductStock
} from './handlers/products';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  getTransactionsByDateRange,
  getTransactionsByCashier,
  updateTransactionStatus,
  getTransactionItems
} from './handlers/transactions';
import {
  getCurrentQueue,
  getQueueByNumber,
  updateQueueStatus,
  getNextQueueNumber,
  completeQueueItem
} from './handlers/queue';
import {
  getSalesAnalytics,
  getDailySales,
  getCashierPerformance,
  getProductPerformance
} from './handlers/analytics';
import {
  getStoreSettings,
  updateStoreSettings,
  initializeStoreSettings
} from './handlers/store_settings';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication
  login: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),
  
  getUserById: publicProcedure
    .input(z.number())
    .query(({ input }) => getUserById(input)),

  // User management
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),
  
  getUsers: publicProcedure
    .query(() => getUsers()),
  
  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),
  
  deleteUser: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteUser(input)),
  
  changePassword: publicProcedure
    .input(changePasswordInputSchema)
    .mutation(({ input }) => changePassword(input)),

  // Category management
  createCategory: publicProcedure
    .input(createCategoryInputSchema)
    .mutation(({ input }) => createCategory(input)),
  
  getCategories: publicProcedure
    .query(() => getCategories()),
  
  getCategoryById: publicProcedure
    .input(z.number())
    .query(({ input }) => getCategoryById(input)),
  
  updateCategory: publicProcedure
    .input(updateCategoryInputSchema)
    .mutation(({ input }) => updateCategory(input)),
  
  deleteCategory: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteCategory(input)),

  // Product management
  createProduct: publicProcedure
    .input(createProductInputSchema)
    .mutation(({ input }) => createProduct(input)),
  
  getProducts: publicProcedure
    .query(() => getProducts()),
  
  getActiveProducts: publicProcedure
    .query(() => getActiveProducts()),
  
  getProductById: publicProcedure
    .input(z.number())
    .query(({ input }) => getProductById(input)),
  
  getProductsByCategory: publicProcedure
    .input(z.number())
    .query(({ input }) => getProductsByCategory(input)),
  
  updateProduct: publicProcedure
    .input(updateProductInputSchema)
    .mutation(({ input }) => updateProduct(input)),
  
  deleteProduct: publicProcedure
    .input(z.number())
    .mutation(({ input }) => deleteProduct(input)),
  
  updateProductStock: publicProcedure
    .input(z.object({ productId: z.number(), quantity: z.number() }))
    .mutation(({ input }) => updateProductStock(input.productId, input.quantity)),

  // Transaction management
  createTransaction: publicProcedure
    .input(createTransactionInputSchema)
    .mutation(({ input }) => createTransaction(input)),
  
  getTransactions: publicProcedure
    .query(() => getTransactions()),
  
  getTransactionById: publicProcedure
    .input(z.number())
    .query(({ input }) => getTransactionById(input)),
  
  getTransactionsByDateRange: publicProcedure
    .input(z.object({ startDate: z.string(), endDate: z.string() }))
    .query(({ input }) => getTransactionsByDateRange(input.startDate, input.endDate)),
  
  getTransactionsByCashier: publicProcedure
    .input(z.object({ cashierId: z.number(), date: z.string().optional() }))
    .query(({ input }) => getTransactionsByCashier(input.cashierId, input.date)),
  
  updateTransactionStatus: publicProcedure
    .input(z.object({ id: z.number(), status: z.enum(['completed', 'cancelled', 'refunded']) }))
    .mutation(({ input }) => updateTransactionStatus(input.id, input.status)),
  
  getTransactionItems: publicProcedure
    .input(z.number())
    .query(({ input }) => getTransactionItems(input)),

  // Queue management
  getCurrentQueue: publicProcedure
    .query(() => getCurrentQueue()),
  
  getQueueByNumber: publicProcedure
    .input(z.number())
    .query(({ input }) => getQueueByNumber(input)),
  
  updateQueueStatus: publicProcedure
    .input(updateQueueStatusInputSchema)
    .mutation(({ input }) => updateQueueStatus(input)),
  
  getNextQueueNumber: publicProcedure
    .query(() => getNextQueueNumber()),
  
  completeQueueItem: publicProcedure
    .input(z.number())
    .mutation(({ input }) => completeQueueItem(input)),

  // Analytics
  getSalesAnalytics: publicProcedure
    .input(dateRangeInputSchema)
    .query(({ input }) => getSalesAnalytics(input)),
  
  getDailySales: publicProcedure
    .input(z.string().optional())
    .query(({ input }) => getDailySales(input)),
  
  getCashierPerformance: publicProcedure
    .input(z.object({ cashierId: z.number(), dateRange: dateRangeInputSchema }))
    .query(({ input }) => getCashierPerformance(input.cashierId, input.dateRange)),
  
  getProductPerformance: publicProcedure
    .query(() => getProductPerformance()),

  // Store settings
  getStoreSettings: publicProcedure
    .query(() => getStoreSettings()),
  
  updateStoreSettings: publicProcedure
    .input(updateStoreSettingsInputSchema)
    .mutation(({ input }) => updateStoreSettings(input)),
  
  initializeStoreSettings: publicProcedure
    .mutation(() => initializeStoreSettings()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Foodeck POS TRPC server listening at port: ${port}`);
}

start();
