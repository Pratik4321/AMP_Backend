import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "annasfurquan27@gmail.com",
    pass: "rpeu mugu ssel aram",
  },
});
