import { parseHMS, parseDMS } from "../src/AstroLib.js";

/* Validate an integer result.
 * 
 * Internal function used by t_sofa_c program.
 * 
 * Given:
 * ival     int          value computed by function under test
 * ivalok   int          correct value
 * func     char[]       name of function under test
 * test     char[]       name of individual test
 */ 
function viv(ival: number, ivalok: number, func: string, test: string) {
    const testResult = ival;
    const expectedResult = ivalok;
    const nameOfFunction = func;
    const nameOfIndividualTest = test;

    expect(testResult).toBe(expectedResult);
}

/* Validate a double result.
* 
* Internal function used by t_sofa_c program.
* 
* Given:
* val      double       value computed by function under test
* valok    double       expected value
* dval     double       maximum allowable error
* func     char[]       name of function under test
* test     char[]       name of individual test
*/
function vvd(val: number, valok: number, dval: number){
    let a: number;
    let f: number;
    a = val - valok;
    if(a != 0)
    {
        f = Math.abs(valok / a);
        expect(Math.abs(a)).toBeLessThanOrEqual(dval);

    } else
    {
        expect(val).toBe(valok);
    }
}

//all values confirmed with SIMBAD
test("Parse HMS; pos(4) components", () => {
    vvd(parseHMS("06 45 08.91728"), 101.28715533, 0.0000001);
    vvd(parseHMS("06-45-08.91728"), 101.28715533, 0.0000001);
    vvd(parseHMS("06:45:08.91728"), 101.28715533, 0.0000001);
    vvd(parseHMS("  06 45 08.91728  "), 101.28715533, 0.0000001);
});

test("Parse HMS; neg(4) components", () => {
        expect(parseHMS("  06   45    08.91728")).toBe(-1);
        expect(parseHMS("  06 45 08.917.28  ")).toBe(-1);
        expect(parseHMS("N0T $ P4TT3RN")).toBe(-1);
        expect(parseHMS("  06   45 ")).toBe(-1);
});

test("Parse DMS; pos(5) components", () => {
    vvd(parseDMS("-16 42 58.0171"), -16.71611586, 0.0000001);
    vvd(parseDMS("16 44 08.171351134"), 16.7356031530928, 0.0000001);
    vvd(parseDMS("-16-42-58.0171"), -16.71611586, 0.0000001);
    vvd(parseDMS("-16:42:58.0171"), -16.71611586, 0.0000001);
    vvd(parseDMS("  -16 42 58.0171  "), -16.71611586, 0.0000001);
});

test("Parse DMS; neg(4) components", () => {
        expect(parseDMS("  -16   42     58.0171")).toBe(-1);
        expect(parseDMS("  -16 42 58.01.71  ")).toBe(-1);
        expect(parseDMS("N0T $ P4TT3RN")).toBe(-1);
        expect(parseDMS("  -16   42 ")).toBe(-1);
});

