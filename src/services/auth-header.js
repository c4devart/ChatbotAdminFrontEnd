export default function authHeader() {
  let admin = JSON.parse(localStorage.getItem("admin"));

  if (admin && admin.accessToken) {
    return { Authorization: "Bearer " + admin.accessToken }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    return {};
  }
}
