// src/auth/constants/jwt.constant.ts
// Este archivo es para guardar las constantes de jwt, como el secret y el tiempo de expiracion del token de autenticacion
// Se lo hace con variables de entorno para que no se guarde en el codigo fuente y sea mas seguro

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
