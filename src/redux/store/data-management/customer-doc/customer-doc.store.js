import { ApiUrl } from "src/api/api-url";
import Service from "../../../../api/api-service";
const service = new Service();
export const getCustomerDoc = (params) => {
    return service
      .get(ApiUrl.CustomerDoc + params)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};
export const getCustomerDocDetail = (params) => {
  return service
    .get(ApiUrl.CustomerDoc + params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const createCustomerDoc = (data) => {
  return service
    .post(ApiUrl.CustomerDoc, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateCustomerDoc = (data) => {
  return service
    .post(ApiUrl.CustomerDoc, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateCustomerDocTrigger = (id) => {
  return service
    .post(ApiUrl.CustomerDocTrigger + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchCustomerDoc = (id, data) => {
  return service
    .patch(ApiUrl.CustomerDoc + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const getDetaileneralDataManagement = (params) => {
  return service
    .get(ApiUrl.CustomerDoc + params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
