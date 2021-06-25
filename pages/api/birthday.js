// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";

import {getData,addData} from '../../firebase'

// const folderPath = path.join(process.cwd(),'data')
// const filePath = path.join(process.cwd(),"data", "birthday.json");

// if (!fs.existsSync(folderPath)) {
//   fs.mkdirSync(folderPath, {
//     recursive: true,
//   });
//   fs.writeFileSync(filePath, JSON.stringify([]));
// }

// const birthdayList = JSON.parse(fs.readFileSync(filePath));


var birthdayList = []

const handler = async (req, res) => {
  birthdayList = [...await getData()]
  const lastStudentId = birthdayList
    .map((d) => d.sId)
    .sort((a, b) => a - b)
    .pop();
  if (req.method == "POST") {
    const {
      studentName,
      studentBirthday,
      studentClass,
      studentDivision,
      studentRoll,
    } = req.body;
    await addData({
      id:
        birthdayList.length > 0 ? (Number(lastStudentId) + 1).toString() : "1",
      name: studentName,
      date: studentBirthday,
      class: studentClass,
      division: studentDivision,
      picId: `${studentClass}-${studentDivision}-${studentRoll}`,
    });
    res.status(201).json({
      message: "New Birthday added successfully",
    });
  } else if(req.method == "GET"){
    res.status(200).json({
      message: "All Birthday loaded successfully",
      data:birthdayList
    });
  }
};

export default handler;
