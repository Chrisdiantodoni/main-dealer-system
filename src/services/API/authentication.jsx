import instance from "../instance";

class authentication {
  async login(body) {
    return await instance
      .post(`/authentication/login`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async passwordAuthentication(body) {
    return await instance
      .post("/user/verify-password", body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }
}

export default new authentication();
