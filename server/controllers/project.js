// Create a new project with just an ID
import Project from '../models/Project.js'
import path from 'path'
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import fs from 'fs'
import Unit from '../models/Unit.js';
import { pbkdf2Sync } from 'crypto';

const __dirname = path.resolve();


export const initiateProject = async (req, res) => {
    try {
        if (req.cookies.jwt) {
            const decodedToken = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

            const userId = decodedToken.userId;

            const project = new Project({ user: userId });
            await project.save();

            const user = await User.findById(userId);
            if (!user) {
                return res.json({
                    success: false,
                    status: "User not found."
                });
            }

            user.projects.push(project._id);
            await user.save();

            return res.json({
                success: true,
                status: "New project initialized successfully.",
                id: project._id
            });
        } else {
            return res.json({
                success: false,
                status: "Login to add new project."
            });
        }
    } catch (error) {
        console.error(error);
        return res.json({
            success: false,
            status: "Problem in initializing new project."
        });
    }
};

export const saveBasicInfo = async (req, res) => {
    try {
        const basicInfo = req.body;

        if (!Array.isArray(basicInfo.units)) {
            return res.json({ success: false, status: "Invalid units array." });
        }

        const createdUnits = await Unit.insertMany(
            basicInfo.units.map(unitName => ({ unitName }))
        );

        basicInfo.units = createdUnits.map(unit => unit._id);

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { basicInfo },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }

        return res.json({ success: true, status: "Basic information saved successfully." });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: "Internal server error." });
    }
};

export const saveEstimationInfo = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { estimationInfo: req.body },
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }
        return res.json({ success: true, status: "Estimation information saved successfully." });
    } catch (error) {
        return res.json({ success: false, status: "Internal server error." });
    }
}

export const saveSiteProgress = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { siteProgress: req.body },
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }
        return res.json({ success: true, status: "Site Progress updated successfully." });
    } catch (error) {
        return res.json({ success: false, status: "Internal server error." });
    }
}

export const saveUnits = async (req, res) => {
    const updates = req.body;
    try {
        for (const [index, update] of Object.entries(updates)) {
            await Unit.findByIdAndUpdate(update._id, update);
        }
        return res.json({ success: true, status: "Units data updated successfully." });
    } catch (error) {
        return res.json({ success: false, status: "Internal server error." });
    }
}

export const saveGallery = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }

        // Ensure gallery field is initialized
        if (!project.gallery) {
            project.gallery = {
                siteElevations: [],
                siteImages: [],
                siteBrochore: []
            };
        }

        if (req.files.siteElevations) {
            const newFiles = req.files.siteElevations.map(file => file.filename);
            project.gallery.siteElevations = project.gallery.siteElevations.concat(newFiles);
        }

        if (req.files.siteImages) {
            const newFiles = req.files.siteImages.map(file => file.filename);
            project.gallery.siteImages = project.gallery.siteImages.concat(newFiles);
        }

        if (req.files.siteBrochore) {
            const newFiles = req.files.siteBrochore.map(file => file.filename);
            project.gallery.siteBrochore = project.gallery.siteBrochore.concat(newFiles);
        }

        await project.save();
        return res.json({ success: true, status: "Gallary files uploaded and saved successfully." });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
}

export const saveDocuments = async (req, res) => {
    try {
        const fileTitle = req.body.fileTitle;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }

        // Ensure documents field is initialized
        if (!project.documents) {
            project.documents = [];
        }

        req.files.forEach(file => {
            project.documents.push({
                title: fileTitle,
                filename: file.filename,
            });
        });

        await project.save();
        return res.json({ success: true, status: "Document uploaded and saved successfully." });

    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
}


//get requests

export const getAllProjects = async (req, res) => {
    const jwtCookie = req.cookies.jwt;

    if (!jwtCookie) {
        return res.json({ success: false, status: "User not logged in." });
    }

    try {
        const decodedToken = jwt.verify(jwtCookie, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const user = await User.findById(userId).populate('projects', 'basicInfo');

        if (!user) {
            return res.json({ success: false, status: "User not found." });
        }

        const projects = user.projects;

        return res.json({ success: true, status: "Projects retrieved successfully.", projects });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
};


export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('user').exec();
        if (!project) {
            return res.json({ success: false, message: 'Project not found.' });
        }
        res.json({ success: true, status: 'Project details retrived successfully.', project });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Internal server error.' });
    }
}


export const getBasicInfo = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id, 'basicInfo')
            .populate('basicInfo.units', 'unitName');
        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }
        return res.json({ success: true, data: project.basicInfo });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: "Internal server error." });
    }
}

export const getUnits = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id, 'basicInfo')
            .populate('basicInfo.units');
        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }
        return res.json({ success: true, data: project.basicInfo.units });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: "Internal server error." });
    }
}


// Fetch Property Info
export const getEstimationInfo = async (req, res) => {
    pbkdf2Sync
    try {
        const project = await Project.findById(req.params.id, 'estimationInfo');
        console.log(project);
        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }
        return res.json({ success: true, data: project.estimationInfo });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: "Internal server error." });
    }
}

// Fetch Amenities
export const getSiteProgress = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id, 'siteProgress');
        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }
        return res.json({ success: true, data: project.siteProgress });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, status: "Internal server error." });
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const filename = req.params.filename;

        // Find the project by ID
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }

        // Find the document to be deleted
        const documentIndex = project.documents.findIndex(doc => doc.filename === filename);

        if (documentIndex === -1) {
            return res.json({ success: false, status: "Document not found." });
        }

        // Remove the document from the project documents array
        const document = project.documents.splice(documentIndex, 1)[0];

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, 'public', 'uploads', document.filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, status: 'Error deleting file' });
            }
        });

        // Save the updated project
        await project.save();

        return res.json({ success: true, status: 'Document deleted successfully.' });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
}


export const deleteGalleryFile = async (req, res) => {
    try {
        const { id, type, filename } = req.params;

        // Find the project by ID
        const project = await Project.findById(id);

        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }

        // Validate the gallery type
        if (!['siteElevations', 'siteImages', 'siteBrochore'].includes(type)) {
            return res.json({ success: false, status: "Invalid gallery type." });
        }

        // Find the file in the specified gallery type
        const fileIndex = project.gallery[type].indexOf(filename);


        if (fileIndex === -1) {
            return res.json({ success: false, status: "File not found in gallery." });
        }

        // Remove the file from the gallery array
        project.gallery[type].splice(fileIndex, 1);

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, 'public', 'uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.json({ success: false, status: 'Error deleting file from filesystem.' });
            }
        });

        // Save the updated project
        await project.save();

        return res.json({ success: true, status: 'Gallery file deleted successfully.' });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
};


export const deleteProjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const project = await Project.findById(id);

        if (!project) {
            return res.json({ success: false, status: "Project not found." });
        }

        await Project.findByIdAndDelete(id);

        return res.json({ success: true, status: "Project deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.json({ success: false, status: "Internal server error." });
    }
}