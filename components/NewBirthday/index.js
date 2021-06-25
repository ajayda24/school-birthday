import { useRef } from "react";
import styles from "./style.module.css";

const Index = (props) => {
  const nameInput = useRef();
  const dateInput = useRef();
  const classInput = useRef();
  const divisionInput = useRef();
  const rollInput = useRef();

  const addBirthdayHandler = (e) => {
    e.preventDefault();
    const studentName = nameInput.current.value.toUpperCase();
    const studentBirthday = new Date(dateInput.current.value)
      .toLocaleDateString("en-GB")
      .split("/")
      .splice(0, 2)
      .join("-");
    const studentClass = classInput.current.value.toUpperCase();
    const studentDivision = divisionInput.current.value.toUpperCase();
    const studentRoll = rollInput.current.value;
      

    fetch("/api/birthday", {
      method: "POST",
      body: JSON.stringify({
        studentName,
        studentBirthday,
        studentClass,
        studentDivision,
        studentRoll,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        props.setMessage(data.message);
        nameInput.current.value = "";
        dateInput.current.value = "";
        classInput.current.value = "";
        divisionInput.current.value = "";
        rollInput.current.value = "";
        document.getElementById("name").focus();
      })
      .catch((err) => {
        console.log(err);
        props.setMessage("Something error occured");
      });
  };
  return (
    <div className={styles.container}>
      <form onSubmit={addBirthdayHandler} method="POST">
        <div className={styles.inputDiv}>
          <input
            type="text"
            name="name"
            id="name"
            ref={nameInput}
            autoComplete="off"
            required
            autoFocus
            placeholder="Name"
            className={styles.inputFullElement}
          />
        </div>
        <div className={styles.inputDiv}>
          <input
            type="date"
            name="date"
            id="date"
            ref={dateInput}
            required
            placeholder="Day & Month"
            className={styles.inputFullElement}
          />
        </div>
        <div className={styles.inputHalfDiv}>
          <div className={styles.inputDiv}>
            <input
              type="number"
              name="roll"
              id="roll"
              ref={rollInput}
              required
              placeholder="Roll No."
              className={styles.inputHalfElement}
            />
          </div>
          <div className={styles.inputDiv}>
            <input
              type="text"
              name="class"
              id="class"
              ref={classInput}
              required
              placeholder="Class"
              className={styles.inputHalfElement}
            />
          </div>
          <div className={styles.inputDiv}>
            <input
              type="text"
              name="division"
              id="division"
              ref={divisionInput}
              required
              placeholder="Division"
              className={styles.inputHalfElement}
            />
          </div>
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
