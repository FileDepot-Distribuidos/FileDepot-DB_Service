const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const routes = require('./routes/routes');
const File = require('./models/fileModel');
const Directory = require('./models/directoryModel');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use('/api', routes);

// WebSocket: conexiones en tiempo real
wss.on('connection', ws => {
    console.log('Nuevo cliente conectado al servidor WebSocket');
    ws.send('Conectado al servidor de archivos');

    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send('Nuevo usuario conectado al servidor');
        }
    });

    // Procesamiento de mensajes
    ws.on('message', (message) => {
        try {
            const parsed = JSON.parse(message);

            if (!parsed.action || !parsed.data) {
                console.log('Mensaje no válido:', parsed);
                ws.send('Formato de mensaje incorrecto');
                return;
            }

            const { action, data } = parsed;

            switch (action) {
                case 'upload': {
                    const { name, type, size, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY  } = data;
                    const creation_date = new Date();
                    const last_modified = creation_date;

                    File.create({ name, type, size, creation_date, last_modified, hash, owner_id, NODE_idNODE, DIRECTORY_idDIRECTORY  }, (err) => {
                        if (err) {
                            console.error('Error al guardar el archivo:', err);
                            ws.send('Error al guardar el archivo');
                        } else {
                            console.log('Archivo guardado exitosamente');
                            ws.send('Archivo registrado correctamente');
                        }
                    });
                    break;
                }
                case 'delete': {
                    const { name } = data;
                    File.delete(name, (err) => {
                        if (err) {
                            console.error('Error al eliminar el archivo:', err);
                            ws.send('Error al eliminar el archivo');
                        } else {
                            console.log(`Archivo "${name}" eliminado`);
                            ws.send('Archivo eliminado correctamente');
                        }
                    });
                    break;
                }
                case 'rename': {
                    const { oldFileName, newFileName } = data;
                    File.updateName(oldFileName, newFileName, (err) => {
                        if (err) {
                            console.error('Error al renombrar archivo:', err);
                            ws.send('Error al renombrar archivo');
                        } else {
                            console.log(`Archivo renombrado de "${oldFileName}" a "${newFileName}"`);
                            ws.send('Archivo renombrado correctamente');
                        }
                    });
                    break;
                }
                default:
                    console.log('Acción no reconocida:', action);
                    ws.send('Acción no reconocida');
            }

        } catch (err) {
            console.error('Error al procesar mensaje:', err);
            ws.send('Error en el formato del mensaje');
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

// Iniciar servidor
server.listen(3001, () => {
    console.log('Servidor corriendo en http://localhost:3001');
});
