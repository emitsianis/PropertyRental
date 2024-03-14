import connectDB from '@/config/database';
import Property from '@/models/Property';

// GET /api/properties
export const GET = async (request) => {
  try {
    await connectDB();

    const properties = await Property.find({});

    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify(properties), { status: 200 })
  } catch (e) {
    console.log(e);
    return new Response('Something went wrong', { status: 500 })
  }
}
