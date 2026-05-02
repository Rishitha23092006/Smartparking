import axiosInstance from './axiosInstance';

export const parkingAPI = {
  // Auth endpoints
  getToken: (username, password) =>
    axiosInstance.post('/api/token/', { username, password }),

  refreshToken: (refreshToken) =>
    axiosInstance.post('/api/token/refresh/', { refresh: refreshToken }),

  getUserInfo: () =>
    axiosInstance.get('/user/info/'),

  // Slots endpoints
  getAvailableSlots: () =>
    axiosInstance.get('/slots/available/'),

  createSlot: (slotData) =>
    axiosInstance.post('/slot/', slotData),

  // Vehicle endpoints
  addVehicle: (vehicleData) =>
    axiosInstance.post('/vehicle/', vehicleData),

  getUserVehicles: () =>
    axiosInstance.get('/vehicles/'),

  // Parking endpoints
  parkVehicle: (slotId, vehicleId) =>
    axiosInstance.post('/park/', {
      slot: slotId,
      vehicle: vehicleId,
    }),

  exitVehicle: (entryId) =>
    axiosInstance.post(`/exit/${entryId}/`),
};

export default parkingAPI;
