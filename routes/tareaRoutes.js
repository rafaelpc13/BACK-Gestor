import express from "express";

import{agragarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    agregarColaborador,
    cambiarEstado,} from "../controllers/tareaController.js";
    import checkAuth from "../middleware/checkAuth.js";


    const router = express.Router();
    router.post("/",checkAuth,agragarTarea);
    router
    .route("/:id")
    .get(checkAuth,obtenerTarea)
    .put(checkAuth,actualizarTarea)
    .delete(checkAuth,eliminarTarea);

    router.post("/estado/:id",checkAuth,cambiarEstado);
    router.post('/colaboradores/:id',checkAuth,agregarColaborador);

    export default router;