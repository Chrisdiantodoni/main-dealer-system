import instance from "../instance";

class unitReturn {
  async getListReturnUnit(query) {
    return await instance
      .get(`/retur-unit/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDetailReturUnit(id) {
    return await instance
      .get(`/retur-unit/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateReturUnitStatus(body) {
    return await instance
      .post(`/retur-unit/update-unit`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
}

export default new unitReturn();
