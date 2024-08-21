const User = require("../models/user");
const emailServiceClass = require("./emailService");

class UserService {
  async emailAllUsers(subject, content) {
    const emailService = new emailServiceClass();
    const allUsers = await User.find({
      role: "user",
      $or: [
        { email_unsubscribed: { $ne: true } },
        { email_unsubscribed: { $exists: false } },
      ],
    });
    // send email
    const emails = allUsers.map((user) => user.email);
    await emailService.sendEmail({
      email: emails,
      subject,
      message: content,
    });
  }
}

module.exports = UserService;
