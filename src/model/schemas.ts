import { Schema, model } from 'mongoose'

const EquipoSchema = new Schema({
    id: String,
    nombre: String,
    ganados: Number,
    empatados: Number,
    perdidos: Number
},{
    collection:'equipos'
})


const JugadorSchema = new Schema({
    dorsal: Number,
    nombre: String,
    equipo: String,
    partidosJugados: Number,
    minutosJugados: Number,
    golesEncajados:Number,
    goles: Number,
    asistencias: Number,
    tarjetasAmarillas: Number,
    tarjetasRojas: Number
},{
    collection:'jugadores'
})



export const Equipos = model('equipos', EquipoSchema  )
export const Jugadores = model('jugadores', JugadorSchema  )
