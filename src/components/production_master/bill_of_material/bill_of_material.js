import React, { useEffect, useState, useRef } from 'react'
import { httpClient } from '../../../utils/HttpClient';
import { key, OK, server } from '../../../constants';
import moment from 'moment';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import './bill_of_material.css'
import _ from "lodash";

export default function Bill_of_material() {
  const [bom_model_list, setbom_model_list] = useState([])
  const [expandableBomList, setexpandableBomList] = useState([])

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false)
  const [editModelIsOpen, setEditModelIsOpen] = useState(false)

  const [model_number, setmodel_number] = useState(null)
  const [material_number, setmaterial_number] = useState(null)
  const [usage, setusage] = useState(null)

  const [modelList, setmodelList] = useState([])
  const [materialList, setmaterialList] = useState([])
  useEffect(() => {
    getBomMaster()
    getModelList()
    getMaterialList()
  }, [])

  const getBomMaster = async () => {
    let result = await httpClient.get(server.BOM_URL)
    if (result.data.bom_model_list.length > 0) {
      setbom_model_list(result.data.bom_model_list)
      setexpandableBomList(result.data.expandableBomList)
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

  const searchChanged = (e) => {
    e.persist();
    debounceSearch(e);
  };
  const debounceSearch = useRef(_.debounce(e => findBom(e), 500)).current;
  const findBom = async (e) => {
    if (e.target.value != '') {
      let result = await httpClient.get(server.FIND_BOM_URL + '/' + e.target.value)
      if (result.data.bom_model_list.length > 0) {
        setbom_model_list(result.data.bom_model_list)
        setexpandableBomList(result.data.expandableBomList)
      } else {
        setbom_model_list([])
        setexpandableBomList([])
      }
    } else {
      getBomMaster()
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
                    step={0.001}
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

  const renderexpandableTable = () => {

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

    const renderExpandableBomList = (index) => {
      // console.log(expandableBomList.length, ' : ', index);
      if (expandableBomList.length > 0 && expandableBomList.length > index) {
        if (expandableBomList[index].length > 0) {
          return expandableBomList[index].map((item) => (
            <tr>
              <td>
              </td>
              <td>
                {item.material_number}
              </td>
              <td>
                {item.material_name}
              </td>
              <td>
                {item.usage}{' ' + item.unit_of_measure}
              </td>
              <td>
                {item.updater}
              </td>
              <td>
                {moment(item.createdAt).format('DD-MMM-YYYY HH:mm')}
              </td>
              <td>
                {moment(item.updatedAt).format('DD-MMM-YYYY HH:mm')}
              </td>
              <td>
                <button onClick={() => {
                  doDeleteBOM(item.model_number, item.material_number)
                }} className="btn btn-danger">Delete</button>
              </td>
            </tr>
          ))
        }
      }
    }

    const renderBom_model_list = () => {
      if (bom_model_list.length > 0) {
        return bom_model_list.map((item, index) => (
          <>
            <tr data-widget="expandable-table" aria-expanded="false">
              <td>
                <i class="expandable-table-caret fas fa-caret-right fa-fw"></i>
                <b>{item.model_number}</b>{' (' + item.model_name + ')'}
              </td>
            </tr>
            <tr className="expandable-body d-none">
              <td>
                <div className="p-0">
                  <table className="table table-hover">
                    <thead>
                      <th></th>
                      <th>material_number</th>
                      <th>material_name</th>
                      <th>usage</th>
                      <th>update by</th>
                      <th>createdAt</th>
                      <th>updatedAt</th>
                      <th>action</th>
                    </thead>
                    <tbody>
                      {renderExpandableBomList(index)}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </>
        ))
      } else {
        return (
          <></>
        )
      }
    }

    return (
      <div style={{ marginTop: 10 }} className="card-body table-responsive p-0">
        <table className="table table-hover text-nowrap">
          <thead>
            {/* <tr role="row">
              <th>Model number</th>
            </tr> */}
          </thead>
          <tbody>
            {renderBom_model_list()}
          </tbody>
        </table>
      </div>
    )
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
                      onChange={(e) => searchChanged(e)}
                      type="search"
                      className="form-control input-lg"
                      placeholder="Enter search model name"
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
                    {/* {renderTable()} */}
                    {renderexpandableTable()}
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
