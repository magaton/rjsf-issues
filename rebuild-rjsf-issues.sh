#!/bin/bash
rm -rf ../rjsf-issues/node_modules/.cache 
rm -rf ../rjsf-issues/node_modules/@rjsf/core/dist 
rm -rf ../rjsf-issues/node_modules/@rjsf/core/lib 
rm -rf ../rjsf-issues/node_modules/@rjsf/core/src
rm -rf ../rjsf-issues/node_modules/@rjsf/utils/dist
rm -rf ../rjsf-issues/node_modules/@rjsf/utils/lib  
rm -rf ../rjsf-issues/node_modules/@rjsf/utils/src
rm -rf ../rjsf-issues/node_modules/@rjsf/mui/dist 
rm -rf ../rjsf-issues/node_modules/@rjsf/mui/lib 
rm -rf ../rjsf-issues/node_modules/@rjsf/mui/src
rm -rf ../rjsf-issues/node_modules/@rjsf/validator-ajv8/dist 
rm -rf ../rjsf-issues/node_modules/@rjsf/validator-ajv8/lib 
rm -rf ../rjsf-issues/node_modules/@rjsf/validator-ajv8/src

echo "cleaned up node_modules"

npm run build

echo "build completed"

cp -Rf packages/core/dist ../rjsf-issues/node_modules/@rjsf/core 
cp -Rf packages/core/lib ../rjsf-issues/node_modules/@rjsf/core
cp -Rf packages/core/src ../rjsf-issues/node_modules/@rjsf/core 
cp -Rf packages/utils/dist ../rjsf-issues/node_modules/@rjsf/utils 
cp -Rf packages/utils/lib ../rjsf-issues/node_modules/@rjsf/utils
cp -Rf packages/utils/src ../rjsf-issues/node_modules/@rjsf/utils 
cp -Rf packages/mui/dist ../rjsf-issues/node_modules/@rjsf/mui 
cp -Rf packages/mui/lib ../rjsf-issues/node_modules/@rjsf/mui
cp -Rf packages/mui/src ../rjsf-issues/node_modules/@rjsf/mui 
cp -Rf packages/validator-ajv8/dist ../rjsf-issues/node_modules/@rjsf/validator-ajv8 
cp -Rf packages/validator-ajv8/lib ../rjsf-issues/node_modules/@rjsf/validator-ajv8
cp -Rf packages/validator-ajv8/src ../rjsf-issues/node_modules/@rjsf/validator-ajv8 

echo "libraries copied"