# Fastcv-ia
 Aplicacion Web para la creacion de CV de manera profesional, rapida y dinamica con el uso de la IA Geminis

## API /api/createcv
Api que usa la inteligencia artificial geminis para resumir y adaptar tu cv a una propuesta de trabajo
### Campos Req
- name *requerido* String
- lastName *requerido* String
- email *requerido* String
- phone *opcional* number
- linkedin *opcional* string - link
- portfolio *opcional* string - link
- description *requerido*  strign - link
- skills *requerido* array(object({ name: string, description: string(**Opcional**) }))
- studies *requerido* array( {
    name: string(nombre de la institucion),
    site: string,
    dateInit - string,
    dateEnd - string,
    description - string **opcional**
    carrera - string, 
    type - string(tipo de carrera)
   })
- experience *requerido* array ({
    employment - string,
    name - string(nombre de la empresa)
    dateInit - string,
    dateEnd - string,
    description - string
   })
- projects *opcional*array.object {
    name - string(nombre del proyecto), 
    description - string,
    link - string(link del proyecto),
    skills - array.string(habilidades usadas en el proyecto) **proximo**
   }
- jobDescription *opcional* string

#### Notes

Return de descripciones

- Descripcion personal description del empleo devolvera maximo 300 caracteres
- Experiencia description del empleo devolvera maximo 350 caracteres
- Proyectos description del proyecto devolvera maximo 350 caracteres
- Skills devolvera maximo 6 skills

### Object Res

´´´cv = {
      personalInfo: {
        name: personalInfo.name,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone
      },
      education: googleResponse.object.education,
      experience: googleResponse.object.experience,
      projects: googleResponse.object.projects,
      leadershipAndActivities: googleResponse.object.leadershipAndActivities,
      technicalSkills: googleResponse.object.technicalSkills
    }´´´