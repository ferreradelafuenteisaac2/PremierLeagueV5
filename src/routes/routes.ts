import {Request, Response, Router } from 'express'
import { Equipos, Jugadores } from '../model/schemas'
import { db } from '../database/database'

class Routes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getEquipos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Equipos.aggregate([
                {
                    $lookup: {
                        from: 'jugadores',
                        localField: 'id',
                        foreignField: 'equipo',
                        as: "jugadores"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getEquipo = async (req: Request, res: Response) => {
        const { id } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Equipos.aggregate([
                {
                    $match: {
                        id:id
                    }

                },{
                    $lookup: {
                        from: 'jugadores',
                        localField: 'id',
                        foreignField: 'equipo',
                        as: "jugadores"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }
    // Recibe un documento equipo en el body con los campos indicados aquí 
    private postEquipo = async (req: Request, res: Response) => {
        const { id, nombre, ganados, empatados, perdidos } = req.body
        await db.conectarBD()
        const dSchema={
            id: id,
            nombre: nombre,
            ganados: ganados,
            empatados: empatados,
            perdidos: perdidos
        }
        const oSchema = new Equipos(dSchema)
        await oSchema.save()
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    // Recibe un documento en el body con los campos indicados aquí
    private postJugador = async (req: Request, res: Response) => {
        const { dorsal, nombre, equipo, partidosJugados, minutosJugados, golesEncajados, goles,
                asistencias, tarjetasAmarillas, tarjetasRojas } = req.body
        await db.conectarBD()
        const dSchema={
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
        }
        const oSchema = new Jugadores(dSchema)
        await oSchema.save()
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }
    

    private getJugador = async (req: Request, res: Response) => {
        const { equipo, dorsal } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const j = await Jugadores.findOne({
                dorsal: dorsal,
                equipo: equipo
            })
            res.json(j)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    private updateJugador = async (req: Request, res: Response) => {
        const {dorsal, equipo} = req.params
        const {  partidosJugados, minutosJugados, golesEncajados, goles,
                asistencias, tarjetasAmarillas, tarjetasRojas } = req.body
        await db.conectarBD()
        await Jugadores.findOneAndUpdate({
            dorsal: dorsal,
            equipo: equipo
        },{
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
        },{
            new: true, // para retornar el documento después de que se haya aplicado la modificación
            runValidators:true
        }
        )
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }

    private updateEquipo = async (req: Request, res: Response) => {
        const {id} =req.params
        const {ganados, empatados, perdidos } = req.body
        await db.conectarBD()
        await Equipos.findOneAndUpdate({
            id: id
        },{
            //id:id, it should not be changed
            //nombre:nombre,
            ganados:ganados,
            empatados:empatados,
            perdidos:perdidos
        },{
            new:true,
            runValidators:true
        }
        )
            .then( (doc: any) => res.send(doc))
            .catch( (err: any) => res.send('Error: '+ err)) 
        await db.desconectarBD()
    }


    private deleteJugador = async (req: Request, res: Response) => {
        const { dorsal, equipo } = req.params
        await db.conectarBD()
        await Jugadores.findOneAndDelete(
                { dorsal: dorsal, equipo: equipo }
            )
            .then( (doc: any) => {
                    if (doc == null) {
                        res.send(`No encontrado`)
                    }else {
                        res.send('Borrado correcto: '+ doc)
                    }
            })
            .catch( (err: any) => res.send('Error: '+ err)) 
        db.desconectarBD()
    }
   

    misRutas(){
        this._router.get('/equipos', this.getEquipos),
        this._router.get('/equipo/:id', this.getEquipo),
        this._router.post('/equipo', this.postEquipo), 
        this._router.post('/jugador', this.postJugador),
        this._router.get('/jugador/:dorsal/:equipo', this.getJugador),
        this._router.put('/jugador/:dorsal/:equipo', this.updateJugador),
        this._router.put('/equipo/:id', this.updateEquipo),
        this._router.delete('/deleteJugador/:dorsal/:equipo', this.deleteJugador)
    }
}

const obj = new Routes()
obj.misRutas()
export const routes = obj.router