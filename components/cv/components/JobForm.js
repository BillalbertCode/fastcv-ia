// Formulario de Trabajo (opcional)
// Esto es para crear un cv con mayor compatibilidad con el trabajo
// Ademas te da un puntaje de que tan compatible eres y un feedback

/**
 * 
 * @param {string} feedbackMessage 
 * @param {number} compatibilityWithWork - compatibilidad con el trabajo 
 * @param {function} onChange - handler input
 * @returns 
 */
import { TextareaForm } from "@/components/component/InputForm"

const JobForm = ({ feedbackMessage, compatibilityWithWork, onChange, _errors }) => {
    return (
        <div className="bg-background p-6 shadow-lg">
            <div className="flex flex-col gap-4">
                <TextareaForm
                    label={"Descripción del Empleo (opcional)"}
                    onChange={onChange}
                    placeholder={"Ingresa una descripción detallada del empleo..."}
                    rows={6}
                    _errors={_errors}
                />
                <div className="flex items-center gap-2">
                    <div title="Compatibilidad con el Empleo" className="flex items-center gap-1 text-primary">
                        <StarIcon className="w-5 h-5" />
                        <span className="font-medium" >{compatibilityWithWork}%</span>
                    </div>
                    <p className="text-muted-foreground">
                        {feedbackMessage}
                    </p>
                </div>
            </div>
        </div>
    )
}

function InfoIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}


function StarIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    )
}

export default JobForm