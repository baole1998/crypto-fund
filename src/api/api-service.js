import axios from "axios";
const isHandlerEnabled = true;
const requestHandler = (request) => {
  if (isHandlerEnabled) {
    // request.headers.common["Accept"] = "application/json";
    request.headers.common["Content-Type"] = "application/json; charset=utf-8";
    request.headers.common["Accept"] =
      "application/json, text/javascript, */*; q=0.01";
    request.headers.common["Access-Control-Allow-Origin"] = "*";
  }

  const accessToken = window.localStorage.getItem('accessToken')
  if (accessToken) {
    request.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  return request;
};

const successHandler = (response, isHandlerEnabled) => {
  if(isHandlerEnabled) {
    //TODO: Do Success Handler
  }
  return response;
}
const errorHandler = (error, isHandlerEnabled) => {
  if(isHandlerEnabled) {
    //TODO: Do Error Handler
  }

  return Promise.reject({
    ...(error.response ? error.response.data : "") 
  });
}

export default class Service {
  constructor(namespace) {
    this.namespace = namespace;
    this.axios = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      responseType: "json",
    });

    // Enable request interceptor
    this.axios.interceptors.request.use(
      (request) => requestHandler(request, isHandlerEnabled),
      (error) => errorHandler(error, isHandlerEnabled),
    );

    //Response and Error handler
    this.axios.interceptors.response.use(
      (response) => successHandler(response, isHandlerEnabled),
      (error) => errorHandler(error, isHandlerEnabled)
    );
  }

  /**
   * Get Http Request
   * @param {any} action
   */
  get(action, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(params ? action + "?" + params : action, {
          method: "GET",
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Get Http Request
   * @param {any} action
   */
  getBinary(action, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(params ? action + "?" + params : action, {
          method: "GET",
          responseType: "blob",
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Post Http Request
   * @param {any} action
   * @param {any} params
   */
  post(action, params, config) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action, {
          method: "POST",
          data: params,
          ...config,
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  patch(action, params, config) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action, {
          method: "PATCH",
          data: params,
          ...config,
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Put Http Request
   * @param {any} action
   * @param {any} params
   */
  put(action, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action, {
          method: "PUT",
          data: params,
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  delete (url, params) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(url, {
          method: "DELETE",
          data: params,
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }

  /**
   * Post Http Request
   * @param {any} action
   * @param {any} params
   */
  postParams(action, params, body) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action + "?" + params, {
          method: "POST",
          data: body,
        })
        .then((response) => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            console.error("REST request error!", error.response.data.error);
            reject(error.response.data.error);
          } else reject(error);
        });
    });
  }
}