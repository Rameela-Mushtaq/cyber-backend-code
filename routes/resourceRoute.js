import { createResource, deleteResource, getResources, updateResource } from "../controllers/resourcesController.js";
import express from 'express'
import { upload } from '../middleware/multer.js';

const router = express.Router()


router.post('/addResource', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'picture', maxCount: 1 }]), createResource);

router.get('/getResources', getResources);

router.put('/updateResource/:resourceId', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'picture', maxCount: 1 }]), updateResource);

router.delete('/deleteResource/:resourceId', deleteResource);

export default router