import { useState, useEffect } from "react";

import BirthdayForm from "../components/NewBirthday/index";

const newBirthday = () => {
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
            paddingTop:'2rem',
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
      <BirthdayForm setMessage={setMessage} />
    </>
  );
};

export default newBirthday;
