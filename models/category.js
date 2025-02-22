import mongoose from'mongoose';

const categorySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String 
    },
});

export const categoryModel = mongoose.model('Category', categorySchema);
