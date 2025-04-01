const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');
const WebSocket = require('ws');

const SERVER_URL = 'http://localhost:3000/api';
const WS_SERVER_URL = 'ws://localhost:3000';

// Establecer la conexión WebSocket
const ws = new WebSocket(WS_SERVER_URL);

ws.on('open', () => {
    console.log('Conexión WebSocket establecida');
});

ws.on('message', message => {
    console.log(`Mensaje del servidor: ${message}`);
});

// Función para generar el hash del archivo
function generateFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
}

// Función para subir un archivo
async function uploadFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: El archivo ${filePath} no existe`);
        return;
    }

    try {
        const fileHash = generateFileHash(filePath);  // Generar hash
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('hash', fileHash);  // Agregar hash al formulario

        const response = await axios.post(`${SERVER_URL}/upload`, formData, {
            headers: formData.getHeaders(),
        });

        console.log('Archivo subido con éxito:', response.data);
    } catch (error) {
        console.error('rror al subir el archivo:', error.response ? error.response.data : error.message);
    }
}

// Función para eliminar un archivo
async function deleteFile(nombreArchivo) {
    try {
        const response = await axios.delete(`${SERVER_URL}/delete/${nombreArchivo}`);
        console.log('Archivo eliminado:', response.data);
    } catch (error) {
        console.error('Error al eliminar el archivo:', error.response ? error.response.data : error.message);
    }
}

// Función para renombrar un archivo
async function renameFile(oldName, newName) {
    try {
        const response = await axios.put(`${SERVER_URL}/rename/${oldName}`, { newName });
        console.log('Archivo renombrado:', response.data);
    } catch (error) {
        console.error('Error al renombrar el archivo:', error.response ? error.response.data : error.message);
    }
}

//menu
function showMenu() {
    console.log('Selecciona una opción:');
    console.log('1: Subir un archivo');
    console.log('2: Eliminar un archivo');
    console.log('3: Renombrar un archivo');
    console.log('4: Salir');
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    showMenu();

    rl.question('Elige una opción: ', async (option) => {
        if (option === '1') {
            const filePath = await new Promise(resolve => {
                rl.question('Ingresa la ruta del archivo a subir: ', resolve);
            });
            uploadFile(filePath);
        } else if (option === '2') {
            const fileName = await new Promise(resolve => {
                rl.question('Ingresa el nombre del archivo a eliminar: ', resolve);
            });
            deleteFile(fileName);
        } else if (option === '3') {
            const oldName = await new Promise(resolve => {
                rl.question('Ingresa el nombre del archivo a renombrar: ', resolve);
            });
            const newName = await new Promise(resolve => {
                rl.question('Ingresa el nuevo nombre para el archivo: ', resolve);
            });
            renameFile(oldName, newName);
        } else if (option === '4') {
            console.log('Saliendo...');
            rl.close();
        } else {
            console.log('Opción no válida');
            rl.close();
        }
    });
}


main();
