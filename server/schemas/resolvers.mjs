import { AuthenticationError } from "apollo-server-express";
import { User, Project } from "../models/index.mjs";
import { signToken } from "../utils/auth.mjs";

const resolvers = {
  // fetches the following data to be loaded onto the page
  Query: {
    users: async () => {
      return User.find().populate("projects");
    },
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("projects");
    },
    projects: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Project.find(params).sort({ createdAt: -1 });
    },
    project: async (parent, { projectId }) => {
      console.log(projectId);
      return Project.findOne({ _id: projectId });
    },
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate("projects");
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },

  // alters and updates the data sets from our schemas
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({
        username,
        email,
        password,
      });
      if (!user) {
        throw new Error("User not found");
      }
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },
    // addFolder: async (parent, { userId, folderName }, context) => {
    //   if (context.user) {
    //     try {
    //       // Assuming you have a function to create a folder here
    //       const user = await User.findOneAndUpdate(
    //         { _id: context.user._id },
    //         {
    //           userId: context.user._id,
    //           folderName,
    //         }
    //       );
    //       // You may use the AWS SDK to create a folder in your S3 bucket
    //       const folderKey = `${userId}/${folderName}/`;

    //       // Create the folder using your S3 library
    //       await s3.createFolder();
    //       return user && `Folder '${folderName}' created successfully`;
    //     } catch (error) {
    //       console.error("Error creating folder:", error);
    //       throw new Error("Failed to create folder");
    //     }
    //   }
    //   throw new AuthenticationError("You need to be logged in!");
    // },
    // addFolder: async (parent, { userId, folderName }, context) => {
    //   if (context.user) {
    //     try {
    //       // Assuming you have a function to create a folder in MongoDB
    //       console.log("User ID from context:", context.user._id);
          
    //       const updatedUser = await User.findByIdAndUpdate(
    //         { _id: context.user._id },
    //         { folderName }, // Set the folder name directly
    //         { new: true }
    //       );

    //       if (!updatedUser) {
    //         throw new Error("User not found");
    //       }

    //       // // You may use the AWS SDK to create a folder in your S3 bucket
    //       // const folderKey = `${userId}/${folderName}/`;

    //       // // Create the folder using your S3 library
    //       // await s3.createFolder(folderKey);

    //       // return {
    //       //   userId: updatedUser._id,
    //       //   folderName: updatedUser.folderName,
    //       //   user: {
    //       //     _id: updatedUser._id,
    //       //     username: updatedUser.username,
    //       //   },
    //       // };
    //       console.log(updatedUser);
    //       return updatedUser;
    //     } catch (error) {
    //       console.error("Error creating folder:", error);
    //       throw new Error("Failed to create folder");
    //     }
    //   }
    //   throw new AuthenticationError("You need to be logged in!");
    // },
    addProject: async (
      parent,
      { projectTitle, projectDescription },
      context
    ) => {
      if (context.user) {
        const project = await Project.create({
          projectTitle,
          projectDescription,
          projectAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { projects: project._id } }
        );

        return project;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addMember: async (parent, { projectId }, context) => {
      if (context.user) {
        return Project.findOneAndUpdate(
          { _id: projectId },
          {
            $addToSet: {
              projectMembers: {
                memberId: context.user._id,
                memberUsername: context.user.username,
              },
            },
          }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    addComment: async (parent, { projectId, commentText }, context) => {
      if (context.user) {
        return Project.findOneAndUpdate(
          { _id: projectId },
          {
            $addToSet: {
              comments: { commentText, commentAuthor: context.user.username },
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeProject: async (parent, { projectId }, context) => {
      if (context.user) {
        const project = await Project.findOneAndDelete({
          _id: projectId,
          projectAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { projects: project._id } }
        );

        return project;
      }
      throw new AuthenticationError("You need to be logged in!");
    },
    removeComment: async (parent, { projectId, commentId }, context) => {
      if (context.user) {
        return Project.findOneAndUpdate(
          { _id: projectId },
          {
            $pull: {
              comments: {
                _id: commentId,
                commentAuthor: context.user.username,
              },
            },
          },
          { new: true }
        );
      }
      throw new AuthenticationError("You need to be logged in!");
    },
  },
};

export default resolvers;
