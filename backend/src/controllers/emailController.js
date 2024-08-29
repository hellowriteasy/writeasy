const userServiceClass = require("../services/userService");

const sendEmailToAllUsers = async (req, res) => {
  let { subject, content } = req.body;
  const userService = new userServiceClass();

  try {
    if (!subject || !content) {
      throw new Error({ status: 400, message: "Please fill all the fields." });
    }
    res.status(200).json({ message: "Email sent successfully." });
    content = content
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("");
    await userService.emailAllUsers(subject, content);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  sendEmailToAllUsers,
};
