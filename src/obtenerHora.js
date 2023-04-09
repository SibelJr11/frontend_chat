export const obtenerHora = (timestamp) => {
      const date = new Date(timestamp); // Convertir a una instancia de Date
      let hours = date.getHours(); // Obtener la hora en formato de 24 horas
      const minutes = date.getMinutes(); // Obtener los minutos
      let ampm = hours < 12 ? "a.m" : "p.m"; // Determinar si es antes o después del mediodía

      // Convertir a formato de 12 horas
      hours = hours % 12;
      hours = hours ? hours : 12;

      // Crear la cadena de tiempo en formato "9:26PM"
      return (
            hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + " " + ampm
      );
};
