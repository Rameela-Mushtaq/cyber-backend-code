// routes/categoryRoutes.js
import express from 'express';
import { upload } from '../middleware/multer.js';
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController.js';

const router = express.Router();


// POST: Create a new category (with image upload)
router.post('/addCategory', upload.single('image'), createCategory);

// GET: Fetch all categories
router.get('/getCategory', getCategories);

// PUT: Update a category (with image upload)
router.put('/updateCategory/:id', upload.single('image'), updateCategory);

// DELETE: Delete a category
router.delete('/deleteCategory/:id', deleteCategory);

export default router;
