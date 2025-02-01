import { categoryModel } from '../models/category.js';
import { imageOnCloudinary } from '../utils/cloudinary.js';

// Create a new category 
export const createCategory = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Check if title or description is missing
        if (!title || !description) {
            return res.status(400).send({
                success: false,
                message: 'Title and Description both are required',
            });
        }

        let imageUrl = '';
        // Check if there's a file uploaded
        if (req.file) {
            const buffer = req.file.buffer;
            const uploadResult = await imageOnCloudinary(buffer, 'categories', title);
            imageUrl = uploadResult.secure_url;
        }

        const newCategory = new categoryModel({ title, description, image: imageUrl });
        await newCategory.save();

        res.status(201).send(newCategory);  
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to create category" });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        if (categories.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No category found'
            });
        }

        res.status(200).send(categories);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to retrieve categories" });
    }
};


// Update category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const category = await categoryModel.findById(id);
        if (!category) {
            return res.status(404).send({ message: "Category not found" });
        }

        let imageUrl = category.image; // Keep the old image if no new image is uploaded

        if (req.file) {
            const buffer = req.file.buffer;
            const uploadResult = await imageOnCloudinary(buffer, 'categories', title);
            imageUrl = uploadResult.secure_url;
        }

        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { title, description, image: imageUrl },
            { new: true }
        );

        res.status(200).send(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to update category" });
    }
};

// Delete category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await categoryModel.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).send({ message: "Category not found" });
        }

        res.status(200).send({
            success: true, 
            message: "Category deleted successfully",
            category
         });
    } catch (error) {
        console.error(error);
        res.status(500).send({ 
            success: false,
            message: "Failed to delete category" });
    }
};
