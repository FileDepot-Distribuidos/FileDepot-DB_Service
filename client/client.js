const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const readline = require('readline');
const crypto = require('crypto');

const ws = new WebSocket('ws://localhost:3000/upload');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ws.on('open', () => {
    console.log('Conexión WebSocket establecida');
});

ws.on('message', (message) => {
    console.log('Mensaje del servidor:', message.toString());
    mostrarMenu();
});

function mostrarMenu() {
    console.log("\nSelecciona una opción:");
    console.log("1: Subir un archivo (solo metadatos)");
    console.log("2: Eliminar un archivo");
    console.log("3: Renombrar un archivo");
    console.log("4: Salir");

    rl.question("Elige una opción: ", (opcion) => {
        switch (opcion) {
            case '1':
                subirArchivo();
                break;
            case '2':
                eliminarArchivo();
                break;
            case '3':
                renombrarArchivo();
                break;
            case '4':
                rl.close();
                ws.close();
                break;
            default:
                console.log("Opción inválida");
                mostrarMenu();
                break;
        }
    });
}

function subirArchivo() {
    rl.question("Ingresa la ruta del archivo a subir: ", (ruta) => {
        fs.stat(ruta, (err, stats) => {
            if (err) {
                console.error("Error al leer el archivo:", err.message);
                mostrarMenu();
                return;
            }

            const nombre = path.basename(ruta);
            const extension = path.extname(ruta).slice(1);
            const tipo = getMimeType(extension);
            const size = stats.size;

            const contenido = fs.readFileSync(ruta);
            const hash = crypto.createHash('sha256').update(contenido).digest('hex');

            const owner_id = Math.floor(Math.random() * 1000); // ID aleatorio temporal
            const NODE_idNODE = Math.floor(Math.random() * 3) + 1; // NODO aleatorio entre 1 y 3
            const DIRECTORY_idDIRECTORY = Math.floor(Math.random() * 3) + 2; // DIRECTORIO aleatorio temporal

            const metadatos = {
                action: 'upload',
                data: {
                    name: nombre,
                    type: tipo,
                    size,
                    hash,
                    owner_id,
                    NODE_idNODE,
                    DIRECTORY_idDIRECTORY
                }
            };

            console.log("Metadatos del archivo:", metadatos);
            ws.send(JSON.stringify(metadatos));
        });
    });
}

function eliminarArchivo() {
    rl.question("Ingresa el nombre del archivo a eliminar: ", (nombre) => {
        const mensaje = {
            action: 'delete',
            data: { name: nombre }
        };
        ws.send(JSON.stringify(mensaje));
    });
}

function renombrarArchivo() {
    rl.question("Ingresa el nombre actual del archivo: ", (oldFileName) => {
        rl.question("Ingresa el nuevo nombre del archivo: ", (newFileName) => {
            const mensaje = {
                action: 'rename',
                data: { oldFileName, newFileName }
            };
            ws.send(JSON.stringify(mensaje));
        });
    });
}

function getMimeType(extension) {
    const tipos = {
        txt: 'text/plain',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        pdf: 'application/pdf',
        doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    return tipos[extension.toLowerCase()] || 'application/octet-stream';
}
