import { Schema, model } from "mongoose";
import { formatTimestamp} from "../utils/dateFormat.mjs";

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
  projectAuthor: {
    type: String,
    required: true,
    trim: true,
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
  projectPhoto: {
    key: String, // S3 key or file path
    url: String, // URL to access the file on S3
    size: Number, // File size in bytes
    mimeType: String, // MIME type of the file
  },
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

export default Project;

// module.exports = Project;
