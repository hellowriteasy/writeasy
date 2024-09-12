const nodemailer = require("nodemailer");

class EmailService {
  async sendEmail({ subject, message, email, attachment }) {
    console.log("send email 2");
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        pass: process.env.SMTP_PW,
        user: process.env.APP_EMAIL,
      },
    });
    // Create personalized HTML content for each recipient
    let mailOptions = {
      from: '"Writeasy" <' + process.env.APP_EMAIL + ">",
      to: process.env.APP_EMAIL,
      bcc: email,
      subject: subject,
      text: subject,
      html: this.EmailTemplate({
        heading: subject,
        message: message,
      }),
    };
    console.log("send email 3");

    if (attachment) {
      mailOptions.attachments = attachment;
    }

    try {

      let info = await transporter.sendMail(mailOptions);
      console.log(`Email sent : ${info.messageId}`);
    } catch (error) {
      console.log(`Error sending email :`, error);
    }
  }
  EmailTemplate({
    heading,
    message,
    receiver_name,
    link,
    code,
    password,
    link_name,
  }) {
    const htmlContent = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
      
        <body class="" style="margin-left:auto;margin-right:auto;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;padding-left:0.5rem;padding-right:0.5rem;padding:1.5rem">
          <table  align="center" width="100%" class="" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:45.5em; padding-top:30px;background-color:white;">
            <tbody>
              <tr style="width:100%">
                <td>
                <a target="_blank" href=${
                  process.env.FRONTEND_BASE_URL
                } style="text-decoration:none">
                
               <img alt="writeasy" height="60" width="60" src= "https://firebasestorage.googleapis.com/v0/b/debai-d0809.appspot.com/o/images%2Flogo.png?alt=media&token=0b709800-aa9c-4557-88e2-6f462f6aa9b3" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto" /> </a> 
                  <div style="padding-left:1.5rem;padding-right:1.5rem;padding-bottom:2rem;">
                
                ${
                  receiver_name
                    ? `<p style="color:#4F5D68;font-size:1.125rem;line-height: 1.75rem;padding-bottom:4px;padding-top:5px">Dear ${receiver_name},</p>`
                    : ""
                }
                ${
                  message
                    ? `<p style="color:#4F5D68;font-size:1.125rem;line-height: 1.75rem;text-align:center;">${message}</p>`
                    : ""
                }
                <div style="text-align:center">
              ${
                code
                  ? `<div style="background-color:##fcba03; border-radius:0.5rem;border-width:1px;border-color:##fcba03;font-size:0.875rem;line-height:100%;color:black;padding-top:0.625rem;padding-bottom:0.625rem;padding-left:1.25rem;padding-right:1.25rem;text-decoration:none;display:inline-block;max-width:100%;padding:10px 20px 10px 20px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">${code}</span><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></div>`
                  : ""
              }
              ${
                password
                  ? `<p style="font-size:1.125rem;line-height:1.75rem;margin:16px 0;font-weight:400;text-align:center;color:#595959"> ${password}</p>`
                  : ""
              }
              ${
                link
                  ? `<a href=${link} style="text-decoration:none;margin-left:auto;margin-right:auto margin-bottom:5px;"><button style="background-color:black;cursor:pointer; border-radius:0.5rem;border-width:1px;border-color:#ebe134;font-size:0.875rem;line-height:100%;color:#ebe134;padding-top:0.625rem;padding-bottom:0.625rem;padding-left:1.25rem;padding-right:1.25rem;text-decoration:none;display:inline-block;max-width:100%;padding:10px 20px 10px 20px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:15" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:7.5px">${link_name}</span><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></button></a>`
                  : ""
              }
                  <p>If you wish to unsubscribe from our emails, please click <a target="_blank" href="${
                    process.env.FRONTEND_BASE_URL
                  }/unsubscribe" style="text-decoration:none">here</a>.</p>

              </div>
                </div>
                </div>
                </td>
                </tr>
              </tbody>
              </table>
              </body>
      
      </html>
    `;

    return htmlContent;
  }
}

module.exports = EmailService;
