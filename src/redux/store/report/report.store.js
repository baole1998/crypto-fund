import { ApiUrl } from "src/api/api-url";
import Service from "./../../../api/api-service";
const service = new Service();
export const getReport = (params) => {
    return service
      .get(ApiUrl.GetAllReport + params)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};