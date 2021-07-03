import Head from 'next/head'
import { useState, useEffect } from "react";
import { addData, getData } from "../firebase";
import cloudinary from '../cloudinary'

import BirthdayForm from "../components/NewBirthday/index";

const newBirthday = (props) => {
  const [message, setMessage] = useState();
  const [time,setTime] = useState()
  useEffect(() => {
    setTimeout(() => {
      if (message) {
        setMessage(null);
      }
    }, time || 2000);
  }, [message]);

  const setMessageHandler = (msg,time) => {
    setMessage(msg)
    setTime(time)
  }

  return (
    <>
      {message && (
        <div
          style={{
            textAlign: 'center',
            fontSize: '3rem',
            margin: 'auto',
            marginTop: '5rem',
            paddingTop: '2rem',
            color: 'blue',
            fontWeight: 'bold',
            backgroundColor: '#879ed1',
            width: '60%',
            height: '10rem',
          }}
        >
          {message}
        </div>
      )}
      <BirthdayForm
        setMessage={setMessageHandler}
        fullList={props.birthdayList}
        studentImages={props.images}
      />
    </>
  )
};

export default newBirthday;

export async function getServerSideProps() {
  const birthdayList = await getData();
  const { resources } = await cloudinary.search
    .expression('folder:school_birthday')
    .sort_by('public_id', 'desc')
    .execute()
  const publicIds = resources.map((file) => file.public_id)
  return {
    props: {
      birthdayList: birthdayList,
      images: publicIds,
    },
  }
}