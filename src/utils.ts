import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateGST = (price: number, rate: number, quantity: number = 1) => {
  const taxableAmount = price * quantity;
  const gstAmount = (taxableAmount * rate) / 100;
  return {
    taxableAmount,
    gstAmount,
    totalAmount: taxableAmount + gstAmount,
  };
};
