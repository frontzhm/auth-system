import { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { message, Modal } from 'antd'
import FormRender, { useForm } from 'form-render'
import { schemaUpdate } from '../config'
import * as api from '../api'
import { IItemResponse } from '../typing'
import AvatarUpload from './AvatarUpload'
// 定义 ModalCreateItemRef 接口类型，父组件通过 ref.current 调用子组件方法
export interface ModalCreateItemRef {
  open: (params: { action: 'create' | 'update'; record?: IItemResponse }) => void
  close: () => void
}
// 定义 ModalCreateItemProps 属性类型，父组件传入属性，子组件通过 props 使用
type ModalCreateItemProps = {
  updateList: () => void
}

const ModalCreateItem = forwardRef<ModalCreateItemRef, ModalCreateItemProps>(({ updateList }, ref) => {
  const form = useForm()
  const [open, setOpen] = useState<boolean>(false)
  const [action, setAction] = useState<'create' | 'update'>('create')
  const [record, setRecord] = useState<IItemResponse | undefined>(undefined)

  // 打开时，如果是编辑状态，将 record 填充到表单中
  useEffect(() => {
    if (open && action === 'update') {
      form.resetFields()
      console.log('record', record)
      form.setValues(record)
    }
  }, [open, action, record])

  // 打开弹窗, action 为 create 时，record 为空，为 update 时，record 为当前行数据
  const openModal = ({ action, record }: { action: 'create' | 'update'; record?: IItemResponse }) => {
    setOpen(true)
    setAction(action)
    setRecord(record)
  }
  const close = () => {
    setOpen(false)
    // 关闭时清空表单‌
    form.resetFields()
  }
  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({ open: openModal, close }), [form])

  const submit = () => {
    form.validateFields().then(() => {
      api.apiUpdate(form.getValues()).then(() => {
        message.success('操作成功')
        // 提交成功后刷新列表
        updateList()
        // 关闭弹窗
        close()
      })
    })
  }

  return (
    <Modal
      width={600}
      title={action === 'create' ? '新建用户' : '编辑用户'}
      open={open}
      onOk={submit}
      onCancel={close}
      destroyOnClose={true}
    >
      <FormRender
        widgets={{ AvatarUpload }}
        maxWidth={400}
        labelWidth={100}
        schema={schemaUpdate}
        form={form}
        column={1}
      />
    </Modal>
  )
})
ModalCreateItem.displayName = 'ModalCreateItem'
export default ModalCreateItem
