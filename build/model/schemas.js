"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jugadores = exports.Equipos = void 0;
const mongoose_1 = require("mongoose");
const EquipoSchema = new mongoose_1.Schema({
    id: String,
    nombre: String,
    ganados: Number,
    empatados: Number,
    perdidos: Number
}, {
    collection: 'equipos'
});
const JugadorSchema = new mongoose_1.Schema({
    dorsal: Number,
    nombre: String,
    equipo: String,
    partidosJugados: Number,
    minutosJugados: Number,
    golesEncajados: Number,
    goles: Number,
    asistencias: Number,
    tarjetasAmarillas: Number,
    tarjetasRojas: Number
}, {
    collection: 'jugadores'
});
exports.Equipos = (0, mongoose_1.model)('equipos', EquipoSchema);
exports.Jugadores = (0, mongoose_1.model)('jugadores', JugadorSchema);
