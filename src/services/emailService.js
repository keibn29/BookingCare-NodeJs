require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Kei Nguyen" <keibn29@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: renderSubjectByLanguage(dataSend), // Subject line
        html: renderHTMLByLanguage(dataSend), // html body
    });
}

let renderSubjectByLanguage = (dataSend) => {
    if (dataSend.language === 'vi') {
        return 'Thông tin đặt lịch khám bệnh'
    }
    if (dataSend.language === 'en') {
        return 'Information to book a medical appointment'
    }
}

let renderHTMLByLanguage = (dataSend) => {
    if (dataSend.language === 'vi') {
        return `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trực tuyến trên BookingCare</p>
        <p>Thông tin lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào liên kết dưới đây để hoàn tất quá trình đặt lịch khám bệnh</p>
        <div>
            <a href=${dataSend.redirectLink} target='_blank' >Click here</a>
        </div>

        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        return `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment on BookingCare</p>
        <p>Information on medical examination schedule:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is correct, please click on the link below to complete the medical appointment booking process</p>
        <div>
            <a href=${dataSend.redirectLink} target='_blank' >Click here</a>
        </div>

        <div>Best regards!</div>
        `
    }
}

let sendAttachment = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Kei Nguyen" <keibn29@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: renderSubjectAttachment(dataSend), // Subject line
        html: renderHTMLAttachment(dataSend), // html body
        attachments: [
            {
                filename: `Remedy-${dataSend.patientName}.png`,
                content: dataSend.image.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    });
}

let renderSubjectAttachment = (dataSend) => {
    if (dataSend.language === 'vi') {
        return 'Thông tin đơn thuốc/hóa đơn khám bệnh'
    }
    if (dataSend.language === 'en') {
        return 'Information on prescription/medical bill'
    }
}

let renderHTMLAttachment = (dataSend) => {
    if (dataSend.language === 'vi') {
        return `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã hoàn thành buổi khám bệnh với BookingCare</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong tệp đính kèm</p>

        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        return `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you completed a medical appointment with BookingCare</p>
        <p>Prescription/invoice information is sent in the attachment</p>

        <div>Best regards!</div>
        `
    }
}


module.exports = {
    sendSimpleEmail,
    sendAttachment
}