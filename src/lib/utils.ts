import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import relativeTime from "dayjs/plugin/relativeTime";
import { Timestamp } from "firebase/firestore";
dayjs.extend(relativeTime);
dayjs.extend(isToday)
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export  function dateConverter(date: Timestamp){
  const d = (date ? date.toDate() : new Date())
  if(dayjs(d).isToday()){
    return dayjs(d).format("HH:mm")
  }
  return dayjs(d).format("DD MMM")
}

export  function dateConverterAppointment(date: Timestamp){
  const d = (date ? date.toDate() : new Date())
  if(dayjs(d).isToday()){
    return "Hari Ini"
  }
  return dayjs(d).format("DD MMM")
}

export  function dateConverterCreatedAt(date: Timestamp){
  const d = (date ? date.toDate() : new Date())
  if(dayjs(d).isToday()){
    return `Hari Ini, ${dayjs(d).format('HH:mm, Hari Ini')}`
  }
  return dayjs(d).format("HH:mm, DD MMM")
}