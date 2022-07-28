import db from '../models/index';

let createSpecialty = (specialtyData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyData.specialName || !specialtyData.contentMarkdown
                || !specialtyData.contentHTML || !specialtyData.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Specialty.create({
                    name: specialtyData.specialName,
                    image: specialtyData.image,
                    descriptionMarkdown: specialtyData.contentMarkdown,
                    descriptionHTML: specialtyData.contentHTML
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
    createSpecialty
}