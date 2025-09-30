import axios from 'axios';
import {
  VITE_BASE_URL,
  VITE_SERVICE_KEY 
} from "../utils/env.js";

// axios 인스턴스 생성
const axiosInstance = axios.create({ baseURL: VITE_BASE_URL });

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use((config) => {
  config.params = {
    ...(config.params || {}),
    serviceKey: VITE_SERVICE_KEY,
    _type: "json",
    MobileOS: "WEB",
    MobileApp: "green-bus",
  };
  return config;
});

export default axiosInstance;
export { axiosInstance };