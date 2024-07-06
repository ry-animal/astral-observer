import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateWithEllipsis(str: string | undefined, maxLength: number): string {
  if (str && str.length <= maxLength) {
    return str;
  } else if (!str) {
    return '';
  }
  return str.slice(0, maxLength - 3) + '...';
}
