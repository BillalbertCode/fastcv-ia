// Fprmulario de informacion de usuario
// Contiene los manejadores de los input y el guardado de la informacion en cache
import { useState, useEffect } from "react"
import { useContext } from "react"
import { UserContext } from "@/utils/contexts/UserContext"
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
import { CheckIco, ErrorIco, SaveIco, TrashIco } from "../resources/Icons"
import { XCircleIcon } from "lucide-react"
// Schema
import { skillSchema, educationSchema, experienceSchema, projectSchema, leadershipSchema } from "../../utils/schemas/userInfo.schema"
// Utilidades
import { phoneCountrys } from "@/utils/phoneCountrys" //Array con la informacion de los codigos de telefono
import { cleanErrorInput, onInputChange } from "@/utils/helper/input-handlers/handleInput"
import { addErrorGroup, addInputGroup, cleanErrorGroup, deleteInputGroup, resetInputGroup } from "@/utils/helper/input-handlers/handleInputGroup"

export function FormUser() {
  // Context para manejar la data del usuario
  const { saveUserCache, userData } = useContext(UserContext)

  // datos del usuario
  const [user, setUser] = useState(userData);

  // Escucha activa de los datos del usuario
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

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
  const [success, setSuccess] = useState({
    message: '',
    status: true,
    visibility: false
  })

  // control de inputs directos
  const handleInputChange = (e, objectKeyName) => {

    // Eliminar error cuando se presione una tecla, si es que el error existe
    setErrorInput({
      ...errorInput,
      user: cleanErrorInput(e, errorInput.user, objectKeyName)
    });


    setUser(onInputChange(e, user, objectKeyName))
  };

  // Manejador de inputs con boton de envio
  // Todos los inputs que se contengan un boton de envio utilizara esta funcion
  //  el input debe tener el nombre del valor del objeto al que va a acceder en la propiedad name
  const handleInputArrayChange = (e, objectKeyName) => {
    // Limpiamos el error del input
    setErrorInput(cleanErrorInput(e, errorInput, objectKeyName))

    // Asignamos los datos
    setInfoInput(onInputChange(e, infoInput, objectKeyName));
  };

  // Manejador del evento de añadir 
  // Añade el array
  const handleAddArray = (arrayName, schema) => {

    // Validacion de schema con zod
    const { success, error, data } = schema.safeParse(infoInput[arrayName])

    if (!success) {
      const errorObject = error.format()
      setErrorInput(addErrorGroup(errorInput, arrayName, errorObject))
      return
    }

    // Asignamos los Datos
    setUser(addInputGroup(user, arrayName, data))

    // Borramos los estados de error
    setErrorInput(cleanErrorGroup(errorInput, arrayName));

    // Reseteamos los campos del formulario 
    setInfoInput(resetInputGroup(infoInput, arrayName));
  };

  // Eliminar Propiedades de un array se elimina segun el indice
  const handleDeleteArray = (arrayName, index) => {
    setUser(deleteInputGroup(user, arrayName, index))
  }

  // Notificacion de usuario guardado
  const notificationSaveUser = (message, status) => {
    setSuccess({ message, status, visibility: true })
  }

  // Manejo del tiempo de la Notificacion
  useEffect(() => {
    if (success.visibility) {
      const timeoutId = setTimeout(() => {
        setSuccess({ visibility: false });
      }, 5000);
      return () => clearTimeout(timeoutId);
    }
  }, [success]);

  // Guardar informacion del usuario
  const saveInfoUser = () => {
    setLoading(true);
    // Guardamos con una funcion del userContext
    const { success, error, message } = saveUserCache(user)
    try {
      // Control de errores
      if (!success) {
        throw new Error(error);
      }
      // vaciamos los errores si no hubo conflicto
      setErrorInput({});

    } catch (err) {
      console.error(err)
      // Hubo un problema de validación de inputs req
      if (error?.issues) {
        const errors = error.format()
        console.log(errors)
        setErrorInput(addErrorGroup(errorInput, "user", errors));
      }
    } finally {
      notificationSaveUser(message, success)
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
                className={errorInput.user?.personalInfo?.name._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder="Nombre" />
              {errorInput.user?.personalInfo?.name._errors &&
                <label title={errorInput.user.personalInfo.name._errors} htmlFor="firstName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.name._errors[0]}</p>
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
                className={errorInput.user?.personalInfo?.lastName._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder="Apellido" />
              {errorInput.user?.personalInfo?.lastName._errors &&
                <label title={errorInput.user.personalInfo.lastName._errors[0]} htmlFor="lastName" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.lastName._errors[0]}</p>
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
                className={errorInput.user?.personalInfo?.email._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                placeholder="Email" />
              {errorInput.user?.personalInfo?.email._errors &&
                <label title={errorInput.user.personalInfo.email._errors[0]} htmlFor="email" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.email._errors}</p>
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
                  className={errorInput.user?.personalInfo?.phone._errors || errorInput.user?.personalInfo?.phoneNumber && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                  name="phoneNumber"
                  type="tel"
                  placeholder="Teléfono" />
              </div>

              {errorInput.user?.personalInfo?.phone._errors || errorInput.user?.personalInfo?.phoneNumber &&
                <label title={errorInput.user.personalInfo.phone._errors[0]} htmlFor="phone" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                  <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.phone._errors[0] || errorInput.user.personalInfo.phoneNumber._errors[0]}</p>
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
              className={errorInput.user?.personalInfo?.description._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
              placeholder="Describe yourself"
              rows={3} />
            {errorInput.user?.personalInfo?.description._errors[0] &&
              <label title={errorInput.user.personalInfo.description._errors[0]} htmlFor="description" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                <p className="text-xs basis-4/5 ">{errorInput.user.personalInfo.description._errors[0]}</p>
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
                        className={errorInput.technicalSkills?.name._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Nombre de la Habilidad" />
                      {errorInput.technicalSkills?.name._errors &&
                        <label title={errorInput.technicalSkills.name._errors[0]} htmlFor="technicalSkills" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.technicalSkills.name._errors[0]}</p>
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

                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("technicalSkills", skillSchema)} >Add Skill</Button>
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
                        className={errorInput.education?.name._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        id="school"
                        placeholder="Institución" />
                      {errorInput.education?.name._errors &&
                        <label title={errorInput.education.name._errors[0]} htmlFor="school" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.name._errors[0]}</p>
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
                        className={errorInput.education?.degree._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Título Académico " />
                      {errorInput.education?.degree._errors &&
                        <label title={errorInput.education.degree._errors[0]} htmlFor="degree" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.degree._errors[0]}</p>
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
                        className={errorInput.education?.concentration._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.concentration._errors &&
                        <label title={errorInput.education.concentration._errors[0]} htmlFor="concentration" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.concentration._errors[0]}</p>
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
                        className={errorInput.education?.graduationDate._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Año de Graducaion" />
                      {errorInput.education?.graduationDate._errors &&
                        <label title={errorInput.education.graduationDate._errors[0]} htmlFor="graduation-year" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.graduationDate._errors[0]}</p>
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
                        className={errorInput.education?.location._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Lugar" />
                      {errorInput.education?.location._errors &&
                        <label title={errorInput.education.location._errors[0]} htmlFor="education-location" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.location._errors[0]}</p>
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
                        className={errorInput.education?.gpa._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.gpa._errors &&
                        <label title={errorInput.education.gpa._errors[0]} htmlFor="gpa" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.gpa._errors[0]}</p>
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
                        className={errorInput.education?.thesis._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.thesis._errors &&
                        <label title={errorInput.education.thesis._errors[0]} htmlFor="education-thesis" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.thesis._errors[0]}</p>
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
                        className={errorInput.education?.relevantEvents._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.relevantEvents._errors &&
                        <label title={errorInput.education.relevantEvents._errors[0]} htmlFor="education-relevantEvents" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.relevantEvents._errors[0]}</p>
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
                        className={errorInput.education?.courseWorks._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="(opcional)" />
                      {errorInput.education?.courseWorks._errors &&
                        <label title={errorInput.education.courseWorks._errors[0]} htmlFor="education-courseWorks" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.education.courseWorks._errors[0]}</p>
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
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("education", educationSchema)} >Add Education</Button>
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
                        className={errorInput.experience?.organization._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Nombre la Organizacion/Empresa" />
                      {errorInput.experience?.organization._errors &&
                        <label title={errorInput.experience.organization._errors[0]} htmlFor="experience-company" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.organization._errors[0]}</p>
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
                        className={errorInput.experience?.position._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Título del empleo" />
                      {errorInput.experience?.position._errors &&
                        <label title={errorInput.experience.position._errors[0]} htmlFor="experience-position" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.position._errors[0]}</p>
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
                        className={errorInput.experience?.startDate._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()}
                      />
                      {errorInput.experience?.startDate._errors &&
                        <label title={errorInput.experience.startDate._errors[0]} htmlFor="experience-startDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.startDate._errors[0]}</p>
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
                        className={errorInput.experience?.endDate._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()} />
                      {errorInput.experience?.endDate._errors &&
                        <label title={errorInput.experience.endDate._errors[0]} htmlFor="experience-endDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.endDate._errors[0]}</p>
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
                        className={errorInput.experience?.location._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Lugar" />
                      {errorInput.experience?.location._errors &&
                        <label title={errorInput.experience.location._errors[0]} htmlFor="experience-location" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.experience.location._errors[0]}</p>
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
                      className={errorInput.experience?.description._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                      placeholder="Descripción de lo que hiciste en la compañia"
                      rows={4} />
                    {errorInput.experience?.description._errors &&
                      <label title={errorInput.experience.description._errors[0]} htmlFor="experience-description" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                        <p className="text-xs basis-4/5 ">{errorInput.experience.description._errors[0]}</p>
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
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("experience", experienceSchema)}>Add Experience</Button>
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
                        className={errorInput.projects?.name._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Nombre" />
                      {errorInput.projects?.name._errors &&
                        <label title={errorInput.projects.name._errors[0]} htmlFor="project-name" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.projects.name._errors[0]}</p>
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
                        className={errorInput.projects?.position._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Posición/Rol" />
                      {errorInput.projects?.position._errors &&
                        <label title={errorInput.projects.position._errors[0]} htmlFor="project-role" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.projects.position._errors[0]}</p>
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
                      className={errorInput.projects?.description._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                      rows={4} />
                    {errorInput.projects?.description._errors &&
                      <label title={errorInput.projects.description._errors[0]} htmlFor="project-description" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                        <p className="text-xs basis-4/5 ">{errorInput.projects.description._errors[0]}</p>
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
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("projects", projectSchema)}>Añadir Proyecto</Button>
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
                        className={errorInput.leadershipAndActivities?.organization._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Organización" />
                      {errorInput.leadershipAndActivities?.organization._errors &&
                        <label title={errorInput.leadershipAndActivities.organization._errors[0]} htmlFor="leadershipAndActivities-organization" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.organization._errors[0]}</p>
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
                        className={errorInput.leadershipAndActivities?.role._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Ingresa tu Rol" />
                      {errorInput.leadershipAndActivities?.role._errors &&
                        <label title={errorInput.leadershipAndActivities.role._errors[0]} htmlFor="leadershipAndActivities-position" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.role._errors[0]}</p>
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
                        className={errorInput.leadershipAndActivities?.startDate._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()} />
                      {errorInput.leadershipAndActivities?.startDate._errors &&
                        <label title={errorInput.leadershipAndActivities.startDate._errors[0]} htmlFor="leadershipAndActivities-startDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.startDate._errors[0]}</p>
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
                        className={errorInput.leadershipAndActivities?.endDate._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        type="date"
                        min="1900-01-01"
                        max={dateToday()} />
                      {errorInput.leadershipAndActivities?.endDate._errors &&
                        <label title={errorInput.leadershipAndActivities.endDate._errors[0]} htmlFor="leadershipAndActivitiesAndActivitiesAndActivities-endDate" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.endDate._errors[0]}</p>
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
                        className={errorInput.leadershipAndActivities?.location._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                        placeholder="Lugar" />
                      {errorInput.leadershipAndActivities?.location._errors &&
                        <label title={errorInput.leadershipAndActivities.location._errors[0]} htmlFor="leadershipAndActivities-location" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                          <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.location._errors[0]}</p>
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
                      className={errorInput.leadershipAndActivities?.achievements._errors && "text-red-400 border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-500 error-input-vibration"}
                      placeholder="Describe lo que hiciste en este evento o los logros que obtuviste"
                      rows={4} />
                    {errorInput.leadershipAndActivities?.achievements._errors &&
                      <label title={errorInput.leadershipAndActivities.achievements._errors[0]} htmlFor="leadershipAndActivities-achievements" className="text-red-500 ml-1 flex items-end justify-between error-message-vibration">
                        <p className="text-xs basis-4/5 ">{errorInput.leadershipAndActivities.achievements._errors[0]}</p>
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
                  <Button className="border hover:bg-slate-50 hover:text-black" onClick={() => handleAddArray("leadershipAndActivities", leadershipSchema)} >Add Leadership</Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-nowrap justify-between">
        <div>
          {success.visibility && (
            <div className={`flex items-center gap-2 ${success.status ? "text-green-500" : "text-red-500"}`}>
              {success.status ? <CheckIco className="size-6" /> : <XCircleIcon className="size-6" />}
              <p className="text-sm">{success.message}</p>
            </div>
          )}
        </div>

        <Button className={`border bg-gradient-to-r hover:from-blue-800 hover:to-red-700 from-sky-800 to-indigo-600 bg-vnzla rounded-full ${loading && 'cursor-wait'}`} onClick={saveInfoUser}>{loading ? 'Guardando...' : 'Guardar Informacion'} <SaveIco className="fill-amber-400 size-5" /></Button>
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