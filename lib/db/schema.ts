import { pgTable, text, timestamp, serial } from 'drizzle-orm/pg-core';

export const apiKeys = pgTable('api_keys', {
  id: serial("id").primaryKey(),
  name: text('name').notNull(),
  key: text('key').notNull().unique(),
  lastUsed: timestamp('last_used'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull(),

});