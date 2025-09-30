import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/axiosConfig"; 
import axios from "axios";

const busIndex = createAsyncThunk(
  "busSlice/busIndex", // thunk 고유 이름
  async (arg) => {
      const url = `${axiosConfig.baseUrl}/getBs02`;
      const config = {
            params:{
                serviceKey: axiosConfig.serviceKey,
                routeId: arg,
            }
        }

        const response = await axios.get(url,config);
        return response.data.body.items;
    }
);

export {busIndex};