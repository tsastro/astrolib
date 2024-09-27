import { expect, test } from '@jest/globals';
import { AstroLib } from "../main/AstroLib.js";
import { DegToDms, DmsToDeg } from "../main/AsLi_base.js";

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

////////
// A test to compare sexegesimal components
// 
// it breaks each HMS and DMS into H/D M & S and 
function vv_ms(testValue: string, expectedValue: string, callingFn: string ){
    let gvArr = expectedValue.split(" ");
    let tvArr = testValue.split(" ");

    expect(Number.parseInt(gvArr[0])).toBe(Number.parseInt(tvArr[0]));
    expect(Number.parseInt(gvArr[0])).toBe(Number.parseInt(tvArr[0]));
    expect(Number.parseFloat(gvArr[2])).toBeCloseTo(Number.parseFloat(tvArr[2]));
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

    expect(AstroLib.HmsToDeg("  06   45    08.91728")).toBe(-111111);
    expect(AstroLib.HmsToDeg("  06 45 08.917.28  ")).toBe(-111111);
    expect(AstroLib.HmsToDeg("N0T $ P4TT3RN")).toBe(-111111);
    expect(AstroLib.HmsToDeg("  06   45 ")).toBe(-111111);
});

test("DegreeMinSec to Degree; natural(6); edge(4)", () => {
    vvf(AstroLib.DmsToDeg("-04 00 20.495887380"), -4.0056933020500);
    vvf(AstroLib.DmsToDeg("-60 51 56.505854844"), -60.8656960707900);
    vvf(AstroLib.DmsToDeg("+89 15 50.7923"), +89.26410897);
    
    vvf(AstroLib.DmsToDeg("-16-42-58.0171"), -16.71611586);
    vvf(AstroLib.DmsToDeg("-16:42:58.0171s"), -16.71611586);
    vvf(AstroLib.DmsToDeg("  -16 42 58.0171  "), -16.71611586);

    expect(AstroLib.DmsToDeg("  -16   42     58.0171")).toBe(-111111);
    expect(AstroLib.DmsToDeg("  -16 42 58.01.71  ")).toBe(-111111);
    expect(AstroLib.DmsToDeg("N0T $ P4TT3RN")).toBe(-111111);
    expect(AstroLib.DmsToDeg("  -16   42 ")).toBe(-111111);
});

//ConvertDegToRad
test("Degree to Radians; pos(1); edge(4); neg(2)", () => {
    vvf(AstroLib.DegToRad(35.0), 0.6108651999993964);

    expect(AstroLib.DegToRad(360.0)).toBeCloseTo(6.283185307178);
    expect(AstroLib.DegToRad(-90.0)).toBeCloseTo(-1.570796);
    expect(AstroLib.DegToRad(361.0)).toBeCloseTo(-111111);
    expect(AstroLib.DegToRad(-91.0)).toBeCloseTo(-111111);


    expect(AstroLib.RadToDeg(10)).toBe(-111111);
    expect(AstroLib.RadToDeg(-2)).toBe(-111111);
});

test("Radians to Degrees; pos(3); edge(2); neg(1)",()=> {
    vvf(AstroLib.RadToDeg(0.610865), 35.0);
    vvf(AstroLib.RadToDeg(1.39626340159546), 80.0);
    vvf(AstroLib.RadToDeg(2.49582), 143.0);

    expect(AstroLib.RadToDeg(6.283185307178)).toBeCloseTo(360.0);
    expect(AstroLib.RadToDeg(-1.570796)).toBeCloseTo(-90.0);

    expect(AstroLib.RadToDeg(1000)).toBe(-111111);
});

test("Degree to HourMinSec; pos(2)", () => {
    vv_ms(AstroLib.DegToHms(141.0079023718000), "+9 24 1.8965692320", "DEG to HMS 1");
    vv_ms(AstroLib.DegToHms(221.7409285236400), "+14 46 57.8228456736", "DEG to HMS 2");
});

test("Degree to DegreeMinSec; pos(2)", () => {
    vv_ms(AstroLib.DegToDms(+89.26410897), "+89 15 50.79229", "DEG to DMS 1");
    vv_ms(AstroLib.DegToDms(-60.8656960707900), "-60 51 56.50585", "DEG to DMS 2");
    vv_ms(AstroLib.DegToDms(45.0), "45 00 0.0", "DEG to DMS 2");
});

test("Radian to HourMinSec; pos(2)", () => {
    vv_ms(AstroLib.RadToHms(2.461052167719), "+9 24 1.8965692320", "RAD to HMS 1");
    vv_ms(AstroLib.RadToHms(3.8701092891669), "+14 46 57.8228456736", "RAD to HMS 2");
});



test("Radian to DegreeMinSec; pos(2)", () => {
    vv_ms(AstroLib.RadToDms(1.557952605), "+89 15 50.79229", "RAD to DMS 1");
    vv_ms(AstroLib.RadToDms(-1.062306797953), "-60 51 56.50585", "RAD to DMS 2");
});

test("HMS Round trips", () => {
    let testVals = ["23 59 49.2197", "11 48 18.2283623", "00 01 1.8965692320"]
    for(let i = 0; i < testVals.length; ++i)
    {
        vv_ms(AstroLib.DegToHms(AstroLib.HmsToDeg(testVals[i])),testVals[i], "DEG to HMS " + i);
    }
});

test("DMS Round trips", () => {
    let testVals = ["-89 01 01.2197234", "0 01 18.2283623", "89 59 1.8965692320"];
    for(let i = 0; i < testVals.length; ++i)
    {
        vv_ms(AstroLib.DegToDms(DmsToDeg(testVals[i])),testVals[i], "DEG to DMS " + i);
    }
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
