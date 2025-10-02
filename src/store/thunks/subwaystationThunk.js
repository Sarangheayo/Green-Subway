import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const subwaystationIndex = createAsyncThunk(
  'subwaystationSlice/subwaystationIndex',
  async () => {
  
    const url = `${import.meta.env.VITE_OPEN_API_BASE_URL}${import.meta.env.VITE_OPEN_API_KEY}${import.meta.env.VITE_OPEN_API_TYPE}${import.meta.env.VITE_OPEN_API_SERVICE_SEARCH_STATION_NAME}/1/799`
    console.log(url);
    const response = await axios.get(url);

    return response.data.SearchInfoBySubwayNameService.row;
  }

);

export {subwaystationIndex}