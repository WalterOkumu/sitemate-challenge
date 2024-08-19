import { MongoClient, ObjectId } from 'mongodb';

export async function DELETE(request) {
 const uri = process.env.MONGODB_URI;
 const dbName = process.env.MONGODB_DATABASE_NAME;

 let client;

 try {
  client = new MongoClient(uri);

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('issues');

  const { id } = await request.json();

  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
   return new Response(JSON.stringify({ message: 'Issue not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
   });
  }

  return new Response(JSON.stringify({ message: 'Issue deleted successfully', result }), {
   status: 200,
   headers: { 'Content-Type': 'application/json' }
  });
 } catch (error) {
  console.error('Error deleting issue:', error);
  return new Response(JSON.stringify({ message: 'Failed to delete issue', error }), {
   status: 500,
   headers: { 'Content-Type': 'application/json' }
  });
 } finally {
  if (client) {
   await client.close();
  }
 }
}
