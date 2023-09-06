import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(isToday)
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  function dateConverter(date: string){
  const d = (date ? new Date(date) : new Date())
  if(dayjs(d).isToday()){
    return dayjs(d).format("HH:mm")
  }
  return dayjs(d).format("DD MMM")
}