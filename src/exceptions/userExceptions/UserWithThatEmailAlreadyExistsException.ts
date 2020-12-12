import HttpException from "../HttpException";

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: String) {
    super(400, `User with the email ${email} already exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;
