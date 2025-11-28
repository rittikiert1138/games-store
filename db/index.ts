import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const poolConnection = mysql.createPool('mysql://root:@localhost:3306/games_store');

export const db = drizzle(poolConnection);
