import connectDB from '@/config/database';
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import cloudinary from '@/config/cloudinary';

// GET /api/properties
export const GET = async (request) => {
  try {
    await connectDB();

    const properties = await Property.find({});

    properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return new Response(JSON.stringify(properties), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response('Something went wrong', { status: 500 });
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser?.userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { userId } = sessionUser;

    const formData = await request.formData();

    const amenities = formData.getAll('amenities');
    const images = formData.getAll('images').filter((image) => image.name !== '');

    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode'),
      },
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities,
      rates: {
        nightly: formData.get('rates.nightly'),
        weekly: formData.get('rates.weekly'),
        monthly: formData.get('rates.monthly'),
      },
      seller_info: {
        name: formData.get('seller_info.name'),
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
      owner: userId,
    };

    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);
      const imageBase64 = imageData.toString('base64');

      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageBase64}`,
        {
          folder: 'PropertyRental',
        }
      );

      imageUploadPromises.push(result.secure_url);
    }

    propertyData.images = await Promise.all(imageUploadPromises);

    const newProperty = new Property(propertyData);
    await newProperty.save();

    // return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`);
  } catch (e) {
    console.log(e);
    return new Response('Failed to add property', { status: 500 });
  }
};
