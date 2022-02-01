"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class Routes {
    constructor() {
        this.getEquipos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Equipos.aggregate([
                    {
                        $lookup: {
                            from: 'jugadores',
                            localField: 'id',
                            foreignField: 'equipo',
                            as: "jugadores"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getEquipo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Equipos.aggregate([
                    {
                        $match: {
                            id: id
                        }
                    }, {
                        $lookup: {
                            from: 'jugadores',
                            localField: 'id',
                            foreignField: 'equipo',
                            as: "jugadores"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        // Recibe un documento equipo en el body con los campos indicados aquí 
        this.postEquipo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, nombre, ganados, empatados, perdidos } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                id: id,
                nombre: nombre,
                ganados: ganados,
                empatados: empatados,
                perdidos: perdidos
            };
            const oSchema = new schemas_1.Equipos(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        // Recibe un documento en el body con los campos indicados aquí
        this.postJugador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { dorsal, nombre, equipo, partidosJugados, minutosJugados, golesEncajados, goles, asistencias, tarjetasAmarillas, tarjetasRojas } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                dorsal: dorsal,
                nombre: nombre,
                equipo: equipo,
                partidosJugados: partidosJugados,
                minutosJugados: minutosJugados,
                golesEncajados: golesEncajados,
                goles: goles,
                asistencias: asistencias,
                tarjetasAmarillas: tarjetasAmarillas,
                tarjetasRojas: tarjetasRojas
            };
            const oSchema = new schemas_1.Jugadores(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.getJugador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { equipo, dorsal } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const j = yield schemas_1.Jugadores.findOne({
                    dorsal: dorsal,
                    equipo: equipo
                });
                res.json(j);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.updateJugador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { dorsal, equipo } = req.params;
            const { partidosJugados, minutosJugados, golesEncajados, goles, asistencias, tarjetasAmarillas, tarjetasRojas } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Jugadores.findOneAndUpdate({
                dorsal: dorsal,
                equipo: equipo
            }, {
                //dorsal: dorsal, It should not be changed
                //nombre: nombre,
                //equipo: equipo, It should not be changed
                partidosJugados: partidosJugados,
                minutosJugados: minutosJugados,
                golesEncajados: golesEncajados,
                goles: goles,
                asistencias: asistencias,
                tarjetasAmarillas: tarjetasAmarillas,
                tarjetasRojas: tarjetasRojas
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.updateEquipo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { ganados, empatados, perdidos } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Equipos.findOneAndUpdate({
                id: id
            }, {
                //id:id, it should not be changed
                //nombre:nombre,
                ganados: ganados,
                empatados: empatados,
                perdidos: perdidos
            }, {
                new: true,
                runValidators: true
            })
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.deleteJugador = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { dorsal, equipo } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Jugadores.findOneAndDelete({ dorsal: dorsal, equipo: equipo })
                .then((doc) => {
                if (doc == null) {
                    res.send(`No encontrado`);
                }
                else {
                    res.send('Borrado correcto: ' + doc);
                }
            })
                .catch((err) => res.send('Error: ' + err));
            database_1.db.desconectarBD();
        });
        this._router = (0, express_1.Router)();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/equipos', this.getEquipos),
            this._router.get('/equipo/:id', this.getEquipo),
            this._router.post('/equipo', this.postEquipo),
            this._router.post('/jugador', this.postJugador),
            this._router.get('/jugador/:dorsal/:equipo', this.getJugador),
            this._router.put('/jugador/:dorsal/:equipo', this.updateJugador),
            this._router.put('/equipo/:id', this.updateEquipo),
            this._router.delete('/deleteJugador/:dorsal/:equipo', this.deleteJugador);
    }
}
const obj = new Routes();
obj.misRutas();
exports.routes = obj.router;
