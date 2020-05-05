import model from '../models';
const {
  AuthorizedUser,
  User,
} = model;

class Users {
  static signUp(req, res) {
    const {
      name,
      username,
      email,
      password
    } = req.body;

    return User.create({
      name,
      username,
      email,
      password
    })
      .then(
        userData => res.status(201).send({
          success: true,
          message: 'User successfully created',
          userData
        })
      );
  }

  static async getAll(req, res) {
    const users = await User.findAll();
    console.log(users);
    users.forEach(async user => {
      // const user = await User.findByPk(id);
      const authorizedUsers = await user.get();
      console.log(authorizedUsers);
      user.authorizedUsers = authorizedUsers;
    });
    await Promise.all(users);
    console.log(users);

    return res.status(200).send(users);
  }

  static async getCurrent(req, res) {
    const { id } = req.params;
    console.log(id);
    const user = await User.findByPk(id, { raw: true });
    if(!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const authorizedUser = await AuthorizedUser.findOne({
      where: { UserId: id },
      raw: true,
    });
    console.log(authorizedUser);
    // user.authorizedUser = [authorizedUser];
    // Object.defineProperty(user, 'authorizedUser', {
    //   value: authorizedUser
    // })
    const data = Object.assign({}, user, authorizedUser);
    console.log(data);
    // console.log(JSON.stringify(data));
    res.send({
      status: 255,
      data,
    })
  }
};

export default Users;
