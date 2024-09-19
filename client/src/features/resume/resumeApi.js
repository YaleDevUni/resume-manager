import resumeApi from '../../services/ResumeApiService';

export const getAllResumes = async (params={
  page: 1,
  limit: 40,
}) => {
  return await resumeApi.get('/', {
    params,
  });
};
export const getResumeById = async id => {
  return await resumeApi.get(`/${id}`);
};

export const updateResumeData = async (id, updatedData) => {
  console.log('id-endpoint', id);
  return await resumeApi.put(`/${id}`, updatedData);
};
