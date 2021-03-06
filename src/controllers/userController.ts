import { Request, Response } from 'express';
import { Profile, User } from '../entity';

// ! GET the details (email, username) of all the users
export const getAllUsersDetails = async (_: Request, res: Response) => {
  const users = await User.find();
  return res.json(users);
};

// ! GET the details (email, username) of logged in user
export const getLoggedInUsersDetails = async (_: Request, res: Response) => {
  return res.send(res.locals.user);
};

// ! GET the details (email, username) of a praticular the user
export const getUserDetails = async (req: Request, res: Response) => {
  const username = req.params.username;
  console.log(username);
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ error: 'user not found' });
  }
  return res.json(user);
};

// ! GET the profile of a praticular the user
export const getUserProfile = async (req: Request, res: Response) => {
  const username = req.params.username;
  const user = await User.findOne({ username }, { relations: ['profile'] });
  if (!user) {
    return res.status(400).json({ error: 'user not found' });
  }
  return res.json(user);
};

// ! GET the profile of a logged in user
export const getLoggedInUserProfile = async (_: Request, res: Response) => {
  const { user: authUser } = res.locals;
  const user = await User.findOne(
    { username: authUser.username },
    { relations: ['profile'] }
  );
  if (!user) {
    return res.status(400).json({ error: 'user not found' });
  }
  return res.json(user);
};

// ! POST add user profile
export const addUserProfile = async (req: Request, res: Response) => {
  const { bio, photo } = req.body;
  const { user } = res.locals;
  const authUser = await User.findOne(
    { username: user.username },
    { relations: ['profile'] }
  );

  if (!authUser) return res.json({ error: 'user not found' });

  let userProfile = await Profile.findOne({
    where: { id: authUser.profile.id },
  });

  if (!userProfile) return res.json({ error: 'user profile not found' });

  userProfile.bio = bio || userProfile.bio;
  userProfile.photo = photo || userProfile.photo;
  authUser.profile = userProfile;

  await userProfile.save();
  await authUser.save();
  return res.json(authUser);
};
