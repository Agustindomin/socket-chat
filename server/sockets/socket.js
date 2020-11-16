const { io } = require('../server');

// Cargamos la clase Usuarios
const { Usuarios } = require('../classes/usuarios');

// Cargamos las Utilidades
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        // Validamos el nombre
        if ( !data.nombre || !data.sala ) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son necesarios'
            });
        }

        // Instrucción para conectar un usuario a una sala
        client.join(data.sala);

        // Agregamos el usuario a la clase Usuarios
        usuarios.agregrarPersona(client.id, data.nombre, data.sala);

        // Enviamos la lista de personas conectadas de la misma sala pero sólo a los usuarios de la misma sala
        client.broadcast.to( data.sala ).emit('listaPersonas', usuarios.getPersonasPorSala( data.sala ));

        // En el callback retornamos las personas conectadas a la misma sala de chat
        callback( usuarios.getPersonasPorSala( data.sala ) );

    });

    client.on('crearMensaje', (data) => {

        // Recuperamos el nombre del usuario que envía el mensaje
        let persona = usuarios.getPersona( client.id );

        // creamos el mensaje
        let mensaje = crearMensaje( persona.nombre, data.mensaje );

        // Enviamos el mensaje a todos los usuarios de la misma sala!!!
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });

    // cuando un usuario se desconecta, lo borramos del chat
    client.on('disconnect', () => {

        // Borramos usuario del chat
        let personaBorrada = usuarios.borrarPersona( client.id );

        // Notificamos a todos los usuarios, de la misma sala!, que esta persona abandonó el chat
        // client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${ personaBorrada.nombre } abandono el chat` });
        client.broadcast.to( personaBorrada.sala ).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salió del chat`) );

        // Enviamos la lista de personas conectadas a la misma sala!
        client.broadcast.to( personaBorrada.sala ).emit('listaPersonas', usuarios.getPersonasPorSala( personaBorrada.sala ));

    });

    // MENSAJES PRIVADOS
    client.on('mensajePrivado', (data, callback) => {

        // data debe contener el id de la persona a la cual se envía el mensaje
        // if ( !data.idEnviar ) {
        //     return callback({
        //         error: true,
        //         mensaje: 'El id de la persona a enviar mensaje es necesario'
        //     });
        // }

        // Recuperamos el nombre del usuario que envía el mensaje
        let persona = usuarios.getPersona( client.id );

        // Enviamos el mensaje privado al usuario
        client.broadcast.to( data.idEnviar ).emit('crearMensaje', crearMensaje( persona.nombre, data.mensaje ));


    });



});