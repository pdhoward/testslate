
//////////////////////////////////////////////////////
////////   mongoDB connection manager         ///////
////////////////////////////////////////////////////

import {MongoClient} from 'mongodb'
import { LRUCache } from 'lru-cache'
// Import MongoClient from the 'mongodb' package



// Maintain up to x socket connections  
const dbOptions = {
  	MaxConnecting: 10       
   }

const cacheOptions = {
    max: 500,    
    ttl: 1000 * 60 * 10,   // ttl in milliseconds
    updateAgeOnGet: true
}

const cache = new LRUCache(cacheOptions)

const log = console

// Function to get MongoDB connection
async function getMongoConnection(url, dbName) {
  try {
      let conn = cache.get(url);
      
      if (!conn) {
          console.info('Creating new connection for ' + url);
          conn = new MongoClient(url, dbOptions);
          await conn.connect();
          console.info('MongoDB server connection live');
          cache.set(url, conn);
      } else {
          console.info('Reusing existing MongoDB connection');
      }

      const db = conn.db(dbName);
      return db;
  } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err;
  }
}

export default getMongoConnection;


