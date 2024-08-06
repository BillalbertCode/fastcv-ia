# Fastcv-ia
 Aplicacion Web para la creacion de CV de manera profesional, rapida y dinamica con el uso de la IA Geminis
 Consiste en colocar lo maximo de información posible sobre tí para crear un curriculum y adaptarlo a un puesto de trabajo
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
- education *requerido* array( {
    name: string(nombre de la institucion),
    location: string,
    degree - string,
    concentration - string,
    gpa - string **opcional**
    graduationDate - string, 
    thesis - string **opcional**
    relevantEvents - string **opcional**
    courseWorks - string **opcional**
   })
- experience *requerido* array ({
    organization - string,
    location - string,
    position - string
    startDate - string,
    endDate - string
    description - string
   })
- projects *opcional*array.object {
    name - string(nombre del proyecto), 
    position - string
    description - string,
   }
- Leadership *opcional* array.object{
  organization - string,
  role - string
  location - string
  startDate - string
  endDate -string
  achievements - string
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
