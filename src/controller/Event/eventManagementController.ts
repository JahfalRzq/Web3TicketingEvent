import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import Joi, { required } from "joi";
import { User,UserRole } from "../../model/User";
import { encrypt,decrypt } from "../../utils/CryptoData";
import multer from 'multer';  
import path from 'path'; 
import { Event,typeEvent,categoryEvent } from "../../model/Event";

const { joiPasswordExtendCore } = require('joi-password')
const joiPassword = Joi.extend(joiPasswordExtendCore)
const { successResponse, errorResponse, validationResponse } = require('../../../utils/response')

const userRepository = AppDataSource.getRepository(User)
const eventRepository = AppDataSource.getRepository(Event)



const storage = multer.diskStorage({    
    destination: (req, file, cb) => {    
        cb(null, 'public/image/event'); // Pastikan folder ini ada    
    },
    filename: (req, file, cb) => {    
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);    
        cb(null, uniqueSuffix + path.extname(file.originalname));   
    }    
});    
  
export const upload = multer({ storage: storage });

export const createEvent = async (req : Request, res: Response) =>{
    const createEventSchema = (input) => Joi.object({
        nameEvent : Joi.string().required(),
        dateEvent : Joi.date().required(),
        alamatEvent : Joi.string().required(),
        typeEvent : Joi.string().required(),
        categoryEvent : Joi.string().required(),


    }).validate(input);

    try {
        const body = req.body
        const schema = createEventSchema(req.body)
        
        if ('error' in schema) {
            return res.status(422).send(validationResponse(schema))
        }

        const user = await userRepository.findOneBy({ id: req.jwtPayload.id })

       // Validasi role pengguna yang sedang login  
       if (!user || user.role == 'USER') {  
        return res.status(403).send(errorResponse('Access Denied: Only ADMIN & Event Organizer can create Event', 403));  
    }  

        const newEvent = new Event()
        newEvent.nameEvent = body.nameEvent
        newEvent.dateEvent = body.dateEvent
        newEvent.alamatEvent = body.alamatEvent
        newEvent.typeEvent = body.typeEvent
        newEvent.categoryEvent = body.categoryEvent


        if (req.file) {  
            newEvent.image = req.file.path; // Menyimpan path file  
        }  
        
        await userRepository.save(newEvent)

        console.log(newEvent)
        return res.status(200).send(successResponse("Create Event Success", { data: newEvent }, 200))

    }catch(error){
        res.status(500).json({ msg: error.message })
    }
}