// const firebase = require("./firebase");
// const birthdayListJson = require('../data/birthdayNew.json')
import firebase from "./firebase";
import birthdayListJson from '../data/birthdayNew.json'

const db = firebase.firestore();

export async function getData() {
  const birthdays = [];
  await db
    .collection("birthday")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        var allBirthday = {
          sId: doc.data().sId,
          name: doc.data().name,
          date: doc.data().date,
          class: doc.data().class,
          division: doc.data().division,
          picId: doc.data().picId,
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
  });
  return q;
}


// birthdayListJson.forEach(doc=>{
//   addData(doc);
// })