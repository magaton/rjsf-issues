# rjsf-issues
Issues faced while using rjsf

- execute `npm install` followed by `npm start`
- app is using locally built `@rjfs/core` and `@rjfs/validator-ajv8` 
- `validator.ts` is changed so it doesn't validate rootSchema on each render
- console logs are added to identify the problem
- Poor performance when using `allOf`, since subschemas in `allOf` are validating multiple times for each render, no matter if the controlling field is changed or not.