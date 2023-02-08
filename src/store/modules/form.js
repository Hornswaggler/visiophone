import Vue from 'vue';
import {parseValidators} from '/src/validation/validationFactory';
import {validateBranch, validateField} from '/src/validation';

export const encodeFormBlob = ({form, key, blob }) => {
  const filename = `${key}${blob.name.slice(blob.name.lastIndexOf('.'))}`;
  form.append(filename, blob);
  return filename;
};

export default {
  namespaced: true,
  state: () => ({
    forms: parseValidators(),
    selectedForm: '',
    errors: []
  }),
  getters:{
    currentForm({forms, selectedForm}) {
      return selectedForm === '' ? {} : forms[selectedForm];
    }
  },
  actions:{
    initialize({commit}, {formName}) {
      commit('selectedForm', formName);
      commit('errors', []);
    },

    validateField({state:{errors}, getters:{currentForm}, commit}, {field, value}) {
      const fieldPath = field.split('.');
      const lastIndex = fieldPath.length - 1;
      const validator = fieldPath.reduce((acc, key, i) => {
        if(Array.isArray(acc[key])) {
          acc = acc[key][0];
          return acc;
        } else if(acc[key] != null){
          acc = acc[key];
        } else if(i === lastIndex) {
          acc = {};
        }
        return acc;
      }, currentForm);

      const validationErrors = validateField(value, field, validator);

      if(!validationErrors[field]){
        validationErrors[field] = []
      }
      
      if(validationErrors.length > 0){
        if(!Object.keys(validationErrors).includes(field)){
          validationErrors[field] = [];
        }
        validationErrors.forEach(v => validationErrors[field].push(v));
      }

      commit('errors', {
        ...errors,
        [field]: validationErrors[field]
      });

      return validationErrors.length === 0;
    },

    async validateForm({getters:{currentForm = {}}, commit}, {formData}) {
      const errors = validateBranch(formData, currentForm);

      commit('errors', errors);
      return Object.keys(errors).length === 0;
    }
  },
  mutations:{
    selectedForm(state, selectedForm) {
      state.selectedForm = selectedForm;
    },
    model(state, model) {
      Vue.set(state, 'model', model);
    },
    errors(state, errors) {
      Vue.set(state, 'errors', errors);
    }
  }
}