import queryString from "query-string";

class queryStringClass {
  stringified = (obj) => {
    for (const [key, value] of Object.entries(obj)) {
      if (!value) {
        delete obj[key];
      }
    }
    return queryString.stringify(obj);
  };
}

export default new queryStringClass();
