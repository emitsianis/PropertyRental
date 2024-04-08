import connectDB from '@/config/database';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';
import Property from '@/models/Property';

export const dynamic = 'force-dynamic';

// GET /api/bookmarks
export const GET = async () => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) return new Response('Unauthorized', { status: 401 });
    const { userId } = sessionUser;
    const user = await User.findById(userId);

    const bookmarks = await Property.find({ _id: { $in: user?.bookmarks } });

    return new Response(JSON.stringify(bookmarks), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response('Internal Server Error', { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) return new Response('Unauthorized', { status: 401 });
    const { userId } = sessionUser;
    const user = await User.findById(userId);

    let isBookmarked = user?.bookmarks?.includes(propertyId);
    let message;

    if (isBookmarked) {
      user?.bookmarks?.pull(propertyId);
      message = 'Property removed from bookmarks';
      isBookmarked = false;
    } else {
      user?.bookmarks?.push(propertyId);
      message = 'Property added to bookmarks';
      isBookmarked = true;
    }

    await user?.save();

    return new Response(JSON.stringify({ message, isBookmarked }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response('Internal Server Error', { status: 500 });
  }
};
