export const getFormatterDate = (date: Date | string = new Date()) => {
  let currentDate = date;

  if (typeof date === 'string') {
    currentDate = new Date(date);
  }

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

  return formatter.format(currentDate as Date);
};
