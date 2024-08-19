import { MongoClient } from 'mongodb';

export async function POST(request) {
 const uri = process.env.MONGODB_URI;
 const dbName = process.env.MONGODB_DATABASE_NAME;

 let client;

 try {
  client = new MongoClient(uri);

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('issues');

  const { title, description, status } = await request.json();

  const newIssue = {
   title,
   description,
   status,
   created_at: new Date(),
   updated_at: new Date(),
  };

  const result = await collection.insertOne(newIssue);

  return new Response(JSON.stringify({ message: 'Issue created successfully', result }), {
   status: 201,
   headers: { 'Content-Type': 'application/json' }
  });
 } catch (error) {
  console.error('Error creating issue:', error);
  return new Response(JSON.stringify({ message: 'Failed to create issue', error }), {
   status: 500,
   headers: { 'Content-Type': 'application/json' }
  });
 } finally {
  if (client) {
   await client.close();
  }
 }
}
