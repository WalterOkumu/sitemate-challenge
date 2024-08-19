import { MongoClient } from 'mongodb';

export async function GET(request) {
 const uri = process.env.MONGODB_URI;
 const dbName = process.env.MONGODB_DATABASE_NAME;

 let client;

 try {
  client = new MongoClient(uri);

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('issues');
  const allData = await collection.find({}).toArray();

  return new Response(JSON.stringify(allData), {
   status: 200,
   headers: { 'Content-Type': 'application/json' }
  });
 } catch (error) {
  console.error('Error fetching data:', error);
  return new Response(JSON.stringify({ message: 'Failed to fetch data' }), {
   status: 500,
   headers: { 'Content-Type': 'application/json' }
  });
 } finally {
  if (client) {
   await client.close();
  }
 }
}
