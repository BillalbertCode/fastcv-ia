import { useState } from "react";
// Layout
import InputGroup from "./layout/InputGroup";
// Components
import InputForm from "../component/InputForm";
import { Button } from "../ui/button";
// Esquemas
import { skillSchema } from "@/utils/schemas/userInfo.schema";
import { useForm } from "@/utils/hooks/useForm";

const FormSkills = ({ onClick }) => {

    const initialState = { name: '' }
    const { errors, formData, handleInput, add } = useForm(skillSchema, initialState, onClick)

    return (
        <InputGroup title={"Habilidades"}>
            <InputForm
                name='name'
                label='Habilidad'
                value={formData.name}
                _errors={errors.name?._errors}
                onChange={handleInput}
            />
            <Button onClick={add} className="border hover:bg-slate-50 hover:text-black" >Añadir Habilidad</Button>
        </InputGroup>
    )
}

export default FormSkills;