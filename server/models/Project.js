const { Schema, model } = require("mongoose");
const { formatTimestamp } = require("../utils/dateFormat.js");

const projectSchema = new Schema({
  projectTitle: {
    type: String,
    required: "You need to leave a project title!",
    minlength: 1,
    maxlength: 280,
    trim: true,
  },

  projectDescription: {
    type: String,
    required: "You need to leave a description!",
    minlength: 1,
    maxlength: 40000,
    trim: true,
  },
  projectImage: {
    type: String,
    required: "You need to upload an image",
  },
  projectAuthor: {
    type: String,
    required: true,
    trim: true,
  },
  projectAudio: {
    type: String,
    required: "You need to upload an audio file.",
  },
  projectMembers: [
    {
      memberId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      memberUsername: {
        type: String,
      },
    },
  ],
  likes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      username: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => formatTimestamp(timestamp),
  },
  comments: [
    {
      commentText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      commentAuthor: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => formatTimestamp(timestamp),
      },
    },
  ],
});

const Project = model("Project", projectSchema);

module.exports = Project;
