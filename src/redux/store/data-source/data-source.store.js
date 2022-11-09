import { ApiUrl } from "src/api/api-url";
import Service from "./../../../api/api-service";
const service = new Service();
export const getDataSource = () => {
    return service
      .get(ApiUrl.GetDataSource)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};