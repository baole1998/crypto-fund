import { ApiUrl } from "src/api/api-url";
import Service from "../../../../api/api-service";
const service = new Service();
export const getCustomerInfo = (params) => {
    return service
      .get(ApiUrl.CustomerInfo + params)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};
export const getCustomerInfoDetail = (params) => {
  return service
    .get(ApiUrl.CustomerInfo + params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const createCustomerInfo = (data) => {
  return service
    .post(ApiUrl.CustomerInfo, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateCustomerInfo = (id, data) => {
  return service
    .put(ApiUrl.CustomerInfo + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateCustomerInfoTrigger = (id) => {
  return service
    .post(ApiUrl.CustomerInfoTrigger + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchCustomerInfo = (id, data) => {
  return service
    .patch(ApiUrl.CustomerInfo + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const getDetaileneralDataManagement = (params) => {
  return service
    .get(ApiUrl.CustomerInfo + params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
