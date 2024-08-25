// Esquema de datos del usuario.
// Valida antes de Guardar los datos en cache 
import { z } from "zod";

// Mensajes de requerido
const requeridoMsg = 'Este campo es requerido'
const requeridoMsgMax = numbermax => `Máximo ${numbermax} caracteres`

// Meses para el Formato
const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
];

// Formateo de el string Si la fecha es la del dia de hoy.
const dateScheme = z.string().min('Ingresa una fecha valida');

// Formatea la fecha recivida a: 'Atualmente' o Mes - Año
const dateFormate = (dateScheme) => {

    // Recibe como value una cadena ejemplo: "2024-08-16" de ahi encuentra los datos
    return dateScheme.transform((value, ctx) => {

        // Desestructuración de Fecha
        const dateParts = value.split('-');
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        // Definimos y revisamos si es 'Actualmente' (Hoy)
        const today = new Date();
        if (date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()) {
            return 'Actualmente';
        }

        // Convertimos la fecha en formato "Mes - Año"

        const monthName = months[date.getMonth()];
        const year = date.getFullYear();

        return `${monthName} - ${year}`;
    });
}

// Esquema de los datos, Validacion, Formato 
const parsedDate = dateFormate(dateScheme);

// PersonalInfo Schema

const personalInfoSchema = z.object({
    name: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    lastName: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    phoneNumber: z.string().min(1, { message: requeridoMsg }).regex(/^(\+?\d{1,3})?[-. ]?(\d{3,12})$/, { message: 'Ingresa un numero de telefono valido' }),
    phone: z.string().min(1, { message: requeridoMsg }),
    email: z.string().min(1, { message: requeridoMsg }).email({ message: 'Ingresa un email valido' }),
    description: z.string().min(10, { message: 'Mínimo 10 caracteres' }).max(1100, { message: requeridoMsgMax(1100) })
})

// Exportacion de Esquemas
export const skillSchema = z.object({
    name: z.string().min(1, { message: requeridoMsg }).max(20, { message: requeridoMsgMax(20) }),
})

export const educationSchema = z.object({
    name: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    location: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    degree: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    concentration: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    graduationDate: parsedDate,
    gpa: z.string().max(3, { message: requeridoMsgMax(50) }).optional(),
    thesis: z.string().max(50, { message: requeridoMsgMax(50) }).optional(),
    relevantEvents: z.string().max(300, { message: requeridoMsgMax(300) }).optional(),
    courseWorks: z.string().max(200, { message: requeridoMsgMax(200) }).optional()
})

export const experienceSchema = z.object({
    organization: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    location: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    position: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    startDate: parsedDate,
    endDate: parsedDate,
    description: z.string().min(10, { message: 'Mínimo de 10 caracteres' }).max(1000, { message: requeridoMsgMax(1000) })
})

export const projectSchema = z.object({
    name: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    position: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    description: z.string().min(10, { message: 'Mínimo 10 caracteres' }).max(1100, { message: requeridoMsgMax(1100) })
})

export const leadershipSchema = z.object({
    organization: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    role: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    location: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
    startDate: parsedDate,
    endDate: parsedDate,
    achievements: z.string().min(10, { message: 'Mínimo 10 caracteres' }).max(1100, requeridoMsgMax(1100))
})

export const userInfoSchema = z.object({
    personalInfo: personalInfoSchema,
    education: z.array(z.any()).nonempty({ message: requeridoMsg })
})

// Esquema que usa el server para validar los datos 
export const userServerSchema = z.object({
    personalInfo: personalInfoSchema,
    technicalSkills: z.array(skillSchema).optional(),
    education: z.array(educationSchema.extend({ graduationDate: z.string() })).nonempty(),
    experience: z.array(experienceSchema.extend({ startDate: z.string(), endDate: z.string() })).optional(),
    projects: z.array(projectSchema).optional(),
    leadershipAndActivities: z.array(leadershipSchema.extend({ startDate: z.string(), endDate: z.string() })).optional(),
    jobDescription: z.string().min(32,{message: 'Mínimo 32 caracteres'}).max(1100,{message: requeridoMsgMax(1100)}).optional()
})