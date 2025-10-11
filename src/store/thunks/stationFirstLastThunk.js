import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/** 첫차/막차 조회 */
export const firstLastByLine = createAsyncThunk(
  "stationDetail/firstLastByLine",
  async ({ line, dow = 1, start = 1, end = 50 }) => {
    const base = import.meta.env.VITE_OPEN_API_BASE_URL;
    const key  = import.meta.env.VITE_OPEN_API_KEY;
    const type = import.meta.env.VITE_OPEN_API_TYPE;
    const svc  = import.meta.env.VITE_OPEN_API_SERVICE_FIRST_AND_LAST;
    const ln   = encodeURIComponent(line);

    const makeUrl = (updown) =>
      `${base}${key}${type}${svc}/${start}/${end}/${ln}/${updown}/${dow}/`;

    const [up, down] = await Promise.all([
      axios.get(makeUrl(1)).then(r =>
        r?.data?.SearchFirstAndLastTrainbyLineServiceNew?.row ?? []
      ).catch(() => []),
      axios.get(makeUrl(2)).then(r =>
        r?.data?.SearchFirstAndLastTrainbyLineServiceNew?.row ?? []
      ).catch(() => []),
    ]);

    return { line, dow, up, down };
  }
);
