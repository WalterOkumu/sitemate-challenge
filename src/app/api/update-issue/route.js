import { MongoClient, ObjectId } from 'mongodb';

export async function PUT(request) {
 const uri = process.env.MONGODB_URI;
 const dbName = process.env.MONGODB_DATABASE_NAME;

 let client;

 try {
  client = new MongoClient(uri);

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('issues');

  const { _id, title, description, status } = await request.json();

  const result = await collection.updateOne(
   { _id: new ObjectId(_id) },
   { $set: { title, description, status, updated_at: new Date() } }
  );

  if (result.matchedCount === 0) {
   return new Response(JSON.stringify({ message: 'Issue not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
   });
  }

  return new Response(JSON.stringify({ message: 'Issue updated successfully', result }), {
   status: 200,
   headers: { 'Content-Type': 'application/json' }
  });
 } catch (error) {
  console.error('Error updating issue:', error);
  return new Response(JSON.stringify({ message: 'Failed to update issue', error }), {
   status: 500,
   headers: { 'Content-Type': 'application/json' }
  });
 } finally {
  if (client) {
   await client.close();
  }
 }
}
