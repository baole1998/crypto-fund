import { ApiUrl } from "src/api/api-url";
import Service from "../../../api/api-service";
const service = new Service();
export const getSyncTask = (params) => {
    return service
      .get(ApiUrl.SyncTask + params)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};
export const getListImage= (id) => {
    return service
      .get(ApiUrl.SyncTask + 'list_import_image' + `/${id}`)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        throw err;
      });
};

export const createSyncTask = (data) => {
  return service
    .post(ApiUrl.SyncTask, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const createSyncTaskImport = (data) => {
  return service
    .post(ApiUrl.SyncTask + 'import', data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateSyncTaskImport = (id, data) => {
  return service
    .put(ApiUrl.SyncTask + 'import' + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const deleteImportImage = (data) => {
  let param = `import_image/${data.id}?customer_doc_id=${data.customer_doc_id}&type=${data.type}`
  return service
    .delete(ApiUrl.SyncTask + param)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const detailSyncTask = (id) => {
  return service
    .get(ApiUrl.SyncTask +id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const updateSyncTask = (id, data) => {
  return service
    .put(ApiUrl.SyncTask + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};

export const patchSyncTask = (id, data) => {
  return service
    .patch(ApiUrl.SyncTask + id, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};
export const updateTaskTrigger = (id, data) => {
  return service
    .post(ApiUrl.SyncTask + 'task_trigger/' + id)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw err;
    });
};