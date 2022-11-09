import { ApiUrl } from "src/api/api-url";
import Service from "./../../../api/api-service";
const service = new Service();
export const getEngine = (params) => {
    return service
      .get(ApiUrl.GetEngine + `${params ? params : ''}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

export const createEngine = (data) => {
  return service
    .post(ApiUrl.GetEngine, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateEngine = (data) => {
  return service
    .post(ApiUrl.GetEngine, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchEngine = (id, data) => {
  return service
    .patch(ApiUrl.GetEngine + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};