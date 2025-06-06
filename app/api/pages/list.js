import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId parameter' });
    }
    
    const { db } = await connectToDatabase();
    
    const pages = await db.collection('pages')
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();
    
    return res.status(200).json({ pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return res.status(500).json({ message: 'Error fetching pages', error: error.message });
  }
}