import { getAllResumes } from "../../../../server/controllers/resumeController";
import resumeApi from "../../services/ResumeApiService";

export const getAllResumes = async (page = 1, limit = 10) => {
  return await resumeApi.get('/', {
    params: { page, limit },
  });
}
