import recruitmentApi from '../../services/RecruitApiService';

export const createRecruitment = async recruitmentData => {
  return await recruitmentApi.post('', recruitmentData);
};

export const getAllRecruitments = async (page = 1, limit = 10) => {
  return await recruitmentApi.get('/', {
    params: { page, limit },
  });
};

export const getRecruitmentById = async id => {
  return await recruitmentApi.get(`/${id}`);
};

export const updateRecruitmentById = async (id, updatedData) => {
  console.log('endpoint', id, updatedData);
  return await recruitmentApi.put(`/${id}`, updatedData);
};

export const deleteRecruitmentById = async id => {
  return await recruitmentApi.delete(`/${id}`);
};
