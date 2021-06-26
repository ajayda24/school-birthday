import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {

  const form = new IncomingForm();
  const directoryPath = `./public/images/students`;
  form.keepExtensions = true;
  form.on("fileBegin", function (name, file) {
    file.path = directoryPath + "/" + file.name;
  });
  form.parse(req, async function (err, fields, files) {
    if (err) console.log(err);
    else {
      console.log(files.file.name);
    }
  });
  res.status(200).send({});
};
