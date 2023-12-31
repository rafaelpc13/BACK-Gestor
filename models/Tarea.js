import mongoose from "mongoose";
//import bcrypt from "bcrypt";

const tareaSchema = mongoose.Schema
    ({
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        descripcion: {
            type: String,
            required: true,
            trim: true
        },
        estado:{
            type:Boolean,
            default:false,
        },
        fechaEntrega:{
            type:Date,
            default:Date.now,
            required: true,
        },
        prioridad:{
            type:String,
            required:true,
            enum:['Baja','Media', 'Alta']
        },
        observaciones:[{
            observacion:String,
        }],
        proyecto:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Proyecto",
        },
        completado:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Usuario",
        },
        colaboradores: [{
           
           email:String
        },
    ],
    },{timestamps:true,});

    const Tarea = mongoose.model("Tarea", tareaSchema);
export default Tarea;