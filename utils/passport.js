import LocalStrategy from 'passport-local';
import passport from 'passport';
import AuthorizedUser from '../app/User/AuthorizedUser';
import User from '../app/User/User';

const incorectError = {
  message: 'Incorect email or password',
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  const user = await User.getOne({ where: { email }});
  if (!user) return done(null, false, incorectError);

  const authUser = await user.getAuthorizedUser();

  if (!authUser) return done(null, false, incorectError);

  const passwordIsMatch = AuthorizedUser.cryptoPassword(password, authUser.salt) === authUser.password;
  if (passwordIsMatch) {
    return done(null, AuthorizedUser.toAuthJSON(authUser, user));
  }
  return done(null, false, incorectError);
}));
