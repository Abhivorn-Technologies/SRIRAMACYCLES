import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google DNS which supports SRV queries.
// Local Windows ISP DNS blocks UDP SRV record lookups needed by mongodb+srv://
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  dns.setDefaultResultOrder?.('ipv4first');
} catch {
  // Ignore if unsupported
}


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sriramacycles';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'sriramacycles';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('MongoDB successfully connected to database:', MONGODB_DB_NAME);
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
