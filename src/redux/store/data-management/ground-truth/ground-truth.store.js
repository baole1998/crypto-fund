import { ApiUrl } from 'src/api/api-url';
import Service from '../../../../api/api-service';
const service = new Service();
export const getGroundTruth = (params) => {
  return service
    .get(ApiUrl.GroundTruth + params)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const createGroundTruth = (data) => {
  return service
    .post(ApiUrl.GroundTruth, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateGroundTruth = (data) => {
  return service
    .post(ApiUrl.GroundTruth, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};


export const putGroundtruth = (id, data) => {
  return service
    .put(ApiUrl.GroundTruth + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchGroundTruth = (id, data) => {
  return service
    .patch(ApiUrl.GroundTruth + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const deleteGroundtruth = (id) => {
  return service
    .delete(ApiUrl.GroundTruth + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const getGroundTruthDetail = (id) => {
  return service
    .get(ApiUrl.GroundTruthDetail + `?id=${id}`)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const triggerGroundtruth = (id) => {
  return service
    .post(ApiUrl.GroundTruth + 'trigger/' + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
