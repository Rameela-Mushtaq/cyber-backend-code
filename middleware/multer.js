import multer from 'multer'
import {v4 as uuidv4} from 'uuid'
import path from "path"

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
