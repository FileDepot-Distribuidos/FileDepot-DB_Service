// controllers/nodeController.js
const Node = require('../models/nodeModel');

exports.registerNode = (req, res) => {
    const { ipv4_address, total_size, available_size } = req.body;

    console.log('Datos recibidos:');
    console.log('  ipv4_address:', ipv4_address);
    console.log('  total_size:', total_size);
    console.log('  available_size:', available_size);

    if (!ipv4_address || total_size == null || available_size == null) {
        console.warn('Faltan campos obligatorios');
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    Node.create({ ipv4_address, total_size, available_size }, (err, result) => {
        if (err) {
            console.error('Error al registrar nodo en la base de datos:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        console.log('Nodo registrado correctamente con ID:', result.insertId);
        return res.status(201).json({ message: 'Nodo registrado correctamente', id: result.insertId });
    });
};
