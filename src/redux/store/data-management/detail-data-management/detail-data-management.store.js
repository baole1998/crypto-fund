import { ApiUrl } from "src/api/api-url";
import Service from "./../../../../api/api-service";
const service = new Service();
export const getDetailDataManagement = (params) => {
    return service
      .get(ApiUrl.CustomerDoc + params)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

export const createDetailDataManagement = (data) => {
  return service
    .post(ApiUrl.CustomerDoc, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateDetailDataManagement = (data) => {
  return service
    .post(ApiUrl.CustomerDoc, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchDetailDataManagement = (id, data) => {
  return service
    .patch(ApiUrl.CustomerDoc + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const updatePartial = (id, data) => {
  return service
    .patch(ApiUrl.CustomerDoc + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};