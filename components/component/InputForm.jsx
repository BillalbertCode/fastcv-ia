// Input con manejo de errores
// Ui
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
// Icons
import { ErrorIco } from "../resources/Icons"

export const InputForm = ({ maxLenght, name, label, _errors, value, onChange, placeholder, title }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input name={name}
                title={title}
                value={value}
                onChange={onChange}
                id={name}
                maxLenght={maxLenght}
                className={_errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder={placeholder || label} />
            {_errors &&
                <label title={_errors[0]} htmlFor="lastName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                    <p className="text-xs basis-4/5 ">{_errors[0]}</p>
                    <ErrorIco />
                </label>
            }
        </div>
    )
}

export const DateForm = ({name, label, _errors, value, onChange, placeholder, title, min, max }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Input name={name}
                title={title}
                value={value}
                onChange={onChange}
                id={name}
                type="date"
                min={min}
                max={max}
                className={_errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder={placeholder || label} />
            {_errors &&
                <label title={_errors[0]} htmlFor="lastName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                    <p className="text-xs basis-4/5 ">{_errors[0]}</p>
                    <ErrorIco />
                </label>
            }
        </div>
    )
}

export const TextareaForm = ({ maxLenght, rows, name, label, _errors, value, onChange, placeholder, title }) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <Textarea name={name}
                title={title}
                value={value}
                onChange={onChange}
                id={name}
                rows={rows}
                maxLenght={maxLenght}
                className={_errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder={placeholder || label} />
            {_errors &&
                <label title={_errors[0]} htmlFor="lastName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                    <p className="text-xs basis-4/5 ">{_errors[0]}</p>
                    <ErrorIco />
                </label>
            }
        </div>
    )
}