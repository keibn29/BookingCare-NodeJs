import db from '../models/index';

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let allClinic = await db.Clinic.findAll();

            // //decode-base64
            // if (allClinic && allClinic.length > 0) {
            //     allClinic.map((item) => {
            //         item.image = new Buffer(item.image, 'base64').toString('binary');
            //         return item;
            //     })
            // }

            resolve({
                errCode: 0,
                allClinic
            })

        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllClinic
}
