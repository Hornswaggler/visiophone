//TODO: CLean this whole file up... :| :|
export function validateField(value, field, rules) {
  const fieldPath = field.split('.');
  const fieldName = fieldPath[fieldPath.length -1];

  const validationErrors = [];
  Object.keys(rules).forEach(f => {
    if(rules[f] && !rules[f].test(value)) {
      validationErrors.push({
        msg: `${fieldName} ${rules[f]['message']}`, 
        id: `${field}.${f}`});
    }
  });

  return validationErrors;
};

export function validateBranch(branch, ruleset, path = '', errors = {}, isArray = false) {
  const validationErrors = {};

  if(isArray) {
    const ids = Object.keys(branch);
    for(let i = 0; i < ids.length; i++) {
      const id = ids[i];
      
      Object.keys(ruleset).forEach(validatorName => {
        const fieldValidation = validateField(branch[id][validatorName], validatorName, ruleset[validatorName]);
        if(fieldValidation.length > 0){
          if(!Object.keys(errors).includes(`${path}.${id}.${validatorName}`)){
            errors[`${path}.${id}.${validatorName}`] = [];
          }
          fieldValidation.forEach(v => errors[`${path}.${id}.${validatorName}`].push(v));          
        }
      });
    }

    return errors;
  } else {
    const rulenames = Object.keys(ruleset);
    for(let i = 0; i < rulenames.length; i++) {
      const rulename = rulenames[i];
      const validator = ruleset[rulenames[i]];
      const newPath = `${path !== '' ? `${path}.` : ''}${rulename}`;

      if(Array.isArray(validator)){
        const result = validateBranch(
          branch[rulename],
          validator[0],
          newPath,
          errors,
          true
        );

        Object.assign(errors, {
          ...errors,
          ...result
        });
      } else {
        const fieldValidation = validateField(
          branch[rulename], 
          newPath,
          validator
        );

        //TODO: REFACTOR DUPLICATE ABOVE...
        if(fieldValidation.length > 0) {
          if(!Object.keys(errors).includes(newPath)) {
            errors[newPath] = [];
          }

          fieldValidation.forEach(v => errors[newPath].push(v));
        }
      }
    }
    return errors;
  }

}

export default {
  validateField,
  validateBranch
}