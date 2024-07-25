import { useRef } from "react"
import createPDF from "../utils/createPDF";
// Añadir lo necesario para el mapeo del array de objeto
// Analizar si necesita un tipo distinto de distribucion segun el tipo de carrera

const TemplateHarvard = ({ user }) => {

    // Hacemos referencia al elemento para luego poder descargarlo
    const cvRef = useRef(null)
    return (
        <>
            <div ref={cvRef} className="container-fluid p-5 bg-white text-dark">
                <div className="d-flex flex-column align-items-center">
                    <h1 className="h5">{`${user.personalInfo.name} ${user.personalInfo.lastName} `}</h1>
                    <div>
                        {`${user.personalInfo.email} | ${user.personalInfo.phone} |`} <a href={user.personalInfo.linkedin}>linkedin</a>
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-center"><u>Educación</u></p>
                    {user.education.map((edu, index) => {
                        return (
                            <SchemeEducation key={index} education={edu} />
                        )
                    })
                    }

                </div>
                <div className="mt-4">
                    <p className="text-center"><u>Experiencia</u></p>
                    {user.experience.map((exp, index) => {
                        return (
                            <SchemeExperience key={index} experience={exp} />
                        )
                    })}
                </div>
                <div className="mt-4">
                    <p className="text-center"><u>Proyectos</u></p>
                    {user.projects.map((project, index) => {
                        return (
                            <SchemeProjects key={index} project={project} />
                        )
                    })}
                </div>
                <div className="mt-4">
                    <p className="text-center"><u>Liderzgo y Actividades</u></p>
                    {user.leadershipAndActivities.map((leadership, index) => {
                        return (
                            <SchemeLidership key={index} leadership={leadership} />
                        )
                    })}
                </div>
                <div className="mt-4">
                    <p className="text-center">Habilidades Tecnicas</p>
                    {user.technicalSkills.map((skill, index) => {
                        return (
                            <SchemeSkills key={index} technicalSkills={skill} />
                        )
                    })}
                </div>
            </div>
            <button className="btn btn-outline-success" onClick={() => createPDF(cvRef)}>Generar PDF</button>
        </>

    )
}

export default TemplateHarvard

// esquema de educacion
// datos que espera: 
// name: nombre de la institucion
// location: lugar del titulo
// degree: titulo obtenido
// concentracion: area de estudio
// gpa: notas recividas (opcional)
// graduationDate: Fecha de graduacion, mes y año
// thesis: nombre de la thesis que realisaste (opcional)
// relevantEvents: Eventos relevantes, como honores, premios y reconocimientos (opcional)
// courseWorks: Cursos hechos en la universidad (opcional)

/**
 * 
 * @param {object} education - recibe un objeto, con los datos de la educacion
 * @returns 
 */
const SchemeEducation = ({ education }) => {
    const {
        name,
        location,
        degree,
        concentration,
        gpa,
        graduationDate,
        thesis,
        relevantEvents,
        courseWorks
    } = education

    return (
        <div className="my-3">
            <div className="d-flex justify-content-between">
                <h3 className="h6">{name}</h3>
                <p>{location}</p>
            </div>
            <div className="d-flex justify-content-between">
                <p>
                    {`${degree}, ${concentration}`}
                    {gpa && `, GPA: ${gpa}`}
                </p>
                <p>{graduationDate}</p>
            </div>
            <div>
                {thesis &&
                    <p><span className="fw-medium">Tesis: </span>{thesis}</p>
                }
                {courseWorks &&
                    <p>Cursos relevantes: {courseWorks}</p>
                }
                {relevantEvents &&
                    <p>{relevantEvents}</p>
                }
            </div>
        </div>
    )
}

// Esquema de experiencia
// datos que espera:
// organization: nombre de la empresa
// location: lugar donde se encuentra
// position: cargoo o posicion que tienes
// startDate: fecha de inicio, fecha en mes y año
// endDate: fecha final, fecha en mes y año
// description: descripcion de el trabajo
/**
 * 
 * @param {object} experience - recibe un objeto, con los datos de la experiencia
 * @returns 
 */

const SchemeExperience = ({ experience }) => {
    const {
        organization,
        location,
        position,
        startDate,
        endDate,
        description
    } = experience

    return (
        <div className="my-3">
            <div className="d-flex justify-content-between">
                <h3 className="h6">{organization}</h3>
                <p>{location}</p>
            </div>
            <div className="d-flex justify-content-between">
                <p className="fw-medium" >{position}</p>
                <p>{startDate} - {endDate}</p>
            </div>
            <p>{description}</p>
        </div>
    )
}

// Esquema del project
// Datos que espera:
// name: Nombre del proyecto
// link: Link del proyecto (opcional)
// description: descripcion del proyecto

/**
 * 
 * @param {object} project - recibe un objeto, con los datos del proyecto
 * @returns 
 */
const SchemeProjects = ({ project }) => {

    const {
        name,
        link,
        description
    } = project

    return (
        <div className="my-3">
            <h3 className="h6">
                {name + ' '}
                {link &&
                    <a href={link} target="_blank" rel="noreferrer">Link</a>}
            </h3>
            <p>{description}</p>
        </div>
    )
}

// Esquema de liderzgo y actividades
// Datos que espera:
// organization: organizacion donde se llevo a cabo
// location: lugar
// role: Que hiciste? cual fue tu papel?
// startDate: Fecha de inicio
// endDate: Fecha de fin
// achievements: [] Logros que hiciste, o algunas descripciones
/**
 * 
 * @param {object} leadership - recibe un objeto, con los datos de liderasgo y actividades
 * @returns 
 */
const SchemeLidership = ({ leadership }) => {

    const {
        organization,
        location,
        role,
        startDate,
        endDate,
        achievements
    } = leadership

    return (
        <div className="my-3" >
            <div className="d-flex justify-content-between">
                <h3 className="h6">{organization}</h3>
                <p>{location}</p>
            </div>
            <div className="d-flex justify-content-between">
                <p className="fw-medium" >{role}</p>
                <p>{startDate} - {endDate}</p>
            </div>
            <p>{achievements.map((data) => {
                return <p>{data}</p>
            })}</p>
        </div>
    )
}

// Esquema de habilidades
// Datos que espera:
// category: nombre de la categoria de habilidads
// skills: [] habilidades que posee

/**
 * 
 * @param {object} technicalSkills - recibe un objeto, con los datos de liderasgo y actividades
 * @returns 
 */
const SchemeSkills = ({ technicalSkills }) => {

    const {
        category,
        skills
    } = technicalSkills

    return (
        <div className="my-2">
            <p><span className="fw-semibold">{category}: </span>{skills.map((skill, index) => {
                return (skills.length >= 2 && skills.length == index + 1) ? <span key={index}>{skill}</span> : <span key={index}>{skill}, </span>
            })}</p>
        </div>
    )
}