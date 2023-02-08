export function validateField(value, field, rules) {
  const fieldPath = field.split('.');
  const fieldName = fieldPath[fieldPath.length -1];

  return Object.keys(rules).reduce((acc, f) => {
    if(rules[f] && !rules[f].test(value)) {
      acc.push({
        msg: `${fieldName} ${rules[f]['message']}`, 
        id: `${field}.${f}`
      });
    }
    return acc;
  }, []);
};

export function validateBranch(branch, ruleset, path = '', errors = {}, isArray = false) {
  if(isArray) {
    const ids = Object.keys(branch);

    for(let i = 0; i < ids.length; i++) {
      const id = ids[i];
      Object.keys(ruleset).forEach(validatorName => {
        const fieldValidation = validateField(branch[id][validatorName], validatorName, ruleset[validatorName]);
        if(Object.keys(fieldValidation).length > 0){
          errors[`${path}.${id}.${validatorName}`] = fieldValidation;
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

        if(Object.keys(fieldValidation).length > 0) {
          errors[newPath] = fieldValidation;
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