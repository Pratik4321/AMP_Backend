import { IInstructor } from "../interfaces/instructor";
import { transporter } from "../services/email";

export const sendBatchAMPEmails = async (
  instructors: IInstructor[],
  options?: string
) => {
  const emailPromises = instructors.map(async (instructor: IInstructor) => {
    const hour = new Date().getHours();
    const greeting =
      hour < 12
        ? "Good Morning"
        : hour < 18
          ? "Good Afternoon"
          : "Good Evening";

    const ampHtml = `
          <!doctype html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background: #f4f4f7;
      color: #333;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: left;
    }
    h1 {
      color: #333;
      font-size: 22px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      color: #555;
      line-height: 1.6;
      margin-bottom: 15px;
    }
    .course-box {
      background: #f9fafb;
      padding: 15px;
      border-left: 4px solid #4f46e5;
      border-radius: 6px;
      font-size: 15px;
      color: #333;
      margin-bottom: 20px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      font-size: 16px;
      font-weight: 600;
      display: block;
      margin-bottom: 10px;
    }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .radio-group label {
      display: flex;
      align-items: center;
      background: #f3f4f6;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: 0.3s;
      width: 100%;
      justify-content: center;
    }
    .radio-group input[type="radio"] {
      display: none;
    }
    .radio-group input[type="radio"]:checked + label {
      background: #4f46e5;
      color: #fff;
    }
    .button {
      display: block;
      width: 100%;
      padding: 12px;
      font-size: 16px;
      color: #fff;
      background-color: #4f46e5;
      border-radius: 6px;
      text-align: center;
      font-weight: 600;
      transition: 0.3s;
      border: none;
    }
    .button:hover {
      background-color: #4338ca;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${greeting}, ${instructor.Name}!</h1>
    <p>We have a new course available for you:</p>

    <div class="course-box">
      <strong>${instructor.Courses}</strong><br>
      ${instructor.Offering}
    </div>

    <p>Would you be available to teach this course?</p>
   
     <a href="http://localhost:3001/form?email=${instructor.Email}&course=${instructor.Courses}&avialability=''&name=${instructor.Name}&instructorId=${instructor._id}" target="_blank">
    <button style="padding: 10px 20px; background-color: green; color: white; border: none; border-radius: 5px;">Confirm in our Website</button>
  </a>

    <p class="footer">If you have any questions, feel free to reach out.</p>
  </div>
</body>
</html>

        `;

    const mailOptions = {
      from: "Admin <annasfurquan27@gmail.com>",
      to: instructor.Email,
      subject: `${options ?? ""} Availability Request for ${instructor.Courses}`,
      html: ampHtml,
      amp: ampHtml,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Email failed to ${instructor.Email}:`, error);
    }
  });

  await Promise.all(emailPromises);
};
