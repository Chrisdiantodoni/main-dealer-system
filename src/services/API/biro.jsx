import instance from "../instance";

class biro {
  async getFakturReceive(query) {
    return await instance
      .get(`/faktur/received/list?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateStatusFakturReceive(body) {
    return await instance
      .post(`/faktur/received/update-status`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async createFakturDelivery(body) {
    return await instance
      .post(`/faktur/delivered/add`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async getFakturDelivered(query) {
    return await instance
      .get(`/faktur/delivered/list?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getFakturDeliveredDetail(id) {
    return await instance
      .get(`/faktur/delivered/detail/${id} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateFakturDelivered(id, body) {
    return await instance
      .put(`/faktur/delivered/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async confirmFakturDelivered(id) {
    return await instance
      .post(`/faktur/delivered/confirm/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async deleteFakturDelivered(id) {
    return await instance
      .delete(`/faktur/delivered/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDealerReceive(query) {
    return await instance
      .get(`/dealer-received/list?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDetailDealerReceive(id) {
    return await instance
      .get(`/dealer-received/detail/${id} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getListDealerReceiveUnit(query) {
    return await instance
      .get(`/dealer-received/list-unit?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSamsatDelivery(query) {
    return await instance
      .get(`/samsat/delivered/list?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSamsatDeliveryDetail(id) {
    return await instance
      .get(`/samsat/delivered/detail/${id} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createSamsatDelivery(body) {
    return await instance
      .post(`/samsat/delivered/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async deleteSamsatDelivery(id) {
    return await instance
      .delete(`/samsat/delivered/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateSamsatDelivery(id, body) {
    return await instance
      .put(`/samsat/delivered/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateSamsatDeliveryDetail(id, body) {
    return await instance
      .put(`/samsat/delivered/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getSamsatReceiveUnit(query) {
    return await instance
      .get(`/samsat/delivered/list-unit?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSamsatReceive(query) {
    return await instance
      .get(`/samsat/received/list?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSamsatReceiveDetail(id) {
    return await instance
      .get(`/samsat/received/detail/${id} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createSamsatReceive(body) {
    return await instance
      .post(`/samsat/received/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async deleteSamsatReceive(id) {
    return await instance
      .delete(`/samsat/received/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateSamsatReceive(id, body) {
    return await instance
      .put(`/samsat/received/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateSamsatReceiveStatus(id) {
    return await instance
      .put(`/samsat/received/status/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async printFakturDelivered(id) {
    return await instance
      .get(`/export/faktur-dev/${id}`, {
        responseType: "blob",
      })
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async getDeliveryDealer(query) {
    return await instance
      .get(`/delivery-dealer/list?${query} `)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createDeliveryDealer(body) {
    return await instance
      .post(`/delivery-dealer/create`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async updateDeliveryDealer(id, body) {
    return await instance
      .put(`/delivery-dealer/update/${id}`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }
  async confirmDeliveryDealer(id) {
    return await instance
      .post(`/delivery-dealer/confirm/${id}`)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async deleteDeliveryDealer(id) {
    return await instance
      .delete(`/delivery-dealer/delete/${id}`)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async getDetailDeliveryDealer(id) {
    return await instance
      .get(`/delivery-dealer/detail/${id}`)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async getDeliveryDealerUnit(query) {
    return await instance
      .get(`/samsat/delivered/list-unit?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDeliveryDealerUnit2(query) {
    return await instance
      .get(`/samsat/delivered/list-unit-dev-dealer?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getPdfDealerReceive(id) {
    return await instance
      .get(`/export/dealer-receive/${id}`, {
        responseType: "blob",
      })
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async getPdfSamsatDelivery(id) {
    return await instance
      .get(`/export/samsat-dev/${id}`, {
        responseType: "blob",
      })
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async getPdfSamsatReceive(id) {
    return await instance
      .get(`/export/samsat-receive/${id}`, {
        responseType: "blob",
      })
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async getPdfDeliveryDealer(id) {
    return await instance
      .get(`/export/delivery-dealer/${id}`, {
        responseType: "blob",
      })
      .then((res) => res.data)
      .catch((err) => err.data);
  }
}

export default new biro();
