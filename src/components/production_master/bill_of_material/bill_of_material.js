import React, { useEffect, useState } from 'react'
import { httpClient } from '../../../utils/HttpClient';
import { key, OK, server } from '../../../constants';
import moment from 'moment';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import './bill_of_material.css'

export default function Bill_of_material() {
  const [tableHeader, settableHeader] = useState([])
  const [tableData, settableData] = useState([])

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
  const [editModelIsOpen, setEditModelIsOpen] = useState(false)

  const [model_number, setmodel_number] = useState(null)
  const [material_number, setmaterial_number] = useState(null)
  const [usage, setusage] = useState(null)

  const [modelList, setmodelList] = useState([])
  const [materialList, setmaterialList] = useState([])
  const [listBom, setlistBom] = useState([])

  useEffect(() => {
    getBomMaster()
    getModelList()
    getMaterialList()
  }, [])

  const getBomMaster = async () => {
    let result = await httpClient.get(server.BOM_URL)
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

  const getModelList = async () => {
    let result = await httpClient.get(server.MODELS_MASTER_URL)
    if (result.data.result.length > 0) {
      // console.log(result.data.result);
      setmodelList(result.data.result)
    } else {
      setmodelList([])
    }
  }

  const getMaterialList = async () => {
    let result = await httpClient.get(server.MATERIALS_MASTER_URL)
    if (result.data.result.length > 0) {
      // console.log(result.data.result);
      setmaterialList(result.data.result)
    } else {
      setmaterialList([])
    }
  }

  const closeModal = () => {
    setmodel_number(null)
    setmaterial_number(null)
    setusage(null)
    setCreateModalIsOpen(false)
    setEditModelIsOpen(false)
  }

  const renderCreateBom = () => {
    const doCraetebillOfMaterials = () => {
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
            model_number: modelList[model_number].model_number,
            material_number: materialList[material_number].material_number,
            usage,
            updater: localStorage.getItem(key.USER_NAME),
          }

          let result = await httpClient.post(server.BOM_URL, data)
          if (result.data.api_result === OK) {
            getBomMaster()
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

    const renderModelsOption = () => {
      if (modelList.length > 0) {
        return modelList.map((item, index) => (
          <option value={index}>{item.model_name + '(' + item.model_number + ')'}</option>
        ))
      }
    }

    const renderMaterialsOption = () => {
      if (materialList.length > 0) {
        return materialList.map((item, index) => (
          <option value={index}>{item.material_name + '(' + item.material_number + ')'}</option>
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
                <h4 className='card-title"'>Create new BOM master</h4>
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
              doCraetebillOfMaterials()
            }}>
              <div class="card-body">
                <div className="form-group">
                  <label>Model number</label>
                  <select
                    required
                    value={model_number}
                    onChange={(e) => {
                      setmodel_number(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter Model number" >
                    <option value="">---Please select models number---</option>
                    {renderModelsOption()}
                  </select>
                </div>
                <div className="form-group">
                  <label>Material number</label>
                  <select required
                    value={material_number}
                    onChange={(e) => {
                      setmaterial_number(e.target.value)
                    }} type="text" className="form-control" placeholder="Enter Material number" >
                    <option value="">---Please select material number---</option>
                    {renderMaterialsOption()}
                  </select>
                </div>
                <div className="form-group">
                  <label> {material_number ? 'usage (' + materialList[material_number].unit_of_measure + ')' : 'usage'}</label>
                  <input required
                    value={usage}
                    onChange={(e) => {
                      setusage(e.target.value)
                    }} type="number" className="form-control" placeholder="Enter usage" />
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

      const doDeleteBOM = (model_number_x, material_number_x) => {
        Swal.fire({
          title: 'Delete BOM : ' + model_number_x + ' ' + material_number_x + ' ?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await httpClient.delete(server.BOM_URL, {
              data: {
                model_number: model_number_x,
                material_number: material_number_x,
                updater: localStorage.getItem(key.USER_NAME),
              }
            })
            if (response.data.api_result === OK) {
              getBomMaster()
              Swal.fire(
                'Deleted!',
                'Your material master has been deleted.',
                'success'
              )
            } else {
              Swal.fire(
                'error!',
                'Your BOM master has not delete.',
                'error'
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
                doDeleteBOM(data.model_number, data.material_number)
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
              <h1 className="m-0">Bill of materials</h1>
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
                  <h1 className="card-title">Bill of material</h1>
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
                      Add BOM
                    </button>
                    {renderCreateBom()}
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
