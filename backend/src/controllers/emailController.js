const userService = require("../services/userService");

const sendEmailToAllUsers = async (req, res) => {
    const { subject, content } = req.body;
  try {
    if (!subject || !content) {
      throw new Error({ status: 400, message: "Please fill all the fields." });
    }

    await userService.emailAllUsers(subject, content);
    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.log(error?.status);

    return res
      .status( 500)
      .json({ message:  "Internal server error" });
  }
};

module.exports = {
    sendEmailToAllUsers
}