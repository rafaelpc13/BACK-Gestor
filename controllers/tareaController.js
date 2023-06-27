import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuarios.js";

const agragarTarea = async (req, res) => {
    const { proyecto } = req.body;

    const existeProyecto = await Proyecto.findById(proyecto);

    if (!existeProyecto) {
        const error = new Error("El poryecto no existe");
        return res.status(404).json({ msg: error.message });
    }

    if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No tienes los permisos para añadir tareas");
        return res.status(404).json({ msg: error.message });
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);
        //almacaenar id en el proyecto
        existeProyecto.tareas.push(tareaAlmacenada._id);
        await existeProyecto.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }
    console.log(existeProyecto);
};

const obtenerTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error("tarea no existe");
        return res.status(404).json({ msg: error.message });
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg: error.message });
    }

    res.json(tarea)

};

const actualizarTarea = async (req, res) => {

    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error("tarea no existe");
        return res.status(404).json({ msg: error.message });
    }
   /*  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg: error.message });
    } */
//console.log("TAREA--->",req.body.observacion)
    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.descripcion = req.body.descripcion || tarea.descripcion;
    tarea.prioridad = req.body.prioridad || tarea.cliente;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
    if (req.body.observacion) {
        tarea.observaciones.push({ observacion: req.body.observacion });
    }

    try {
        const tareaAlmacenada = await tarea.save();
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }
};

const eliminarTarea = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error("tarea no existe");
        return res.status(404).json({ msg: error.message });
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg: error.message });
    }

    try {

        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()]);
        // await tarea.deleteOne();
        res.json({ msg: "Tarea Eliminada" })
    } catch (error) {
        console.log(error);
    }
};

const cambiarEstado = async (req, res) => {
    const { id } = req.params;

    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        const error = new Error("tarea no existe");
        return res.status(404).json({ msg: error.message });
    }
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() &&
        !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
        const error = new Error("Accion no valida");
        return res.status(403).json({ msg: error.message });
    }
    tarea.estado = !tarea.estado;
    tarea.completado = req.usuario._id;
    await tarea.save()
    const tareaAlmacenada = await Tarea.findById(id)
        .populate("proyecto")
        .populate("completado");
    res.json(tareaAlmacenada);
};

const agregarColaborador = async (req, res) => {

    const tarea = await Tarea.findById(req.params.id);

    const { email } = req.body
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ msg: error.message });
    }


    if(tarea.colaboradores.includes(usuario._id)){
        const error = new Error("El colaborador ya se encuentra agregado");
        return res.status(404).json({ msg: error.message });
    }
    observacion: req.body.observacion 
    tarea.colaboradores.push({email:usuario.email});
    await tarea.save()
    res.json({msg:'Colaborador Agregado'})
  
};


export {
    agragarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado,
    agregarColaborador
}