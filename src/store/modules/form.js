import _rules from '/src/validation-rules.json' assert {type: 'json'};
import _forms from '/src/form-validations.json' assert {type: 'json'};
import Vue from 'vue';

export const forms = () => {
  return Object.keys(_forms).reduce((acc, formKey) => {
    const form = _forms[formKey];
    
    const formField = Object.keys(form).reduce( (acc, formField) => {
      const fieldValidations = form[formField];

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
        }

        return acc;
      }, {});
      
      acc[formField] = fieldValidator;
      return acc;
    }, {} );

    acc[formKey] = formField;
    return acc;
  },{});
}

export default {
  namespaced: true,
  state: () => ({
    forms: forms(),
    selectedForm: '',
    model: () => {},
    errors: () => {}
  }),
  getters:{
    currentForm({forms, selectedForm}){
      return selectedForm === '' ? {} : forms[selectedForm];
    }
  },
  actions:{
    initialize({commit}, {formName, model}) {
      commit('selectedForm', formName);
      commit('model', model);
    },
    getForm({state:{forms}}, {formName}) {
      return forms[formName];
    },
    validateField({state:{model, errors}, getters:{currentForm}, commit}, {field}) {
      const validationErrors = [];
      const validator = currentForm[field] || {};
      const value = model[field];

      Object.keys(validator).forEach(f => {
        if(!validator[f].test(value)){
          validationErrors.push({msg: `${field} ${validator[f]['message']}`, id: validationErrors.length});
        }
      });
      const result = {
        ...errors,
      };
      result[field] = validationErrors;
      commit('errors', result);
      return validationErrors.length === 0;
    },

    async validateForm({getters:{currentForm = {}}, dispatch}){
      let isValid = true;
      const keys = Object.keys(currentForm);
      for(let i = 0; i < keys.length; i++){
        const field = keys[i];
        if(!await dispatch('validateField', {field})){
          isValid = false;
        };
      }
      return isValid;
    },

    setField({commit, state:{model}}, {field, value}){
      const result = {
        ...model
      };
      result[field] = value;
      commit('model', result);
    }
  },
  mutations:{
    selectedForm(state, selectedForm){
      state.selectedForm = selectedForm;
    },
    model(state, model){
      Vue.set(state, 'model', model);
    },
    errors(state, errors){
      Vue.set(state, 'errors', errors);
    }
  }
}