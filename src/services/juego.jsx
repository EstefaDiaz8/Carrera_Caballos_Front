import axios from 'axios';

const API_URL = 'https://carrera-caballos-back.onrender.com/api/juego';

// Crear un nuevo jugador
export const crearJugador = async (nombrePersona) => {
  const response = await axios.post(`${API_URL}/crearJugador`, { nombrePersona });
  return response.data;
};

// Actualizar el nombre de un jugador
export const actualizarNombre = async (id, nombrePersona) => {
  const response = await axios.put(`${API_URL}/actualizarNombre/${id}`, { nombrePersona });
  return response.data;
};

// Registrar el resultado de una partida
export const resultadoJuego = async (id, resultado) => {
  const response = await axios.post(`${API_URL}/resultadoJuego/${id}`, { resultado });
  return response.data;
};

// Obtener un jugador
export const obtenerJugadorPorNombre = async (nombrePersona) => {
    const response = await axios.get(`${API_URL}/obtenerJugadorPorNombre`, {params: { nombrePersona }});
    return response.data;
};


