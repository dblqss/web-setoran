import http from "./http";

export const service = {
  getPaSaya() {
    return http.get("/dosen/pa-saya");
  },

  getMahasiswaSetoran(nim) {
    return http.get(`/mahasiswa/setoran/${nim}`);
  },

  accSetoran(nim, payload) {
    return http.post(`/mahasiswa/setoran/${nim}`, payload);
  },

  deleteSetoran(nim, payload) {
    return http.delete(`/mahasiswa/setoran/${nim}`, {
      data: payload,
    });
  },
};
