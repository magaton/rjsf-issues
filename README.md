# rjsf-issues
Issues faced while using rjsf

1. compileSchemaValidators is not a function
TypeError: compileSchemaValidators is not a function
    at ./src/components/DynamicFormComponent.tsx 

2. After I changed import to:

import { compileSchemaValidatorsCode } from '@rjsf/validator-ajv8/lib/compileSchemaValidators';

I am getting:
Module not found: Error: Can't resolve 'fs' in '/Users/magaton/Projects/rjsf-issues/node_modules/@rjsf/validator-ajv8/lib'
