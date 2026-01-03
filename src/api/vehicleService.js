import axiosClient from "./axiosClient";

const vehicleService = {
    
  getAllVehicles: async (paramsObject) => {
    const response = await axiosClient.get("/Vehicles", {params: paramsObject});
    return response.data;
  },
  saveVehicle: async (vehicle) => {
    const response = await axiosClient.post("/Vehicles", vehicle);
    return response;
  },
};

export default vehicleService;
