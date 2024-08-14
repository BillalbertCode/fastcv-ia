// Esquema de datos del usuario.
// Valida antes de Guardar los datos en cache 
import { z } from "zod";

const requeridoMsg = 'Este campo es requerido'
const requeridoMsgMax = numbermax => `Máximo ${numbermax} caracteres`

export const userInfoSchema = z.object({
    personalInfo: z.object({
        name: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
        lastName: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
        phone: z.string().min(1, { message: requeridoMsg }).regex(/^(\+?\d{1,3})?[-. ]?(\d{3,12})$/, { message: 'Ingresa un numero de telefono valido' }),
        email: z.string().min(1, { message: requeridoMsg }).email({ message: 'Ingresa un email valido' }),
        description: z.string().min(10, { message: 'La descripcion debe tener al menos 10 caracteres' }).max(500, { message: requeridoMsgMax(500) })
    })
})

export const skillSchema = z.object({
    name: z.string().min(1, { message: requeridoMsg }).max(20, { message: requeridoMsgMax(20) }),
})

export const educationSchema = z.object({
    name: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    location: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    degree: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    concentration: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    graduationDate: z.string().date('Ingresa una fecha valida'),
    gpa: z.string().max(3, { message: requeridoMsgMax(50) }).optional(),
    thesis: z.string().max(50, { message: requeridoMsgMax(50) }).optional(),
    relevantEvents: z.string().max(300, { message: requeridoMsgMax(300) }).optional(),
    courseWorks: z.string().max(200, { message: requeridoMsgMax(200) }).optional()
})

export const experienceSchema = z.object({
    organization: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    location: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    position: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    startDate: z.string().date('Ingresa una fecha valida'),
    endDate: z.string().date('Ingresa una fecha valida'),
    description: z.string().min(10, { message: 'Mínimo de 10 caracteres' }).max(500, { message: requeridoMsgMax(500) })
})

export const projectSchema = z.object({
    name: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    position: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    description: z.string().min(10, { message: 'Mínimo 10 caracteres' }).max(500, { message: requeridoMsgMax(500) })
})

export const leadershipSchema = z.object({
    organization: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    role: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    location: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    startDate: z.string().date('Ingresa una fecha valida'),
    endDate: z.string().date('Ingresa una fecha valida'),
    achievements: z.string().min(10, { message: 'Mínimo 10 caracteres' }).max(500, requeridoMsgMax(500))
})