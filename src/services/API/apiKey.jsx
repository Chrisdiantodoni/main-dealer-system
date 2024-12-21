import instance from "../instance";

class apiKey {
  async getListAPIkey(query) {
    return await instance
      .get(`/dealer-api-key/list?${query}`)
      .then((res) => res.data);
  }

  async getApiKeyDetail(id) {
    return await instance
      .get(`/dealer-api-key/detail/${id}`)
      .then((res) => res.data);
  }

  async updateApiKey(id, body) {
    return await instance
      .put(`/dealer-api-key/update/${id}`, body)
      .then((res) => res.data);
  }

  async apiKeyAddUser(id, body) {
    return await instance
      .post(`/dealer-api-key/add-user/${id}`, body)
      .then((res) => res.data);
  }

  async apiKeyCreate(body) {
    return await instance
      .post(`/dealer-api-key/create`, body)
      .then((res) => res.data);
  }
}

export default new apiKey();
