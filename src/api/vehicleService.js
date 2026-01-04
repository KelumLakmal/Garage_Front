import axiosClient from "./axiosClient";

const vehicleService = {

  getAllVehicles: async (paramsObject) => {
    const response = await axiosClient.get("/Vehicles", {params: paramsObject});
    return response.data;
  },
  saveVehicle: async (formData) => {
    const response = await axiosClient.post("/Vehicles", formData);
    return response;
  },
  updateVehicle: async (id, formData) => {
    const response = await axiosClient.put(`/Vehicles/${id}`, formData);
    return response;
  },
  deleteVehicle: async (id) => {
    const response = await axiosClient.delete(`/Vehicles/${id}`);
    return response;
  }
};

export default vehicleService;
