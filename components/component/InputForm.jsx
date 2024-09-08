// Input con manejo de errores
// Ui
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
// Icons
import { ErrorIco } from "../resources/Icons"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const ErrorLabel = ({ _errors, htmlFor, className }) => {
    return (
        <label title={_errors[0]} htmlFor={htmlFor} className={`${className} text-red-500 ml-1 flex items-end justify-between error-message-vibration`}>
            <p className="text-xs basis-4/5 ">{_errors[0]}</p>
            <ErrorIco />
        </label>
    )
}

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
                <ErrorLabel _errors={_errors} htmlFor={name} />
            }
        </div>
    )
}

export const DateForm = ({ name, label, _errors, value, onChange, placeholder, title, min, max }) => {
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
                <ErrorLabel _errors={_errors} htmlFor={name} />
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
                <ErrorLabel _errors={_errors} htmlFor={name} />
            }
        </div>
    )
}

export const SelectForm = ({ label, onChange, name, _errors, options, value }) => {
    
    // Modificamos un poco la funcion para usarla
    const handleSelectInput = (value) => {
        const e = { target: { name, value } };
        onChange(e);
    };
    return (
        <div className="space-y-2">
            <Label htmlFor={name}>{label}</Label>
            <div className="flex items-center gap-2">
                <Select id={name} name={name} onValueChange={handleSelectInput}>
                    <SelectTrigger className={`w-32 ${_errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}`} >
                        <SelectValue placeholder={`${value.lenght > 0 ? value : label} `} />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-to-r from-cyan-500 to-blue-500">
                        <SelectGroup>
                            {
                                options.map((option, index) => {
                                    return (
                                        <SelectItem
                                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:to-blue-800 focus:to-blue-800"
                                            key={index}
                                            title={option.title + option.value}
                                            value={option.value}
                                        >
                                            {option.label + " " + option.value}
                                        </SelectItem>
                                    )
                                })
                            }
                            <SelectItem value={' '} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:to-blue-800 focus:to-blue-800" >
                                Ninguno
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {_errors &&
                <ErrorLabel _errors={_errors} htmlFor={name} />
            }
        </div>
    )
}