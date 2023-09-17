import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import { DocumentData, QuerySnapshot, Timestamp } from "firebase/firestore";
dayjs.extend(relativeTime);
dayjs.extend(isToday);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateConverter(date: Timestamp) {
  const d = date ? date.toDate() : new Date();
  if (dayjs(d).isToday()) {
    return dayjs(d).format("HH:mm");
  }
  return dayjs(d).format("DD MMM");
}

export function dateConverterAppointment(date: Timestamp) {
  const d = date ? date.toDate() : new Date();
  if (dayjs(d).isToday()) {
    return "Hari Ini";
  }
  return dayjs(d).format("DD MMM");
}

export function dateConverterCreatedAt(date: Timestamp) {
  const d = date ? date.toDate() : new Date();
  if (dayjs(d).isToday()) {
    return `Hari Ini, ${dayjs(d).format("HH:mm, Hari Ini")}`;
  }
  return dayjs(d).format("HH:mm, DD MMM");
}

export function queueTypeToColorConverter(type: string) {
  return type === "Menunggu"
    ? "yellow"
    : type === "Bayar"
    ? "green"
    : type === "Batal"
    ? "red"
    : type === "Dalam Proses"
    ? "purple"
    : "blue";
}

export  function mappingToArray({data}: { data: QuerySnapshot<DocumentData, DocumentData> | undefined}) {
  if(data === undefined) return
  const mapped = data.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return mapped
}



type InputObj = Record<string, { startTime: Date; endTime: Date }>;

type OutputObj = { days: string; startTime: Date; endTime: Date }[];

export function convertToObjectArray(input: InputObj): OutputObj {
  return Object.keys(input).map((day) => ({
    days: day,
    ...input[day],
  }));
}


type Schedule = {
  startTime: Date;
  endTime: Date;
};

type SchedulesObject = Record<string, Schedule>;

export function schedulesConvertToDates(input: SchedulesObject): SchedulesObject {
  const converted: SchedulesObject = {};

  for (const day in input) {
    const { startTime, endTime } = input[day];
    converted[day] = {
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    };
  }

  return converted;
}