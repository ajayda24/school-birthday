import { useRef } from "react";
import styles from "./style.module.css";

const Index = (props) => {
  const nameInput = useRef();
  const dateInput = useRef();

  const addBirthdayHandler = (e) => {
    e.preventDefault();
    const studentName = nameInput.current.value;
    const studentBirthday = new Date(dateInput.current.value)
      .toLocaleDateString("en-GB")
      .split("/")
      .splice(0, 2)
      .join("-");
    console.log(studentName, studentBirthday);
    fetch("/api/birthday", {
      method: "POST",
      body: JSON.stringify({
        studentName,
        studentBirthday,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data.message);
        props.setMessage(data.message);
        nameInput.current.value = "";
        dateInput.current.value = "";
      })
      .catch((err) => {
        console.log(err);
        props.setMessage(err.message || "Something error occured");
      });
  };
  return (
    <div className={styles.container}>
      <form onSubmit={addBirthdayHandler} method='POST'>
        <div className={styles.inputDiv}>
          <input type="text" name="name" id="name" ref={nameInput} autoComplete='off' required />
        </div>
        <div className={styles.inputDiv}>
          <input type="date" name="date" id="date" ref={dateInput} required />
        </div>
        <center>
          <button type="submit" className={styles.btn}>
            Add
          </button>
        </center>
      </form>
    </div>
  );
};

export default Index;
