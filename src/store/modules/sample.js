import { axios, securePost } from "@/axios.js";

export const makeNewSample = () => ({
  tag: "",
  description: "",
});

export default {
  namespaced: true,
  state: () => ({
    formData: {},
    fileBuffer: {},
  }),
  getters: {
    fileName({ fileBuffer: { name = "" } }) {
      return name;
    },
  },
  actions: {
    uploadBuffer({ state: { fileBuffer }, dispatch }, sampleData) {
      try {
        let fd = new FormData();
        fd.append("file", fileBuffer);
        fd.append("data", JSON.stringify(sampleData));

        return securePost(axios, fd, { slug: "secure/upload_sample" });
      } catch (e) {
        console.error(e);
      } finally {
        dispatch("setFileBuffer", {});
      }
    },
    setFileBuffer({ commit }, fileBuffer) {
      commit("assignObject", { key: "fileBuffer", value: fileBuffer });
    },
  },
};
