const backend_url = "http://localhost:8080";

const api = {
  Login: backend_url + "/api/auth/login",
  UserFetch: backend_url + "/api/auth/me",
  CreateStudent: backend_url + "/api/admin/createStudent",
  CreateExam: backend_url + "/api/admin/createExam",
  AddQuestion: backend_url + "/api/admin/createQuestion",
  GetStudents: backend_url + "/api/admin/getStudents",
  GetExams: backend_url + "/api/admin/getExams",
  GetQuestions:backend_url+"/api/admin/getQuestions"
};

export default api;
