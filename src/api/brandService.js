import axiosClient from "./axiosClient"

const brandService = {

    getAllBrands: async () => {
        const response = await axiosClient.get("/Brands");
        return response.data;
    }
};

export default brandService;

// export const brandService = () => {

//     const getAllBrands =  async () => {
//     const response = await axiosClient.get("/Brands");
//     return response.data;
// }

// }

// export const getAllBrands =  async () => {
//     const response = await axiosClient.get("/Brands");
//     return response.data;
// }