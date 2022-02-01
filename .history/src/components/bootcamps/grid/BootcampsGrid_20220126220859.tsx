import React from 'react'
import { DataGrid, GridActionsCellItem, GridColumns } from '@mui/x-data-grid'

import { useBootcampsList } from 'common/hooks/bootcamps'
import router from 'next/router'
import { routes } from 'common/routes'

const columns: GridColumns = [
  { field: 'id', headerName: 'ID', hide: true },
  {
    field: 'firstName',
    headerName: 'First Name',
    editable: true,
    width: 200,
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
    editable: true,
    width: 200,
  },
  {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 200,
    getActions: ({ id }) => {
      return [
        <GridActionsCellItem
          icon={<SaveIcon />}
          label="Save"
          onClick={}
          color="primary"
          key={id}
        />,
        <GridActionsCellItem
          icon={<CancelIcon />}
          label="Cancel"
          className="textPrimary"
          onClick={()}
          color="inherit"
          key={id}
        />,
      ];
    }
  },
]

export default function BootcampsGrid() {
  const { data } = useBootcampsList()

  return (
    <DataGrid
      rows={data || []}
      columns={columns}
      pageSize={5}
      editMode="row"
      autoHeight
      autoPageSize
      checkboxSelection
      disableSelectionOnClick
      onRowClick={(row) => {
        const id = row.getValue(row.id, 'id')
        if (typeof id !== 'string') return
        router.push(routes.bootcamps.viewBootcampById(id))
      }}
    />
  )
}