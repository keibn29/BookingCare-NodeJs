import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';


let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?doctorId=${doctorId}&token=${token}`; //compare 2 key (doctorId, token)

    return result;
}

let createBookAppointment = (dataBooking) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataBooking.email || !dataBooking.doctorId
                || !dataBooking.timeType || !dataBooking.date
                || !dataBooking.fullName || !dataBooking.timeString
                || !dataBooking.address || !dataBooking.phoneNumber
                || !dataBooking.selectedGender || !dataBooking.reason) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                //không tồn tại -> tạo mới
                //upsert patient
                let patient = await db.User.findOne({
                    where: {
                        email: dataBooking.email
                    }
                })
                if (!patient) {
                    patient = await db.User.create({
                        email: dataBooking.email,
                        roleId: 'R3',
                        firstName: dataBooking.fullName,
                        address: dataBooking.address,
                        phonenumber: dataBooking.phoneNumber,
                        gender: dataBooking.selectedGender
                    })

                    //create booking record
                    await db.Booking.create({
                        statusId: 'S1',
                        patientId: patient.id,
                        doctorId: dataBooking.doctorId,
                        date: dataBooking.date,
                        timeType: dataBooking.timeType,
                        reason: dataBooking.reason,
                        token: token
                    })
                    await emailService.sendSimpleEmail({
                        receiverEmail: dataBooking.email,
                        patientName: dataBooking.fullName,
                        time: dataBooking.timeString,
                        doctorName: dataBooking.doctorName,
                        language: dataBooking.language,
                        redirectLink: buildUrlEmail(dataBooking.doctorId, token)
                    })

                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })

                } else {
                    //create booking record
                    let appointment = await db.Booking.findOne({
                        where: {
                            patientId: patient.id,
                            doctorId: dataBooking.doctorId,
                            date: '' + dataBooking.date
                        }
                    })
                    if (appointment) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Appointment already exists!'
                        })
                    }
                    if (!appointment) {
                        await db.Booking.create({
                            statusId: 'S1',
                            patientId: patient.id,
                            doctorId: dataBooking.doctorId,
                            date: dataBooking.date,
                            timeType: dataBooking.timeType,
                            reason: dataBooking.reason,
                            token: token
                        })
                        await emailService.sendSimpleEmail({
                            receiverEmail: dataBooking.email,
                            patientName: dataBooking.fullName,
                            time: dataBooking.timeString,
                            doctorName: dataBooking.doctorName,
                            language: dataBooking.language,
                            redirectLink: buildUrlEmail(dataBooking.doctorId, token)
                        })

                        patient.firstName = dataBooking.fullName;
                        patient.address = dataBooking.address;
                        patient.phonenumber = dataBooking.phoneNumber;
                        patient.gender = dataBooking.selectedGender

                        await patient.save();

                        resolve({
                            errCode: 0,
                            errMessage: 'OK'
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let verifyBookAppointment = (token, doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token || !doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: doctorId,
                        token: token,
                        statusId: 'S1'
                    }
                })
                if (appointment) {
                    appointment.statusId = 'S2'

                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Appointment has been activated or doesn't exist`
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createBookAppointment,
    verifyBookAppointment
}