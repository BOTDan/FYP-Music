import dotenv from 'dotenv';

dotenv.config();

// Stores a list of missing env variables
const missingVariables: string[] = [];

/**
 * Chekcs and gets a variable from the environment.
 * Adds it to missingVariables if it's undefined
 * @param variable The name of the environment variable
 * @returns The value if exists, otherwise empty string
 */
function checkSet(variable: string): string {
  const variableUpper = variable.toUpperCase();
  if (process.env[variableUpper] !== undefined) {
    return process.env[variableUpper] as string;
  }
  // The variable is unset
  if (!missingVariables.includes(variableUpper)) {
    missingVariables.push(variableUpper);
  }
  return '';
}

/**
 * Outputs a warning to console about missing environment variables.
 * Doesn't output if no environment variables are missing.
 */
export function outputConfigWarnings(): void {
  if (missingVariables.length === 0) { return; }
  let text = '⚠ The following environment variables are unset:\n';
  text += missingVariables.reduce((acc, name) => `${acc}\t${name}\n`, '');
  text += 'Some functionality may not work without these being set.';
  console.error(text);
}

/**
 * Config/environment variables
 */
export const config = {
  PORT: checkSet('PORT'),
};

export default config;
