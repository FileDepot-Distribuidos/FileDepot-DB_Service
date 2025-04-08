// controllers/nodeController.js
const Node = require('../models/nodeModel');

exports.registerNode = (req, res) => {
    const { ipv4_address, total_size, available_size } = req.body;

    if (!ipv4_address || total_size == null || available_size == null) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    Node.create({ ipv4_address, total_size, available_size }, (err, result) => {
        if (err) {
            console.error('Error al registrar nodo:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        return res.status(201).json({ message: 'Nodo registrado correctamente', id: result.insertId });
    });
};
