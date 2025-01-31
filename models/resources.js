import mongoose from'mongoose';

const resourceSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    link: { 
        type: String 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    video: { 
        type: String 
    }, // Cloudinary URL for the video
    picture: { 
        type: String 
    }, // Cloudinary URL for the picture
}, { timestamps: true });

export const resourcesModel = mongoose.model('Resources', resourceSchema);
