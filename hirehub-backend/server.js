const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const http = require("http");
const Message = require("./models/User.js");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());
// MongoDB Client Setup
const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let userCollection;
let jobsCollection;
let subscriptionCollection;
let messageCollection;
let chatsCollection;

async function connectToDB() {
  try {
    await client.connect();
    const database = client.db("Hirehub-dev");
    userCollection = database.collection("users");
    jobsCollection = database.collection("jobs");
    subscriptionCollection = database.collection("subscriptions");
    messageCollection = database.collection("messages");
    chatsCollection = database.collection("chats");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}
connectToDB();
const connectedUsers = new Map();
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);
  socket.on("registerUser", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
  });
  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, content, chatId } = data;

    try {
      let chatIdToUse = chatId;
      console.log("line69");
      if (!chatId) {
        const newChat = {
          participants: [senderId, receiverId],
          lastMessage: content,
          updatedAt: new Date(),
        };

        const result = await chatsCollection.insertOne(newChat);
        chatIdToUse = result.insertedId;
      } else {
        await chatsCollection.updateOne(
          { _id: new ObjectId(chatId) },
          {
            $set: {
              lastMessage: content,
              updatedAt: new Date(),
            },
          }
        );
      }

      const message = {
        chatId: new ObjectId(chatIdToUse),
        senderId,
        receiverId,
        content,
        createdAt: new Date(),
      };
      const messageResult = await messageCollection.insertOne(message);

      io.to(connectedUsers.get(receiverId)).emit("receiveMessage", {
        _id: messageResult.insertedId,
        ...message,
      });

      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error("Error handling sendMessage event:", error);
    }
  });

  socket.on("disconnect", () => {
    connectedUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(
          `User ${userId} disconnected and removed from connected users.`
        );
      }
    });
  });
});
app.get("/api/getchatId", async (req, res) => {
  const { senderId, receiverId, skip = 0, limit = 20 } = req.query;
  try {
    const existingChat = await chatsCollection.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (existingChat) {
      const messages = await messageCollection
        .find({ chatId: existingChat._id })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .toArray();
      console.log("messages", messages);
      return res.json({
        message: "Chat already exists",
        chat: existingChat,
        messages: messages.reverse(),
      });
    } else {
      return res.json({
        message: "Chat not found",
        chat: null,
      });
    }
  } catch (error) {}
});
app.get("/api/fetchMessages", async (req, res) => {
  const { chatId, skip = 0, limit = 20 } = req.query;
  try {
    if (chatId) {
      const messages = await messageCollection
        .find({ chatId: new ObjectId(chatId) })
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .toArray();
      console.log("messages", messages);
      return res.json({
        message: "Success",
        messages: messages.reverse(),
      });
    } else {
      return res.json({
        message: "Chat not found",
        messages: null,
      });
    }
  } catch (error) {}
});
// User Signup
app.post("/api/signup", async (req, res) => {
  const { name, email, password, type } = req.body;

  try {
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email;

    const newUser = {
      name,
      email,
      password: hashedPassword,
      username,
      type,
    };

    const result = await userCollection.insertOne(newUser);
    const token = jwt.sign(
      { userId: result.insertedId, name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Signin
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        location: user.location,
        phone: user.phone,
        type: user.type,
        jobs: user.jobs,
        subscriptionStatus: user.subscription,
        resume: user.resume,
        aboutMe: user.aboutMe,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/postjobs", async (req, res) => {
  const { title, company, location, description } = req.body;

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const postedDate = new Date();
    console.log("userID", userId);
    const postedBy = new ObjectId(userId.toString());
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });
    const newJob = {
      title,
      company,
      location,
      description,
      postedDate,
      postedBy,
    };

    const result = await jobsCollection.insertOne(newJob);
    const job = {
      _id: result.insertedId,
      ...newJob,
    };
    if (!user.jobs) user.jobs = [];

    if (!user.jobs.includes(new ObjectId(job._id.toString()))) {
      user.jobs.push(job._id);
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { jobs: user.jobs } }
      );
    }
    res.status(201).json({ message: "Job added successfully!", job });
  } catch (error) {
    console.error("Add Job error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/jobs/search", async (req, res) => {
  const { title, location } = req.query;

  try {
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const jobs = await jobsCollection.find(query).toArray();
    res.json({ jobs });
  } catch (error) {
    console.error("Search Jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/candidates/search", async (req, res) => {
  try {
    const { query, location } = req.query;
    const filters = {};
    if (query) {
      filters.$or = [
        { name: { $regex: query, $options: "i" } },
        { skills: { $regex: query, $options: "i" } },
        { jobTitle: { $regex: query, $options: "i" } },
      ];
    }
    if (location) {
      filters.location = { $regex: location, $options: "i" };
    }
    const candidates = await userCollection.find(filters).toArray();
    res.status(200).json({ success: true, candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.get("/api/job/search", async (req, res) => {
  const { jobId } = req.query;

  try {
    const job = await jobsCollection.findOne({
      _id: new ObjectId(jobId.toString()),
    });
    res.json({ job });
  } catch (error) {
    console.error("Search Jobs error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a password reset token
    const token = crypto.randomBytes(32).toString("hex");

    // Set token and expiration on user object
    const resetToken = {
      token,
      expires: Date.now() + 3600000, // Token expires in 1 hour
    };

    await userCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken.token,
          resetPasswordExpires: resetToken.expires,
        },
      }
    );

    // Send password reset email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use environment variables for sensitive data
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link to reset your password: 
            http://localhost:3000/reset-password/${token}`,
    };

    await sendEmail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/api/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find user with the given reset token and check expiration
    const user = await userCollection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and remove reset token and expiration
    await userCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      }
    );

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/api/edit-profile", async (req, res) => {
  const {
    name,
    email,
    jobTitle,
    password,
    type,
    subscriptionStatus,
    location,
    phone,
    aboutMe,
    skills,
    experience,
    education,
    resume,
  } = req.body;
  try {
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (jobTitle) updateFields.jobTitle = jobTitle;
    if (location) updateFields.location = location;
    if (phone) updateFields.phone = phone;
    if (type) updateFields.type = type;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    if (aboutMe) updateFields.aboutMe = aboutMe;
    if (skills) updateFields.skills = skills;
    if (experience) updateFields.experience = experience;
    if (education) updateFields.education = education;
    if (resume) {
      updateFields.resume = resume;
    }
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = await userCollection.updateOne(
      { _id: user._id },
      { $set: updateFields }
    );
    const user1 = await userCollection.findOne({ email });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        jobTitle: user.jobTitle,
        location: user.location,
        phone: user.phone,
        type: user.type,
        jobs: user.jobs,
        subscriptionStatus: user.subscription,
        resume: user.resume,
        aboutMe: user.aboutMe,
        skills: user.skills,
        experience: user.experience,
        education: user.education,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Edit profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/api/apply", async (req, res) => {
  const { userId, jobId } = req.body;
  try {
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });
    const job = await jobsCollection.findOne({
      _id: new ObjectId(jobId.toString()),
    });
    console.log("user", user, job);
    if (!user || !job) {
      return res.status(404).json({ message: "User or Job not found" });
    }

    if (!user.appliedJobs) user.appliedJobs = [];

    if (!user.appliedJobs.includes(new ObjectId(jobId.toString()))) {
      user.appliedJobs.push(job._id);
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { appliedJobs: user.appliedJobs } }
      );
    }

    if (!job.applications) job.applications = [];
    const applicationExists = job.applications.some((app) =>
      app.userId.equals(new ObjectId(userId))
    );
    if (!applicationExists) {
      job.applications.push({
        userId: user._id,
        status: "Applied",
        appliedOn: new Date(),
      });
      await jobsCollection.updateOne(
        { _id: job._id },
        { $set: { applications: job.applications } }
      );
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Your Application for Job : ${job.title} was successful`,
      text: `Dear ${user.name},\n\n You have successfully applied for the job  ${job.title} .\n\nBest regards,\n ${job.company}`,
    };
    await sendEmail(mailOptions);
    res.status(200).json({ message: "Application successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/myjobs", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const appliedJobIds = user.appliedJobs.map((jobId) => new ObjectId(jobId));
    const jobs = await jobsCollection
      .find({ _id: { $in: appliedJobIds } })
      .toArray();
    const jobsWithStatus = jobs.map((job) => {
      const application = job.applications.find((app) =>
        app.userId.equals(new ObjectId(userId))
      );

      return {
        ...job,
        status: application ? application.status : "Not Applied",
      };
    });

    console.log("Applied Jobs:", jobsWithStatus);
    res.status(200).json(jobsWithStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/savedjobs", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const savedJobIds = user.savedJobs.map((jobId) => new ObjectId(jobId));
    const jobs = await jobsCollection
      .find({ _id: { $in: savedJobIds } })
      .toArray();

    console.log("Applied Jobs:", jobs);
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/api/fetchjobs", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const jobIds = user.jobs.map((jobId) => new ObjectId(jobId));
    const jobs = await jobsCollection.find({ _id: { $in: jobIds } }).toArray();

    console.log("Applied Jobs:", jobs);
    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
app.put("/api/savejob", async (req, res) => {
  const { userId, jobId } = req.body;
  try {
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });
    const job = await jobsCollection.findOne({
      _id: new ObjectId(jobId.toString()),
    });
    console.log("user", user, job);
    if (!user || !job) {
      return res.status(404).json({ message: "User or Job not found" });
    }

    if (!user.savedJobs) user.savedJobs = [];

    if (!user.savedJobs.includes(new ObjectId(jobId.toString()))) {
      user.savedJobs.push(job._id);
      await userCollection.updateOne(
        { _id: user._id },
        { $set: { savedJobs: user.savedJobs } }
      );
    }

    if (!job.saves) job.saves = [];
    const saveExists = job.saves.some((app) =>
      app.userId.equals(new ObjectId(userId))
    );
    if (!saveExists) {
      job.saves.push({ userId: user._id, status: "Applied" });
      await jobsCollection.updateOne(
        { _id: job._id },
        { $set: { saves: job.saves } }
      );
    }

    res.status(200).json({ message: "save successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

async function sendEmail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
app.delete("/api/deletejob/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!ObjectId.isValid(jobId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID" });
    }
    const result = await jobsCollection.deleteOne({ _id: new ObjectId(jobId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.put("/api/editjob/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const updatedJobData = req.body;
    const job = await jobsCollection.findOne({
      _id: new ObjectId(jobId.toString()),
    });
    if (!job) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid job ID" });
    }
    if (
      !updatedJobData.title ||
      !updatedJobData.company ||
      !updatedJobData.location ||
      !updatedJobData.description
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All job fields are required" });
    }
    const result = await jobsCollection.updateOne(
      { _id: job._id },
      { $set: updatedJobData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
app.post("/api/subscriptions", async (req, res) => {
  try {
    const { userId, plan, price, durationInMonths } = req.body;

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + durationInMonths);

    const subscription = {
      userId: new ObjectId(userId),
      plan,
      price,
      startDate,
      endDate,
      status: "active",
    };

    const result = await subscriptionCollection.insertOne(subscription);
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });
    console.log("result", result);
    if (!user.subscription) user.subscription = [];
    if (
      !user.subscription.includes(new ObjectId(result.insertedId.toString()))
    ) {
      user.subscription.push(result.insertedId);
      await userCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { subscription: user.subscription } }
      );
    }
    res.status(201).json({
      success: true,
      message: "Subscription created",
      subscriptionId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/getsubscriptions", async (req, res) => {
  try {
    const { userId } = req.query;

    const subscription = await subscriptionCollection.findOne({
      userId: new ObjectId(userId.toString()),
    });

    if (!subscription) {
      return res
        .status(404)
        .json({ success: false, message: "No subscription found" });
    }

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.get("/api/fetchuserdata", async (req, res) => {
  try {
    const { userId } = req.query;
    const userWithSubscription = await userCollection
      .aggregate([
        { $match: { _id: new ObjectId(userId.toString()) } },
        {
          $lookup: {
            from: "subscriptions",
            localField: "subscription",
            foreignField: "_id",
            as: "subscriptionDetails",
          },
        },
        { $unwind: "$subscriptionDetails" },
      ])
      .toArray();
    if (userWithSubscription.length === 0) {
      throw new Error("User or subscription not found.");
    }

    console.log("User with Subscription:", userWithSubscription[0]);
    res.status(200).json({ success: true, data: userWithSubscription[0] });
  } catch (err) {
    console.error("Error fetching user with subscription:", err);
  }
});
app.get("/api/applications/users", async (req, res) => {
  try {
    const { jobId } = req.query;
    console.log("jobId", jobId);
    const job = await jobsCollection
      .aggregate([
        {
          $match: { _id: new ObjectId(jobId) },
        },
        {
          $lookup: {
            from: "users",
            localField: "applications.userId",
            foreignField: "_id",
            as: "applicants",
          },
        },
        {
          $unwind: {
            path: "$applicants",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            "applicants._id": 1,
            "applicants.name": 1,
            "applicants.email": 1,
            "applicants.jobTitle": 1,
            "applicants.location": 1,
            "applicants.phone": 1,
            "applicants.resume": 1,
            "applicants.username": 1,
            "applicationStatus.status": 1,
            applications: 1,
          },
        },
      ])
      .toArray();

    if (job.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    const applicants = job[0].applicants;
    res.status(200).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch applicants" });
  }
});
app.post("/api/application/update-status", async (req, res) => {
  const { jobId, userId, status } = req.body;

  if (!jobId || !userId || !status) {
    return res
      .status(400)
      .json({ error: "Job ID, User ID, and status are required." });
  }

  if (!["Shortlisted", "Rejected"].includes(status)) {
    return res
      .status(400)
      .json({ error: "Status must be either 'Shortlisted' or 'Rejected'." });
  }
  const user = await userCollection.findOne({
    _id: new ObjectId(userId.toString()),
  });
  const job = await jobsCollection.findOne({
    _id: new ObjectId(jobId.toString()),
  });
  try {
    const updateResult = await jobsCollection.updateOne(
      { _id: new ObjectId(jobId), "applications.userId": new ObjectId(userId) },
      { $set: { "applications.$.status": status } }
    );
    console.log("updateResult", updateResult);
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Job or application not found." });
    }

    res
      .status(200)
      .json({ message: `Application ${status.toLowerCase()} successfully.` });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Status updated for Job : ${job.title}`,
      text: `Dear ${user.name},\n\nWe hope this message finds you well.\n\nWe are writing to inform you that there has been an update to the status of your application for the ${job.title} position at ${job.company}.\n\nCurrent Status: ${status} \n\n Best Regards, \n ${job.company}`,
    };
    await sendEmail(mailOptions);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.get("/api/candidates", async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await userCollection.findOne({
      _id: new ObjectId(userId.toString()),
    });

    if (!user) {
      throw new Error("User  not found.");
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching user with subscription:", err);
  }
});
app.get("/chats/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const threads = await chatsCollection
      .find({ participants: userId })
      .sort({ updatedAt: -1 })
      .toArray();

    const enrichedThreads = await Promise.all(
      threads.map(async (thread) => {
        const participantIds = thread.participants.map(
          (id) => new ObjectId(id)
        );
        const participants = await userCollection
          .find({ _id: { $in: participantIds } })
          .project({ name: 1 })
          .toArray();

        return {
          ...thread,
          participants: participants.map((participant) => ({
            id: participant._id,
            name: participant.name,
          })),
        };
      })
    );

    return res.json({ threads: enrichedThreads });
  } catch (error) {
    console.error("Error fetching chat threads:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching threads" });
  }
});
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
