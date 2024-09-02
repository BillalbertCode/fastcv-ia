// Layout
import InputGroup from "./layout/InputGroup"
// Components
import { DateForm, InputForm, TextareaForm } from "@/components/component/InputForm"
import { Button } from "../ui/button";
//  Esquemas
import { experienceSchema } from "@/utils/schemas/userInfo.schema"
//  Hooks
import { useForm } from "@/utils/hooks/useForm"
// Utilidades
import { dateToday } from "@/utils/helper/time-handlers/today"

const FormExperience = ({ onClick }) => {

    // Estado Inicial del formulario
    const initialState = {
        organization: '',
        location: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    }

    // Hook para el control del formulario
    const { errors, formData, handleInput, add } = useForm(experienceSchema, initialState, onClick)

    return (
        <InputGroup title={"Experiencia"}>
            <InputForm
                name='organization'
                label='Empresa o Organización'
                maxLenght={50}
                value={formData.organization}
                _errors={errors.organization?._errors}
                onChange={handleInput}
                placeholder={"Nombre de la Organizacion/Empresa"}
            />
            <InputForm
                name='position'
                label='Posición'
                maxLenght={50}
                value={formData.position}
                _errors={errors.position?._errors}
                onChange={handleInput}
                placeholder={"Título del empleo"}
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
                label='Fecha de Fin'
                value={formData.endDate}
                _errors={errors.endDate?._errors}
                onChange={handleInput}
                min={"1900-01-01"}
                max={dateToday()}
            />
            <InputForm
                name='location'
                label='Lugar'
                maxLenght={50}
                value={formData.location}
                _errors={errors.location?._errors}
                onChange={handleInput}
            />
            <TextareaForm
                name='description'
                label='Descripción'
                value={formData.description}
                _errors={errors.description?._errors}
                onChange={handleInput}
                rows={4}
                placeholder={"Descripción detallada de tu utilidad en la compañia"}
            />
            <Button onClick={add} className="border hover:bg-slate-50 hover:text-black" >Añadir Experiencia</Button>
        </InputGroup>
    )
}

export default FormExperience