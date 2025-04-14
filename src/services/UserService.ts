import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

const UserService = {
    async authenticateUser(email: string, password: string, done: Function) {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Incorrect password' });

        return done(null, user);
    },

    serializeUser(user: mongoose.Document & IUser, done: Function) {
      done(null, (user as mongoose.Document & IUser & { _id: mongoose.Types.ObjectId })._id.toString() as string); // Use `_id` as a string identifier
    },
  
    async deserializeUser(id: string, done: Function) {
      try {
          const user = await User.findById(id).exec();
          done(null, user || false); // Return user or false if not found
      } catch (error) {
          done(error, null);
      }
    },
};

export default UserService;
