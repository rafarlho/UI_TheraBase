import { subMonths } from "date-fns";
import { describe, expect, it } from "vitest";
import { displayAgeByMonths } from "./date-helper";

describe("dateHelper", ()=> {
    it("should return only months when age is lower than 1 year", ()=> {
        const birthDate =  subMonths(new Date(), 9)
        expect(displayAgeByMonths(birthDate)).toBe("9 meses")
    })

    it("should return only years when age is bigger or equal than 6 years", ()=> {
        let birthDate =  subMonths(new Date(), 6*12)
        expect(displayAgeByMonths(birthDate)).toBe("6 anos")
        birthDate =  subMonths(new Date(), 80*12)
        expect(displayAgeByMonths(birthDate)).toBe("80 anos")
    })

    it("should return years and months when age is lower than 6 years and higher than 1 year", ()=> {
        let birthDate =  subMonths(new Date(), 6*12 -1)
        expect(displayAgeByMonths(birthDate)).toBe("5 anos e 11 meses")
        
        birthDate =  subMonths(new Date(), 1*12 + 1)
        expect(displayAgeByMonths(birthDate)).toBe("1 anos e 1 meses")
    })

    it("should return only years when age is lower than 6 years and higher than 1 year and 0 additional months", ()=> {
        let birthDate =  subMonths(new Date(), 4*12)
        expect(displayAgeByMonths(birthDate)).toBe("4 anos")
        
        birthDate =  subMonths(new Date(), 2*12)
        expect(displayAgeByMonths(birthDate)).toBe("2 anos")
    })
})