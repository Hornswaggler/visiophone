import _rules from '/src/validation/validation-rules.json' assert {type: 'json'};

import {validationTypes} from '/src/validation/validationTypes';

export function parseValidators(validatorDefinitions){
  const validators = Object.keys(validatorDefinitions).reduce((acc, key) => {
    const form = validatorDefinitions[key];

    acc[key] = parseValidatorBranch(form);
    return acc;
  },{});

  return validators;
}

function parseValidatorBranch(branch) {

  var validations;
  if(Object.keys(branch).includes("type")) {
    validations = parseValidatorBranch(validationTypes[branch["type"]]);
  } else {
    validations = Object.keys(branch).reduce( (acc, formField) => { 
      var type = branch[formField]["type"] || "";
      var isArray = type.includes("[]");
  
  
      if(isArray) {
        var arrayType = type.substring(0, type.indexOf("[]"));
        const validator = validationTypes[arrayType];
        acc[formField] = [parseValidatorBranch(validator)];  
      } else {
        acc[formField] = parseField(formField, branch[formField]);
      }
  
      return acc;
    }, {} );
  }

  return validations;
};

function parseField(key, fieldValidations){
  const fieldValidator = Object.keys(fieldValidations).reduce((acc, validationKey) => {
    let message = _rules[validationKey]['message'];
    const matches =  message.match(/^.*({[\d]+}).*$/);
    if(matches != null && matches.length > 1){
      for(let i = 1; i < matches.length; i++){
        message = message.replace(matches[i], fieldValidations[validationKey]);
      }
    }

    acc[validationKey] = {
      message
    };

    switch(validationKey) {
      case 'required':
        acc[validationKey]['test'] = value => {
          const regex = new RegExp(_rules[validationKey]['pattern']);
          return regex.test(value);
        };
        break;
      case 'max-length':
        acc[validationKey]['test'] = value => (value || '').length <= fieldValidations[validationKey]
        break;
      case 'gt':
        acc[validationKey]['test'] = value => {
          let result = false;
          try {
            result = parseFloat(value) > fieldValidations[validationKey];
          } catch (e) {
            console.error(e);
          }
          return result;
        };
        break;
      case 'gte':
        acc[validationKey]['test'] = value => {
          let result = false;
          try {
            result = parseFloat(value) >= fieldValidations[validationKey];
          } catch (e) {
            console.error(e);
          }
          return result;
        };
        break;
      case 'lte':
        acc[validationKey]['test'] = value => {
          let result = false;
          try {
            result = parseFloat(value) <= fieldValidations[validationKey];
          } catch (e) {
            console.error(e);
          }
          return result;
        }
    }
    return acc;
  }, {});

  return fieldValidator;
};

export default {
  parseValidators
}