export interface Screening {
    id: number,
    hu: string,
    en: string,
    startEpochSeconds: number,
    lengthMins: number,
    reserved: string[],
  }
