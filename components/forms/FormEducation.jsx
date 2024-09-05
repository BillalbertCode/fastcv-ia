// Layout
import InputGroup from "./layout/InputGroup";
// Components
import { DateForm, InputForm, TextareaForm } from "../component/InputForm";
import { Button } from "../ui/button";
// Esquemas
import { educationSchema } from "@/utils/schemas/userInfo.schema";
// Hooks
import { useForm } from "@/utils/hooks/useForm";

const FormEducation = ({ onClick }) => {

    // Estado inicial del formulario
    const initialState = {
        name: '',
        location: '',
        degree: '',
        concentration: '',
        gpa: undefined,
        graduationDate: '',
        thesis: undefined,
        relevantEvents: undefined,
        courseWorks: undefined
    }

    // Hook para el control del formulario
    const { errors, formData, handleInput, add } = useForm(educationSchema, initialState, onClick)

    return (
        <InputGroup title={"Educación"}>
            <div className="grid grid-cols-3 gap-2">
                <InputForm
                    name='name'
                    label='Institución'
                    value={formData.name}
                    _errors={errors.name?._errors}
                    onChange={handleInput}
                    maxLenght={50}
                />
                <InputForm
                    name='degree'
                    label='Título Académico'
                    value={formData.degree}
                    _errors={errors.name?._errors}
                    onChange={handleInput}
                    maxLenght={50}
                />
                <InputForm
                    name='concentration'
                    label='Concentración'
                    value={formData.concentration}
                    _errors={errors.concentration?._errors}
                    onChange={handleInput}
                    maxLenght={50}
                    placeholder={"(opcional)"}
                    title="Área de estudio o Área de Concentracion"
                />
            </div>
            <div className="grid grid-cols-3 gap-2">
                <DateForm
                    name='graduationDate'
                    label='Año de Graduación'
                    value={formData.graduationDate}
                    _errors={errors.graduationDate?._errors}
                    onChange={handleInput}
                    type={"date"}
                    min={"1900-01-01"}
                />
                <InputForm
                    name='location'
                    label='Lugar'
                    value={formData.location}
                    _errors={errors.location?._errors}
                    onChange={handleInput}
                    maxLenght={50}
                />
                <InputForm
                    name='gpa'
                    label='GPA'
                    title='Promedio de Calificaciones'
                    value={formData.gpa}
                    _errors={errors.gpa?._errors}
                    onChange={handleInput}
                    maxLenght={3}
                    placeholder={"(opcional)"}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputForm
                    name='thesis'
                    label='Tesis'
                    title='Nombre de la tesis'
                    value={formData.thesis}
                    _errors={errors.thesis?._errors}
                    onChange={handleInput}
                    maxLenght={50}
                    placeholder={"(opcional)"}
                />
                <InputForm
                    name='courseWorks'
                    label='Cursos'
                    title="Cursos realizados en la institucion"
                    value={formData.courseWorks}
                    _errors={errors.courseWorks?._errors}
                    onChange={handleInput}
                    placeholder={"(opcional)"}
                />
            </div>
            <TextareaForm
                name='relevantEvents'
                label='Eventos Relevantes'
                title="Eventos relevantes en la institución como participaciones"
                value={formData.relevantEvents}
                _errors={errors.relevantEvents?._errors}
                onChange={handleInput}
                rows={3}
                placeholder={"Eventos relevantes en la institución como participaciones, (opcional)"}
            />
            <Button onClick={add} className="border hover:bg-slate-50 hover:text-black" >Añadir Educación</Button>
        </InputGroup>
    )
}

export default FormEducation;