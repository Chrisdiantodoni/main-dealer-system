import instance from "../instance";

class master {
  async getMainDealerList(query) {
    return await instance
      .get(`/public/main-dealer/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  // async getDealer(query) {
  //   return await instance.get(`/public/`)
  // }
  async getMaritalList(query) {
    return await instance
      .get(`/public/marital/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getHobbiesList(query) {
    return await instance
      .get(`/public/hobbies/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMethodSales(query) {
    return await instance
      .get(`/public/method-sales/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getResidenceList(query) {
    return await instance
      .get(`/public/residence/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getMotorBrand(query) {
    return await instance
      .get(`/public/motor-brand/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getEducationList(query) {
    return await instance
      .get(`/public/education/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getOccupationList(query) {
    return await instance
      .get(`/public/occupation/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getProvinceList(query) {
    return await instance
      .get(`/public/province/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getCitiesList(query) {
    return await instance
      .get(`/public/cities/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDistrictList(query) {
    return await instance
      .get(`/public/district/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSubDistrictList(query) {
    return await instance
      .get(`/public/sub-district/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSalesmanList(query) {
    return await instance
      .get(`/public/salesman/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMicrofinanceList(query) {
    return await instance
      .get(`/public/microfinance/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getIncomeList(query) {
    return await instance
      .get(`/public/income/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getExpenditureList(query) {
    return await instance
      .get(`/public/expend/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getLeasingList(query) {
    return await instance
      .get(`/public/leasing/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getTenorList(query) {
    return await instance
      .get(`/public/tenor/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDealerList(query) {
    return await instance
      .get(`/dealer/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDealerNeqList(query) {
    return await instance
      .get(`/dealer/neq/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //cru dealer
  async createDealer(body) {
    return await instance
      .post(`/dealer/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getDealerDetail(id) {
    return await instance
      .get(`/dealer/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateDealer(id, body) {
    return await instance
      .put(`/dealer/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  // async deleteDealer(id, body) {
  //   return await instance
  //     .get(`/dealer/delete/${id}`, body)
  //     .then((res) => res.data)
  //     .catch((error) => console.log(error));
  // }

  //create dealer_neq
  async createDealerNeq(body) {
    return await instance
      .post(`/dealer/neq/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getDealerNeqDetail(id) {
    return await instance
      .get(`/dealer/neq/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateDealerNeq(id, body) {
    return await instance
      .put(`/dealer/neq/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create marital

  async createMarital(body) {
    return await instance
      .post(`/master-data/marital/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateMarital(id, body) {
    return await instance
      .put(`/master-data/marital/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  // create Hobbies

  async createHobbies(body) {
    return await instance
      .post(`/master-data/hobbies/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateHobbies(id, body) {
    return await instance
      .put(`/master-data/hobbies/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  // Create Residence
  async createResidence(body) {
    return await instance
      .post(`/master-data/residence/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateResidence(id, body) {
    return await instance
      .put(`/master-data/residence/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  // create Motor Brand
  async createMotorBrand(body) {
    return await instance
      .post(`/master-data/motor-brand/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateMotorBrand(id, body) {
    return await instance
      .put(`/master-data/motor-brand/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  // create Education
  async createEducation(body) {
    return await instance
      .post(`/master-data/education/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateEducation(id, body) {
    return await instance
      .put(`/master-data/education/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createOccupation(body) {
    return await instance
      .post(`/master-data/occupation/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateOccupation(id, body) {
    return await instance
      .put(`/master-data/occupation/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create Microfinance
  async createMicrofinance(body) {
    return await instance
      .post(`/master-data/microfinance/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateMicrofinance(id, body) {
    return await instance
      .put(`/master-data/microfinance/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create Microfinance
  async createLeasing(body) {
    return await instance
      .post(`/master-data/leasing/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateLeasing(id, body) {
    return await instance
      .put(`/master-data/leasing/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create income

  async createIncome(body) {
    return await instance
      .post(`/master-data/income-amount/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateIncome(id, body) {
    return await instance
      .put(`/master-data/income-amount/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create expenditure

  async createExpenditure(body) {
    return await instance
      .post(`/master-data/expenditure/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateExpenditure(id, body) {
    return await instance
      .put(`/master-data/expenditure/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create expenditure

  async createTenorAmount(body) {
    return await instance
      .post(`/master-data/tenor/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateTenorAmount(id, body) {
    return await instance
      .put(`/master-data/tenor/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create pooling source

  async createPoolingSource(body) {
    return await instance
      .post(`/master-data/method-sales/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updatePoolingSource(id, body) {
    return await instance
      .put(`/master-data/method-sales/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateMasterStatus(id, body) {
    return await instance
      .put(`/master-data/update/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  //create MotorType
  async getMotorType(body) {
    return await instance
      .get(`/public/motor/list`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async getMotorList(query) {
    return await instance
      .get(`/master-data/motor/list?${query}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getMotorDetail(id) {
    return await instance
      .post(`/master-data/motor/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async createMotorType(body) {
    return await instance
      .post(`/master-data/motor/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateMotorType(id, body) {
    return await instance
      .put(`/master-data/motor/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async assignUserDealer(id, body) {
    return await instance
      .post(`/dealer/assign-api-key/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getBirolist(query) {
    return await instance
      .get(`/biro/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createBiro(body) {
    return await instance
      .post(`/biro/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateBiro(id, body) {
    return await instance
      .post(`/biro/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateBiroStatus(id) {
    return await instance
      .post(`/biro/update-status/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getMasterCityList(query) {
    return await instance
      .get(`/master-data/region/city/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createCity(body) {
    return await instance
      .post(`/master-data/region/city/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateCity(id, body) {
    return await instance
      .put(`/master-data/region/city/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async deleteCity(id) {
    return await instance
      .delete(`/master-data/region/city/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async getMasterDistrictList(query) {
    return await instance
      .get(`/master-data/region/district/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createDistrict(body) {
    return await instance
      .post(`/master-data/region/district/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateDistrict(id, body) {
    return await instance
      .put(`/master-data/region/district/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async deleteDistrict(id) {
    return await instance
      .delete(`/master-data/region/district/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getMasterSubDistrictList(query) {
    return await instance
      .get(`/master-data/region/sub-district/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createSubDistrict(body) {
    return await instance
      .post(`/master-data/region/sub-district/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateSubDistrict(id, body) {
    return await instance
      .put(`/master-data/region/sub-district/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async deleteSubDistrict(id) {
    return await instance
      .delete(`/master-data/region/sub-district/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async createProvince(body) {
    return await instance
      .post(`/master-data/region/province/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateProvince(id, body) {
    return await instance
      .put(`/master-data/region/province/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getVariantList(query) {
    return await instance
      .get(`/motor-variant/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getVariantDetail(id) {
    return await instance
      .get(`/motor-variant/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async createVariant(body) {
    return await instance
      .post(`/motor-variant/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateVariant(id, body) {
    return await instance
      .put(`/motor-variant/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async deleteVariant(id) {
    return await instance
      .put(`/motor-variant/delete/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new master();
