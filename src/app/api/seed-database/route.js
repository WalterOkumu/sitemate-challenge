import { MongoClient } from 'mongodb';

const dummyData = [
 {
  title: 'Bug in user login',
  description: 'Users are unable to log in after the recent update.',
  status: 'open',
  created_at: new Date('2024-08-19T08:00:00Z'),
  updated_at: new Date('2024-08-19T08:00:00Z')
 },
 {
  title: 'Add forgot password feature',
  description: "Implement a 'Forgot Password' feature for users who have forgotten their credentials.",
  status: 'open',
  created_at: new Date('2024-08-18T12:30:00Z'),
  updated_at: new Date('2024-08-18T12:30:00Z')
 },
 {
  title: 'UI enhancement for dashboard',
  description: 'Redesign the dashboard to be more user-friendly and intuitive.',
  status: 'in progress',
  created_at: new Date('2024-08-17T14:45:00Z'),
  updated_at: new Date('2024-08-19T09:30:00Z')
 },
 {
  title: 'Database optimization',
  description: 'Optimize the database queries to improve performance.',
  status: 'closed',
  created_at: new Date('2024-08-16T09:20:00Z'),
  updated_at: new Date('2024-08-18T10:00:00Z')
 },
 {
  title: 'Implement API rate limiting',
  description: 'Add rate limiting to the API to prevent abuse.',
  status: 'open',
  created_at: new Date('2024-08-15T11:15:00Z'),
  updated_at: new Date('2024-08-15T11:15:00Z')
 },
 {
  title: 'Security audit',
  description: 'Conduct a security audit to identify vulnerabilities.',
  status: 'in progress',
  created_at: new Date('2024-08-14T07:50:00Z'),
  updated_at: new Date('2024-08-19T10:10:00Z')
 },
 {
  title: 'Refactor authentication module',
  description: 'Refactor the authentication module for better maintainability.',
  status: 'closed',
  created_at: new Date('2024-08-13T15:00:00Z'),
  updated_at: new Date('2024-08-16T08:30:00Z')
 },
 {
  title: 'Upgrade to latest Node.js version',
  description: 'Upgrade the backend server to use the latest stable version of Node.js.',
  status: 'open',
  created_at: new Date('2024-08-12T16:20:00Z'),
  updated_at: new Date('2024-08-12T16:20:00Z')
 },
 {
  title: 'Add logging for API requests',
  description: 'Implement logging for all incoming API requests for better monitoring.',
  status: 'in progress',
  created_at: new Date('2024-08-11T10:35:00Z'),
  updated_at: new Date('2024-08-19T08:50:00Z')
 },
 {
  title: 'Fix typo in user settings page',
  description: 'Correct the spelling mistake on the user settings page.',
  status: 'closed',
  created_at: new Date('2024-08-10T12:00:00Z'),
  updated_at: new Date('2024-08-10T13:00:00Z')
 }
];

export async function POST(request) {
 const uri = process.env.MONGODB_URI;
 const dbName = process.env.MONGODB_DATABASE_NAME;

 let client;

 try {
  client = new MongoClient(uri);

  await client.connect();
  console.log('Connected successfully to server');

  const db = client.db(dbName);

  // Check if the collection exists, create it if it doesn't
  const collectionNames = await db.listCollections({ name: 'issues' }).toArray();
  if (collectionNames.length === 0) {
   await db.createCollection('issues');
  }
  const collection = db.collection('issues');

  // Insert the dummy data into the 'issues' collection
  const result = await collection.insertMany(dummyData);

  return new Response(JSON.stringify({ message: 'Dummy data inserted successfully', result }), {
   status: 200,
   headers: { 'Content-Type': 'application/json' }
  });
 } catch (error) {
  console.error('Error inserting dummy data:', error);
  return new Response(JSON.stringify({ message: 'Failed to insert dummy data', error }), {
   status: 500,
   headers: { 'Content-Type': 'application/json' }
  });
 } finally {
  if (client) {
   await client.close();
  }
 }
}
