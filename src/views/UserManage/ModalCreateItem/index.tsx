import { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal } from 'antd'
import FormRender, { useForm } from 'form-render'
import { schema } from './config'
import * as api from '../api'
import { IItemResponse } from '../typing'
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
  const close = () => {
    setOpen(false)
    // ✅ 关闭时清空表单‌
    form.resetFields()
  }

  useImperativeHandle(
    ref,
    () => ({
      open: ({ action, record }: { action: 'create' | 'update'; record?: IItemResponse }) => {
        // ✅ 延迟到渲染周期外‌.若 FormRender 组件因模态框未渲染而处于未挂载状态，同步调用 form.setValues 会因表单实例未绑定到 DOM 元素而失败。setTimeout 延迟操作至模态框完成挂载后，保证表单实例已初始化‌
        setTimeout(() => {
          setOpen(true)
          setAction(action)
          action === 'update' && form?.setValues(record)
        }, 0)
      },
      close,
      // 依赖项声明。form 实例可能因组件状态更新而发生变化。若未声明依赖，open 方法会通过闭包持续引用旧的 form 实例，导致 setValues 操作失效或数据不同步‌
    }),
    [form],
  )
  const submit = () => {
    form.validateFields().then((values) => {
      console.log(values)
      api.apiUpdate(form.getValues()).then(() => {
        // ✅ 提交成功后刷新列表
        updateList()
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
      <FormRender maxWidth={400} labelWidth={100} schema={schema} form={form} column={1} />
    </Modal>
  )
})
ModalCreateItem.displayName = 'ModalCreateItem'
export default ModalCreateItem
