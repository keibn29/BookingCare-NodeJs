import db from '../models/index';
import emailService from './emailService';

let createBookAppointment = (dataBooking) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataBooking.email || !dataBooking.doctorId ||
                !dataBooking.timeType || !dataBooking.date ||
                !dataBooking.fullName || !dataBooking.timeString) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {

                await emailService.sendSimpleEmail({
                    receiverEmail: dataBooking.email,
                    patientName: dataBooking.fullName,
                    time: dataBooking.timeString,
                    doctorName: dataBooking.doctorName,
                    language: dataBooking.language,
                    redirectLink: 'https://www.facebook.com/keibn29'
                })

                //không tồn tại -> tạo mới
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: {
                        email: dataBooking.email
                    },
                    defaults: {
                        email: dataBooking.email,
                        roleId: 'R3'
                    }
                })
                //create booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            // doctorId: dataBooking.doctorId,
                            // date: dataBooking.date,
                            // timeType: dataBooking.timeType
                        },
                        defaults: {
                            statusId: 'S1',
                            patientId: user[0].id,
                            doctorId: dataBooking.doctorId,
                            date: dataBooking.date,
                            timeType: dataBooking.timeType
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createBookAppointment
}