export const Login_Schema = {
  type: "object",
  
  // Extra/Unwanted properties allow nahi hongi (Strict Check)
  additionalProperties: false, 

  // Mandatory fields jo response me HONI HI CHAHIYE
  required: ["token"],

  properties: {
    token: {
      type: "string",

      // 1. Minimum aur Maximum length restrictions
      minLength: 1,      // Token empty string ("") nahi ho sakta
      maxLength: 128,    // Token unusual large nahi ho sakta

      // 2. Format / Pattern Check (Alphanumeric only - Alpha-numeric chars/hexadecimal check)
      pattern: "^[a-zA-Z0-9]+$", 

      // 3. Null values reject karega
      nullable: false
    }
  }
};