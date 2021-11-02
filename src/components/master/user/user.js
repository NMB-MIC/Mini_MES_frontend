import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2';
import _ from "lodash";
import { key, server, OK } from '../../../constants';
import { httpClient } from '../../../utils/HttpClient';
import moment from 'moment';

export default function User() {
  const [tableHeader, settableHeader] = useState([])
  const [tableData, settableData] = useState([])
 
  useEffect(() => {
    doGetUser()
  }, [])

  const debounceSearch = useRef(_.debounce(e => findUserByKey(e), 500)).current;

  const searchChanged = (e) => {
    e.persist();
    debounceSearch(e);
  };

  const findUserByKey = async (e) => {
    console.log('findUserByKey');
    if (e.target.value != '') {
      let response = await httpClient.get(server.FIND_USER_URL + '/' + e.target.value)
      console.log(response.data);
      if (response.data.result.length > 0 && response.data.api_result === OK) {
        settableData(response.data.result)
      } else {
        settableData([])
      }
    } else {
      doGetUser()
    }

  }

  const doGetUser = async () => {
    let result = await httpClient.get(server.USER_URL)
    if (result.data.result.length > 0) {
      let tableHeader = Object.keys(result.data.result[0])
      tableHeader.push('Action')
      settableData(result.data.result)
      settableHeader(tableHeader)
    }
  }

  const renderTableRow = () => {
    const generateTableData = (data) => {
      return tableHeader.map((header) => (
        <td>
          {renderRow(data, header)}
        </td>
      ))
    }

    const renderRow = (data, header) => {
      if (header == 'lastLogOn') {
        return moment(data[header]).format('DD-MMM-YYYY HH:mm:ss')
      } else {
        switch (header) {
          case 'levelUser':
            return renderOptions(data[header], data['username'], data['email'])
          case 'Action':
            return <div className="">
              <button onClick={(e) => {
                e.preventDefault()
                doDeleteUser(data.username)
              }} className='btn btn-danger'>Delete</button>
              <button onClick={(e) => {
                e.preventDefault()
                doEditEmail(data.levelUser, data.username, data.email)
              }} className='btn btn-warning' style={{ marginLeft: 10 }}>
                edit email
              </button>
            </div>
          default:
            return data[header]
        }
      }
    }

    const renderOptions = (levelUser, username, email) => {
      return (
        <select className="form-control" onChange={(e) => {
          doChangeLevel(e.target.value, username, email)
        }}>
          <option selected={levelUser == 'admin' ? true : false}>
            admin
          </option>
          <option selected={levelUser == 'power' ? true : false}>
            power
          </option>
          <option selected={levelUser == 'user' ? true : false}>
            user
          </option>
          <option selected={levelUser == 'guest' ? true : false}>
            guest
          </option>

        </select>
      )
    }

    const doDeleteUser = async (username) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "Delete user : " + username + ", You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const data = {
            updater: localStorage.getItem(key.USER_NAME),
            username
          }
          let response = await httpClient.delete(server.USER_URL, { data })
          if (response.data.api_result === OK) {
            Swal.fire(
              'Deleted!',
              username + ' has been deleted.',
              'success'
            ).then(() => doGetUser())
          } else {
            Swal.fire(
              'Error!',
              'Delete user : ' + username + ' failed, please try again.',
              'error'
            )
          }
        }
      })
    }

    const doChangeLevel = (levelUser, username, email) => {
      if ((levelUser === 'power' || levelUser === 'admin') && email == null) {
        Swal.fire({
          title: 'Enter your email',
          input: 'text',
          showCancelButton: true,
          confirmButtonText: 'Submit',
          showLoaderOnConfirm: true,
          preConfirm: async (email) => {
            const changedData = {
              levelUser,
              username,
              updater: localStorage.getItem(key.USER_NAME),
              email,
            }
            return await httpClient.put(server.CHANGE_LV_URL, changedData)
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
            console.log(result);
            if (result.value.data.api_result === OK) {
              Swal.fire('Changed!', '', 'success').then(() => doGetUser())
            } else {
              Swal.fire('Error!', result.value.data.error, 'error').then(() => doGetUser())
            }
          }
        })

      } else {
        Swal.fire({
          title: 'Do you want to change user level?',
          showCancelButton: true,
          confirmButtonText: `Change`,
        }).then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            const changedData = {
              levelUser,
              username,
              updater: localStorage.getItem(key.USER_NAME)
            }
            let response = await httpClient.put(server.CHANGE_LV_URL, changedData)
            if (response.data.api_result === OK) {
              Swal.fire('Changed!', '', 'success').then(() => doGetUser())
            } else {
              Swal.fire('Error!', response.data.error, 'error').then(() => doGetUser())
            }
          }
        })
      }

    }

    const doEditEmail = (levelUser, username, email) => {
      Swal.fire({
        title: 'Enter your new email ',
        text: 'Your old email is : ' + email,
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: async (newEmail) => {
          const changedData = {
            levelUser,
            username,
            updater: localStorage.getItem(key.USER_NAME),
            email: newEmail,
          }
          return await httpClient.put(server.CHANGE_LV_URL, changedData)
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(result);
          if (result.value.data.api_result === OK) {
            Swal.fire('Changed!', '', 'success').then(() => doGetUser())
          } else {
            Swal.fire('Error!', result.value.data.error, 'error').then(() => doGetUser())
          }
        }
      })
    }

    return tableData.map((item) => (
      <tr>{generateTableData(item)}</tr>
    ))
  }

  const renderTableHeader = () => {
    return tableHeader.map((item) => (
      <th className="sorting"
        rowSpan={1}
        colSpan={1}>
        {item}
      </th>
    ))
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Master manage</h1>
            </div>{/* /.col */}
            <div className="col-sm-6">

            </div>{/* /.col */}
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12">
              <div className="card card-dark">
                <div className="card-header">
                  <h1 className="card-title">User</h1>
                </div>
                <div className="card-body">
                  <div className="input-group input-group-sm">
                    <input
                      onChange={(e) => searchChanged(e)}
                      type="search"
                      className="form-control input-lg"
                      placeholder="Enter search keyword"
                      style={{ borderRadius: 10 }}
                    />
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table
                      id="example2"
                      className="table table-hover text-nowrap"
                      role="grid"
                      aria-describedby="example2_info"
                    >
                      <thead>
                        <tr role="row">
                          {renderTableHeader()}
                        </tr>
                      </thead>
                      <tbody>
                        {renderTableRow()}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer">

                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
