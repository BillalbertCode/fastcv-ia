// Fprmulario de informacion de usuario
// Contiene los manejadores de los input y el guardado de la informacion en cache
import { useState, useEffect } from "react"
// UI components
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
// Iconos
import { ErrorIco, InfoIco, SaveIco, TrashIco } from "../resources/Icons"
// Schema
import { skillSchema, educationSchema } from "../schemas/userInfo.schema"


export function FormUser() {

  // datos del usuario
  const [user, setUser] = useState({
    personalInfo: {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      description: ''
    },
    technicalSkills: [],
    education: [],
    experience: [],
    projects: [],
    leadershipAndActivities: []
  });

  useEffect(() => {
    const userInfo = localStorage.getItem("user")

    if (userInfo) {
      try {

        const parsedUserInfo = JSON.parse(userInfo)

        setUser(parsedUserInfo)
      }
      catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    }
  }, []);


  // Manejador de inputs
  // Estado de los input para luego añadirlos a la informacion del usuario
  const [infoInput, setInfoInput] = useState({
    technicalSkills: {
      name: '',
    },
    education: {
      name: '',
      location: '',
      degree: '',
      concentration: '',
      gpa: undefined,
      graduationDate: '',
      thesis: undefined,
      relevantEvents: undefined,
      courseWorks: undefined
    },
    experience: {
      organization: '',
      location: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    },
    projects: {
      name: '',
      role: '',
      link: '',
      description: ''
    },
    leadershipAndActivities: {
      organization: '',
      location: '',
      role: '',
      startDate: '',
      endDate: '',
      achievements: ''
    }
  });

  // Manejo de Errores de los inputs
  const [errorInput, setErrorInput] = useState({})

  // control de inputs directos
  const handleInputChange = (e, objectKeyName) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [objectKeyName]: { ...user[objectKeyName], [name]: value }
    });
  };

  // Manejador de inputs con boton de envio
  // Todos los inputs que se contengan un boton de envio utilizara esta funcion
  //  el input debe tener el nombre del valor del objeto al que va a acceder en la propiedad name
  const handleInputArrayChange = (e, objectKeyName) => {
    const { name, value } = e.target;

    setInfoInput({
      ...infoInput,
      [objectKeyName]: { ...infoInput[objectKeyName], [name]: value }
    });
  };

  // Manejador del evento de añadir 
  // Añade el array
  const handleAddArray = (arrayName) => {
    console.log(educationSchema.parse(infoInput[arrayName]))
    setUser({ ...user, [arrayName]: [...user[arrayName], infoInput[arrayName]] });
    
    // Reseteamos los campos del formulario 
    setInfoInput({
      ...infoInput,
      [arrayName]: Object.fromEntries(Object.keys(infoInput[arrayName]).map(key => [key, '']))
    });
  };

  // Eliminar Propiedades de un array se elimina segun el indice
  const handleDeleteArray = (arrayName, index) => {
    setUser({
      ...user,
      [arrayName]: user[arrayName].filter((item, i) => i !== index)
    })
  }

  // Guardar informacion del usuario
  const saveInfoUser = () => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    (<Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
        <CardDescription>Actualiza la información de tu perfil.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName" >Nombre</Label>
              {/* <Input name="name" value={user.personalInfo.name} onChange={(e) => handleInputChange(e, "personalInfo")} id="firstName" placeholder="Nombre" /> */}
              <Input
                name="name"
                value={user.personalInfo.name}
                onChange={(e) => handleInputChange(e, "personalInfo")}
                className="text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500"
                id="firstName"
                placeholder="Nombre" />
              <label title="error message" htmlFor="firstName" className="text-red-500 ml-1 flex items-end justify-between"><p className="text-xs basis-4/5 ">Texto de ejemplo</p><ErrorIco /></label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input name="lastName" value={user.personalInfo.lastName} onChange={(e) => handleInputChange(e, "personalInfo")} id="lastName" placeholder="Enter your last name" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" value={user.personalInfo.email} onChange={(e) => handleInputChange(e, "personalInfo")} type="email" id="email" placeholder="Email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input name="phone" value={user.personalInfo.phone} onChange={(e) => handleInputChange(e, "personalInfo")} id="phone" placeholder="Enter your phone number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea name="description" value={user.personalInfo.description} onChange={(e) => handleInputChange(e, "personalInfo")} id="description" placeholder="Describe yourself" rows={3} />
          </div>

          <Separator />
          <div>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="font-medium">Skills</div>
                <ChevronDownIcon
                  className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mt-2">
                      <Input name="name" value={infoInput.technicalSkills.name} onChange={(e) => handleInputArrayChange(e, "technicalSkills")} id="technicalSkills" placeholder="Nombre de la Habilidad" />
                    </div>
                  </div>
                  {user.technicalSkills.length > 0 &&
                    (
                      <div className="transition grid grid-cols-3 gap-2">
                        {user.technicalSkills.map((skill, index) => (
                          <div key={index} className="grid grid-cols-3 bg-slate-700 space-x-2 text-center rounded ">
                            <p className="col-span-2 text-sm">{skill.name}</p>
                            <button className="transition bg-red-600 hover:bg-red-700 flex justify-center items-center rounded-r" onClick={() => handleDeleteArray("technicalSkills", index)}>
                              <TrashIco />
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  }

                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("technicalSkills")} >Add Skill</Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="font-medium">Educación</div>
                <ChevronDownIcon
                  className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="school">Institución</Label>
                      <Input name="name" value={infoInput.education.name} onChange={(e) => handleInputArrayChange(e, "education")} id="school" placeholder="Institución" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree">Título Académico</Label>
                      <Input name="degree" value={infoInput.education.degree} onChange={(e) => handleInputArrayChange(e, "education")} id="degree" placeholder="Título Académico " />
                    </div>
                    <div className="space-y-2" title="Área de estudio o Área de Concentracion">
                      <Label htmlFor="concentration">Área de Estudio</Label>
                      <Input name="concentration" value={infoInput.education.concentration} onChange={(e) => handleInputArrayChange(e, "education")} id="concentration" placeholder="(opcional)" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="graduation-year">Año de Graducaion</Label>
                      <Input name="graduationDate" value={infoInput.education.graduationDate} onChange={(e) => handleInputArrayChange(e, "education")} id="graduation-year" type="date" placeholder="Año de Graducaion" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education-location">Lugar</Label>
                      <Input name="location" value={infoInput.education.location} onChange={(e) => handleInputArrayChange(e, "education")} id="education-location" placeholder="Lugar" />
                    </div>
                    <div className="space-y-2" title="Promedio de Calificaciones">
                      <Label htmlFor="gpa">GPA</Label>
                      <Input name="gpa" value={infoInput.education.gpa} onChange={(e) => handleInputArrayChange(e, "education")} type="number" id="gpa" placeholder="(opcional)" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2" title="Nombre de la tesis">
                      <Label htmlFor="education-thesis">Tesis</Label>
                      <Input name="thesis" value={infoInput.education.thesis} onChange={(e) => handleInputArrayChange(e, "education")} id="education-thesis" placeholder="(opcional)" />
                    </div>
                    <div className="space-y-2" title="Eventos relevantes en la institución como participaciones">
                      <Label htmlFor="education-relevantEvents">Eventos relevantes</Label>
                      <Input name="relevantEvents" value={infoInput.education.relevantEvents} onChange={(e) => handleInputArrayChange(e, "education")} id="education-relevantEvents" placeholder="(opcional)" />
                    </div>
                    <div className="space-y-2" title="Cursos realizados en la institucion">
                      <Label htmlFor="education-courseWorks">Cursos</Label>
                      <Input name="courseWorks" value={infoInput.education.courseWorks} onChange={(e) => handleInputArrayChange(e, "education")} id="education-courseWorks" placeholder="(opcional)" />
                    </div>
                  </div>
                  {/* Info Edcuacion del Usuario */}
                  {user.education.length > 0 &&
                    (
                      <div className="transition">
                        {user.education.map((edu, index) => (
                          <Collapsible key={index} className="bg-slate-800 p-2 space-x-2 rounded">
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                              <div className="font-medium">{edu.name}</div>
                              <ChevronDownIcon
                                className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="py-1 text-sm">
                                <div className="py-1 grid grid-cols-2"><span className="font-medium">Institucion: </span>{edu.name} </div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Título Académico: </span>{edu.degree}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Área de Estudio: </span>{edu.concentration}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Año de Graduacion: </span>{edu.graduationDate}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Lugar: </span>{edu.location}</div>
                                {edu.gpa && (<div className="py-1 grid grid-cols-2"> <span className="font-semibold">GPA:</span> {edu.gpa}</div>)}
                                {edu.thesis && (<div className="py-1 grid grid-cols-2"> <span className="font-semibold">Tesis:</span> {edu.thesis}</div>)}
                                {edu.relevantEvents && (<div className="py-1 grid grid-cols-2"> <span className="font-semibold">Eventos Relevantes:</span> {edu.relevantEvents}</div>)}
                                {edu.courseWorks && (<div className="py-1 grid grid-cols-2"> <span className="font-semibold">Cursos:</span> {edu.courseWorks}</div>)}
                              </div>
                              <button className="w-full transition bg-red-600 hover:bg-red-700 flex justify-center items-center rounded" onClick={() => handleDeleteArray("education", index)}>
                                <TrashIco />
                              </button>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    )
                  }
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("education")} >Add Education</Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="font-medium">Experiencia</div>
                <ChevronDownIcon
                  className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience-company">Empresa o Organizacion</Label>
                      <Input name="organization" value={infoInput.experience.organization} onChange={(e) => handleInputArrayChange(e, "experience")} id="experience-company" placeholder="Nombre la Organizacion/Empresa" />
                    </div>
                    <div className="space-y-2" title="Que eras en el trabajo?">
                      <Label htmlFor="experience-position">Posición</Label>
                      <Input name="position" value={infoInput.experience.position} onChange={(e) => handleInputArrayChange(e, "experience")} id="experience-position" placeholder="Título del empleo" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience-startDate">Fecha de Inicio</Label>
                      <Input name="startDate" value={infoInput.experience.startDate} onChange={(e) => handleInputArrayChange(e, "experience")} id="experience-startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience-endDate">Fecha final </Label>
                      <Input name="endDate" value={infoInput.experience.endDate} onChange={(e) => handleInputArrayChange(e, "experience")} id="experience-endDate" type="date" />
                    </div>
                    <div className="space-y-2" title="Que eras en el trabajo?">
                      <Label htmlFor="experience-location">Lugar</Label>
                      <Input name="location" value={infoInput.experience.location} onChange={(e) => handleInputArrayChange(e, "experience")} id="experience-location" placeholder="Lugar" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience-description">Descripción</Label>
                    <Textarea
                      id="experience-description"
                      name="description"
                      value={infoInput.experience.description}
                      onChange={(e) => handleInputArrayChange(e, "experience")}
                      placeholder="Descripción de lo que hiciste en la compañia"
                      rows={4} />
                  </div>
                  {user.experience.length > 0 &&
                    (
                      <div className="transition">
                        {user.experience.map((exp, index) => (
                          <Collapsible key={index} className="bg-slate-800 p-2 space-x-2 rounded ">
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                              <div className="font-medium">{exp.organization} <span className="text-sm font-normal">{exp.position}</span></div>
                              <ChevronDownIcon
                                className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="py-1 text-sm">
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Organización: </span>{exp.organization} </div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Ubicación: </span>{exp.location}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Posición/Puesto: </span>{exp.position}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Fecha de Inicio: </span>{exp.startDate}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Fecha Final: </span>{exp.endDate}</div>
                                <div className="py-1 grid grid-cols-1 max-h-40 overflow-auto"><span className="font-semibold">Descripción: </span>{exp.description}</div>
                              </div>
                              <button className="w-full transition bg-red-600 hover:bg-red-700 flex justify-center items-center rounded" onClick={() => handleDeleteArray("experience", index)}>
                                <TrashIco />
                              </button>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    )
                  }
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("experience")}>Add Experience</Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="font-medium">Proyectos</div>
                <ChevronDownIcon
                  className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Nombre del Proyecto</Label>
                      <Input name="name" value={infoInput.projects.name} onChange={(e) => handleInputArrayChange(e, "projects")} id="project-name" placeholder="Nombre" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-role">Posición </Label>
                      <Input name="role" value={infoInput.projects.role} onChange={(e) => handleInputArrayChange(e, "projects")} id="project-role" placeholder="Posición/Rol" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Descripción</Label>
                    <Textarea name="description" value={infoInput.projects.description} onChange={(e) => handleInputArrayChange(e, "projects")} id="project-description" placeholder="Descripcion del proyecto" rows={4} />
                  </div>
                  {user.projects.length > 0 &&
                    (
                      <div className="transition">
                        {user.projects.map((project, index) => (
                          <Collapsible key={index} className="bg-slate-800 p-2 space-x-2 rounded ">
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                              <div className="font-medium">{project.name} <span className="text-sm font-normal">{project.position}</span> </div>
                              <ChevronDownIcon
                                className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="py-1 text-sm">
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Nombre del Proyecto: </span>{project.name} </div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Positición/Rol: </span>{project.position}</div>
                                <div className="py-1 grid grid-cols-1 max-h-40 overflow-auto"><span className="font-semibold">Descripción </span>{project.description}</div>
                              </div>
                              <button className="w-full transition bg-red-600 hover:bg-red-700 flex justify-center items-center rounded" onClick={() => handleDeleteArray("projects", index)}>
                                <TrashIco />
                              </button>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    )
                  }
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("projects")}>Añadir Proyecto</Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="font-medium" title="Actividades, eventos importantes en los que has participado" >Liderazgo y Actividades</div>
                <ChevronDownIcon
                  className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2" title="Organización en la que participaste:">
                      <Label htmlFor="leadershipAndActivities-organization">Organizacion</Label>
                      <Input name="organization" value={infoInput.leadershipAndActivities.organization} onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")} id="leadershipAndActivities-organization" placeholder="Enter an organization" />
                    </div>
                    <div className="space-y-2" title="cual fue tu rol">
                      <Label htmlFor="leadershipAndActivities-position">Rol</Label>
                      <Input name="role" value={infoInput.leadershipAndActivities.role} onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")} id="leadershipAndActivities-position" placeholder="Ingresa tu Rol" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leadershipAndActivities-startDate">Fecha de Inicio</Label>
                      <Input name="startDate" value={infoInput.leadershipAndActivities.startDate} onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")} id="leadershipAndActivities-startDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadershipAndActivities-endDate">Fecha final </Label>
                      <Input name="endDate" value={infoInput.leadershipAndActivities.endDate} onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")} id="leadershipAndActivitiesAndActivitiesAndActivities-endDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadershipAndActivities-location">Lugar</Label>
                      <Input name="location" value={infoInput.leadershipAndActivities.location} onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")} id="leadershipAndActivities-location" placeholder="Lugar" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadershipAndActivities-achievements">Logros</Label>
                    <Textarea
                      id="leadershipAndActivities-achievements"
                      name="achievements"
                      value={infoInput.leadershipAndActivities.achievements}
                      onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")}
                      placeholder="Describe lo que hiciste en este evento o los logros que obtuviste"
                      rows={4} />
                  </div>
                  {user.leadershipAndActivities.length > 0 &&
                    (
                      <div className="transition">
                        {user.leadershipAndActivities.map((leadership, index) => (
                          <Collapsible key={index} className="bg-slate-800 p-2 space-x-2 rounded ">
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                              <div className="font-medium">{leadership.organization} <span className="text-sm font-normal">{leadership.location}</span> </div>
                              <ChevronDownIcon
                                className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="py-1 text-sm">
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Organización: </span>{leadership.organization} </div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Posición/Rol: </span>{leadership.position}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Lugar: </span>{leadership.location}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Fecha de inicio: </span>{leadership.startDate}</div>
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Fecha de finalización </span>{leadership.endDate}</div>
                                <div className="py-1 grid grid-cols-1 max-h-40 overflow-auto"><span className="font-semibold">Logros:</span>{leadership.achievements}</div>
                              </div>
                              <button className="w-full transition bg-red-600 hover:bg-red-700 flex justify-center items-center rounded" onClick={() => handleDeleteArray("leadershipAndActivities", index)}>
                                <TrashIco />
                              </button>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    )
                  }
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("leadershipAndActivities")} >Add Leadership</Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button className="border bg-teal-600 hover:bg-green-600 rounded-full" onClick={saveInfoUser}>Guardar Informacion <SaveIco /></Button>
      </CardFooter>
    </Card>)
  );
}

function ChevronDownIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>)
  );
}


function XIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>)
  );
}
