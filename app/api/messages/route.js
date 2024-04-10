import connectDB from '@/config/database';
import { getSessionUser } from '@/utils/getSessionUser';
import Message from '@/models/Message';

export const dynamic = 'force-dynamic';

// GET /api/messages
export const GET = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { userId } = sessionUser;

    const messages = await Message
      .find({ recipient: userId })
      .populate('sender', 'username')
      .populate('property', 'name');

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response('Something went wrong', { status: 500 });
  }
};

// POST /api/messages
export const POST = async (request) => {
  try {
    await connectDB();

    const { name, email, phone, message, recipient, property } = await request.json();

    const sessionUser = await getSessionUser();
    if (!sessionUser?.userId) {
      return new Response(JSON.stringify({ message: 'You must be logged in to send a message' }), { status: 401 });
    }

    const { user } = sessionUser;

    if (user.id === recipient) {
      return new Response(JSON.stringify({ message: 'Can not send a message to yourself' }), { status: 400 });
    }

    const newMessage = new Message({
      sender: user.id,
      recipient,
      property,
      name,
      email,
      phone,
      body: message,
    });

    await newMessage.save();

    return new Response(JSON.stringify({ message: 'Message sent successfully' }), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response('Something went wrong', { status: 500 });
  }
};
