import React from 'react'
import { genColumns, schemaQuery, schemaUpdate } from './config'
import * as api from './api'
import PageTable from '@/components/PageTable'

const DeptManage: React.FC = () => {
  return <PageTable genColumns={genColumns} schemaQuery={schemaQuery} api={api} schemaUpdate={schemaUpdate} />
}

DeptManage.displayName = 'DeptManage'
export default DeptManage
