export const generateUserErrorInfo = (user) => {
  return `Una o mas propiedades están incompletas o invalidas.
    Lista de propiedades: 
    * first_name: Debe contener al menos 2 caracteres. (${user.first_name})
    * last_name: Debe contener al menos 2 caracteres. (${user.last_name})
    * email: Debe contener un email valido. (${user.email})
    `;
};
