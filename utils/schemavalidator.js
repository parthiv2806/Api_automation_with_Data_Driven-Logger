import Ajv from "ajv";
const ajv = new Ajv();

export async function Validateschema(schema, response) {
  const validate = ajv.compile(schema);
  const valid = validate(response);
  if (!valid) {
    throw new Error(
      `Schema validation failed: ${JSON.stringify(validate.errors)}`,
    );
  }

  return true;
}
