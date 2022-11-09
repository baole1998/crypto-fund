import { ApiUrl } from 'src/api/api-url';
import Service from './../../../api/api-service';
const service = new Service();
export const getCompare = (params) => {
  return service
    .get(ApiUrl.GetCompare + params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const createCompare = (data) => {
  return service
    .post(ApiUrl.GetCompare, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateCompare = (data) => {
  return service
    .post(ApiUrl.GetCompare, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchCompare = (id, data) => {
  return service
    .patch(ApiUrl.GetCompare + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const putCompare = (id, data) => {
  return service
    .put(ApiUrl.GetCompare + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const deleteCompare = (id) => {
  return service
    .delete(ApiUrl.GetCompare + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const getCompareResult = (id) => {
  return service
    .get(ApiUrl.CompareDetail + 'get_compare_detail/' + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const triggerCompare = (id) => {
  return service
    .post(ApiUrl.GetCompare + 'trigger/' + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const getCustomerImg = (id) => {
  return service
    .get(ApiUrl.GetImage + 'customer_doc/' + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
