import 'server-only'
import postgres from 'postgres'
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from './schema'


const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment variables')
}

const client = postgres(connectionString, {
    prepare: false,
})

export const db = drizzle(client, {schema})