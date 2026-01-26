import axiosClient from "./axiosClient";

const repairService = {
    getRepairsByCategoryId: async (id) => {
        const response  = await axiosClient.get(`/Repairs/by-category/${id}`);
        return response.data;
    }
};

export default repairService;