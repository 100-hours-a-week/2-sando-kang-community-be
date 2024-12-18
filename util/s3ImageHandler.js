const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const sharp = require('sharp');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadResizedImageToS3 = async (fileBuffer, originalName) => {
    const key = `uploads/${Date.now()}-${originalName}`;
    try {
        const resizedBuffer = await sharp(fileBuffer).resize({ height: 306, width: 544, fit:'cover' }).toBuffer();

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
                Body: resizedBuffer,
                ContentType: 'image/jpeg',
                ACL: 'public-read',
            }),
        );

        return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
        console.error('Error uploading resized image to S3:', error);
        throw error;
    }
};

const deleteImageFromS3 = async (key) => {
    try {
        if (!key) throw new Error('No key provided for deletion');

        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: key,
            }),
        );

        console.log(`Successfully deleted image from S3: ${key}`);
    } catch (error) {
        console.error('Error deleting image from S3:', error);
        throw error;
    }
};


const handleImageProcessing = async (fileBuffer, originalName, existingUrl = null) => {
    try {
        
        if (existingUrl) {
            const existingKey = existingUrl.split('/').slice(-2).join('/');
            await deleteImageFromS3(existingKey);
        }

        const newImageUrl = await uploadResizedImageToS3(fileBuffer, originalName);

        return newImageUrl;
    } catch (error) {
        console.error('Error handling image processing:', error);
        throw error;
    }
};

module.exports = {
    handleImageProcessing,
    uploadResizedImageToS3,
    deleteImageFromS3,
};
