import { format } from '@formkit/tempo';

const region = 'es-MX';

export const formatDate = (date: string | Date) => {
  return format(date, 'YYYY-MM-DD HH:mm:ss', region);
};
