// Layout
import InputGroup from "./layout/InputGroup";
// Components
import { DateForm, InputForm, TextareaForm } from "../component/InputForm";
import { Button } from "../ui/button";
// Esquemas
import { leadershipSchema } from "@/utils/schemas/userInfo.schema";
// Hooks
import { useForm } from "@/utils/hooks/useForm";
// Utilidades
import { dateToday } from "@/utils/helper/time-handlers/today";


const FormLeadership = ({ onClick }) => {

    // Estado inicial del formulario
    const initialState = {
        organization: '',
        location: '',
        role: '',
        startDate: '',
        endDate: '',
        achievements: ''
    }

    // Hook para el control del formulario
    const { errors, formData, handleInput, add } = useForm(leadershipSchema, initialState, onClick)

    return (
        <InputGroup title={"Liderazgo y Actividades"}>
            <InputForm
                name='organization'
                label='Organización'
                value={formData.organization}
                _errors={errors.organization?._errors}
                onChange={handleInput}
                maxLenght={50}
            />
            <InputForm
                name='role'
                label='Rol'
                value={formData.role}
                _errors={errors.role?._errors}
                onChange={handleInput}
                maxLenght={50}
                placeholder={"Ingresa tu Rol/Posición"}
                title={"Cual fue tu rol/posición, que hiciste?"}
            />
            <DateForm
                name='startDate'
                label='Fecha de Inicio'
                value={formData.startDate}
                _errors={errors.startDate?._errors}
                onChange={handleInput}
                min={"1900-01-01"}
                max={dateToday()}
            />
            <DateForm
                name='endDate'
                label='Fecha de Finalización'
                value={formData.endDate}
                _errors={errors.endDate?._errors}
                onChange={handleInput}
                min={"1900-01-01"}
                max={dateToday()}
            />
            <InputForm
                name='location'
                label='Lugar'
                value={formData.location}
                _errors={errors.location?._errors}
                onChange={handleInput}
                maxLenght={50}
            />
            <TextareaForm
                name='description'
                label='Descripción'
                value={formData.description}
                _errors={errors.description?._errors}
                onChange={handleInput}
                placeholder={"Describe extensivamente como fue tu participación en este evento o que logros obtuviste"}
            />
            <Button onClick={add} className="border hover:bg-slate-50 hover:text-black" >Añadir Liderazgo</Button>
        </InputGroup>
    )
}

export default FormLeadership;