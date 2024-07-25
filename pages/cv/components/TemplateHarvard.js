
// Añadir lo necesario para el mapeo del array de objeto
// Analizar si necesita un tipo distinto de distribucion segun el tipo de carrera
const TemplateEducation = () => {
    return (
        <div>
            <div className="d-flex justify-content-between">
                <h3 className="h6">[Education Name]</h3>
                <p>[Sitio/Lugar]</p>
            </div>
            <div className="d-flex justify-content-between">
                <p>[Titulo Academico], [Area de estudio], [Calficacion Promedio] </p>
                <p>[Año de Graduación]</p>
            </div>
            <div>
                <p>[Thesis (opcional)] </p>
                <p>[Relevant Coursework: (Note: optional. Honors & awards can also be listed here)]</p>
            </div>
        </div>
    )
}

const TemplateSkills = () => {
    return(
        <div>
            <p><span className="fw-semibold">Habilidades Tecnicas</span>[lista de habilidades tecnicas]</p>
            <p><span className="fw-semibold">Habilidades Tecnicas</span>[lista de habilidades tecnicas]</p>
            <p><span className="fw-semibold">Habilidades Tecnicas</span>[lista de habilidades tecnicas]</p>
            <p><span className="fw-semibold">Habilidades Tecnicas</span>[lista de habilidades tecnicas]</p>
        </div>
    )
}

const TemplateExperience = () => {
    return (
        <div>
            <div className="d-flex justify-content-between">
                <h3 className="h6">[organization Name]</h3>
                <p>[Sitio/Lugar]</p>
            </div>
            <div className="d-flex justify-content-between">
                <p className="fw-semibold" >[Position Title]</p>
                <p>[Fecha Init] - [Fecha End]</p>
            </div>
            <p>[Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ]</p>
        </div>
    )
}

const TemplateProjects = () => {
    return (
        <div>
            <h3 className="h6">[Project Name] <a href="[linkDelProyecto]">[Link (opcional)]</a></h3>
            <p>[Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. ]</p>
        </div>
    )
}

const TemplateLidership = () => {
    return (
        <div>
            <div className="d-flex justify-content-between">
                <h3 className="h6">[organization Name]</h3>
                <p>[Sitio/Lugar]</p>
            </div>
            <div className="d-flex justify-content-between">
                <p className="fw-semibold" >[Role]</p>
                <p>[Fecha Init] - [Fecha End]</p>
            </div>
            <p>[En este contexto, se busca destacar las habilidades de liderazgo, la capacidad para trabajar en equipo, la iniciativa y la pasión por actividades específicas que un estudiante ha demostrado fuera del salón de clases.]</p>
        </div>
    )
}
const TemplateHarvard = ({ user }) => {
    return (
        <div className="container-fluid p-5 bg-light text-dark">
            <div className="d-flex flex-column align-items-center">
                <h1 className="h5">{`${user.name} ${user.lastName}`}</h1>
                <div>
                    {`${user.email} | ${user.phone} |`} <a href={user.linkedin}>linkedin</a>
                </div>
            </div>
            <div className="mt-4">
                <p className="text-center"><u>Educación</u></p>
                {/* // Añadir lo necesario para el mapeo del array de objeto */}
                <TemplateEducation />
            </div>
            <div className="mt-4">
                <p className="text-center"><u>Experiencia</u></p>
                <TemplateExperience />
            </div>
            <div className="mt-4">
                <p className="text-center"><u>Proyectos</u></p>
                <TemplateProjects />
            </div>
            <div className="mt-4">
                <p className="text-center"><u>Liderzgo y Actividades</u></p>
                <TemplateLidership />
            </div>
            <div className="mt-4">
                <p className="text-center">Habilidades Tecnicas</p>
                <TemplateSkills/>
            </div>
        </div>
    )
}

export default TemplateHarvard