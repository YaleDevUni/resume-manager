import resumeApi from '../../services/ResumeApiService';

export const getAllResumes = async (page = 1, limit = 10, recruitmentID) => {
  return await resumeApi.get('/', {
    params: { page, limit },
  });
};
export const getResumeById = async id => {
  return await resumeApi.get(`/${id}`);
};

export const updateResumeData = async (id, updatedData) => {
  console.log('id-endpoint', id);
  return await resumeApi.put(`/${id}`, updatedData);
};
