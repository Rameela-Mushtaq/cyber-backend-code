import { imageOnCloudinary } from "../utils/cloudinary.js";
import { resourcesModel } from "../models/resources.js"

// Create a new resource
export const createResource = async (req, res) => {
    try {
        const { title, description, link,  category } = req.body;

        // Validate mandatory fields
        if (!title || !description  ) {
            return res.status(400).send({
                success: false,
                message: 'Title and Description both are required',
            });
        }

        // Upload video (optional)
        let videoUrl = null;
        if (req.files?.video?.[0]) {
            const result = await imageOnCloudinary(req.files.video[0].buffer, 'resources', req.files.video[0].originalname);
            videoUrl = result.secure_url;
        }

        // Upload picture (optional)
        let pictureUrl = null;
        if (req.files?.picture?.[0]) {
            const result = await imageOnCloudinary(req.files.picture[0].buffer, 'resources', req.files.picture[0].originalname);
            pictureUrl = result.secure_url;
        }

        // Create new resource
        const newResource = await resourcesModel.create({
            title,
            description,
            link,       
            category,   
            video: videoUrl,  
            picture: pictureUrl,  
        });

        await newResource.save();

        res.status(201).send(newResource);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating resource',
            error,
        });
    }
};

// Get all resources
export const getResources = async (req, res) => {
    try {
        const resources = await resourcesModel.find().populate('category', 'title');
        if (resources.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No Resources found'
            });
        }
        res.status(200).send(
            resources
        );
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching resources',
            error
        });
    }
};

// Update a resource
export const updateResource = async (req, res) => {
    const { resourceId } = req.params;
    const { title, description, link, category } = req.body;

    try {
        let resource = await resourcesModel.findById(resourceId);
        if (!resource) {
            return res.status(404).send({
                message: 'Resource not found'
            });
        }

        
        // Check and upload new video
        let videoUrl = resource.video;
        if (req.files?.video?.[0]) {
            const result = await imageOnCloudinary(req.files.video[0].buffer, 'resources', req.files.video[0].originalname);
            videoUrl = result.secure_url;
        }

        // Check and upload new picture
        let pictureUrl = resource.picture;
        if (req.files?.picture?.[0]) {
            const result = await imageOnCloudinary(req.files.picture[0].buffer, 'resources', req.files.picture[0].originalname);
            pictureUrl = result.secure_url;
        }

        resource.title = title || resource.title;
        resource.description = description || resource.description;
        resource.link = link || resource.link;
        resource.category = category || resource.category;
        resource.video = videoUrl;
        resource.picture = pictureUrl;

        await resource.save();
        res.status(200).send(resource);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error updating resource' });
    }
};

// Delete a resource
export const deleteResource = async (req, res) => {
    const { resourceId } = req.params;

    try {
        const resource = await resourcesModel.findByIdAndDelete(resourceId);
        if (!resource) {
            return res.status(404).send({ message: 'Resource not found' });
        }

        res.status(200).send({
            success: true,
            message: 'Resource deleted successfully',
            resource
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting resource'
        });
    }
};
