import connectDB from '@/config/database';
import { getSessionUser } from '@/utils/getSessionUser';
import Message from '@/models/Message';

// GET /api/messages/unread-count
export const GET = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { userId } = sessionUser;

    const count = await Message.countDocuments({ recipient: userId, read: false });

    return new Response(JSON.stringify(count), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response('Something went wrong', { status: 500 });
  }
};
