// Input con manejo de errores
// Ui
import { Label } from "../ui/label"
import { Input } from "../ui/input"
// Icons
import { ErrorIco } from "../resources/Icons"

const InputForm = ({ name, label, _errors, value, onChange }) => {
    return (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <Input name={name}
                value={value}
                onChange={onChange}
                id={name}
                className={_errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder={label} />
            {_errors &&
                <label title={_errors[0]} htmlFor="lastName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                    <p className="text-xs basis-4/5 ">{_errors[0]}</p>
                    <ErrorIco/>
                </label>
            }
        </div>
    )
}

export default InputForm