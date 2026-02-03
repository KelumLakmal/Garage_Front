import axiosClient from "./axiosClient";

// export const getAllCustomers = async () => {
//     const response = await axiosClient.get("/Customers");
//     return response.data;
// }
export const getAllCustomers = async (paramsObject) => {
    const response = await axiosClient.get("/Customers", {params: paramsObject});
    // console.log("ResposnseFull", response);
    
    return response.data;
}

export const saveCustomer = async (customer) => {
    const response = await axiosClient.post("/Customers", customer);
    return response;
}

export const updateCustomer = async (id, customer) => {
    const response = await axiosClient.put(`/Customers/${id}`, customer);
    return response;
}

export const deleteCustomer = async (id) => {
    const response = await axiosClient.delete(`/Customers/${id}`);
    return response;
}