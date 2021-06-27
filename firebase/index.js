// const firebase = require("./firebase");
// const birthdayListJson = require('../data/birthdayNew.json')
import firebase from "./firebase";
// import birthdayListJson from '../data/birthdayNew.json'

const db = firebase.firestore();


export async function getData() {
  const birthdays = [];
  await db
    .collection("birthday")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        var allBirthday = {
          docId: doc.id,
          sId: doc.data().sId,
          name: doc.data().name,
          date: doc.data().date,
          class: doc.data().class,
          division: doc.data().division,
          roll: doc.data().picId.split('-')[2],
          picId: doc.data().picId,
          imageName:doc.data().imageName || null
        };
        birthdays.push(allBirthday);
      });
    });
  return birthdays;
}

export async function addData(data) {
  const q = await db.collection("birthday").add({
    sId: data.id,
    picId:data.picId,
    name: data.name,
    class: data.class,
    division: data.division,
    date: data.date,
    imageName:data.imageName
  });
  return q;
}
export async function editData(docId,data) {
  const w = await db.collection('birthday').doc(docId).get()
  try {
    var imageName = data.imageName;
    if (!data.imageName) imageName = w.data().imageName;
    if (!w.data().imageName) imageName = ''
      await db
        .collection("birthday")
        .doc(docId)
        .update({
          picId: data.picId || w.data().picId,
          name: data.name || w.data().name,
          class: data.class || w.data().class,
          division: data.division || w.data().division,
          date: data.date == "Invalid Date" ? w.data().date : data.date,
          imageName: imageName,
        });
    return ["Edited student successfully",null];
  } catch (err) {
    console.log(err);
    return ["Something went wrong!", err];
  }
}

export async function getSingleData(docId){
  return await db.collection("birthday").doc(docId).get();
}

export async function deleteData(docId){
  try{
    await db.collection("birthday").doc(docId).delete();
    return ["Deleted student successfully",null];
  }catch(err){
    return ['Something went wrong!',err]
  }
}


// birthdayListJson.forEach(doc=>{
//   addData(doc);
// })