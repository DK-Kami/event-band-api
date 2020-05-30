import LocalStrategy from 'passport-local';
import passport from 'passport';
import AuthorizedUser from '../app/User/AuthorizedUser';
import User from '../app/User/User';

const IncorrectError = {
  message: 'Incorrect email or password',
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  const user = await User.getOne({ where: { email } });
  console.log('passport', user);
  if (!user) return done(IncorrectError);

  const authUser = await user.getAuthorizedUser();

  if (!authUser) return done(IncorrectError);

  const passwordIsMatch = AuthorizedUser.cryptoPassword(password, authUser.salt) === authUser.password;
  if (passwordIsMatch) {
    return done(null, AuthorizedUser.toAuthJSON(authUser, user));
  }
  return done(IncorrectError);
}));
