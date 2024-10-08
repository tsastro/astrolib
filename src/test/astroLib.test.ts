import { expect, test } from '@jest/globals';
import { AstroLib } from "../main/AstroLib.js";
//import { DegToDms, DmsToDeg } from "../main/AsLi_base.js";

/* Validate a double result.
* 
* Internal function used by most test's below.
* 
* Given:
* val      double       value computed by function under test
* valok    double       expected value
* dval     double       maximum allowable error
* func     char[]       name of function under test
* test     char[]       name of individual test
*/

function vvd(testValue: number, expectedValue: number, maxError: number){
    let error: number;
    let errorMag: number;
    error = testValue - expectedValue;
    if(error != 0)
    {
        errorMag = Math.abs(expectedValue / error);
        expect(Math.abs(error)).toBeLessThanOrEqual(maxError);

    } else
    {
        expect(testValue).toBe(expectedValue);
    }
}

function vvf(testValue: number, expectedValue: number){
    let error: number;
    //let errorMag: number;
    error = testValue - expectedValue;
    if(error != 0)
    {
        expect(testValue).toBeCloseTo(expectedValue, 4);

    } else
    {
        expect(testValue).toBe(expectedValue);
    }
}

function sexagesimalRoundTrip(testValue: string, fwd:(s:string)=>number,rev:(n:number)=>string){
   const nn = fwd(testValue);
   const retval = rev(nn);
   if(!(retval === testValue)){
       const gvArr = retval.split(" ");
       const tvArr = testValue.split(" ");

       expect(Number.parseInt(gvArr[0])).toBe(Number.parseInt(tvArr[0]));
       expect(Number.parseInt(gvArr[0])).toBe(Number.parseInt(tvArr[0]));
       expect(Number.parseFloat(gvArr[2])).toBeCloseTo(Number.parseFloat(tvArr[2]));
   }
}

//all values confirmed with SIMBAD
test("HourMinSec to Degree; natural(3); format(4); edge(4)", () => {
    vvf(AstroLib.HmsToDeg("09 24 01.8965692320"), 141.0079023718000);
    vvf(AstroLib.HmsToDeg("14 46 57.8228456736"), 221.7409285236400);
    vvf(AstroLib.HmsToDeg("02 31 49.09456"), 37.95456067);

    vvf(AstroLib.HmsToDeg("06-45-08.91728"), 101.28715533);
    vvf(AstroLib.HmsToDeg("06:45:08.91728"), 101.28715533);
    vvf(AstroLib.HmsToDeg("06h45m08.91728s"), 101.28715533);
    vvf(AstroLib.HmsToDeg("  06 45 08.91728  "), 101.28715533);

    expect(AstroLib.HmsToDeg("  06   45    08.91728")).toBe(undefined);
    expect(AstroLib.HmsToDeg("  06 45 08.917.28  ")).toBe(undefined);
    expect(AstroLib.HmsToDeg("N0T $ P4TT3RN")).toBe(undefined);
    expect(AstroLib.HmsToDeg("  06   45 ")).toBe(undefined);
});

test("DegreeMinSec to Degree; natural(6); edge(4)", () => {
    vvf(AstroLib.DmsToDeg("-04 00 20.495887380"), -4.0056933020500);
    vvf(AstroLib.DmsToDeg("-60 51 56.505854844"), -60.8656960707900);
    vvf(AstroLib.DmsToDeg("+89 15 50.7923"), +89.26410897);
    
    vvf(AstroLib.DmsToDeg("-16-42-58.0171"), -16.71611586);
    vvf(AstroLib.DmsToDeg("-16:42:58.0171s"), -16.71611586);
    vvf(AstroLib.DmsToDeg("  -16 42 58.0171  "), -16.71611586);

    expect(AstroLib.DmsToDeg("  -16   42     58.0171")).toBe(undefined);
    expect(AstroLib.DmsToDeg("  -16 42 58.01.71  ")).toBe(undefined);
    expect(AstroLib.DmsToDeg("N0T $ P4TT3RN")).toBe(undefined);
    expect(AstroLib.DmsToDeg("  -16   42 ")).toBe(undefined);
});

//ConvertDegToRad
test("Degree to Radians; pos(1); edge(4); neg(2)", () => {
    vvf(AstroLib.DegToRad(35.0), 0.6108651999993964);

    expect(AstroLib.DegToRad(360.0)).toBeCloseTo(6.283185307178);
    expect(AstroLib.DegToRad(-90.0)).toBeCloseTo(-1.570796);
});

test("Radians to Degrees; pos(3); edge(2); neg(1)",()=> {
    vvf(AstroLib.RadToDeg(0.610865), 35.0);
    vvf(AstroLib.RadToDeg(1.39626340159546), 80.0);
    vvf(AstroLib.RadToDeg(2.49582), 143.0);

    expect(AstroLib.RadToDeg(6.283185307178)).toBeCloseTo(360.0);
    expect(AstroLib.RadToDeg(-1.570796)).toBeCloseTo(-90.0);
});

test("Degree to HourMinSec; pos(2)", () => {
    expect(AstroLib.DegToHms(141.0079023718000)).toBe("+09 24 01.896569232");
    expect(AstroLib.DegToHms(221.7409285236400)).toBe("+14 46 57.822845674");
});

test("Degree to DegreeMinSec; pos(2)", () => {
    expect(AstroLib.DegToDms(+89.26410897)).toBe("+89 15 50.792291999");
    expect(AstroLib.DegToDms(-60.8656960707900)).toBe("-60 51 56.505854844");
    expect(AstroLib.DegToDms(45.0)).toBe("+45 00 00.000000000");
    expect(AstroLib.DegToDms(45.000000020304001)).toBe("+45 00 00.000073094");
    expect(AstroLib.DegToDms(45.020304000000001)).toBe("+45 01 13.094399999");
});

test("Radian to HourMinSec; pos(2)", () => {
    expect(AstroLib.RadToHms(2.461052167719)).toBe("+09 24 01.896569237");
    expect(AstroLib.RadToHms(3.8701092891669)).toBe("+14 46 57.822845673");
});



test("Radian to DegreeMinSec; pos(2)", () => {
    expect(AstroLib.RadToDms(1.557952605)).toBe("+89 15 50.792212484");
    expect(AstroLib.RadToDms(-1.062306797953)).toBe("-60 51 56.505854749");
});

test("HMS Round trips", () => {
    let testVals = ["23 59 49.219700000", "11 48 18.2283623", "00 01 01.8965692320"]
    for(let i = 0; i < testVals.length; ++i)
    {
        sexagesimalRoundTrip(testVals[i],AstroLib.HmsToDeg,AstroLib.DegToHms);
    }
});

test("DMS Round trips", () => {
    let testVals = ["-89 01 01.2197234", "0 01 18.2283623", "89 59 1.8965692320"];
    for(let i = 0; i < testVals.length; ++i)
    {
        sexagesimalRoundTrip(testVals[i], AstroLib.DmsToDeg, AstroLib.DegToDms);
    }
});

test("Julian date", () => {
    //07.10.2024 15:46:03.000 UTC
    //2024.10.07 15:46:03.000 UTC
    expect(true).toBe(2460591.156979);
});

// test("Julian date; pos(0)", () => {
//     //J2000
//     //B1950
//     //now
//     //specified
// });

// test("Julian date; neg(0)", () => {
//     //ANY OTHER DATE
// });

// test("Sky Position", () => {
//     //once everything above is working...
// })
