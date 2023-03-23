import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT), 
    secure: false,
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS, 
    },
    

});


export const sendMail = (mailRecipientList: string[], contentHTML: string, subject: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const mailOptions = {
                from: "noresponder@perseo.ec" ,
                to: mailRecipientList,
                subject: subject,
                html: contentHTML
            };
            transporter.sendMail(mailOptions).then((resp) => {
                resolve(resp.envelope);
            },(error) => {
                reject(error);
            });
        } catch (error) {
            reject(error);
        }
    });
}