import {TSOFA} from "@republicof1/tsofa";
import { constrainedMemory } from "process";

// not sure what the best library structure is https://www.typescriptlang.org/docs/handbook/declaration-files/library-structures.html

//declare namespace AstroLib {

//get access to TSOFA

//wrapper to convert between formats -- Arctime to Rad to Deg

//parse arctime
//parse deg
//parse rad

//epoch and Julian time




//}

export function parseDMS(entry: string):number
{
    //DMS Degrees, Minutes, Seconds
    return parse_MS(entry, "Dec");
}

export function parseHMS(entry: string):number
{
    //HMS Hours, Minutes, Seconds
    return parse_MS(entry, "RA");
}

//internal multi-function for RA & Dec
function parse_MS(entry: string, mode: string):number
{
    let out: number;
    let conforms: boolean = false;
    let negative: boolean = false;
    const regexp: RegExp = new RegExp("(\\d{1,2})\\D(\\d{1,2})\\D(\\d{1,2}(\\.\\d+)?)");
    
    //first filter to ensure input is at least in the ball park of sensible
    conforms = regexp.test(entry);
    if(conforms)
    {
        entry = entry.trim();

        //split on all non digits
        let values: string[] = entry.split(/\D/);

        //handle negative symbol
        //in the case of RA we elimitate it, for Dec we apply it
        if(entry[0] == '-')
        {
            values = values.slice(1, values.length);
            negative = true;
            console.log("negative entry");
        }
        
        //if we have 4 components at this stage, handle decimal
        if(values.length == 4)
        {
            const decimal = values[3];
            values = values.slice(0,3);
            values[2] += "." + decimal;
            console.log(values);
        }

        //filter for expected component number
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
            return out;
        }
    }
    console.log("non-conformant pattern found");
    return -1;
}

//this is the terminus brace for namespace if used
//}