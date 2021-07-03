import { useEffect, useRef, useState } from 'react'
import { Image } from 'cloudinary-react'
import { getSingleData, deleteData } from '../../firebase'
import styles from './style.module.css'

import 'datatables.net-dt/css/jquery.dataTables.min.css'
import $ from 'jquery'
// import 'jquery/dist/jquery'
import datatable from 'datatables.net'
$.DataTable = datatable

const Index = (props) => {
  const [editMode, setEditMode] = useState(false)
  const [editStudentId, setEditStudentId] = useState()
  const [editStudentDetails, setEditStudentDetails] = useState({})

  const [previewFile, setPreviewFile] = useState()
  const [isImage, setIsImage] = useState(false)

  const previewFileHandler = (file) => {
    setIsImage(true)
    const reader = new FileReader()
    reader.readAsDataURL(file.target.files[0])
    reader.onloadend = () => {
      setPreviewFile(reader.result)
    }
  }

  useEffect(() => {
    $(document).ready(function () {
      $('#birthdayListTable').DataTable()
    })
  }, [])
  const studentEditHandler = async (docId) => {
    props.setMessage('Loading...',5000)
    window.scrollTo(0, 0)
    getSingleData(docId).then((q) => {
      props.setMessage(null)
      setEditMode(true)
      setEditStudentId(docId)
      setEditStudentDetails({
        name: q.data().name,
        date: q.data().date,
        roll: q.data().picId.split('-').pop(),
        class: q.data().class,
        division: q.data().division,
      })

      document.getElementById('pageDivId').classList.add(styles.pageDiv)
    })
  }

  const studentDeleteHandler = async (docId,imageUrl) => {
    props.setMessage('Loading...', 10000)
    window.scrollTo(0, 0)
    fetch('/api/birthday', {
      method: 'POST',
      body: JSON.stringify({
        action: 'delete',
        docId: docId,
        imageUrl: imageUrl,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((r) => {
        props.setMessage('Processing...')
        return r.json()
      })
      .then((data) => {
        props.setMessage(data.message, 2000)
        setTimeout(() => {
          location.reload()
        }, 2000)
      })
      .catch((err) => {
        console.log(err)
        props.setMessage('Something error occured. Try Again.')
      })
    // setTimeout(async () => {
    //   const [msg, err] = await deleteData(docId,imageUrl)
    //   props.setMessage(msg)
    //   setTimeout(() => {
    //     location.reload()
    //   }, 2000)
    // }, 1000)
  }
  function confirmDelete(docId,imageUrl) {
    bootbox.confirm({
      title: 'Delete Student?',
      message: 'Do you want to delete this student now? This cannot be undone.',
      buttons: {
        cancel: {
          label: '<i class="fa fa-times"></i> Cancel',
        },
        confirm: {
          label: '<i class="fa fa-check"></i> Delete',
        },
      },
      callback: function (result) {
        if (result) {
          studentDeleteHandler(docId, imageUrl)
        } else {
          return
          // location.reload("/newBirthday");
        }
      },
    })
  }
  const nameInput = useRef()
  const dateInput = useRef()
  const classInput = useRef()
  const divisionInput = useRef()
  const rollInput = useRef()

  const addBirthdayHandler = async (e, action) => {
    e.preventDefault()
    var formData = {
      name: e.target.name.value,
      class: e.target.class.value,
      roll: e.target.roll.value,
      division: e.target.division.value,
      date: e.target.date.value,
      class: e.target.class.value,
      action: action,
    }
    if (e.target.image.files[0]) {
      formData = {
        ...formData,
        image: previewFile,
        isImage: true,
      }
    }
    if (action == 'edit') {
      formData = {
        ...formData,
        editId: editStudentId,
      }
    }
    
    props.setMessage('Processing...',10000)
    fetch('/api/birthday', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        props.setMessage('Processing...')
        return res.json()
      })
      .then((data) => {
        window.scrollTo(0, 0)
        props.setMessage(data.message)
        setTimeout(() => {
          location.reload()
        }, 2000)
      })
      .catch((err) => {
        console.log(err)
        props.setMessage('Something error occured. Try Again.')
      })
  }
  return (
    <>
      <div id='pageDivId'>
        <div className={styles.container}>
          <form
            onSubmit={(e) => addBirthdayHandler(e, 'add')}
            method='POST'
            id='formID'
          >
            <div className={styles.inputDiv}>
              <input
                type='text'
                name='name'
                id='name'
                ref={nameInput}
                autoComplete='off'
                required
                autoFocus
                placeholder='Name'
                className={styles.inputFullElement}
              />
            </div>
            <div className={styles.inputDiv}>
              <input
                type='date'
                name='date'
                id='date'
                ref={dateInput}
                required
                min='2021-01-01'
                max='2021-12-31'
                placeholder='Day & Month'
                className={styles.inputFullElement}
              />
            </div>
            <div className={styles.inputHalfDiv}>
              <div className={styles.inputDiv}>
                <input
                  type='number'
                  name='roll'
                  id='roll'
                  ref={rollInput}
                  required
                  placeholder='Roll No.'
                  className={styles.inputHalfElement}
                />
              </div>
              <div className={styles.inputDiv}>
                <input
                  type='text'
                  name='class'
                  id='class'
                  ref={classInput}
                  required
                  placeholder='Class'
                  className={styles.inputHalfElement}
                />
              </div>
              <div className={styles.inputDiv}>
                <input
                  type='text'
                  name='division'
                  id='division'
                  ref={divisionInput}
                  required
                  placeholder='Division'
                  className={styles.inputHalfElement}
                />
              </div>
            </div>
            <div className={styles.inputDiv}>
              <input
                type='file'
                accept='.jpg,.jpeg,.png'
                name='image'
                id='image'
                ref={nameInput}
                autoComplete='off'
                required
                autoFocus
                placeholder='Image'
                onChange={previewFileHandler}
                className={styles.inputFullElement}
              />
            </div>
            <center>
              <button type='submit' className='btn btn-primary'>
                Add
              </button>
            </center>
          </form>
        </div>
        <center>
          <div className={styles.tableDiv}>
            {props.fullList.length > 1 ? (
              <table id='birthdayListTable'>
                <thead>
                  <tr>
                    <th>Sl.No.</th>
                    <th>Roll.No.</th>
                    <th>Name</th>
                    <th>DOB</th>
                    <th>Class</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {props.fullList.map((s) => (
                    <tr key={s.sId}>
                      <td>{s.sId}</td>
                      <td>{s.roll}</td>
                      <td>{s.name}</td>
                      <td>{s.date}</td>
                      <td>{`${s.class}-${s.division}`}</td>
                      <td>
                        {/* <img
                          src={`/images/students/${s.picId}.${
                            s.imageName ? s.imageName.split('.').pop() : 'jpg'
                          }`}
                          alt='Not Added'
                          width='60px'
                        /> */}
                        {s.imageName && s.imageName.length > 25 ? (
                          <img
                            src={s.imageName}
                            alt='Student Image'
                            width='60px'
                          />
                        ) : (
                          'Not Added'
                        )}
                        {/* {s.imageName ? <Image cloudName='ajayda24' publicId={s.imageName} width='60px' /> : 'Not Added'} */}
                      </td>
                      <td>
                        <button
                          className='btn btn-warning m-2'
                          onClick={() => studentEditHandler(s.docId)}
                        >
                          Edit
                        </button>
                        <button
                          className='btn btn-danger m-2'
                          onClick={() =>
                            confirmDelete(
                              s.docId,
                              s.imageName && s.imageName.length > 25
                                ? s.imageName
                                : null
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </center>
      </div>

      {editMode && (
        <div className={styles.editContainer}>
          <form
            onSubmit={(e) => addBirthdayHandler(e, 'edit')}
            method='POST'
            id='editFormID'
          >
            <div className={styles.inputDiv}>
              <input
                type='text'
                name='name'
                id='edit-name'
                ref={nameInput}
                autoComplete='off'
                autoFocus
                placeholder='Name'
                className={styles.inputFullElement}
                value={editStudentDetails.name ? editStudentDetails.name : ''}
                onChange={(e) => {
                  setEditStudentDetails((p) => ({
                    ...p,
                    name: e.target.value,
                  }))
                }}
              />
            </div>
            <div className={styles.inputDiv}>
              <input
                type='date'
                name='date'
                id='edit-date'
                ref={dateInput}
                placeholder='Day & Month'
                className={styles.inputFullElement}
                defaultValue={
                  editStudentDetails.date
                    ? `2021-${editStudentDetails.date.split('-')[1]}-${
                        editStudentDetails.date.split('-')[0]
                      }`
                    : ''
                }
              />
            </div>
            <div className={styles.inputHalfDiv}>
              <div className={styles.inputDiv}>
                <input
                  type='number'
                  name='roll'
                  id='edit-roll'
                  ref={rollInput}
                  placeholder='Roll No.'
                  className={styles.inputHalfElement}
                  value={editStudentDetails.roll ? editStudentDetails.roll : ''}
                  onChange={(e) => {
                    setEditStudentDetails((p) => ({
                      ...p,
                      roll: e.target.value,
                    }))
                  }}
                />
              </div>
              <div className={styles.inputDiv}>
                <input
                  type='text'
                  name='class'
                  id='edit-class'
                  ref={classInput}
                  placeholder='Class'
                  className={styles.inputHalfElement}
                  value={
                    editStudentDetails.class ? editStudentDetails.class : ''
                  }
                  onChange={(e) => {
                    setEditStudentDetails((p) => ({
                      ...p,
                      class: e.target.value,
                    }))
                  }}
                />
              </div>
              <div className={styles.inputDiv}>
                <input
                  type='text'
                  name='division'
                  id='edit-division'
                  ref={divisionInput}
                  placeholder='Division'
                  className={styles.inputHalfElement}
                  value={
                    editStudentDetails.division
                      ? editStudentDetails.division
                      : ''
                  }
                  onChange={(e) => {
                    setEditStudentDetails((p) => ({
                      ...p,
                      division: e.target.value,
                    }))
                  }}
                />
              </div>
            </div>
            <div className={styles.inputDiv}>
              <input
                type='file'
                accept='.jpg,.jpeg,.png'
                name='image'
                id='edit-image'
                ref={nameInput}
                autoComplete='off'
                autoFocus
                placeholder='Image'
                onChange={previewFileHandler}
                className={styles.inputFullElement}
              />
            </div>
            <center>
              <button
                type='button'
                className={`btn btn-primary m-2`}
                onClick={() => {
                  document
                    .getElementById('pageDivId')
                    .classList.remove(styles.pageDiv)
                  setEditMode(false)
                }}
              >
                Cancel
              </button>
              <button type='submit' className={`btn btn-warning m-2`}>
                Edit
              </button>
            </center>
          </form>
        </div>
      )}
    </>
  )
}

export default Index
