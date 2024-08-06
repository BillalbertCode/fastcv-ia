import { useRef } from "react"
import createPDF from "../utils/createPDF";
// Añadir lo necesario para el mapeo del array de objeto
// Analizar si necesita un tipo distinto de distribucion segun el tipo de carrera

const TemplateHarvard = ({ user }) => {

    // Hacemos referencia al elemento para luego poder descargarlo
    const cvRef = useRef(null);

    if (!user.personalInfo) {
        return <div>Loading...</div>
    }

    return (
        <>
            <button style={{ width: "920px" }} className="btn bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded mt-4 mx-auto" onClick={() => createPDF(cvRef)}>Descargar PDF</button>

            <div ref={cvRef} style={{ width: "920px" }} className="container mx-auto p-5 bg-white text-black">
                <div className="flex flex-col items-center">
                    <h1 className="text-2xl">{`${user.personalInfo.name} ${user.personalInfo.lastName} `}</h1>
                    <div>
                        {`${user.personalInfo.email} | ${user.personalInfo.phone} `} 
                    </div>
                </div>
                {user.education.length > 0 &&
                    (
                        <div className="mt-4">
                            <p className="text-center ">Educación</p>
                            {user.education.map((edu, index) => (
                                <SchemeEducation key={index} education={edu} />
                            ))}
                        </div>
                    )
                }
                {user.experience.length > 0 &&
                    (
                        <div className="mt-4">
                            <p className="text-center ">Experiencia</p>
                            {user.experience.map((exp, index) => (
                                <SchemeExperience key={index} experience={exp} />
                            ))}
                        </div>
                    )
                }
                {user.projects.length > 0 &&
                    (
                        <div className="mt-4">
                            <p className="text-center ">Proyectos</p>
                            {user.projects.map((project, index) => (
                                <SchemeProjects key={index} project={project} />
                            ))}
                        </div>
                    )
                }
                {user.leadershipAndActivities.length > 0 &&
                    (
                        <div className="mt-4">
                            <p className="text-center ">Liderazgo y Actividades</p>
                            {user.leadershipAndActivities.map((leadership, index) => (
                                <SchemeLidership key={index} leadership={leadership} />
                            ))}
                        </div>
                    )
                }
                {user.technicalSkills.length > 0 &&
                    (
                        <div className="mt-4">
                            <p className="text-center">Habilidades Técnicas</p>
                            {user.technicalSkills.map((skill, index) => (
                                <SchemeSkills key={index} technicalSkills={skill} />
                            ))}
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default TemplateHarvard;

// Esquema de educación
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
    } = education;

    return (
        <div className="my-3">
            <div className="flex justify-between">
                <h3 className="text-lg font-bold">{name}</h3>
                <p>{location}</p>
            </div>
            <div className="flex justify-between">
                <p>
                    {`${degree}, ${concentration}`}
                    {gpa !== "undefined" && `, GPA: ${gpa}`}
                </p>
                <p>{graduationDate}</p>
            </div>
            <div>
                {thesis !== "undefined" && <p><span className="font-medium">Tesis: </span>{thesis}</p>}
                {courseWorks !== "undefined" && <p>Cursos relevantes: {courseWorks}</p>}
                {relevantEvents !== "undefined" && <p>{relevantEvents}</p>}
            </div>
        </div>
    );
}

// Esquema de experiencia
const SchemeExperience = ({ experience }) => {
    const {
        organization,
        location,
        position,
        startDate,
        endDate,
        description
    } = experience;

    return (
        <div className="my-3">
            <div className="flex justify-between">
                <h3 className="text-lg font-bold">{organization}</h3>
                <p>{location}</p>
            </div>
            <div className="flex justify-between">
                <p className="font-medium">{position}</p>
                <p>{startDate} - {endDate}</p>
            </div>
            <p>{description}</p>
        </div>
    );
}

// Esquema del proyecto
const SchemeProjects = ({ project }) => {
    const {
        name,
        link,
        description
    } = project;

    return (
        <div className="my-3">
            <h3 className="text-lg font-bold">
                {name + ' '}
                {link && <a href={link} target="_blank" rel="noreferrer" className="text-blue-500">Link</a>}
            </h3>
            <p>{description}</p>
        </div>
    );
}

// Esquema de liderazgo y actividades
const SchemeLidership = ({ leadership }) => {
    const {
        organization,
        location,
        role,
        startDate,
        endDate,
        achievements
    } = leadership;

    return (
        <div className="my-3">
            <div className="flex justify-between">
                <h3 className="text-lg font-bold">{organization}</h3>
                <p>{location}</p>
            </div>
            <div className="flex justify-between">
                <p className="font-medium">{role}</p>
                <p>{startDate} - {endDate}</p>
            </div>
            {achievements.map((data, index) => (
                <p key={index}>{data}</p>
            ))}
        </div>
    );
}

// Esquema de habilidades
const SchemeSkills = ({ technicalSkills }) => {
    const {
        category,
        skills
    } = technicalSkills;

    return (
        <div className="my-2">
            <p><strong>{category}: </strong>{skills.map((skill, index) => (
                skills.length >= 2 && skills.length === index + 1 ? <span key={index}>{skill}</span> : <span key={index}>{skill}, </span>
            ))}</p>
        </div>
    );
}
