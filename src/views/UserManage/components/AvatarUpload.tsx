import { useState } from 'react'
import { Upload, Avatar, message } from 'antd'
import { UploadProps, UploadFile } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'

const AvatarUpload = ({ value, onChange }: any) => {
  // value 是表单传入的值，onChange 是表单传入的方法, 用于同步数据到表单, value 和 onChange 是固定的
  // imageUrl 是组件内部的状态，用于展示图片
  const [imageUrl, setImageUrl] = useState<string>(value)
  const [loading, setLoading] = useState<boolean>(false)

  // 上传图片
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      const {
        response: {
          success,
          data: { url },
        },
      } = info.file
      if (!success) {
        message.error('上传失败')
        return
      }
      setImageUrl(url)
      onChange(url) // 关键：同步数据到表单
    }
    if (info.file.status === 'error') {
      setLoading(false)
      message.error('上传失败')
    }
  }
  // 上传前校验
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('请上传jpg或png格式的图片')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能超过2M')
      return false
    }
    return isJpgOrPng && isLt2M
  }
  // 上传图标
  const uploadButton = <div>{loading ? <LoadingOutlined /> : <PlusOutlined />}</div>

  return (
    <>
      <Upload
        listType='picture-circle'
        showUploadList={false}
        maxCount={1}
        headers={{ Authorization: localStorage.getItem('token') || '' }}
        action={`${import.meta.env.VITE_BASE_URL}/api/user/upload`}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <Avatar style={{ height: '100px', width: '100px' }} src={imageUrl} /> : uploadButton}
      </Upload>
    </>
  )
}

export default AvatarUpload
