/**
 * Talk with the Waveup API.
 *
 * @param {string} route - The route to call, ex: `/auth/login` will request `https://url/auth/login`
 * @param {string} [method] - The method to use for this request, default `GET`.
 * @param {Object} [data = {}] - An object who contains additional data to pass to the request accept only `headers` and `body` properties, default `{}`.
 * @param {Object} [data.useDefaultRoute = false] - If true route must be a complete url.
 * @param {Object} [data.headers = {}] - An object that will be used as request header cannot contains `Accept, content-type, x-waveup-mobile, x-waveup-version`.
 * @param {Object} [data.body = {}] - Object with data to pass in the body request should be a javascript object and not a JSON object.
 */
export default function (route, method, data = {}) {
  if (!route) {
    return console.error(
      new Error("You should enter a route to fetch").message
    );
  } else {
    typeof route !== "string" &&
      console.error(
        new Error("The route parameter should be a string.").message
      );
  }

  if (method) {
    typeof method !== "string" &&
      console.error(new Error("Method should be a string").message);

    if (!["GET", "POST", "PUT", "DELETE"].includes(method.toUpperCase())) {
      return console.error(
        new Error(`The ${method} is not available for now.`).message
      );
    }
  } else {
    method = "GET";
  }

  let headers;
  if (data.useCustomRoute) {
    headers = { ...data.headers };
  } else {
    headers = {
      ...data.headers,
      Accept: "application/json",
      "Content-Type": "application/json;charset=utf-8",
    };
  }

  return fetch(
    data.useCustomRoute
      ? route
      : `${
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_APIURL_DEV
            : process.env.REACT_APP_APIURL_PROD
        }${route}`,
    {
      credentials: "include",
      method: method,
      headers: { ...headers },
      body: data.body && JSON.stringify(data.body),
    }
  )
    .then((res) => res.json())
    .then((dataParsed) => dataParsed);
}
