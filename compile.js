import { RJSFSchema, RegistryWidgetsType } from "@rjsf/utils";
const { compileSchemaValidators } = require('@rjsf/validator-ajv8');
const schema = require("src/configSchema.json");
const options = {
    ajvOptionsOverrides: {
    $data: true,
    verbose: true,
  },
  ajvFormatOptions: {
    mode: 'fast',
  },
};

compileSchemaValidators(schema, '/Users/magaton/validation.js', options);