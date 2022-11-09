import { ApiUrl } from "src/api/api-url";
import Service from "../../../../api/api-service";
const service = new Service();
export const getGroundTruthRecord = (params) => {
    return service
      .get(ApiUrl.GroundTruthRecord + params)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};