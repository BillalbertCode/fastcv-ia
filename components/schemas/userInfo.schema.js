// Esquema de datos del usuario.
// Valida antes de Guardar los datos en cache 
import { z } from "zod";

// Mensajes de requerido
const requeridoMsg = 'Este campo es requerido'
const requeridoMsgMax = numbermax => `Máximo ${numbermax} caracteres`

// Formateo de el string Si la fecha es la del dia de hoy.
const endDate = z.string().date('Ingresa una fecha valida');

// Recive como value una cadena ejemplo: "2024-08-16" de ahi encuentra los datos
const parsedEndDate = endDate.transform((value, ctx) => {
  const dateParts = value.split('-');
  const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const today = new Date();
  if (date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()) {
    return 'Actualmente';
  }
  return value;
});


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
    endDate: parsedEndDate,
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
    startDate: z.string().date('Ingresa una fecha valida'),
    endDate: parsedEndDate,
    achievements: z.string().min(10, { message: 'Mínimo 10 caracteres' }).max(1100, requeridoMsgMax(1100))
})

export const userInfoSchema = z.object({
    personalInfo: z.object({
        name: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
        lastName: z.string().min(1, { message: requeridoMsg }).max(50, { message: requeridoMsgMax(50) }),
        phone: z.string().min(1, { message: requeridoMsg }).regex(/^(\+?\d{1,3})?[-. ]?(\d{3,12})$/, { message: 'Ingresa un numero de telefono valido' }),
        email: z.string().min(1, { message: requeridoMsg }).email({ message: 'Ingresa un email valido' }),
        description: z.string().min(10, { message: 'Mpinimo 10 caracteres' }).max(1100, { message: requeridoMsgMax(1100) })
    }),
    technicalSkills: skillSchema.array().optional(),
    education: educationSchema.array().nonempty({ message: requeridoMsg }),
    experience: experienceSchema.array().optional(),
    projects: projectSchema.array().optional(),
    leadership: leadershipSchema.array().optional()
})