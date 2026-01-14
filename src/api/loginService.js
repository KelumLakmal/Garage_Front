import axiosClient from "./axiosClient";

const loginService = {

  login: async (loginData) => {
    const response = await axiosClient.post("/Logins", loginData);
    return response;
  },
};

export default loginService;


