import nodemailer from "nodemailer";
import { nodemailer_config } from "../config/config.js";

//create transport
const transport = nodemailer.createTransport({
  host: nodemailer_config.host, //simple mail transport (othercustom->eg:abc.com.np--> smtp.abc.com.np )
  port: nodemailer_config.port,
  secure: parseInt(nodemailer_config.port) === 465 ? true : false,
  service: nodemailer_config.service,
  auth: {
    user: nodemailer_config.user,
    pass: nodemailer_config.pass,
  },
});

//use transport to send mail(func)
/*
to- kaslai mail send garnay,
subject- subject k hunxa mail ko,
html- content k hunxa mail ko,
bcc, cc-> string or array ma aauna paryo
attachments - single or array ma aauxa files haru file ko path
*/
export const sendEmail = async ({to,subject,html,cc=null ,bcc = null, attachments = null }) => {
  const options = { //tala ko default nai hunxa mail ko lagi
    to: to,
    from: nodemailer_config.user,
    subject: subject,
    //   text: "Hello from email service",
    html: html,
  };

  if(cc){
    options ['cc'] = cc
  }
  if(bcc){
    options ['bcc'] = bcc
  }
  if(attachments){
    options['attachments'] = attachments
  }

  try {
    await transport.sendMail(options);  //mail send garxa
    console.log("Email sent!");
  } catch (error) {
    console.log("Email sending error");
  }
};
