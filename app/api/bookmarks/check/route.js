import connectDB from '@/config/database';
import { getSessionUser } from '@/utils/getSessionUser';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export const POST = async (request) => {
  try {
    await connectDB();

    const { propertyId } = await request.json();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) return new Response('Unauthorized', { status: 401 });
    const { userId } = sessionUser;
    const user = await User.findById(userId);

    let isBookmarked = user?.bookmarks?.includes(propertyId);

    return new Response(JSON.stringify({ isBookmarked }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response('Internal Server Error', { status: 500 });
  }
};
