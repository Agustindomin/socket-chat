// Recuperamos los parámetros pasados por Url
var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre');
var sala = params.get('sala');


// Referencias JQuery
//======================================
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
var Chattitle = $('#Chattitle');




// Funciones para renderizar usuarios
//======================================
function renderizarUsuarios( personas ) { // [{},{},{},...]

    // console.log(personas);

    var html = '';

    Chattitle.text(params.get('sala'));

    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';

    // recorremos el array de personas
    for( var i = 0; i < personas.length; i++ ) {
        html += '<li>';
        html += '<a data-id="' + personas[0].id + '" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';
    }

    // Ponemos el html en divUsuarios
    divUsuarios.html(html);

}

function renderizarMensajes( mensaje, yo ) { // {fecha: , mensaje: , nombre:}, yo: es si yo envío el mensaje

    // console.log(mensaje);

    var html = '';
    // formateamos la fecha timstamp
    var fecha = new Date( mensaje.fecha );
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    // si el mensaje viene del administrador cambiamos el color
    var adminClass = 'info';
    if ( mensaje.nombre === 'Administrador' ) {
        adminClass = 'danger';
    }

    if ( yo ) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if ( mensaje.nombre !== 'Administrador' ) {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }

    // Añadimos el html en divChatbox
    divChatbox.append(html);

}

// Scroll automático para el divChatbox
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



// Listeners de JQuery
//=============================
divUsuarios.on('click', 'a', function() {

    var id = $(this).data('id');

    if ( id ) { // porque el <a></a> de la sala no tiene id
        console.log(id);
    }

});

formEnviar.on('submit', function(e) {

    // por si pulsa enter sin dar al boton
    e.preventDefault();

    // validamos mewnsajes vacíos
    if ( txtMensaje.val().trim() === 0) {
        return;
    }

    // Enviamos el mensaje
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val().trim()
    }, function(mensaje) {
        txtMensaje.val('').focus();
        renderizarMensajes(mensaje, true); // porque soy yo el que la ha dado al botón
        scrollBottom();
    });

    // console.log(txtMensaje.val());

});
