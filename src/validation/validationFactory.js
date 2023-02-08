import _forms from '/src/validation/form-validations.json' assert {type: 'json'};
import _rules from '/src/validation/validation-rules.json' assert {type: 'json'};

import {validationTypes} from '/src/validation/validationTypes';

function parseValidatorBranch(branch) {
  const formField = Object.keys(branch).reduce( (acc, formField) => {      
    if(Array.isArray(branch[formField])) {
      const validator = validationTypes[branch[formField][0]];
      acc[formField] = [parseValidatorBranch(validator)];  
    } else {
      acc[formField] = parseField(formField, branch[formField]);
    }

    return acc;
  }, {} );
  return formField;
};

const parseField = (key, fieldValidations) => {
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

export const parseValidators = () => {
  const validators = Object.keys(_forms).reduce((acc, key) => {
    const form = _forms[key];

    acc[key] = parseValidatorBranch(form);
    return acc;
  },{});

  return validators;
}

export default {
  parseValidators
}