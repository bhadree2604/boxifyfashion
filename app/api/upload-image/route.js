import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const productId = formData.get('productId') || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided in request.' },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Buffer to base64 Data URI for upload
    const fileType = file.type || 'image/jpeg';
    const base64Data = `data:${fileType};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary under 'boxify-products' folder
    const folderPath = `boxify-products/${productId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: folderPath,
      resource_type: 'image',
      transformation: [
        { fetch_format: 'auto', quality: 'auto' }
      ]
    });

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('Cloudinary upload response did not return a valid secure_url.');
    }

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    console.error('Cloudinary API route upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed on server.' },
      { status: 500 }
    );
  }
}
