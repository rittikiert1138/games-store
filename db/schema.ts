import { mysqlTable, bigint, varchar, decimal, boolean, timestamp, datetime, mysqlEnum, text, int, primaryKey } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

// Users Table
export const users = mysqlTable('users', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    lastLoginAt: timestamp('last_login_at'),
    isActive: boolean('is_active').default(true),
    isBanned: boolean('is_banned').default(false),
    bannedAt: datetime('banned_at'),
    bannedReason: varchar('banned_reason', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Wallets Table
export const wallets = mysqlTable('wallets', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number' }).references(() => users.id).notNull().unique(),
    balance: decimal('balance', { precision: 10, scale: 2 }).default('0.00'),
    points: bigint('points', { mode: 'number' }).default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Wallet Transactions Table
export const walletTransactions = mysqlTable('wallet_transactions', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    walletId: bigint('wallet_id', { mode: 'number' }).references(() => wallets.id).notNull(),
    type: mysqlEnum('type', ['DEPOSIT', 'WITHDRAW', 'PURCHASE', 'REFUND', 'ADJUSTMENT']).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    description: text('description'),
    orderId: varchar('order_id', { length: 36 }), // Optional reference to an order
    createdAt: timestamp('created_at').defaultNow(),
});

// Topup Requests Table
export const topupRequests = mysqlTable('topup_requests', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number' }).references(() => users.id).notNull(),
    walletId: bigint('wallet_id', { mode: 'number' }).references(() => wallets.id).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum('status', ['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),
    paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'TRUE_WALLET', 'PROMPTPAY'
    transactionRef: varchar('transaction_ref', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Games Table
export const games = mysqlTable('games', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description'),
    thumbnail: varchar('thumbnail', { length: 255 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Game Products Table
export const gameProducts = mysqlTable('game_products', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    gameId: bigint('game_id', { mode: 'number' }).references(() => games.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    gameData: text('game_data'), // JSON or text data specific to the product (e.g., codes, credentials)
    description: text('description'),
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
    stock: int('stock').default(0),
    sold: int('sold').default(0),
    isActive: boolean('is_active').default(true),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Orders Table
export const orders = mysqlTable('orders', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: bigint('user_id', { mode: 'number' }).references(() => users.id).notNull(),
    orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
    totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0.00'),
    finalAmount: decimal('final_amount', { precision: 10, scale: 2 }).notNull(),
    status: mysqlEnum('status', ['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED']).default('PENDING'),
    paymentMethod: varchar('payment_method', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Order Items Table
export const orderItems = mysqlTable('order_items', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: varchar('order_id', { length: 36 }).references(() => orders.id).notNull(),
    gameProductId: bigint('game_product_id', { mode: 'number' }).references(() => gameProducts.id).notNull(),
    quantity: int('quantity').notNull().default(1),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
});

// Admins Table
export const admins = mysqlTable('admins', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    isActive: boolean('is_active').default(true),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Roles Table
export const roles = mysqlTable('roles', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    description: varchar('description', { length: 255 }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// Permissions Table
export const permissions = mysqlTable('permissions', {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    description: varchar('description', { length: 255 }),
    module: varchar('module', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow(),
});

// Role Permissions Table (Many-to-Many)
export const rolePermissions = mysqlTable('role_permissions', {
    roleId: bigint('role_id', { mode: 'number' }).references(() => roles.id).notNull(),
    permissionId: bigint('permission_id', { mode: 'number' }).references(() => permissions.id).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
}));

// Admin Roles Table (Many-to-Many)
export const adminRoles = mysqlTable('admin_roles', {
    adminId: varchar('admin_id', { length: 36 }).references(() => admins.id).notNull(),
    roleId: bigint('role_id', { mode: 'number' }).references(() => roles.id).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.adminId, table.roleId] }),
}));

// System Logs Table
export const systemLogs = mysqlTable('system_logs', {
    id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    adminId: varchar('admin_id', { length: 36 }).references(() => admins.id),
    userId: bigint('user_id', { mode: 'number' }).references(() => users.id),
    action: varchar('action', { length: 255 }).notNull(),
    module: varchar('module', { length: 255 }),
    description: text('description'),
    metadata: text('metadata'), // JSON string
    ipAddress: varchar('ip_address', { length: 45 }),
    createdAt: timestamp('created_at').defaultNow(),
});
