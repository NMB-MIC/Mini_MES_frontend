import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import moment from 'moment';
import { httpClient } from '../../../utils/HttpClient';
import { key, OK, server } from '../../../constants';
import './models.css'

export default function Models() {

  const [model_number, setmodel_number] = useState(null)
  const [model_name, setmodel_name] = useState(null)
  const [drawing, setdrawing] = useState(null)

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
  const [editModelIsOpen, setEditModelIsOpen] = useState(false)

  const [tableHeader, settableHeader] = useState([])
  const [tableData, settableData] = useState([])

  useEffect(() => {
    getModelsMaster()
  }, [])

  const getModelsMaster = async () => {
    let result = await httpClient.get(server.MODELS_MASTER_URL)
    if (result.data.result.length > 0) {
      console.log(result.data.result);
      let tableHeader = Object.keys(result.data.result[0])
      tableHeader.push('Action')
      settableData(result.data.result)
      settableHeader(tableHeader)
    } else {
      settableData([])
      settableHeader(['Action'])
    }
  }

  const closeModal = () => {
    setmodel_number(null)
    setmodel_name(null)
    setdrawing(null)
    setCreateModalIsOpen(false)
    setEditModelIsOpen(false)
  }

  const renderCreateModels = () => {
    const doCraeteModels = () => {
      Swal.fire({
        title: 'Are you sure?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          var data = new FormData();

          data.append('model_number', model_number);
          data.append('model_name', model_name);
          data.append('drawing', drawing);
          data.append('updater', localStorage.getItem(key.USER_NAME))

          let result = await httpClient.post(server.MODELS_MASTER_URL, data)
          if (result.data.api_result === OK) {
            getModelsMaster()
            Swal.fire(
              'Success!',
              'Your model has been created.',
              'success'
            )
          }

        }
      })

    }

    return (
      <Modal
        isOpen={createModalIsOpen}
        style={{
          content: {
            transform: 'translate(0%, 0%)',
            overlfow: 'scroll' // <-- This tells the modal to scrol
          },
        }}
        className="content-wrapper"
      >
        <div style={{ margin: '10%', padding: '5%', backgroundColor: 'rgba(0,0,0,0)', overflow: 'auto' }}>
          <div className="card card-success">
            <div className="card-header">
              <div className='d-flex justify-content-between'>
                <h4 className='card-title"'>Create new models master</h4>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" onClick={(e) => {
                    e.preventDefault()
                    closeModal();
                  }}><i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <form>
              <div class="card-body">

                <div className="form-group">
                  <label>Model number</label>
                  <input required
                    value={model_number}
                    onChange={(e) => {
                      setmodel_number(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter model number" />
                </div>
                <div className="form-group">
                  <label>Model name</label>
                  <input required
                    value={model_name}
                    onChange={(e) => {
                      setmodel_name(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter model name" />
                </div>
                <div className='form-group'>
                  <label>Drawing file (pdf)</label>
                  <div className="input-group">
                    <div className="custom-file">
                      <input onChange={
                        (e) => {
                          setdrawing(e.target.files[0])
                          document.getElementById("chooseFile").innerHTML = e.target.files[0].name;
                        }
                      } type="file"
                        className="custom-file-input"
                        accept="application/pdf" />
                      <label id="chooseFile" className="custom-file-label" htmlFor="exampleInputFile">Choose file</label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-footer">
                <button class="btn btn-success"
                  onClick={(e) => {
                    e.preventDefault()
                    doCraeteModels()
                  }}
                >Submit</button>
                <button class="btn btn-default float-right" onClick={(e) => {
                  e.preventDefault()
                  closeModal();
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    )
  }

  const renderTable = () => {
    if (tableData.length > 0 && tableHeader.length > 0) {
      const renderTableHeader = () => {
        return tableHeader.map((item) => (
          <th className="sorting"
            rowSpan={1}
            colSpan={1}>
            {item}
          </th>
        ))
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
          switch (header) {
            case 'Action':
              return <button onClick={(e) => {
                e.preventDefault()
                doDeleteModelMaster(data.model_number)
              }} className='btn btn-danger'>Delete</button>

            case 'createdAt':
              return moment(data[header]).format('DD-MMM-YYYY HH:mm:ss')
            case 'updatedAt':
              return moment(data[header]).format('DD-MMM-YYYY HH:mm:ss')

            default:
              return data[header]
          }
        }

        return tableData.map((item) => (
          <tr>{generateTableData(item)}</tr>
        ))

      }
      const doDeleteModelMaster = (model_number) => {
        Swal.fire({
          title: 'Delete model : ' + model_number + ' ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await httpClient.delete(server.MODELS_MASTER_URL, {
              data: {
                model_number,
                updater: localStorage.getItem(key.USER_NAME),
              }
            })
            if (response.data.api_result === OK) {
              getModelsMaster()
              Swal.fire(
                'Deleted!',
                'Your model master has been deleted.',
                'success'
              )
            }

          }
        })
      }
      return (
        <div className="card-body table-responsive p-0">
          <table
            className="table table-hover text-nowrap"
            role="grid"
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
      )
    }
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Models master</h1>
            </div>{/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">

              </ol>
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
                  <h1 className="card-title">Models master</h1>
                </div>
                <div className="card-body">
                  <div className="input-group input-group-sm">
                    <input
                      // onChange={(e) => searchChanged(e)}
                      type="search"
                      className="form-control input-lg"
                      placeholder="Enter search keyword"
                      style={{ borderRadius: 10, marginRight: 10 }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCreateModalIsOpen(true)
                      }} className="btn btn-success btn-sm">
                      Add models
                    </button>
                    {renderCreateModels()}
                    {renderTable()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
