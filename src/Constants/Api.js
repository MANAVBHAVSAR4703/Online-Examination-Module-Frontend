const backend_url = "http://localhost:8080";

const api = {
  Login: backend_url + "/api/auth/login",
  UserFetch: backend_url + "/api/auth/me",
  CreateStudent: backend_url + "/api/admin/createStudent",
  CreateExam: backend_url + "/api/admin/createExam",
  AddQuestion: backend_url + "/api/admin/createQuestion",
  GetStudents: backend_url + "/api/admin/getStudents",
  GetExams: backend_url + "/api/admin/getExams",
  GetQuestions: backend_url + "/api/admin/getQuestions",
  GetOverview: backend_url + "/api/admin/getOverview",
  GetEnrolledExams: backend_url + "/api/student/getExams",
  GetExamById: backend_url + "/api/student/getExamById",
  SubmitExam: backend_url + "/api/student/submitExam",
  getExamResults: backend_url + "/api/admin/completed-exams",
  editStudent: backend_url + "/api/admin/editStudent",
  deleteStudent: backend_url + "/api/admin/deleteStudent",
  deleteQuestion: backend_url + "/api/admin/deleteQuestion",
};

export default api;
