export const getFormatterDate = () => {
  const currentDate = new Date();

  const opciones: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat('es-ES', opciones);

  return formatter.format(currentDate);
};
