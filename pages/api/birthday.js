import { getData, addData, editData, deleteData } from '../../firebase'
import cloudinary from '../../cloudinary'

var birthdayList = []
var imageName

const handler = async (req, res) => {
  if (req.method == 'POST') {
    birthdayList = [...(await getData())]
    const lastStudentId = birthdayList
      .map((d) => d.sId)
      .sort((a, b) => a - b)
      .pop()
    var date
    if (req.body.action == 'add' || req.body.action == 'edit') {
      date = new Date(req.body.date)
        .toLocaleDateString('en-GB')
        .split('/')
        .splice(0, 2)
        .join('-')
    }

    var uploadImageResponse

    if (req.body.isImage) {
      uploadImageResponse = await cloudinary.uploader.upload(req.body.image, {
        upload_preset: 'school_birthday',
        public_id: `${req.body.class.toUpperCase()}-${req.body.division.toUpperCase()}-${
          req.body.roll
        }`,
      })
    }
    if (req.body.isImage && !uploadImageResponse) {
      return res.status(500).json({
        message: 'Server error try again!',
      })
    }
    if (req.body.action == 'add') {
      await addData({
        id:
          birthdayList.length > 0
            ? (Number(lastStudentId) + 1).toString()
            : '1',
        name: req.body.name.toUpperCase(),
        date: date,
        class: req.body.class.toUpperCase(),
        division: req.body.division.toUpperCase(),
        picId: `${req.body.class.toUpperCase()}-${req.body.division.toUpperCase()}-${
          req.body.roll
        }`,
        imageName: req.body.isImage && uploadImageResponse['secure_url'] || '',
      })
      res.status(201).json({
        message: 'New Birthday added successfully',
      })
    } else if (req.body.action == 'edit') {
      const [msg, err] = await editData(req.body.editId, {
        name: req.body.name && req.body.name.toUpperCase(),
        date: date,
        class: req.body.class && req.body.class.toUpperCase(),
        division: req.body.division && req.body.division.toUpperCase(),
        picId:
          req.body.class &&
          req.body.division &&
          `${req.body.class.toUpperCase()}-${req.body.division.toUpperCase()}-${
            req.body.roll
          }`,
        imageName: req.body.isImage && uploadImageResponse['secure_url'] || '',
      })
      res.status(201).json({
        message: msg,
      })
    } else if (req.body.action == 'delete') {
      const { docId, imageUrl } = req.body
      var [msg, err] = await deleteData(docId)
      if (imageUrl) {
        const split = imageUrl.split('/')
        const publicId = split
          .slice(Math.max(split.length - 2, 0))
          .join('/')
          .split('.')[0]
        try {
          const deleteImageResponse = await cloudinary.uploader.destroy(publicId)
        } catch (error) {
          msg = 'Something went wrong!'
        }
      }
      res.status(201).json({
        message: msg,
      })
    }
  } else if (req.method == 'GET') {
    birthdayList = [...(await getData())]
    res.status(200).json({
      message: 'All Birthday loaded successfully',
      data: birthdayList,
    })
  }
}

export default handler
