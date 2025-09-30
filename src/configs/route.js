// src/configs/route.js
const route = {
  home: "/",
  busList: "/bus",
  busShow: (id) => `/bus/${id}`,
  // 필요하면 여기에 더 추가...
};

export default route; // ✅ default export
