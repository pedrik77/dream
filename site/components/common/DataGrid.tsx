import React from 'react'
import {
  DataGrid as MuiDG,
  DataGridProps,
  GridColDef,
  GridValidRowModel,
  skSK,
} from '@mui/x-data-grid'

interface ICol extends React.FC<GridColDef> {}

interface AdditionalProps<R> {
  rowIdKey: keyof R
  className?: string
  children?: any
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
  children,
  ...props
}) => {
  const columns = (Array.isArray(children) ? children : [children]).map(
    (c) => c.props
  )

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
        columns={columns}
      />
    </div>
  )
}

export const Col: ICol = () => null
