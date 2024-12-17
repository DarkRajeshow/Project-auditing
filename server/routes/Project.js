import express from "express";
import {
    deleteDocument,
    deleteGalleryFile,
    deleteProjectById,
    getSiteProgress,
    getBasicInfo,
    getProjectById,
    getEstimationInfo,
    initiateProject,
    saveSiteProgress,
    saveBasicInfo,
    saveDocuments,
    saveGallery,
    saveEstimationInfo,
    getUnits,
    saveUnits
} from "../controllers/project.js";
import upload from "../utility/multer.js";
import multer from "multer";

const router = express.Router();

router.post("/new", initiateProject);

router.patch('/:id/basic-info', saveBasicInfo);
router.patch('/:id/estimation-info', saveEstimationInfo);
router.patch('/:id/site-progress', saveSiteProgress);
router.patch('/:id/units', saveUnits);

router.patch('/:id/gallery', (req, res, next) => {
    upload.fields([
        { name: 'siteElevations', maxCount: 10 },
        { name: 'siteImages', maxCount: 10 },
        { name: 'siteBrochore', maxCount: 10 }
    ])(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.json({ success: false, status: "The file size shouldn't be more than 6MB" });
        } else if (err) {
            return res.json({ success: false, status: "File upload validation failed." });
        }
        next();
    });
}, saveGallery);


router.patch('/:id/documents', (req, res, next) => {
    upload.array('documents', 10)(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.json({ success: false, status: "The file size shouldn't be more than 6MB" });
        } else if (err) {
            return res.json({ success: false, status: "File upload validation failed." });
        }
        next();
    })
}, saveDocuments);



router.get('/:id/basic-info', getBasicInfo)
router.get('/:id/estimation-info', getEstimationInfo)
router.get('/:id/site-progress', getSiteProgress)
router.get('/:id/units', getUnits)

router.delete('/:id/gallery/:type/:filename', deleteGalleryFile)
router.get('/:id', getProjectById);
router.delete('/:id', deleteProjectById);


router.delete('/:id/documents/:filename', deleteDocument);

export default router;
