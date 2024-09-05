// Layout
import InputGroup from "./layout/InputGroup";
// Components
import { InputForm } from "../component/InputForm";
import { Button } from "../ui/button";
// Esquemas
import { skillSchema } from "@/utils/schemas/userInfo.schema";
import { useForm } from "@/utils/hooks/useForm";

const FormSkills = ({ onClick }) => {
    // Estado del Formulario
    const initialState = { name: '' }

    // Hook para el control del formulario
    const { errors, formData, handleInput, add } = useForm(skillSchema, initialState, onClick)

    return (
        <InputGroup title={"Habilidades"}>
            <div className="flex">
                <InputForm
                    name='name'
                    label='Habilidad'
                    value={formData.name}
                    _errors={errors.name?._errors}
                    onChange={handleInput}
                />
            </div>
            <Button onClick={add} className="border hover:bg-slate-50 hover:text-black" >Añadir Habilidad</Button>
        </InputGroup>
    )
}

export default FormSkills;