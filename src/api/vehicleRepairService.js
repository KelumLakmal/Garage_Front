import axiosClient from "./axiosClient";

const vehicleRepairService = {
    getAllVehicleRepairs: async (paramsObject) => {
        const response = await axiosClient.get("/VehicleRepairs", {params: paramsObject});
        return response.data;
    },
    saveVehicleRepairs: async (vehicleRepairs) => {
        const response = await axiosClient.post("/VehicleRepairs", vehicleRepairs);
        return response;
    },
    updateVehicleRepair: async (id, vehicleRepair) => {
        const response = await axiosClient.put(`/VehicleRepairs/${id}`, vehicleRepair);
        return response;
    },
    deleteVehicleRepair: async (id) => {
        const response = await axiosClient.delete(`/VehicleRepairs/${id}`);
        return response;
    }
};
export default vehicleRepairService;