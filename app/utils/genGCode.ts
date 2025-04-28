import * as utils from './utils';

export const genMainGCode = (
    numMeasSize: number,
    numDiameter: number,
    numCirc: number,
    numTotalKick: number,
    numYaixs: number,
    numKickRatio: number,    
    
    numFeedRate: number,
    numOverWrap: number,
    numPerLayer: number,
    numTotalLayers: number,

    isBurnishEnable: boolean,
    numBurnishPcg: number,
    numBurRampSteps: number,
    numBurStartSpeed: number,
    numBurFinalSpeed: number,

    isPumpEnabled: boolean,
    strPumpOnCode: string,
    strPumpOffCode: string,
    numCycPerShell: number,
    numDuration: number,

    strStartupGCode: string,
    strEndMainWrap: string,
    strEndComWrap: string,

    strPatternName: string,
) : {
    entireGCode: string,
    estTapeFeet: number,
} => {

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Generate Main G-Code /////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////


 /*   const numMeasSize = parseFloat(measSize);
    const numDiameter = parseFloat(diameter) / 100;
    const numCirc = parseFloat(circ);
  
    const numTotalKick = parseFloat(totalKick) / 100;
    const numKickRatio = parseFloat(kickRatio) / 100;
  
    const numOverWrap = parseFloat(overwrap) / 100;
    const numPerLayer = parseInt(perLayer, 10);
    const numTotalLayers = parseInt(totalLayers, 10);
  
    const numYaixs = parseFloat(yaixs); // Adjust if division by 100 is needed
  */
    // Calculate initial values
    const numXOffSet = numMeasSize * Math.PI * numDiameter * numTotalKick;
    const numXAxisCircle = (numMeasSize * Math.PI * numDiameter) - numXOffSet;
    const numYAxisCircle = numXAxisCircle * numYaixs;
    const numYOffset = numXOffSet * numKickRatio;
  
    let layerCounter = 0;
    let wrapCounter = 1;
    let rowCounter = 0;
  
    let wrapXAxisTravel: number, wrapYAxisTravel: number, kickXAxisTravel: number, kickYAxisTravel: number;
    const mainWrapGCode: string[] = new Array((numTotalLayers + 1) * numPerLayer * 2);
  
    wrapXAxisTravel = numXAxisCircle + numCirc;
    wrapYAxisTravel = numYAxisCircle + numCirc;
  
    let estTapeFeet: number = 0;
  
    while (layerCounter <= numTotalLayers) {
      while (wrapCounter <= numPerLayer) {
        estTapeFeet = ((wrapXAxisTravel + wrapYAxisTravel) / 2) / 12;
        mainWrapGCode[rowCounter] = `X${wrapXAxisTravel.toFixed(3)}Y${wrapYAxisTravel.toFixed(3)}`;
  
        const varA = numXAxisCircle + numCirc;
        const varB = numYAxisCircle + numCirc;
  
        rowCounter++;
  
        if (wrapCounter === numPerLayer) {
          kickXAxisTravel = wrapXAxisTravel + numXOffSet + numMeasSize * numOverWrap;
          kickYAxisTravel = wrapYAxisTravel + numYOffset + numMeasSize * numOverWrap;
  
          estTapeFeet = ((kickXAxisTravel + kickYAxisTravel) / 2) / 12;
        } else {
          kickXAxisTravel = wrapXAxisTravel + numXOffSet;
          kickYAxisTravel = wrapYAxisTravel + numYOffset;
  
          estTapeFeet = ((kickXAxisTravel + kickYAxisTravel) / 2) / 12;
        }
  
        mainWrapGCode[rowCounter] = `X${kickXAxisTravel.toFixed(3)}Y${kickYAxisTravel.toFixed(3)}`;
  
        const newVarA = varA + numCirc;
        const newVarB = varB + numCirc;
  
        wrapXAxisTravel = kickXAxisTravel + newVarA + numCirc;
        wrapYAxisTravel = kickYAxisTravel + newVarA + numCirc;
  
        rowCounter++;
        wrapCounter++;
      }
      wrapCounter = 1;
      layerCounter++;
    }

 //   return mainWrapGCode;


    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Generate Pump Code ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    const pumpCode: string[] = new Array(mainWrapGCode.length).fill(""); // Initialize array with empty strings

    if (isPumpEnabled) { // Check if the pumpCode state is enabled

        if (pumpCode.length > numCycPerShell * numDuration) {
            const startPos = Math.floor(pumpCode.length / numCycPerShell); // Calculate start position

            for (let i = 0; i * startPos + numDuration - 1 < pumpCode.length; i++) {
                pumpCode[i * startPos] = strPumpOnCode; // Set pumpCode on code
                pumpCode[i * startPos + numDuration - 1] = strPumpOffCode; // Set pumpCode off code
            }
        } else {
            for (let i = 0; i < pumpCode.length; i += numDuration) {
                pumpCode[i] = strPumpOnCode; // Set pumpCode on code
                if (i + numDuration - 1 >= pumpCode.length) {
                    pumpCode[pumpCode.length - 1] = strPumpOffCode; // Set pumpCode off code at the last position
                } else {
                    pumpCode[i + numDuration - 1] = strPumpOffCode; // Set pumpCode off code
                }
            }
        }
    }

//    return pumpCode;


    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Replace the %variable% in the G-Code /////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////



    const replaceVariables = (template: string): string => {
        // Regular expression to find all %Variable% patterns
        const regex = /%([^\s%]+)%/g;

        // Dictionary of variables and their corresponding values
        const variables: { [key: string]: string } = {};

        // Populate the dictionary with variable-value mappings
        variables["Startup_GCode"] = strStartupGCode;
        variables["startup_gcode"] = strStartupGCode;
        variables["Startup_Gcode"] = strStartupGCode;
        variables["Startup_GCODE"] = strStartupGCode;
        variables["Startup_gcode"] = strStartupGCode;
        variables["startup_GCode"] = strStartupGCode;
        variables["startup_Gcode"] = strStartupGCode;

        /*
        variables["Pattern_Name"] = openedFilePath ? Path.basename(openedFilePath) : StrPatternName.value;
        variables["pattern_name"] = openedFilePath ? Path.basename(openedFilePath) : StrPatternName.value;
        variables["Pattern_name"] = openedFilePath ? Path.basename(openedFilePath) : StrPatternName.value;
        variables["pattern_Name"] = openedFilePath ? Path.basename(openedFilePath) : StrPatternName.value;
        */
        variables["Pattern_Name"] = strPatternName;

        variables["End_of_Main_Wrap"] = strEndMainWrap;
        variables["end_of_main_wrap"] = strEndMainWrap;
        variables["End_Of_Main_Wrap"] = strEndMainWrap;

        variables["End_of_Complete_Wrap"] = strEndComWrap;
        variables["End_Of_Complete_Wrap"] = strEndComWrap;
        variables["end_of_complete_wrap"] = strEndComWrap;

        // Replace each match with its corresponding value
        return template.replace(regex, (match, variableName) => {
            // Check if the variable exists in the dictionary
            if (variables.hasOwnProperty(variableName)) {
                return variables[variableName];
            }

            // If the variable doesn't exist, leave it as is
            return match;
        });
    }




    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Generate Entire G-Code ///////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////



    // Initialize an empty string for GCode output
    let gcodeOutput = "";

    // Add Startup GCode
    gcodeOutput += replaceVariables(strStartupGCode) + "\n";

    // Add Main part of GCode
    const feedRate = "F" + numFeedRate;
    for (let i = 0; i < mainWrapGCode.length; i++) {
        let line = mainWrapGCode[i];

        // Only add feed rate to the first line
        if (i === 0) {
            line += `  ${feedRate} `;
        } else {
            line += "  ";
        }

        line += pumpCode[i];
        gcodeOutput += line + "\n";
    }

    // Add End of Main Wrap
    gcodeOutput += replaceVariables(strEndMainWrap) + "\n";

    // Add Burnish Selection
    gcodeOutput += "\\Burnish Selection\n";

    // Calculate burnish layer percentage once
    // const burLayerPcg = parseFloat(numBurnishPcg) / 100;
    const burnishLayerCount = Math.floor(mainWrapGCode.length * numBurnishPcg);
console.log(numBurnishPcg, burnishLayerCount);
    // const hasBurnishParams =
    //     NumBurStartSpeed.trim() !== "" &&
    //     NumBurFinalSpeed.value.trim() !== "" &&
    //     NumBurRampSteps.value.trim() !== "";

    if (!isBurnishEnable) {
        // Simple burnish without speed ramping
        for (let i = 0; i < burnishLayerCount; i++) {
            gcodeOutput += mainWrapGCode[i] + "\n";
        }
    } else {
        // Burnish with speed ramping
        // const startSpeed = parseInt(NumBurStartSpeed.value, 10);
        // const finalSpeed = parseInt(NumBurFinalSpeed.value, 10);
        // const rampStep = parseInt(NumBurRampSteps.value, 10);
        const burnishSpeed = genBurnishSpeed(numBurStartSpeed, numBurFinalSpeed, numBurRampSteps);

        for (let i = 0; i < burnishLayerCount; i++) {
            if (utils.isEven(i) && i < burnishSpeed.length * 2) {
                gcodeOutput += `${mainWrapGCode[i]}  F${burnishSpeed[Math.floor(i / 2)]}\n`;
            } else {
                gcodeOutput += mainWrapGCode[i] + "\n";
            }
        }
    }

    // Add End of Completed Wrap
    gcodeOutput += replaceVariables(strEndComWrap);

    // // Set the final output text at once
    // TxtGcodeOutput.textContent = gcodeOutput;

    // // Update estimated feet display
    // NumTotalEstFeet.textContent = Math.round(EstTapeFeet * 100) / 100;

    return {
        entireGCode: gcodeOutput,
        estTapeFeet: estTapeFeet,
    }
}




const genBurnishSpeed = (startSpeed: number, finalSpeed: number, rampSteps: number) : number[] => {
    try {
        // Calculate the ramp speed increment
        const dblRampSpeed = (finalSpeed - startSpeed) / (rampSteps - 1);
        const rampSpeed = utils.roundToNearest25(dblRampSpeed);

        // Initialize the burnish speed array
        const burnishSpeed: number[] = new Array(rampSteps);

        // Set the first value to the start speed
        burnishSpeed[0] = startSpeed;

        for (let i = 1; i < rampSteps; i++) {
            if (i === 1) {
                // Special case for the second step
                if (finalSpeed - startSpeed >= 25) {
                    burnishSpeed[1] = utils.roundToNearest25(burnishSpeed[0] + 13 + rampSpeed);
                } else {
                    burnishSpeed[1] = startSpeed;
                }
            } else {
                // General case for other steps
                burnishSpeed[i] = burnishSpeed[i - 1] + rampSpeed;

                // Ensure the speed does not exceed the final speed
                if (burnishSpeed[i] > finalSpeed) {
                    burnishSpeed[i] = finalSpeed;
                }
            }

            // Ensure the last value is exactly the final speed
            if (i === rampSteps - 1) {
                burnishSpeed[i] = finalSpeed;
            }
        }

        return burnishSpeed;
    } catch {
        // Return a fallback array in case of an error
        return [startSpeed, finalSpeed];
    }
}


/*
function GetPumpCode(codeLength: number): string[] {
    const pump: string[] = new Array(codeLength).fill(""); // Initialize array with empty strings

    if (pumpState.checked) { // Check if the pump state is enabled
        const pumpOnCode = StrPumpOnCode.value; // Get the pump on code
        const pumpOffCode = StrPumpOffCode.value; // Get the pump off code
        const cycPerShell = parseInt(NumCyclesPerShell.value, 10); // Parse cycles per shell
        const duration = parseInt(NumDuration.value, 10); // Parse duration

        if (pump.length > cycPerShell * duration) {
            const startPos = Math.floor(pump.length / cycPerShell); // Calculate start position

            for (let i = 0; i * startPos + duration - 1 < pump.length; i++) {
                pump[i * startPos] = pumpOnCode; // Set pump on code
                pump[i * startPos + duration - 1] = pumpOffCode; // Set pump off code
            }
        } else {
            for (let i = 0; i < pump.length; i += duration) {
                pump[i] = pumpOnCode; // Set pump on code
                if (i + duration - 1 >= pump.length) {
                    pump[pump.length - 1] = pumpOffCode; // Set pump off code at the last position
                } else {
                    pump[i + duration - 1] = pumpOffCode; // Set pump off code
                }
            }
        }
    }

    return pump;
}




/*
export const genCompletedGCode = () : string => {






    TxtGcodeOutput.textContent = "";

const GCode = Generate_GCode(outEstTapeFeet);
if (!ValidatePumpCodeParameter()) {
    alert("Please ensure all Pump Parameters are entered before proceeding.");
    return;
}

const pumpCode = GetPumpCode(GCode.length);

// Use an array to store GCode lines instead of StringBuilder
const gcodeLines: string[] = [];

// Add Startup GCode
gcodeLines.push(ReplaceVariables(TxtStartGcode.value));

// Add Main part of GCode
const feedRate = "F" + numFeedRate;
for (let i = 0; i < GCode.length; i++) {
    let line = GCode[i];

    // Only add feed rate to the first line
    if (i === 0) {
        line += `  ${feedRate} `;
    } else {
        line += "  ";
    }

    line += pumpCode[i];
    gcodeLines.push(line);
}

// Add End of Main Wrap
gcodeLines.push(ReplaceVariables(TxtEndMWrap.value));

// Add Burnish Selection
gcodeLines.push("\\Burnish Selection");

// Calculate burnish layer percentage once
const burLayerPcg = parseFloat(numBurnishPcg) / 100;
const burnishLayerCount = Math.floor(GCode.length * burLayerPcg);

const hasBurnishParams =
    NumBurStartSpeed.value.trim() !== "" &&
    NumBurFinalSpeed.value.trim() !== "" &&
    NumBurRampSteps.value.trim() !== "";

if (!hasBurnishParams) {
    // Simple burnish without speed ramping
    for (let i = 0; i < burnishLayerCount; i++) {
        gcodeLines.push(GCode[i]);
    }
} else {
    // Burnish with speed ramping
    const startSpeed = parseInt(NumBurStartSpeed.value, 10);
    const finalSpeed = parseInt(NumBurFinalSpeed.value, 10);
    const rampStep = parseInt(NumBurRampSteps.value, 10);
    const burnishSpeed = GenerateBurnishSpeed(startSpeed, finalSpeed, rampStep);

    for (let i = 0; i < burnishLayerCount; i++) {
        if (IsEven(i) && i < burnishSpeed.length * 2) {
            gcodeLines.push(`${GCode[i]}  F${burnishSpeed[Math.floor(i / 2)]}`);
        } else {
            gcodeLines.push(GCode[i]);
        }
    }
}

// Add End of Completed Wrap
gcodeLines.push(ReplaceVariables(TxtEndCWrap.value));

// Set the final output text at once
TxtGcodeOutput.textContent = gcodeLines.join("\n");

// Update estimated feet display
NumTotalEstFeet.textContent = Math.round(outEstTapeFeet * 100) / 100;



}
*/

export default genMainGCode;