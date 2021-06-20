// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";

const folderPath = path.join(process.cwd(),'data')
const filePath = path.join(process.cwd(),"data", "birthday.json");

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, {
    recursive: true,
  });
  fs.writeFileSync(filePath, JSON.stringify([]));
}

const birthdayList = JSON.parse(fs.readFileSync(filePath));


const handler = (req, res) => {
  if (req.method == "POST") {
    const { studentName, studentBirthday } = req.body;
    birthdayList.push({
      id: birthdayList.length > 0 ?(Number(birthdayList[birthdayList.length - 1].id) + 1).toString() : '1',
      name: studentName,
      date: studentBirthday,
    });
    fs.writeFileSync(filePath, JSON.stringify(birthdayList));
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
