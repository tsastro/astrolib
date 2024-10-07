
import { constrainedMemory, loadEnvFile } from "process";
import {TSOFA} from "@tsastro/tsofa";
import { setMaxIdleHTTPParsers } from "http";

// not sure what the best library structure is https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html
//////////////////////////////
/**
* Constants
*/
const CONV_PRECISION_RD = 14;
const CONV_PRECISION_SE = 9;
///////////////////////////////
/**
* Transform position in degrees into degree, arcminute, arcsecond and fraction.
* 
* Returns undefined if an error occurs
*/
export function DegToDms(value: number):string 
{
    const rad = ConvertDegToRad(value, CONV_PRECISION_RD);
    return ConvertToDms(rad, CONV_PRECISION_SE);
}
///////////////////////////////
/**
* Transform position in degrees into hours, minutes, seconds and fraction.
* 
* Returns undefined if an error occurs
*/
export function DegToHms(value: number):string 
{   
    const rad = ConvertDegToRad(value, CONV_PRECISION_RD);
    return ConvertToHms(rad, CONV_PRECISION_SE);
}
///////////////////////////////
/**
* Convert degrees to radians
*/
export function DegToRad(value: number):number 
{
    return ConvertDegToRad(value, CONV_PRECISION_RD);
}
///////////////////////////////
/**
* Transform position in radians into degree, arcminute, arcsecond and fraction.
* 
* Returns undefined if an error occurs
*/
export function RadToDms(value: number):string {
    //console.log("R2DMS - in: " + value);
    return ConvertToDms(value, CONV_PRECISION_SE);
}
///////////////////////////////
/**
* Transform position in radians into hours, minutes, seconds and fraction.
* 
* Returns undefined if an error occurs
*/
export function RadToHms(value: number):string {
    //console.log("R2HMS - in: " + value);
    return ConvertToHms(value, CONV_PRECISION_SE);
}
///////////////////////////////
/** 
* Convert radians to degrees
*/
export function RadToDeg(value: number):number 
{    
    return ConvertRadToDeg(value, CONV_PRECISION_RD);
}
///////////////////////////////
/**
* Transform position in degree, arcminute, arcsecond and fraction into degrees.
* 
* Returns undefined if an error occurs
*/
export function DmsToDeg(value: string):number
{
    //DMS Degrees, Minutes, Seconds
    return XXmsToDeg(value, "Dec");
}
///////////////////////////////
/**
* Transform position in degree, arcminute, arcsecond and fraction into radians
* 
* Returns undefined if an error occurs
*/
export function DmsToRad(value: string):number 
{
    const deg = XXmsToDeg(value, "Dec");
    //if an error has occurred, bail out 
    if(deg == undefined)
    {
        return deg;    
    }
    return ConvertDegToRad(deg, CONV_PRECISION_RD);
}
///////////////////////////////
/**
* Transform position in hours, minutes, seconds and fraction into degrees.
* 
* Returns undefined if an error occurs
*/
export function HmsToDeg(value: string):number
{
    //HMS Hours, Minutes, Seconds
    return XXmsToDeg(value, "RA");
}
///////////////////////////////
/**
* Transform position in hours, minutes, seconds and fraction into radians.
* 
* Returns undefined if an error occurs
*/
export function HmsToRad(value: string):number 
{
    const deg = XXmsToDeg(value, "RA");
    //if an error has occurred, bail out 
    if(deg == undefined)
    {
        return deg;    
    }
    return ConvertDegToRad(deg, CONV_PRECISION_RD);
}

//////////////////////////////////////////////////////////////////////////
//  Internal Functions
//////////////////////////////////////////////////////////////////////////
/**
* >>>>>>>>>>>>>>>>>>>> XXmsToDeg >>>>>>>>>>>>>>>>>>>>>>>>>>
*  This does the heavy lifting of conversion from 
*  Sexegesimal (RA & Dec) to decimal form
*  note: there are no out-of-range checks, if desired the caller 
*  must manage these externally
*/
function XXmsToDeg(value: string, mode: string):number
{
    let out: number;
    let conforms: boolean = false;
    let negative: boolean = false;
    const regexp: RegExp = new RegExp(/(\d{1,2})\D(\d{1,2})\D(\d{1,2}(\.\d+)[sS]*)/);
    
    //first filter to ensure input is at least in the ball park of sensible
    conforms = regexp.test(value);
    if(conforms)
    {
        //handle white space
        value = value.trim();
        //handle trailing 'S' or 's'
        value = value.replace(/[sS]/, '');

        //split on all non digits
        let values: string[] = value.split(/\D/);
        //handle negative symbol
        //in the case of RA we elimitate it, for Dec we apply it
        if(value[0] == '-' || value[0] == '+')
        {
            values = values.slice(1, values.length);
            if(value[0] == '-')
            {
                negative = true;
                //console.log("negative value");
            }
        }
        //if we have 4 components at this stage, handle decimal
        if(values.length == 4)
        {
            const decimal = values[3];
            values = values.slice(0,3);
            values[2] += "." + decimal;
        }
        //process values - by this point we should be returning good data
        if(values.length == 3)
        {
            out = Number.parseInt(values[0]);
            out += Number.parseInt(values[1]) / 60;
            out += Number.parseFloat(values[2]) / 3600.0;
            
            if(mode == "RA")
            {
                
                out *= 15;

                if(negative)
                {
                    console.log("negative RA detected! Resolving to positive value")
                }
            }
            else if(mode == "Dec")
            {
                //if out of range
                if(negative)
                {
                    out *= -1;
                }
            }         
            return out;
        }
    }
    //console.log("non-conformant pattern found");
    return undefined;
}
function PrecMod(degree: number): number
{
    let output = 1;
    for(let i = 0; i < degree; ++i)
    {
        output *= 10;
    }

    return output;
}
/**
* >>>>>>>>>>>>>>>>>>>> ConvertDegToRad >>>>>>>>>>>>>>>>>>>>>>>>>>
*  Wrapper for Deg >> Rad with precision modifier
*/
function ConvertDegToRad(value: number, precision: number):number
{
    const pm = PrecMod(precision);
    let retval = value * TSOFA.DD2R_$LI$();
    retval = Math.round((retval + Number.EPSILON) * pm); 
    retval /= pm;
    return retval;
}
/**
* >>>>>>>>>>>>>>>>>>>> ConvertRadToDeg >>>>>>>>>>>>>>>>>>>>>>>>>>
*  Wrapper for Rad >> Deg with precision modifier
*/
function ConvertRadToDeg(value: number, precision: number):number
{
    const pm = PrecMod(precision);
    let retval = value * TSOFA.DR2D_$LI$();
    retval = Math.round((retval + Number.EPSILON)* pm); 
    retval /= pm;
    return retval;
}

/**
* >>>>>>>>>>>>>>>>>>>> ConvertToDms >>>>>>>>>>>>>>>>>>>>>>>>>>
*  Wrapper for dms calculation and string construction
*/
function ConvertToDms(angleRad: number, decimalPrecision: number): string
{
    return ConvertToXXms(angleRad, decimalPrecision, TSOFA.jauA2af);
}

/**
* >>>>>>>>>>>>>>>>>>>> ConvertToHms >>>>>>>>>>>>>>>>>>>>>>>>>>
*  Wrapper for hms calculation and string construction
*/
function ConvertToHms(angleRad: number, decimalPrecision: number): string
{
    return ConvertToXXms(angleRad, decimalPrecision, TSOFA.jauA2tf);
}

/**
* >>>>>>>>>>>>>>>>>>>> ConvertToXXms >>>>>>>>>>>>>>>>>>>>>>>>>>
*  (*)ms calculation and string construction
*/
function ConvertToXXms(angleRad: number, decimalPrecision: number, fn: Function): string
{
    //int representaiton A2tf output array
    let idmsf = new Array(4);
    //string representation array output
    let sdmsf = new Array(4);
    //get answer components as number array
    const sign: string = fn(decimalPrecision, angleRad, idmsf);
    //convert and pad each component:
    sdmsf[0] = idmsf[0].toString();
    if(sdmsf[0].length == 1)
    {
        sdmsf[0] = "0" + sdmsf[0];
    }
    sdmsf[1] = idmsf[1].toString();
    if(sdmsf[1].length == 1)
    {
        sdmsf[1] = "0" + sdmsf[1];
    }
    sdmsf[2] = idmsf[2].toString();
    if(sdmsf[2].length == 1)
    {
        sdmsf[2] = "0" + sdmsf[2];
    }
    sdmsf[3] = idmsf[3].toString();
    while(sdmsf[3].length != CONV_PRECISION_SE)
    {
        //lhs padding of precision - extant numbers
        sdmsf[3] = "0" + sdmsf[3];
    }
    //compose and return the string
    let formated: string = sign + sdmsf[0]+" "+sdmsf[1]+" "+sdmsf[2]+"."+sdmsf[3];
    return formated;
}