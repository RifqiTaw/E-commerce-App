import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options: ToastContainerOptions = {
    autoClose: 3000,
    position: "top-right",
    theme: "light",
    pauseOnHover: true,
    transition: "slide",
  };

  nuxtApp.vueApp.use(Vue3Toastify, options);
});
