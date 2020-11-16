// Clase para gestionar los usuarios del chat, va a ser un objeto del tipo:
// {
//     id: 'SKDFKGKJ.95995-Y699Y6FDCV', // será el ID del socket, que es único
//     nombre: 'Agustin',
//     sala: 'videojuegos'
// }



class Usuarios {

    // constructor
    constructor() {
        this.personas = []; // arary de personas conectadas al chat
    }

    // Método parsa agregar una persona al chat
    agregrarPersona(id, nombre, sala) {

        let persona = {id, nombre, sala}; // creamos una persona

        this.personas.push(persona); // agregamos la persona al array de personas

        return this.personas;

    }

    // Método para recuperar una persona por el id
    getPersona( id ) {
        let persona = this.personas.filter( persona => persona.id === id)[0];

        return persona; // persona ó undefined
    }

    // Método para recuperar todas las personas
    getPersonas() {
        return this.personas;
    }

    // Método para recuperar las personas de un a sala
    getPersonasPorSala( sala ) {
        // dcevolvemos sólo las personas en la misma sala
        let personasPorSala = this.personas.filter( persona => {return persona.sala === sala});

        return personasPorSala;
    }

    // Método para borrar una persona del chat
    borrarPersona(id) {

        // Almacenamos la persona antes de borrarla
        let personaBorrada = this.getPersona(id);

        // Borramos la perdsona del array
        this.personas = this.personas.filter( persona => persona.id != id );

        // retornamos la persona borrada
        return personaBorrada;

    }







}


module.exports = {
    Usuarios
}