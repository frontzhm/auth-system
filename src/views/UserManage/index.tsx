import React from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'
import AvatarUpload from './components/AvatarUpload'

const UserManage: React.FC = () => {
  return (
    <PageTable
      genColumns={genColumns}
      schemaQuery={schemaQuery}
      api={api}
      schemaUpdate={schemaUpdate}
      widgets={{ AvatarUpload }}
    />
  )
}

UserManage.displayName = 'UserManage'
export default UserManage
