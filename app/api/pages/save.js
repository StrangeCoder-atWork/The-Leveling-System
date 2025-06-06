import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, page } = req.body;
    
    if (!userId || !page) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const { db } = await connectToDatabase();
    
    // Check if page already exists
    if (page.id && page.id.startsWith('page-')) {
      // This is a page that was created client-side and hasn't been saved to DB yet
      // We'll create a new entry
      const result = await db.collection('pages').insertOne({
        userId,
        ...page,
        _id: page.id
      });
      
      return res.status(200).json({ 
        success: true, 
        pageId: result.insertedId 
      });
    } else {
      // Update existing page
      await db.collection('pages').updateOne(
        { _id: page.id, userId },
        { $set: { ...page, updatedAt: new Date().toISOString() } }
      );
      
      return res.status(200).json({ 
        success: true, 
        pageId: page.id 
      });
    }
  } catch (error) {
    console.error('Error saving page:', error);
    return res.status(500).json({ message: 'Error saving page', error: error.message });
  }
}