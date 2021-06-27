import nextConnect from "next-connect";
import multer from "multer";

import { getData, addData, editData } from "../../firebase";

var birthdayList = [];
var imageName;

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/images/students",
    filename: (req, file, cb) => {
      imageName = `${req.body.class.toUpperCase()}-${req.body.division.toUpperCase()}-${
        req.body.roll
      }.${file.originalname.split(".").pop()}`;
      return cb(null, imageName);
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    console.log(error);
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.array("image"));

apiRoute.post(async (req, res) => {
  birthdayList = [...(await getData())];
  const lastStudentId = birthdayList
    .map((d) => d.sId)
    .sort((a, b) => a - b)
    .pop();
  const { name, division, roll } = req.body;
  const date = new Date(req.body.date)
    .toLocaleDateString("en-GB")
    .split("/")
    .splice(0, 2)
    .join("-");
  if (req.body.action == "add") {
    await addData({
      id:
        birthdayList.length > 0 ? (Number(lastStudentId) + 1).toString() : "1",
      name: name.toUpperCase(),
      date: date,
      class: req.body.class.toUpperCase(),
      division: division.toUpperCase(),
      picId: `${req.body.class.toUpperCase()}-${division.toUpperCase()}-${roll}`,
      imageName: imageName,
    });
    res.status(201).json({
      message: "New Birthday added successfully",
    });
  } else if (req.body.action == "edit") {
    const [msg,err] = await editData(req.body.editId, {
      name: name && name.toUpperCase(),
      date: date,
      class: req.body.class && req.body.class.toUpperCase(),
      division: division && division.toUpperCase(),
      picId:
        req.body.class &&
        division &&
        `${req.body.class.toUpperCase()}-${division.toUpperCase()}-${roll}`,
      imageName: imageName,
    });
    res.status(201).json({
      message: msg,
    });
  }
});

apiRoute.get(async (req, res) => {
  birthdayList = [...(await getData())];
  res.status(200).json({
    message: "All Birthday loaded successfully",
    data: birthdayList,
  });
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
