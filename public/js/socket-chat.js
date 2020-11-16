var socket = io();

// Recuperamos los parámetros Url
var params = new URLSearchParams( window.location.search );

// validaciones
if ( !params.has('nombre') || !params.has('sala')) { // si no viene el nombre del usuario o la sala
    window.location = 'index.html';
    throw new Error('El nombre y la sala son necesarios');
}

// Definimos datos del usuario
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
} 

socket.on('connect', function() {

    console.log('Conectado al servidor');

    // Emitimos al server el nombre del usuario conectado
    socket.emit('entrarChat', usuario, function( resp ) {
        console.log('Usuarios conectados', resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// // Enviar información
// socket.emit('crearMensaje', {
//     usuario: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    console.log('Servidor:', mensaje);
});

// Escuchar cambios de usuarios, cuando un  usuario entra ó sale del chat
socket.on('listaPersonas', function(personas) {
    console.log(personas);
});

// MENSAJES PRIVADOS, usuario a usuario
socket.on('mensajePrivado', function(mensaje) {

    console.log('Mensaje privado:', mensaje);

});
