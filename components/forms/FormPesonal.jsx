// Layout
import InputGroup from "./layout/InputGroup";
// Components
import { InputForm, SelectForm, TextareaForm } from "../component/InputForm";
import { Button } from "../ui/button";
// Esquemas
import { personalInfoSchema } from "@/utils/schemas/userInfo.schema";
// Hooks
import { useForm } from "@/utils/hooks/useForm";
import { phoneCountrys } from "@/utils/phoneCountrys";

const FormPersonal = ({ onClick }) => {

    // Estado inicial del formulario
    const initialState = {
        name: '',
        lastName: '',
        countryCode: '',
        phoneNumber: '',
        email: '',
        description: ''
    }

    // Hook para el control del formulario
    const { errors, formData, handleInput, add } = useForm(personalInfoSchema, initialState, onClick)

    // Opciones de Numeros de telefono
    const countryOptions = {
        placeholder: 'Seleccione un país', // texto del placeholder
        items: phoneCountrys.map((phone) => ({
            title: phone.name + phone.phoneCode,
            value: phone.phoneCode,
            label: phone.code,
        })),
    };

    return (
        <InputGroup title={"Información Personal"}>
            <InputForm
                name='name'
                label='Nombre'
                value={formData.name}
                _errors={errors.name?._errors}
                onChange={handleInput}
                maxLenght={50}
            />
            <InputForm
                name='lastName'
                label='Apellido'
                value={formData.lastName}
                _errors={errors.lastName?._errors}
                onChange={handleInput}
                maxLenght={50}
            />
            <InputForm
                name='email'
                label='Email'
                value={formData.email}
                _errors={errors.email?._errors}
                onChange={handleInput}
                maxLenght={50}
            />
            <div className="flex">
                <SelectForm
                    name='countryCode'
                    label='Seleccione el País'
                    onChange={handleInput}
                    value={formData.countryCode}
                    _errors={errors.countryCode?._errors}
                    options={countryOptions.items}
                />
                <InputForm
                    name='phoneNumber'
                    label='Número de Teléfono'
                    value={formData.phoneNumber}
                    _errors={errors.phoneNumber?._errors}
                    onChange={handleInput}
                />
            </div>
            <TextareaForm
                name='description'
                label='Descripción'
                value={formData.description}
                _errors={errors.description?._errors}
                onChange={handleInput}
                maxLenght={1100}
                placeholder={"Habla un poco de tí en esta descripción, como quien eres y que experiencias tienes.. "}
            />
            <Button onClick={add} className="border hover:bg-slate-50 hover:text-black" >Añadir Informacion Personal</Button>
        </InputGroup>
    )
}

export default FormPersonal;