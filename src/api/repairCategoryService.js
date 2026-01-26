import axiosClient from "./axiosClient";

const repairCategoryService = {
    getAllRepairCategories: async () => {
        const response = await axiosClient.get("/RepairCategories");
        return response.data;
    }
};

export default repairCategoryService;