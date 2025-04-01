const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// Configurar Multer para subir archivos a la carpeta 'uploads/'
const upload = multer({ dest: 'uploads/' });

// Ruta para manejar la subida de archivos
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }
    res.json({ message: 'Archivo subido correctamente', file: req.file });
});

// Ruta para eliminar archivos en el servidor
app.delete('/api/delete/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(__dirname, 'uploads', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el archivo o no existe' });
        }
        res.json({ message: `Archivo ${fileName} eliminado` });
    });
});

// Ruta para renombrar archivos
app.put('/api/rename/:oldName', (req, res) => {
    const oldName = req.params.oldName;
    const newName = req.body.newName;

    const oldFilePath = path.join(__dirname, 'uploads', oldName);
    const newFilePath = path.join(__dirname, 'uploads', newName);

    // Verificar si el archivo existe
    fs.exists(oldFilePath, (exists) => {
        if (!exists) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
        }

        // Renombrar archivo
        fs.rename(oldFilePath, newFilePath, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al renombrar el archivo' });
            }
            res.json({ message: `Archivo renombrado de ${oldName} a ${newName}` });
        });
    });
});

app.use('/api', routes);

// Manejo de WebSocket
wss.on('connection', ws => {
    console.log('Nuevo cliente conectado al servidor WebSocket');

    ws.send('Conectado al servidor de archivos');

    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(' Nuevo usuario conectado al servidor');
        }
    });

    ws.on('close', () => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('Un usuario se desconectó del servidor');
            }
        });
    });
});

// Iniciar el servidor
server.listen(3000, () => console.log('Servidor en http://localhost:3000'));
