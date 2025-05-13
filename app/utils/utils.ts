export const roundToNearest25 = (inputValue: number): number => {
    // Round the input value to the nearest integer
    let value = Math.round(inputValue);

    // Calculate the remainder when divided by 25
    const remainder = value % 25;

    if (remainder === 0) {
        // Already a multiple of 25
        return value;
    } else if (remainder < 13) {
        // Round down
        return value - remainder;
    } else {
        // Round up
        return value + (25 - remainder);
    }
}

export const isEven = (inputValue: number) : boolean => {
    return inputValue % 2 === 0;
}

export const replacevariables = (
    template: string,
    strStartupGCode: string,
    strEndMainWrap: string,
    strEndComWrap: string,
    strPatternName: string,
): string => {
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

export const isEmpty = (input: string): boolean => {
    return input === undefined || input === null || input.trim() === '';
};

export const isNumeric = (input: string): boolean => {
    // This regex pattern accepts:
    // - Whole numbers
    // - Decimal numbers
    // - No negative numbers
    // - Prevents multiple dots
    return /^\d*\.?\d+$/.test(input);
}

export const hasEmptyInputs = (inputs: string[]): boolean => {
    return inputs.some(element => !isNumeric(element));
};

export const getFileName = (uri: string): string => {
    // Remove query parameters if any
    const cleanUri = uri.split('?')[0];

    // Get the last part after the last slash
    const fileName = cleanUri.split('/').pop();

    // Decode URI components if needed
    return fileName ? decodeURIComponent(fileName) : '';
}

export const getFileExtension = (filename: string): string => {
  // Handle empty or invalid filenames
  if (!filename) return '';
  
  // Split by dots and get the last part
  const parts = filename.split('.');
  
  // If no dots or only one character after dot, return empty
  if (parts.length <= 1) return '';
  
  // Return the last part as extension
  return parts[parts.length - 1].toLowerCase();
};
