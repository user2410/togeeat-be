export function roundUpToMinute(date: Date): Date {
  date.setMilliseconds(0); 
  date.setSeconds(0);
  return date;
}
