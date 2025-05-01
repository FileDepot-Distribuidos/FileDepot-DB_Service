const directoryModel = require('../models/directoryModel');
const fileModel = require('../models/fileModel');

async function getStructure(req, res) {
    try {
        const directories = await directoryModel.getAllDirectories();
        const files = await fileModel.getAllFiles();

        res.json({
            directories: directories,
            files: files
        });
    } catch (error) {
        console.error('Error obteniendo estructura general:', error);
        res.status(500).json({ error: 'Error obteniendo estructura general' });
    }
}

module.exports = {
    getStructure
};
