import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import Swal from "sweetalert2";
import { actualizarNombre, crearJugador, obtenerJugadorPorNombre, resultadoJuego } from "./services/juego";


function App() {
  const cartasIniciales = [
    {
      id: 1,
      titulo: "Oro",
      imagen: "https://i.pinimg.com/736x/42/56/9e/42569ef9fc840a4b35fdde4e9426dc97.jpg",
      left: "20%",
      top: 65,
      score: 0,
    },
    {
      id: 2,
      titulo: "Copa",
      imagen: "https://i.pinimg.com/736x/07/d5/2e/07d52ea5558997beeb4bb87e7c89e9b8.jpg",
      left: "35%",
      top: 65,
      score: 0,
    },
    {
      id: 3,
      titulo: "Espada",
      imagen: "https://i.pinimg.com/736x/92/18/bb/9218bb98d9a76d476a88407cca8c351d.jpg",
      left: "50%",
      top: 65,
      score: 0,
    },
    {
      id: 4,
      titulo: "Basto",
      imagen: "https://i.pinimg.com/736x/6c/2c/74/6c2c74174cf9c1798e376f2bf2deca29.jpg",
      left: "65%",
      top: 65,
      score: 0,
    },
  ];

  const cartasSecretasIniciales = [
    {
      puntos: 1,
      titulo: "",
      imagen: "",
      activada: false,
      left: "10%",
      top: 50,
    },
    {
      puntos: 2,
      titulo: "",
      imagen: "",
      activada: false,
      left: "10%",
      top: 35,
    },
    {
      puntos: 3,
      titulo: "",
      imagen: "",
      activada: false,
      left: "10%",
      top: 20,
    },
    {
      puntos: 4,
      titulo: "",
      imagen: "",
      activada: false,
      left: "10%",
      top: 5,
    },
  ];

  const [cartas, setCartas] = useState(structuredClone(cartasIniciales));
  const [cartasSecretas, setCartasSecretas] = useState(structuredClone(cartasSecretasIniciales));
  const [puntajeMax, setPuntajeMax] = useState(0);
  const [valorBaraja, setValorBaraja] = useState("");
  const screenHeight = window.innerHeight;
  const [cartaSeleccionada, setCartaSeleccionada] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [victorias, setVictorias] = useState(0);
  const [derrotas, setDerrotas] = useState(0);

  useEffect(() => {
    return () => {
      mostrarModal()
    }
  }, []);

  const mostrarModal = () => {
    Swal.fire({
      title: "Ingresa el nombre del jugador",
      input: "text",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      confirmButtonText: "Crear",
      confirmButtonColor: "#16A34A",
      showLoaderOnConfirm: true,
      preConfirm: (userInput) => {
        if (!userInput) {
          Swal.showValidationMessage("El nombre no puede estar vacío");
          return;
        }

        // Llamada a la API para crear un nuevo jugador
        return crearJugador(userInput)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.error("Error al crear el usuario:", error);
            Swal.showValidationMessage("Hubo un error al crear el usuario");
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoUsuario = result.value;
        setUsuario(nuevoUsuario.nombrePersona);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("El usuario canceló la acción.");
      }
    });
  };

  const actualizarModal = () => {
    Swal.fire({
      title: `Ingresa el nuevo nombre del jugador (${usuario})`,
      input: "text",
      inputAttributes: { autocapitalize: "off" },
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      confirmButtonColor: "#16A34A",
      showLoaderOnConfirm: true,
      preConfirm: (userInput) => {
        if (!userInput) {
          Swal.showValidationMessage("El nombre no puede estar vacío");
          return;
        }

        // Llamada a la API para actualizar un jugador
        return actualizarNombre(userInput)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            console.error("Error al actualizar el usuario:", error);
            Swal.showValidationMessage("Hubo un error al actualizar el usuario");
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoUsuario = result.value;
        setUsuario(nuevoUsuario.nombrePersona);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("El usuario canceló la acción.");
      }
    });
  };


  const cartaAlAzar = () => {
    const cartas = structuredClone(cartasIniciales);
    return cartas[Math.floor(Math.random() * cartas.length)];
  };

  const seleccionDeCarta = (caballo) => {
    if (cartaSeleccionada) {
      Swal.fire({
        title: "Error",
        text: "Ya seleccionaste un caballo",
        icon: "error",
      });
    } else {
      setCartaSeleccionada(caballo);
    }
  }

  const quitarSeleccion = () => {
    Swal.fire({
      text: "¿Estás seguro de quitar la selección?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Si",
      confirmButtonColor: "#16A34A",
      cancelButtonText: "No",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        setCartaSeleccionada(null);
      }
    });
  }

  const reiniciarJuego = () => {
    setCartas(structuredClone(cartasIniciales));
    setCartasSecretas(structuredClone(cartasSecretasIniciales));
    setPuntajeMax(0);
    setValorBaraja("");
    setCartaSeleccionada(null);
  };

  const movimientoCaballo = (value, punto, posicion) => {
    const buscarCaballo = cartas.find((carta) => carta.titulo == value);
    if (buscarCaballo.score < 5) {
      buscarCaballo.score = buscarCaballo.score + punto;
      buscarCaballo.top = buscarCaballo.top + posicion;
      setCartas([...cartas]);
    } else {
      buscarCaballo.top = 5;
    }
    return buscarCaballo;
  }

  const sacarCarta = async () => {
    if (!usuario || cartaSeleccionada == null) {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar un caballo y colocar tu usuario",
        icon: "error",
      });
      return;
    }

    const valor = cartaAlAzar();
    setValorBaraja(valor);

    const caballo = movimientoCaballo(valor.titulo, 1, -15);

    if (caballo.score >= 5) {
      try {
        const jugador = await obtenerJugadorPorNombre(usuario);

        if (cartaSeleccionada.titulo === caballo.titulo) {
          await Swal.fire({
            title: "FELICITACIONES",
            text: `${usuario} ganó con el caballo de ${caballo.titulo}`,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#16A34A",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          await resultadoJuego(jugador.id, true);
          setVictorias(jugador.gano + 1);
        } else {
          await Swal.fire({
            title: "Oops...",
            text: `${usuario} perdió con el caballo de ${cartaSeleccionada.titulo}`,
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#16A34A",
            allowOutsideClick: false,
            allowEscapeKey: false,
          });

          await resultadoJuego(jugador.id, false);
          setDerrotas(jugador.perdio + 1);
        }

        // Reinicia el juego después del resultado
        setCartas(structuredClone(cartasIniciales));
        setCartasSecretas(structuredClone(cartasSecretasIniciales));
        setPuntajeMax(0);
        setValorBaraja("");
      } catch (err) {
        console.error("Error al obtener el jugador o enviar el resultado:", err);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al procesar el resultado del juego",
          icon: "error",
        });
      }
    } else {
      if (caballo.score > puntajeMax) {
        setPuntajeMax(caballo.score);

        const buscarCartaSecreta = cartasSecretas.find((carta) => carta.puntos === caballo.score);
        if (!buscarCartaSecreta.activada) {
          const caballoEncontrado = cartaAlAzar();
          buscarCartaSecreta.activada = true;
          buscarCartaSecreta.titulo = caballoEncontrado.titulo;
          buscarCartaSecreta.imagen = caballoEncontrado.imagen;

          setTimeout(() => {
            movimientoCaballo(buscarCartaSecreta.titulo, -1, +15);
          }, 1000);
          setCartasSecretas([...cartasSecretas]);
        }
      }
    }
  };


  return (
    <>
      <div className="relative" style={{ height: `${screenHeight}px` }}>
        <h1 className="absolute font-bold" style={{ left: `80%`, top: `10%` }}>{usuario ? `Bienvenid@, ${usuario}` : "Bienvenid@"}</h1>
        {usuario && (
          <div className="absolute" style={{ left: `80%`, top: `20%`, fontWeight: 'normal' }}>
            <p>{`Partidas ganadas: ${victorias}`}</p>
            <p>{`Partidas perdidas: ${derrotas}`}</p>
          </div>
        )}
        <div>
          {cartasSecretas.map((carta, i) => (
            <div key={i} className="absolute" style={{ left: carta.left, top: `${carta.top}%` }}>
              <Card imagen={carta.imagen} name={'SECRETA'} />
            </div>
          ))}
        </div>
        <div>
          {cartas.map((carta) => (
            <div key={carta.id} className="absolute" style={{ left: carta.left, top: `${carta.top}%`, border: cartaSeleccionada && cartaSeleccionada.id === carta.id ? '2px solid red' : 'none', }}
              onClick={() => seleccionDeCarta(carta)}
            >
              <Card name={carta.titulo} imagen={carta.imagen} />
            </div>
          ))}
        </div>
        <div>
          <div className="absolute cursor-pointer" style={{ left: `82%`, top: `40%` }} onClick={sacarCarta}>
            <Card imagen={valorBaraja.imagen} name={"BARAJA"} />
          </div>
        </div>
      </div>
      <div className="absolute" style={{ left: `80%`, top: `60%` }}>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          onClick={mostrarModal}
        >
          Crear Jugador
        </button>
      </div>
      <div className="absolute" style={{ left: `80%`, top: `70%` }}>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          onClick={actualizarModal}
        >
          Actualizar Nombre
        </button>
      </div>
      <div className="absolute" style={{ left: `80%`, top: `80%` }}>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          onClick={quitarSeleccion}
        >
          Quitar Selección
        </button>
      </div>
      <div className="absolute" style={{ left: "80%", top: "90%" }}>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
          onClick={reiniciarJuego}
        >
          Reiniciar Juego
        </button>
      </div>

    </>
  );
}

export default App;
