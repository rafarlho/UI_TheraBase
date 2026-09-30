import { differenceInMonths, intervalToDuration } from "date-fns"

export function displayAgeByMonths(birthDate: Date | string | number) {
    const months = differenceInMonths(new Date(), new Date(birthDate))
    const years = Math.floor(months/12)
    if(months >= (12*6)) return years + " anos"
    if(months < 12) return months + " meses"
    const duration = intervalToDuration({start: new Date(birthDate), end: new Date()})
    return `${duration.years} anos${duration.months ? ` e ${duration.months} meses` : ""}`
}