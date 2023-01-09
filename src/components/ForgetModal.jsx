import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import {Button, Form, Modal} from "react-bootstrap"
import { axiosFetch } from '../axios'
import {ToastContainer,toast} from "react-toastify"
import {toastOptions} from "../utils/toastOptions"
import { useTranslation } from 'react-i18next'

const ForgetModal = ({show,onHide}) => {
  const {t}=useTranslation();
  const [email,setEmail]=useState("")
  const [message,setMessage]=useState("");

  const forgetPassword=useMutation((email)=>{
    return axiosFetch.post('/auth/forget',email);
  },{
    onSuccess:(({data})=>{
      console.log(data);
      toast.success(data.msg,toastOptions);
      onHide();
    }),
    onError:err=>{
      if(err.response.data) {
        setMessage(err.response.data);
      }
    }
  })
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>{t("update_password")}</Modal.Header>
      <Modal.Body>
        <Form onSubmit={e=>e.preventDefault()}>
          <Form.Group>
            <Form.Label>{t("enter_email")}</Form.Label>
            <Form.Control placeholder="user@gmail.com" value={email} type="email" onChange={e=>setEmail(e.target.value)} />
            {message.email && <p className='error'>{message.email}</p>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={!email} type="submit" onClick={()=>forgetPassword.mutate({email})} variant="success">{t("send_email")}</Button>
        <Button onClick={onHide} variant='secondary'>{t("cancel")}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ForgetModal