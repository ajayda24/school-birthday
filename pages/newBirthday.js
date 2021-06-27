import Head from 'next/head'
import { useState, useEffect } from "react";
import { addData, getData } from "../firebase";

import BirthdayForm from "../components/NewBirthday/index";

const newBirthday = (props) => {
  const [message, setMessage] = useState();
  useEffect(() => {
    setTimeout(() => {
      if (message) {
        setMessage(null);
      }
    }, 2000);
  }, [message]);

  return (
    <>
      {message && (
        <div
          style={{
            textAlign: "center",
            fontSize: "3rem",
            margin: "auto",
            marginTop: "5rem",
            paddingTop: "2rem",
            color: "blue",
            fontWeight: "bold",
            backgroundColor: "#879ed1",
            width: "60%",
            height: "10rem",
          }}
        >
          {message}
        </div>
      )}
      <BirthdayForm setMessage={setMessage} fullList={props.birthdayList} />
    </>
  );
};

export default newBirthday;

export async function getServerSideProps() {
  const birthdayList = await getData();
  return {
    props: {
      birthdayList: birthdayList,
    },
  };
}