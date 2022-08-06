import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from './emailService';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let GetTopDoctorsHomepage = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limitInput) {
                limitInput = 10;
            }
            let users = await db.User.findAll({
                limit: limitInput,
                where: {
                    roleId: 'R2'
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor,
                        attributes: [],
                        include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['nameVi', 'nameEn'] }
                        ]
                    }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getetAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2'
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor,
                        attributes: [],
                        include: [
                            { model: db.Specialty, as: 'specialtyData', attributes: ['nameVi', 'nameEn'] },
                            { model: db.Clinic, as: 'clinicData', attributes: ['nameVi', 'nameEn'] }
                        ]
                    }
                ],
                raw: true,
                nest: true
            })

            //decode-base64
            if (doctors && doctors.length > 0) {
                doctors.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let createDoctorInfo = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.priceId
                || !inputData.provinceId || !inputData.paymentId
                || !inputData.clinicId || !inputData.specialtyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }

            let existingMarkdown = await db.Markdown.findOne({
                where: {
                    doctorId: inputData.doctorId
                }
            })
            if (!existingMarkdown) {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
            }
            let existingDetail = await db.Doctor.findOne({
                where: {
                    doctorId: inputData.doctorId
                }
            })
            if (!existingDetail) {
                await db.Doctor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.priceId,
                    provinceId: inputData.provinceId,
                    paymentId: inputData.paymentId,
                    clinicId: inputData.clinicId,
                    specialtyId: inputData.specialtyId,
                    note: inputData.note
                })
            }

            if (existingMarkdown && existingDetail) {
                resolve({
                    errCode: 3,
                    errMessage: 'Doctor Info is existing!'
                })
            }

            resolve({
                errCode: 0,
                errMessage: 'OK'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getDoctorInfo = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let doctorInfo = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor,
                            attributes: ['priceId', 'provinceId', 'paymentId', 'specialtyId', 'clinicId', 'note'],
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Clinic, as: 'clinicData', attributes: ['nameEn', 'nameVi', 'address'] },
                                { model: db.Specialty, as: 'specialtyData', attributes: ['nameEn', 'nameVi'] },
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (!doctorInfo) {
                    doctorInfo = {}
                }
                //decode-base64
                if (doctorInfo && doctorInfo.image) {
                    doctorInfo.image = Buffer.from(doctorInfo.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    doctorInfo
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let editDoctorInfo = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            }

            let doctorMarkdown = await db.Markdown.findOne({
                where: {
                    doctorId: inputData.doctorId
                }
            })
            let doctorDetail = await db.Doctor.findOne({
                where: {
                    doctorId: inputData.doctorId
                }
            })
            if (!doctorMarkdown || !doctorDetail) {
                resolve({
                    errCode: 2,
                    errMessage: 'Doctor not found!'
                })
            }

            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;

            doctorDetail.priceId = inputData.priceId;
            doctorDetail.provinceId = inputData.provinceId;
            doctorDetail.paymentId = inputData.paymentId;
            doctorDetail.clinicId = inputData.clinicId;
            doctorDetail.specialtyId = inputData.specialtyId;
            doctorDetail.note = inputData.note;

            await doctorMarkdown.save();
            await doctorDetail.save();

            resolve({
                errCode: 0,
                errMessage: 'OK'
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getMarkdown = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let infoMarkdown = await db.Markdown.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    infoMarkdown
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (scheduleInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!scheduleInput.result || !scheduleInput.doctorId || !scheduleInput.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }
            let schedule = scheduleInput.result;
            if (schedule && schedule.length > 0) {
                schedule = schedule.map((item) => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                })
            }

            //get all existing data
            let existing = await db.Schedule.findAll({
                where: {
                    doctorId: scheduleInput.doctorId,
                    date: scheduleInput.date
                },
                attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                raw: true
            })

            //convert date to timestamp
            // if (existing && existing.length > 0) {
            //     existing = existing.map((item) => {
            //         item.date = new Date(item.date).getTime();
            //         return item;
            //     })
            // }

            //compare different vs DB
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && +a.date === +b.date;   // + : convert string to integer
            })

            //create data
            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate);
            }

            resolve({
                errCode: 0,
                errMessage: 'OK'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!schedule) {
                    schedule = []
                }
                resolve({
                    errCode: 0,
                    schedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDoctorInfoExtra = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }

            let infoExtra = await db.Doctor.findOne({
                where: {
                    doctorId: doctorId
                },
                attributes: {
                    exclude: ['id', 'doctorId']
                },
                include: [
                    { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Clinic, as: 'clinicData', attributes: ['nameEn', 'nameVi', 'address'] }
                ],
                raw: false,
                nest: true
            })
            if (!infoExtra) {
                infoExtra = []
            }
            resolve({
                errCode: 0,
                infoExtra
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getDoctorInfoGeneral = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            }

            let infoGeneral = await db.User.findOne({
                where: {
                    id: doctorId
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, attributes: ['description'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor,
                        attributes: ['priceId', 'provinceId', 'paymentId', 'clinicId', 'note'],
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            // { model: db.Clinic, as: 'clinicData', attributes: ['nameEn', 'nameVi', 'address'] },
                            // { model: db.Specialty, as: 'specialtyData', attributes: ['nameEn', 'nameVi'] },
                        ]
                    },
                ],
                raw: false,
                nest: true
            })
            if (!infoGeneral) {
                infoGeneral = {}
            }
            //decode-base64
            if (infoGeneral && infoGeneral.image) {
                infoGeneral.image = Buffer.from(infoGeneral.image, 'base64').toString('binary');
            }

            resolve({
                errCode: 0,
                infoGeneral
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllPatientByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let allPatient = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    attributes: ['reason', 'timeType', 'patientId'],
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['firstName', 'email', 'phonenumber', 'address'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueVi', 'valueEn'] }
                            ]
                        },
                        { model: db.Allcode, as: 'timeBooking', attributes: ['valueVi', 'valueEn'] }
                    ]
                })
                resolve({
                    errCode: 0,
                    allPatient
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId
                || !data.firstName || !data.date
                || !data.timeType || !data.patientId
                || !data.language || !data.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        date: data.date,
                        timeType: data.timeType,
                        statusId: 'S2'
                    }
                })
                if (appointment) {
                    appointment.statusId = 'S3'

                    await appointment.save();
                }

                await emailService.sendAttachment({
                    language: data.language,
                    patientName: data.firstName,
                    image: data.image,
                    receiverEmail: data.email
                })

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
    GetTopDoctorsHomepage,
    getetAllDoctors,
    createDoctorInfo,
    getDoctorInfo,
    editDoctorInfo,
    getMarkdown,
    bulkCreateSchedule,
    getScheduleByDate,
    getDoctorInfoExtra,
    getDoctorInfoGeneral,
    getAllPatientByDate,
    sendRemedy
}