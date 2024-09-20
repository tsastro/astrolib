
import { constrainedMemory, loadEnvFile } from "process";
import {TSOFA} from "@republicof1/tsofa";

// not sure what the best library structure is https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html

const RAD_MIN = -1.57952297307;
const RAD_MAX = 6.291911955;
const DEG_MIN = -90.5;
const DEG_MAX = 360.5;
const CONV_PRECISION_RD = 10;
const CONV_PRECISION_SE = 6;

//deg in
export function DegToDms(value: number):string 
{
    return ConvertToDMS(ConvertDegToRad(value, CONV_PRECISION_RD), CONV_PRECISION_SE);
}
export function DegToHms(value: number):string 
{
    return ConvertToHMS(ConvertDegToRad(value, CONV_PRECISION_RD), CONV_PRECISION_SE);
}
export function DegToRad(value: number):number 
{
    return ConvertDegToRad(value, CONV_PRECISION_RD);
}

//sexegesemal in
export function DmsToDeg(value: string):number
{
    //DMS Degrees, Minutes, Seconds
    return XXmsToDeg(value, "Dec");
}

export function DmsToRad(value: string):number 
{
    const deg = XXmsToDeg(value, "Dec");
    if(deg == -111111)
    {
        return deg;    
    }
    return ConvertDegToRad(deg, CONV_PRECISION_RD);
}

export function HmsToDeg(value: string):number
{
    //HMS Hours, Minutes, Seconds
    return XXmsToDeg(value, "RA");
}

export function HmsToRad(value: string):number 
{
    const deg = XXmsToDeg(value, "RA");
    if(deg == -111111)
    {
        return deg;    
    }
    return ConvertDegToRad(deg, CONV_PRECISION_RD);
}
//low priority 
export function RadToDms(value: number):string {
    return ConvertToDMS(value, CONV_PRECISION_SE);
}

//low priority 
export function RadToHms(value: number):string {
    return ConvertToHMS(value, CONV_PRECISION_SE);
}

//low priority 
export function RadToDeg(value: number):number 
{    
    return ConvertRadToDeg(value, CONV_PRECISION_RD);
}


//////////////////////////////////////////////////////////////////////////
//  Internal Functions
//////////////////////////////////////////////////////////////////////////

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  This does the heavy lifting of conversion from 
//  Sexegesimal (RA & Dec) to decimal form
//
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
            }
            else if(mode == "Dec")
            {
                if(negative)
                {
                    out *= -1;
                }
            }
            //("gamma: " + out);
            return out;
        }
    }
    //console.log("non-conformant pattern found");
    return -111111;
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  Wrapper for Deg >> Rad with precision modifier
//
function ConvertDegToRad(value: number, precision: number):number
{
    if(value < DEG_MIN || value > DEG_MAX){
        return -111111;
    }
    const pm = PrecMod(precision);
    let retval = value * TSOFA.DD2R_$LI$();
    retval = Math.round((retval + Number.EPSILON)* pm); 
    retval /= pm;
    return retval;
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
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  Wrapper for Rad >> Deg with precision modifier
//
function ConvertRadToDeg(value: number, precision: number):number
{
    if(value < RAD_MIN || value > RAD_MAX){
        return -111111;
    }
    const pm = PrecMod(precision);
    let retval = value * TSOFA.DR2D_$LI$();
    retval = Math.round((retval + Number.EPSILON)* pm); 
    retval /= pm;
    return retval;
}


function ConvertToDMS(angleRad: number, decimalPrecision: number): string
{
    let idmsf: number[] = new Array(4);
    const sign: string = TSOFA.jauA2af(decimalPrecision, angleRad, idmsf);

    let formated: string = sign + idmsf[0]+" "+idmsf[1]+" "+idmsf[2]+"."+idmsf[3];
    
    return formated;
}

function ConvertToHMS(angleRad: number, decimalPrecision: number): string
{
    let idmsf: number[] = new Array(4);
    const sign: string = TSOFA.jauA2tf(decimalPrecision, angleRad, idmsf);

    let formated: string = sign + idmsf[0]+" "+idmsf[1]+" "+idmsf[2]+"."+idmsf[3];
    
    return formated;
}