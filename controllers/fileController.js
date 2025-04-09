const File = require('../models/fileModel');

exports.uploadFile = (req, res) => {
    const { name, type, size, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY } = req.body;
    const creation_date = new Date();
    const last_modified = creation_date;

    File.create({ name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE,DIRECTORY_idDIRECTORY }, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Archivo registrado correctamente');
    });
};

exports.deleteFile = (req, res) => {
    const { name } = req.params;
    File.delete(name, (err) => {
        if (err) return res.status(500).send(err);
        res.send('Archivo eliminado');
    });
};

exports.renameFile = (req, res) => {
    const { oldFileName, newFileName } = req.body;

    File.updateName(oldFileName, newFileName, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el nombre del archivo en la base de datos', details: err });
        }

        res.json({ message: 'Archivo renombrado correctamente', oldFileName, newFileName });
    });
};
