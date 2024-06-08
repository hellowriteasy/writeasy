const User = require("../models/user");
const { sendEmail, EmailTemplate } = require("./emailService");

class UserService {
  async emailAllUsers(subject, content) {
    const allUsers = await User.find({
      role: "user",
    });
    // send email
    const emails = allUsers.map((user) => user.email);
    console.log("sending emails to ", emails);
    await sendEmail({
      email: emails,
      html: EmailTemplate({
        heading: subject,
        message: content,
      }),
      subject,
      text: subject,
    });
  }
}

module.exports = new UserService();
