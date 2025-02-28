import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const { MAIL_SERVICE, MAIL_USER, MAIL_PASS, MAIL_PORT, MAIL_HOST } =
  process.env;

async function sendMail(to, subject, text, html) {
  let transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, 
    },
   
    port: MAIL_PORT,
    host: MAIL_HOST,
  });

  let info = await transporter.sendMail({
    from: MAIL_USER, // Ваша електронна адреса відправника
    to: to, // Одержувач vitaliyfront@gmail.com
    subject: subject, // Тема
    text: text, // Текст листа
    html: html, // HTML-версія листа
  });

  console.log('Message sent: %s', info.messageId);
}
export default sendMail;
