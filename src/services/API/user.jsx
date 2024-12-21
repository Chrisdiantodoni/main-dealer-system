import instance from "../instance";

class user {
  async getListUser(query) {
    return await instance
      .get(`/user/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getDetailUser(id) {
    return await instance
      .get(`/user/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createUser(body) {
    return await instance
      .post(`/user/create`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async updateUser(id, body) {
    return await instance
      .put(`/user/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async resetPassword(id) {
    return await instance
      .patch(`/user/reset-password/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async changePassword(id, body) {
    return await instance
      .put(`/user/change-password/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async changeStatus(id) {
    return await instance
      .patch(`/user/change-status/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getUserMainDealer() {
    return await instance
      .get(`/user/user-main-dealer`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  async selectMainDealer(body) {
    return await instance
      .post("/user/select-main-dealer", body)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  async getOwnUserDetail(id) {
    return await instance
      .get(`/user/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new user();
