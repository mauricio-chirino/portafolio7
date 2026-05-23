// "Base de datos" falsa de usuarios, simulada en el front (no hay backend real).
// Cada usuario tiene sus propios favoritos y preferencias.
export const USUARIOS = [
  {
    nombre: 'Ana',
    correo: 'ana@clima.com',
    password: '1234',
    favoritos: [1, 3], // Madrid y Valencia
    preferencias: { unidad: 'C', tema: 'claro' },
  },
  {
    nombre: 'Luis',
    correo: 'luis@clima.com',
    password: '1234',
    favoritos: [2, 5], // Barcelona y Bilbao
    preferencias: { unidad: 'F', tema: 'oscuro' },
  },
]

// Busca un usuario que coincida con el correo y la contraseña.
// Devuelve el usuario o null si no existe.
export function buscarUsuario(correo, password) {
  return (
    USUARIOS.find((u) => u.correo === correo && u.password === password) || null
  )
}
