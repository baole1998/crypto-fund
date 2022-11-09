import { ApiUrl } from "src/api/api-url";
import Service from "./../../../api/api-service";
const service = new Service();
export const getUser = (params) => {
    return service
      .get(ApiUrl.GetUser + `${params ? params : ''}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

export const createUser = (data) => {
  return service
    .post(ApiUrl.GetUser, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateUser = (data) => {
  return service
    .post(ApiUrl.GetUser, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchUser = (id, data) => {
  return service
    .patch(ApiUrl.GetUser + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};