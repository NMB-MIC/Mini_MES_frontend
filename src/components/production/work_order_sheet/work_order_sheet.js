import React, { useEffect, useState, useRef } from 'react'
import { httpClient } from '../../../utils/HttpClient';
import { key, OK, server } from '../../../constants';
import moment from 'moment';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import './work_order_sheet.css'
import _ from "lodash";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Work_order_sheet() {
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
  const [editModelIsOpen, setEditModelIsOpen] = useState(false)

  const [MO_number, setMO_number] = useState(null)
  const [quantity, setquantity] = useState(null)
  const [production_date, setproduction_date] = useState(moment().date())
  const [production_line, setproduction_line] = useState(null)

  const [tableHeader, settableHeader] = useState([])
  const [tableData, settableData] = useState([])

  const [mo_list, setmo_list] = useState([])

  useEffect(() => {
    getWOS()
    getMo()
  }, [])


  const closeModal = () => {
    setMO_number(null)
    setquantity(null)
    setproduction_date(moment().date())
    setproduction_line(null)
    setCreateModalIsOpen(false)
    setEditModelIsOpen(false)
  }

  const getWOS = async () => {
    let result = await httpClient.get(server.WOS_URL)
    if (result.data.result.length > 0) {
      let tableHeader = Object.keys(result.data.result[0])
      tableHeader.push('Action')
      settableData(result.data.result)
      settableHeader(tableHeader)
    } else {
      settableData([])
      settableHeader(['Action'])
    }
  }

  const getMo = async () => {
    let result = await httpClient.get(server.MO_URL)
    if (result.data.result.length > 0) {
      setmo_list(result.data.result)
    } else {
    }
  }


  const renderCreateWOS = () => {
    const doCraeteWOS = () => {
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
          var data = {
            MO_number,
            quantity,
            production_date,
            production_line,
            updater: localStorage.getItem(key.USER_NAME)
          }
          console.log(data);
          let result = await httpClient.post(server.WOS_URL, data)
          if (result.data.api_result === OK) {
            getWOS()
            closeModal()
            Swal.fire(
              'Success!',
              'Your model has been created.',
              'success'
            )
          } else {
            Swal.fire(
              'Error!',
              'Your model has been not create.',
              'error'
            )
          }
        }
      })

    }

    const renderMO_Option = () => {
      if (mo_list.length > 0) {
        return mo_list.map((item, index) => (
          <option value={item.manufacturing_order_number}>{item.manufacturing_order_number + ' (' + item.model_number + ') max quantity ' + item.quantity + ''}</option>
        ))
      }
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
                <h4 className='card-title"'>Create new WOS</h4>
                <div class="card-tools">
                  <button type="button" class="btn btn-tool" onClick={(e) => {
                    e.preventDefault()
                    closeModal();
                  }}><i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              doCraeteWOS()
            }}>
              <div class="card-body">
                <div className="form-group">
                  <label>MO number</label>
                  <select
                    required
                    value={MO_number}
                    onChange={(e) => {
                      setMO_number(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter MO number" >
                    <option value="">---Please select models number---</option>
                    {renderMO_Option()}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    required
                    value={quantity}
                    type="number"
                    step={1}
                    onChange={(e) => {
                      setquantity(e.target.value)
                    }} className="form-control" placeholder="Enter quantity" />
                </div>
                <div className="form-group">
                  <label>Production line</label>
                  <input
                    required
                    value={production_line}
                    type="text"
                    onChange={(e) => {
                      setproduction_line(e.target.value)
                    }} className="form-control" placeholder="Enter production line" />
                </div>
                <div className="form-group">
                  <label>Production date</label>
                  <DatePicker required selected={production_date} className="form-control input-lg" onChange={(date) => setproduction_date(date)} />
                </div>
              </div>
              <div class="card-footer">
                <button type='submit' class="btn btn-success">Submit</button>
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
          <th rowSpan={1}
            colSpan={1}>
            {item}
          </th>
        ))
      }
      const doDeleteMaterialMaster = (manufacturing_order_number) => {
        Swal.fire({
          title: 'manufacturing order : ' + manufacturing_order_number + ' ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await httpClient.delete(server.WOS_URL, {
              data: {
                manufacturing_order_number,
                updater: localStorage.getItem(key.USER_NAME),
              }
            })
            if (response.data.api_result === OK) {
              getMo()
              Swal.fire(
                'Deleted!',
                'Your material master has been deleted.',
                'success'
              )
            }

          }
        })
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
                doDeleteMaterialMaster(data.manufacturing_order_number)
              }} className='btn btn-danger'>Delete</button>

            case 'production_date':
              return moment(data[header]).format('DD-MMM-YYYY')
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
              <h1 className="m-0">Work order sheet</h1>
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
                  <h1 className="card-title">Work order sheet</h1>
                </div>
                <div className="card-body">
                  <div className="input-group input-group-sm">
                    <input
                      // onChange={(e) => searchChanged(e)}
                      type="search"
                      className="form-control input-lg"
                      placeholder="Enter search MO number"
                      style={{ borderRadius: 10, marginRight: 10 }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setCreateModalIsOpen(true)
                      }} className="btn btn-success btn-sm">
                      create WOS
                    </button>
                  </div>
                  <div>
                    {renderCreateWOS()}
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
