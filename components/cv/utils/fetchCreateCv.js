// Obtencion de la informacion para crear el cv

/**
 * 
 * @param {Object} userData - Objeto con la informacion del usuario debe tener el formato de schema que esta en el readme 
 * @returns 
 */
export const fetchCreateCV = async (userData) => {

  try {

    // Peticion de los datos generados por IA
    const response = await fetch('/api/createcv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      return { cv: data.cv }
    } else {
      console.error(data.error);
      throw new Error(JSON.stringify(data.error));
    }
  }
  catch (error) {
    console.error(JSON.parse(error.message));
    return JSON.parse(error.message)
  }
};