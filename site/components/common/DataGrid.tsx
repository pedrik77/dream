import React from 'react'
import {
  DataGrid as MuiDG,
  DataGridProps,
  GridValidRowModel,
  skSK,
} from '@mui/x-data-grid'

interface AdditionalProps<R> {
  rowIdKey: keyof R
  className?: string
}

interface DataGridComponent {
  <R extends GridValidRowModel = any>(
    props: DataGridProps<R> &
      React.RefAttributes<HTMLDivElement> &
      AdditionalProps<R>
  ): JSX.Element
  propTypes?: any
}

export const DataGrid: DataGridComponent = ({
  className = '',
  rowIdKey,
  ...props
}) => {
  return (
    <div className={`w-full h-[650px] my-4 ${className}`}>
      <MuiDG
        className="border-none font-[Raleway] text-base"
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row[rowIdKey]}
        getRowClassName={() => 'cursor-pointer'}
        disableSelectionOnClick
        localeText={skSK.components.MuiDataGrid.defaultProps.localeText}
        {...props}
      />
    </div>
  )
}
