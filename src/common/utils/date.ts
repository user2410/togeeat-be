export function addMinutes(date: Date, minutes: number): Date {
  const newDate = new Date(date);
  newDate.setTime(newDate.getTime() + minutes * 60000);
  return newDate;
}

export function roundUpToMinute(date: Date): Date {
  date.setMilliseconds(0); 
  date.setSeconds(0);
  return date;
}
