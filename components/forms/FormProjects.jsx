// Layout
import InputGroup from "./layout/InputGroup"
// Components
import { InputForm, TextareaForm } from "@/components/component/InputForm"
import { Button } from "../ui/button";
//  Esquemas
import { projectSchema } from "@/utils/schemas/userInfo.schema"
//  Hooks
import { useForm } from "@/utils/hooks/useForm"

const FormProjects = ({ onClick }) => {

    // Estado Inicial del formulario
    const initialState = {
        name: '',
        position: '',
        description: ''
    }

    // Hook para el control del formulario
    const { errors, formData, handleInput, add } = useForm(projectSchema, initialState, onClick)

    return (
        <InputGroup title={"Proyectos"}>
            <div className="grid grid-cols-2 gap-4">

                <InputForm
                    name='name'
                    label='Nombre del Proyecto'
                    maxLenght={50}
                    value={formData.name}
                    _errors={errors.name?._errors}
                    onChange={handleInput}
                />
                <InputForm
                    name='position'
                    label='Posición'
                    maxLenght={50}
                    value={formData.position}
                    _errors={errors.position?._errors}
                    onChange={handleInput}
                    placeholder={"Posición/Rol"}
                />
            </div>
            <div className="grid grid-cols-1">
                <TextareaForm
                    name='description'
                    label='Descripción'
                    value={formData.description}
                    _errors={errors.description?._errors}
                    onChange={handleInput}
                    rows={4}
                    placeholder={"Descripción detallada del proyecto"}
                />
            </div>
            <Button onClick={add} className="border hover:bg-slate-50 hover:text-black" >Añadir Proyectos</Button>
        </InputGroup>
    )
}

export default FormProjects