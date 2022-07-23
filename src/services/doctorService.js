import db from '../models/index';
require('dotenv').config();
import _, { reject } from 'lodash';

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
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
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
                attributes: {
                    exclude: ['password', 'image']
                }
            })

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
                || !inputData.nameClinic || !inputData.addressClinic) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
                await db.Doctor.create({
                    doctorId: inputData.doctorId,
                    priceId: inputData.priceId,
                    provinceId: inputData.provinceId,
                    paymentId: inputData.paymentId,
                    nameClinic: inputData.nameClinic,
                    addressClinic: inputData.addressClinic,
                    note: inputData.note
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
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!doctorInfo) {
                    doctorInfo = {}
                }
                //decode-base64
                if (doctorInfo && doctorInfo.image) {
                    doctorInfo.image = new Buffer(doctorInfo.image, 'base64').toString('binary');
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
            } else {
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
                doctorDetail.nameClinic = inputData.nameClinic;
                doctorDetail.addressClinic = inputData.addressClinic;
                doctorDetail.note = inputData.note;

                await doctorMarkdown.save();
                await doctorDetail.save();
            }
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
            console.log(scheduleInput.date)
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
            console.log('check existing: ', existing)

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
            }
            let schedule = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }
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
    getScheduleByDate
}