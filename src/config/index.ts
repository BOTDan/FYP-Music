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
function checkSet(variable: string, fallback: string = ''): string {
  const variableUpper = variable.toUpperCase();
  if (process.env[variableUpper] !== undefined) {
    return process.env[variableUpper] as string;
  }
  // The variable is unset
  if (!missingVariables.includes(variableUpper)) {
    missingVariables.push(variableUpper);
  }
  return fallback;
}

/**
 * Outputs a warning to console about missing environment variables.
 * Doesn't output if no environment variables are missing.
 */
export function outputConfigWarnings(): void {
  if (missingVariables.length === 0) { return; }
  let text = '⚠ The following environment variables are unset:\n';
  text += missingVariables.reduce((acc, name) => `${acc}\t${name}\n`, '');
  text += 'Default values will be used. This may lead to errors.';
  console.error(text);
}

/**
 * Config/environment variables
 */
export const config = {
  PORT: checkSet('PORT', '8080'),
  // Database variables
  DB_HOST: checkSet('DB_HOST', 'localhost'),
  DB_PORT: checkSet('DB_PORT', '5432'),
  DB_DATABASE: checkSet('DB_DATABASE', 'music'),
  DB_USERNAME: checkSet('DB_USERNAME', 'music'),
  DB_PASSWORD: checkSet('DB_PASSWORD', 'music'),
};

export default config;
