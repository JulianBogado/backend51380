export default class UserDTO {
  constructor(user) {
    this.name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = "user";
    this.age = user.age;
  }
  validate(){
    if (!this.name || !this.last_name || !this.email || !this.age) {
      return false;
    }
    return true;
  }
}

