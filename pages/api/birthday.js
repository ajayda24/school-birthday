// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {getData,addData} from '../../firebase'


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
