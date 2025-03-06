import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'
import FormRender, { useForm } from 'form-render'
import { schema } from './config'
import * as api from '../api'

type ModalCreateItemProps = {}
const ModalCreateItem: React.FC<ModalCreateItemProps> = forwardRef((props, ref) => {
  const form = useForm()
  const [open, setOpen] = useState<boolean>(false)
  const close = () => {
    setOpen(false)
  }
  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true)
    },
    close,
  }))
  const submit = () => {
    form.validateFields().then((values) => {
      console.log(values)
      api.apiUpdate(form.getValues()).then((res) => {
        console.log(res)
        close()
      })
    })
  }

  return (
    <Modal width={600} title='新增用户' open={open} onOk={submit} onCancel={close} destroyOnClose={true}>
      <FormRender maxWidth={400} labelWidth={100} schema={schema} form={form} column={1} />
    </Modal>
  )
})
ModalCreateItem.displayName = 'ModalCreateItem'
export default ModalCreateItem
