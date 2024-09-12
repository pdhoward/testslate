import { NextResponse } from 'next/server';
import getMongoConnection from '@/db/connections/index.js';

const uri = process.env.DB;
const MIGRATEDB = process.env.MIGRATEDB;

export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // Parse the request body to get repoDetails
    const { dbDetails } = await req.json();

    let collection = dbDetails.collection
    let dbName = dbDetails.db

    if (!dbDetails || !dbDetails.db || !dbDetails.collection) {
      return NextResponse.json({ error: 'Invalid database details' });
    }

    // Establish a MongoDB connection
    const db = await getMongoConnection(uri, MIGRATEDB);
    const metaCollection = db.collection(collection);

    // Fetch all documents from the meta collection (you can add filters if needed)
    const metaDocs = await metaCollection.find({}).toArray();

    // Return the documents as a JSON response
    return NextResponse.json(metaDocs);
  } catch (error) {
    console.error('Error fetching documents from meta collection:', error);
    return NextResponse.json({ error: 'Failed to fetch documents from meta collection' });
  }
}

