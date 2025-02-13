import { Api } from './api';

const api = new Api({
    baseURL: "",
});

// api.instance.interceptors.response.use(
//     (response) => {
//         if (response.data?.error) {
//             // Show error
//         }
//         return response
//     },
//     (error) => {
//         if (error.status === 401) {
//             if (window.location.pathname !== '/login') {
//                 window.location.href = '/login'
//             }
//         } else {
//            // Show error
//         }
//         // keep normal flow
//         return error.response
//     }
// )


export default api;
