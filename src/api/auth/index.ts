import request from "@/utils/request";
const AUTH_BASE_URL = "/auth";
const testLoginUser = {
  username: "admin",
  password: "123456"
};
export function loginApi(data: any) {
  return request({
    url: `${AUTH_BASE_URL}/login`,
    method: "post",
    data,
  });
};

export function testloginApi(data: any) {
  if (data.username == testLoginUser.username && data.password == testLoginUser.password) {
    return ({
      code: 200,
      data: {
        Token: "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjYyMTA4MDcsImV4cCI6MTcyNjI0MzIwNywidXNlcklkIjozMCwiaW50ZXJuYWxVc2VySWQiOjEsIm5hbWVFbmciOiJhZG1pbiIsInBvc3QiOiJhZG1pbiIsImRpdmlzaW9uIjoiQSxNIiwiYWROYW1lIjoiYWRtaW4ifQ.n0NZ8TmxU032bq87Vv4xQymSuOtr0xVQBAJMVRKa0rs",
        adName: "Admin",
        nameChi: "Admin",
        nameEng: "Admin",
        message: "success",
      }
    })
  } else {
    return ({
      code: 500
    })
  }
  return null;
};

