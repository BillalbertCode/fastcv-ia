// Funcion que retorna el dia de hoy en formato YY//MM//DD
// Usado principalmente en los max time del input Date
export const dateToday = () => {
    const today = new Date()
    const maxDate = today.toISOString().split('T')[0];
    return maxDate
}