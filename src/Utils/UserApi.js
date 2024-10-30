import axios from "axios";
import Cookies from "js-cookie";
import api from "../Constants/Api.js";
export const fetchUserDetails = async () => {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }

  let AuthStr = `Bearer ${token}`;
  try {
    const response = await axios.get(`${api?.UserFetch}`, {
      headers: {
        Authorization: AuthStr,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error?.response?.data?.error;
  }
};
