const { Profile } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    profiles: async () => {
      return Profile.find();
    },
  },

  Mutation: {
    signUp: async (parent, { username, email, password }) => {
      const profile = await Profile.create({ username, email, password });
      console.log(profile);
      const token = signToken(profile);
      return { token, profile };
    },
    logIn: async (parent, { email, password }) => {
      const profile = await Profile.findOne({ email });

      if (!profile) {
        throw new AuthenticationError("No profile with this email found!");
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(profile);
      return { token, profile };
    },

    saveBook: async (
      parent,
      { bookId, authors, description, image, link, title },
      context
    ) => {
      console.log(
        bookId,
        authors,
        description,
        image,
        link,
        title,
        context.user._id
      );
      if (context.user) {
        const profile = await Profile.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: { bookId, authors, description, image, link, title },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        console.log(profile);
        return profile;
      } else {
        throw new AuthenticationError("You need to be logged in!");
      }
    },

    removeBook: async (parent, args, context) => {
      if (context.user) {
        return Profile.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBook: args } },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

module.exports = resolvers;
