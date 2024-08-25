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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
// Iconos
import { CheckIco, ErrorIco, InfoIco, SaveIco, TrashIco } from "../resources/Icons"
// Schema
import { skillSchema, educationSchema, experienceSchema, projectSchema, leadershipSchema, userInfoSchema } from "../../utils/schemas/userInfo.schema"
import { phoneCountrys } from "@/utils/phoneCountrys"

export function FormUser() {

  // datos del usuario
  const [user, setUser] = useState({
    personalInfo: {
      name: '',
      lastName: '',
      countryCode: '',
      phoneNumber: '',
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
      position: '',
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

  // Guardar la informacion en cache
  const [loading, setLoading] = useState(false)

  // evento de guardado exitosamente
  const [success, setSuccess] = useState()

  // control de inputs directos
  const handleInputChange = (e, objectKeyName) => {
    const { name, value } = e.target;

    // Eliminar error cuando se presione una tecla, si es que el error existe
    if (errorInput.user?.[objectKeyName]?.[name]) {
      setErrorInput({
        ...errorInput,
        user: {
          ...errorInput.user,
          [objectKeyName]: {
            ...errorInput.user[objectKeyName],
            [name]: null
          }
        }
      });
    }

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

    // Quitar estado de error del input
    if (errorInput[objectKeyName]?.[name]) {
      setErrorInput({ ...errorInput, [objectKeyName]: { ...errorInput[objectKeyName], [name]: null } })
    }

    setInfoInput({
      ...infoInput,
      [objectKeyName]: { ...infoInput[objectKeyName], [name]: value }
    });
  };

  // Manejador del evento de añadir 
  // Añade el array
  const handleAddArray = (arrayName) => {

    // Validacion con esquema zod  
    const funValidation = schema => {
      // Validamos el esquema
      const { success, error, data } = schema.safeParse(infoInput[arrayName])
      if (!success) {
        // Controlamos el error
        const errorObject = Object.fromEntries(error.issues.map(({ path: [key], message }) => [key, message]))
        setErrorInput({ ...errorInput, [arrayName]: errorObject })
        return false
      }

      // Asignamos los Datos
      setUser({ ...user, [arrayName]: [...user[arrayName], data] });
      return true
    }

    // Asignacion del esquema a la funcion para la validación
    switch (arrayName) {
      case 'technicalSkills':
        if (!funValidation(skillSchema)) {
          return
        }
        break;
      case 'education':
        if (!funValidation(educationSchema)) {
          return
        }
        break;
      case 'experience':
        if (!funValidation(experienceSchema)) {
          return
        }
        break;
      case 'projects':
        if (!funValidation(projectSchema)) {
          return
        }
        break;
      case 'leadershipAndActivities':
        if (!funValidation(leadershipSchema)) {
          return
        }
        break;
      default:
        console.error('error inesperado')
        break;
    }

    // Borramos los estados de error
    setErrorInput({ ...errorInput, [arrayName]: {} });

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
  const saveInfoUser = async () => {
    setLoading(true);
    // Funcion recursiva para asignar los errores
    const { success, error } = userInfoSchema.safeParse(user)
    if (!success) {
      const errorObject = {};
      // Recorremos los datos del objeto ZodError para agregarlo al inputError
      // Asigna las validaciones para que sea facil de acceder
      error.issues.forEach((issue) => {
        const path = issue.path;
        const message = issue.message;
        let current = errorObject;
        for (let i = 0; i < path.length - 1; i++) {
          const key = path[i];
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
        current[path[path.length - 1]] = message;
      });

      setErrorInput({ ...errorInput, user: errorObject });
      setLoading(false);
      return
    }
    // vaciamos los errores
    setErrorInput({})

    try {
      // Intentamos guardar la informacion en cache
      const userString = JSON.stringify(user)
      localStorage.setItem("user", userString)

      setSuccess(true); // Mostrar mensaje de éxito
      setTimeout(() => {
        setSuccess(false); // Borrar mensaje de éxito después de 5 segundos
      }, 5000);
    } catch (error) {
      console.error("Error al guardar la información:", error);
    } finally {
      setLoading(false);
    }
  };

  const dateToday = () => {
    const today = new Date()
    const maxDate = today.toISOString().split('T')[0];
    return maxDate
  }


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
              <Input name="name"
                value={user.personalInfo.name}
                onChange={(e) => handleInputChange(e, "personalInfo")}
                id="firstName"
                className={errorInput.user?.personalInfo?.name && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder="Nombre" />
              {errorInput.user?.personalInfo?.name &&
                <label title={errorInput.user.personalInfo.name} htmlFor="firstName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.name}</p>
                  <ErrorIco />
                </label>
              }
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Apellido</Label>
              <Input name="lastName"
                value={user.personalInfo.lastName}
                onChange={(e) => handleInputChange(e, "personalInfo")}
                id="lastName"
                className={errorInput.user?.personalInfo?.lastName && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder="Apellido" />
              {errorInput.user?.personalInfo?.lastName &&
                <label title={errorInput.user.personalInfo.lastName} htmlFor="lastName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.lastName}</p>
                  <ErrorIco />
                </label>
              }
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email"
                value={user.personalInfo.email}
                onChange={(e) => handleInputChange(e, "personalInfo")}
                type="email"
                id="email"
                className={errorInput.user?.personalInfo?.email && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder="Email" />
              {errorInput.user?.personalInfo?.email &&
                <label title={errorInput.user.personalInfo.email} htmlFor="email" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.email}</p>
                  <ErrorIco />
                </label>
              }
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="flex items-center gap-2">
                <Select onValueChange={(value) => {
                  const newPhoneValue = `${value} ${user.personalInfo.phoneNumber}`;
                  setUser({
                    ...user,
                    personalInfo: {
                      ...user.personalInfo,
                      countryCode: value,
                      phone: newPhoneValue
                    }
                  });
                }}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={user.personalInfo.countryCode || 'Select'} />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-r from-cyan-500 to-blue-500">
                    <SelectGroup>
                      {phoneCountrys.map((phone, index) => {
                        return (
                          <SelectItem
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:to-blue-800 focus:to-blue-800 "
                            key={index}
                            title={phone.name + phone.phoneCode}
                            value={phone.phoneCode}
                          >
                            {phone.code}
                            <span className="text-yellow-250 font-medium">{phone.phoneCode}</span>
                          </SelectItem>
                        )
                      })}
                      <SelectItem
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:to-blue-800 focus:to-blue-800 "
                        value={' '}
                      >
                        Ninguno
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input id="phoneNumber"
                  value={user.personalInfo.phoneNumber}
                  onChange={(e) => handleInputChange(e, "personalInfo")}
                  className={errorInput.user?.personalInfo?.phone || errorInput.user?.personalInfo?.phoneNumber && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                  name="phoneNumber"
                  type="tel"
                  placeholder="Teléfono" />
              </div>

              {errorInput.user?.personalInfo?.phone || errorInput.user?.personalInfo?.phoneNumber &&
                <label title={errorInput.user.personalInfo.phone} htmlFor="phone" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.phone || errorInput.user.personalInfo.phoneNumber}</p>
                  <ErrorIco />
                </label>
              }

            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea name="description"
              value={user.personalInfo.description}
              onChange={(e) => handleInputChange(e, "personalInfo")}
              id="description"
              className={errorInput.user?.personalInfo?.description && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
              placeholder="Describe yourself"
              rows={3} />
            {errorInput.user?.personalInfo?.description &&
              <label title={errorInput.user.personalInfo.description} htmlFor="description" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.description}</p>
                <ErrorIco />
              </label>
            }
          </div>

          <Separator />
          <div>
            <Collapsible>
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <div className="font-medium">Habilidades</div>
                <ChevronDownIcon
                  className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="mt-2">
                      <Input
                        name="name"
                        value={infoInput.technicalSkills.name}
                        onChange={(e) => handleInputArrayChange(e, "technicalSkills")}
                        id="technicalSkills"
                        maxLength={20}
                        className={errorInput.technicalSkills?.name && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Nombre de la Habilidad" />
                      {errorInput.technicalSkills?.name &&
                        <label title={errorInput.technicalSkills.name} htmlFor="technicalSkills" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.technicalSkills.name}</p>
                          <ErrorIco />
                        </label>
                      }
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
                <div className="font-medium">Educación <p className="text-sm text-red-500 ">{errorInput.user?.education}</p></div>
                <ChevronDownIcon
                  className="h-5 w-5 transition-transform duration-300 [&[data-state=open]]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="school">Institución</Label>
                      <Input name="name"
                        value={infoInput.education.name}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        maxLength={50}
                        className={errorInput.education?.name && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        id="school"
                        placeholder="Institución" />
                      {errorInput.education?.name &&
                        <label title={errorInput.education.name} htmlFor="school" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.name}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="degree">Título Académico</Label>
                      <Input name="degree"
                        value={infoInput.education.degree}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        id="degree"
                        maxLength={50}
                        className={errorInput.education?.degree && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Título Académico " />
                      {errorInput.education?.degree &&
                        <label title={errorInput.education.degree} htmlFor="degree" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.degree}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2" title="Área de estudio o Área de Concentracion">
                      <Label htmlFor="concentration">Área de Estudio</Label>
                      <Input name="concentration"
                        value={infoInput.education.concentration}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        id="concentration"
                        maxLength={50}
                        className={errorInput.education?.concentration && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.concentration &&
                        <label title={errorInput.education.concentration} htmlFor="concentration" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.concentration}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="graduation-year">Año de Graducaion</Label>
                      <Input name="graduationDate"
                        value={infoInput.education.graduationDate}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        id="graduation-year"
                        type="date"
                        min="1900-01-01"
                        className={errorInput.education?.graduationDate && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Año de Graducaion" />
                      {errorInput.education?.graduationDate &&
                        <label title={errorInput.education.graduationDate} htmlFor="graduation-year" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.graduationDate}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="education-location">Lugar</Label>
                      <Input name="location"
                        value={infoInput.education.location}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        id="education-location"
                        maxLength={50}
                        className={errorInput.education?.location && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Lugar" />
                      {errorInput.education?.location &&
                        <label title={errorInput.education.location} htmlFor="education-location" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.location}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2" title="Promedio de Calificaciones">
                      <Label htmlFor="gpa">GPA</Label>
                      <Input name="gpa"
                        value={infoInput.education.gpa}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        type="number"
                        maxLength={3}
                        id="gpa"
                        className={errorInput.education?.gpa && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.gpa &&
                        <label title={errorInput.education.gpa} htmlFor="gpa" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.gpa}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2" title="Nombre de la tesis">
                      <Label htmlFor="education-thesis">Tesis</Label>
                      <Input name="thesis"
                        value={infoInput.education.thesis}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        id="education-thesis"
                        maxLength={50}
                        className={errorInput.education?.thesis && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.thesis &&
                        <label title={errorInput.education.thesis} htmlFor="education-thesis" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.thesis}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2" title="Eventos relevantes en la institución como participaciones">
                      <Label htmlFor="education-relevantEvents">Eventos relevantes</Label>
                      <Input name="relevantEvents"
                        value={infoInput.education.relevantEvents}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        id="education-relevantEvents"
                        className={errorInput.education?.relevantEvents && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.relevantEvents &&
                        <label title={errorInput.education.relevantEvents} htmlFor="education-relevantEvents" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.relevantEvents}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2" title="Cursos realizados en la institucion">
                      <Label htmlFor="education-courseWorks">Cursos</Label>
                      <Input name="courseWorks"
                        value={infoInput.education.courseWorks}
                        onChange={(e) => handleInputArrayChange(e, "education")}
                        id="education-courseWorks"
                        className={errorInput.education?.courseWorks && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.courseWorks &&
                        <label title={errorInput.education.courseWorks} htmlFor="education-courseWorks" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.courseWorks}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  {/* Info Edcuacion del Usuario */}
                  {user.education.length > 0 &&
                    (
                      <div className="transition">
                        {user.education.map((edu, index) => (
                          <Collapsible key={index} className="bg-slate-800 p-2 space-x-2 space-y-2 rounded">
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
                      <Input name="organization"
                        value={infoInput.experience.organization}
                        onChange={(e) => handleInputArrayChange(e, "experience")}
                        id="experience-company"
                        maxLength={50}
                        className={errorInput.experience?.organization && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Nombre la Organizacion/Empresa" />
                      {errorInput.experience?.organization &&
                        <label title={errorInput.experience.organization} htmlFor="experience-company" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.organization}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2" title="Que eras en el trabajo?">
                      <Label htmlFor="experience-position">Posición</Label>
                      <Input name="position"
                        value={infoInput.experience.position}
                        onChange={(e) => handleInputArrayChange(e, "experience")}
                        id="experience-position"
                        maxLength={50}
                        className={errorInput.experience?.position && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Título del empleo" />
                      {errorInput.experience?.position &&
                        <label title={errorInput.experience.position} htmlFor="experience-position" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.position}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience-startDate">Fecha de Inicio</Label>
                      <Input name="startDate"
                        value={infoInput.experience.startDate}
                        onChange={(e) => handleInputArrayChange(e, "experience")}
                        id="experience-startDate"
                        className={errorInput.experience?.startDate && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()}
                      />
                      {errorInput.experience?.startDate &&
                        <label title={errorInput.experience.startDate} htmlFor="experience-startDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.startDate}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience-endDate">Fecha final </Label>
                      <Input name="endDate"
                        value={infoInput.experience.endDate}
                        onChange={(e) => handleInputArrayChange(e, "experience")}
                        id="experience-endDate"
                        className={errorInput.experience?.endDate && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()} />
                      {errorInput.experience?.endDate &&
                        <label title={errorInput.experience.endDate} htmlFor="experience-endDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.endDate}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2" title="Que eras en el trabajo?">
                      <Label htmlFor="experience-location">Lugar</Label>
                      <Input name="location"
                        value={infoInput.experience.location}
                        onChange={(e) => handleInputArrayChange(e, "experience")}
                        id="experience-location"
                        maxLength={50}
                        className={errorInput.experience?.location && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Lugar" />
                      {errorInput.experience?.location &&
                        <label title={errorInput.experience.location} htmlFor="experience-location" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.location}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience-description">Descripción</Label>
                    <Textarea
                      id="experience-description"
                      name="description"
                      value={infoInput.experience.description}
                      onChange={(e) => handleInputArrayChange(e, "experience")}
                      className={errorInput.experience?.description && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                      placeholder="Descripción de lo que hiciste en la compañia"
                      rows={4} />
                    {errorInput.experience?.description &&
                      <label title={errorInput.experience.description} htmlFor="experience-description" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                        <p className="text-xs basis-4/5 ">{errorInput.experience.description}</p>
                        <ErrorIco />
                      </label>
                    }
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
                      <Input name="name"
                        value={infoInput.projects.name}
                        onChange={(e) => handleInputArrayChange(e, "projects")}
                        id="project-name"
                        maxLength={50}
                        className={errorInput.projects?.name && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Nombre" />
                      {errorInput.projects?.name &&
                        <label title={errorInput.projects.name} htmlFor="project-name" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.projects.name}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-role">Posición </Label>
                      <Input name="position"
                        value={infoInput.projects.position}
                        onChange={(e) => handleInputArrayChange(e, "projects")}
                        id="project-role"
                        maxLength={50}
                        className={errorInput.projects?.position && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Posición/Rol" />
                      {errorInput.projects?.position &&
                        <label title={errorInput.projects.position} htmlFor="project-role" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.projects.position}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Descripción</Label>
                    <Textarea name="description"
                      value={infoInput.projects.description}
                      onChange={(e) => handleInputArrayChange(e, "projects")}
                      id="project-description"
                      placeholder="Descripcion del proyecto"
                      className={errorInput.projects?.description && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                      rows={4} />
                    {errorInput.projects?.description &&
                      <label title={errorInput.projects.description} htmlFor="project-description" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                        <p className="text-xs basis-4/5 ">{errorInput.projects.description}</p>
                        <ErrorIco />
                      </label>
                    }
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
                      <Label htmlFor="leadershipAndActivities-organization">Organización</Label>
                      <Input name="organization"
                        value={infoInput.leadershipAndActivities.organization}
                        onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")}
                        id="leadershipAndActivities-organization"
                        maxLength={50}
                        className={errorInput.leadershipAndActivities?.organization && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Organización" />
                      {errorInput.leadershipAndActivities?.organization &&
                        <label title={errorInput.leadershipAndActivities.organization} htmlFor="leadershipAndActivities-organization" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.organization}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2" title="cual fue tu rol">
                      <Label htmlFor="leadershipAndActivities-position">Rol</Label>
                      <Input name="role"
                        value={infoInput.leadershipAndActivities.role}
                        onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")}
                        id="leadershipAndActivities-position"
                        maxLength={50}
                        className={errorInput.leadershipAndActivities?.role && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Ingresa tu Rol" />
                      {errorInput.leadershipAndActivities?.role &&
                        <label title={errorInput.leadershipAndActivities.role} htmlFor="leadershipAndActivities-position" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.role}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leadershipAndActivities-startDate">Fecha de Inicio</Label>
                      <Input name="startDate"
                        value={infoInput.leadershipAndActivities.startDate}
                        onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")}
                        id="leadershipAndActivities-startDate"
                        className={errorInput.leadershipAndActivities?.startDate && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()} />
                      {errorInput.leadershipAndActivities?.startDate &&
                        <label title={errorInput.leadershipAndActivities.startDate} htmlFor="leadershipAndActivities-startDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.startDate}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadershipAndActivities-endDate">Fecha final </Label>
                      <Input name="endDate"
                        value={infoInput.leadershipAndActivities.endDate}
                        onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")}
                        id="leadershipAndActivitiesAndActivitiesAndActivities-endDate"
                        className={errorInput.leadershipAndActivities?.endDate && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()} />
                      {errorInput.leadershipAndActivities?.endDate &&
                        <label title={errorInput.leadershipAndActivities.endDate} htmlFor="leadershipAndActivitiesAndActivitiesAndActivities-endDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.endDate}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadershipAndActivities-location">Lugar</Label>
                      <Input name="location"
                        value={infoInput.leadershipAndActivities.location}
                        onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")}
                        id="leadershipAndActivities-location"
                        maxLength={50}
                        className={errorInput.leadershipAndActivities?.location && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Lugar" />
                      {errorInput.leadershipAndActivities?.location &&
                        <label title={errorInput.leadershipAndActivities.location} htmlFor="leadershipAndActivities-location" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.location}</p>
                          <ErrorIco />
                        </label>
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadershipAndActivities-achievements">Logros</Label>
                    <Textarea
                      id="leadershipAndActivities-achievements"
                      name="achievements"
                      value={infoInput.leadershipAndActivities.achievements}
                      onChange={(e) => handleInputArrayChange(e, "leadershipAndActivities")}
                      className={errorInput.leadershipAndActivities?.achievements && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                      placeholder="Describe lo que hiciste en este evento o los logros que obtuviste"
                      rows={4} />
                    {errorInput.leadershipAndActivities?.achievements &&
                      <label title={errorInput.leadershipAndActivities.achievements} htmlFor="leadershipAndActivities-achievements" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                        <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.achievements}</p>
                        <ErrorIco />
                      </label>
                    }
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
                                <div className="py-1 grid grid-cols-2"><span className="font-semibold">Posición/Rol: </span>{leadership.role}</div>
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
        {success && (
          <div className="flex text-green-500">
            <CheckIco className="size-6"/>
            <p className="text-sm">¡La información se ha guardado correctamente!</p>
          </div>
        )}
        <Button className={`border bg-gradient-to-r hover:from-blue-800 hover:to-red-700 from-sky-800 to-indigo-600 bg-vnzla rounded-full ${loading && 'cursor-wait'}`} onClick={saveInfoUser}>{loading ? 'Guardando...' : 'Guardar Informacion'} <SaveIco className="fill-amber-400 size-5"/></Button>
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
