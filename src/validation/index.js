export function validateField(value, field, rules) {
  const fieldPath = field.split('.');
  const fieldName = fieldPath[fieldPath.length -1];

  const validationErrors = [];
  Object.keys(rules).forEach(f => {
    if(rules[f] && !rules[f].test(value)) {
      validationErrors.push({msg: `${fieldName} ${rules[f]['message']}`, id: `${field}.${f}`});
    }
  });

  return validationErrors;
};

export function validateBranch(branch, ruleset, path = '', isArray = false) {
  const validationErrors = {};

  if(isArray) {
    const ids = Object.keys(branch);
    for(let i = 0; i < ids.length; i++) {
      const id = ids[i];
      
      Object.keys(ruleset).forEach(validatorName => {
        const fieldValidation = validateField(branch[id][validatorName], validatorName, ruleset[validatorName]);
        if(fieldValidation.length > 0){
          if(!Object.keys(validationErrors).includes(`${path}.${id}.${validatorName}`)){
            validationErrors[`${path}.${id}.${validatorName}`] = [];
          }
          fieldValidation.forEach(v => validationErrors[`${path}.${id}.${validatorName}`].push(v));          
        }
      });
    }
    return validationErrors;
  } else {
    const rulenames = Object.keys(ruleset);
    for(let i = 0; i < rulenames.length; i++){
      const rulename = rulenames[i];
      const validator = ruleset[rulenames[i]];

      if(Array.isArray(validator)){
        const result = validateBranch(
          branch[rulename],
          validator[0], 
          `${path !== '' ? `${path}.` : ''}${rulename}`,
          true
        );

        Object.assign(validationErrors, {
          ...validationErrors,
          ...result
        })
      }
    }
    return validationErrors;
  }

}

export default {
  validateField,
  validateBranch
}