import React from 'react'
import {
  DataGrid as MuiDG,
  DataGridProps,
  GridColDef,
  GridRenderCellParams,
  GridRowSpacing,
  GridValidRowModel,
  skSK,
} from '@mui/x-data-grid'

interface AdditionalProps<R> {
  rowIdKey: keyof R
  className?: string
  wrapperClassName?: string
  rowClassName?: string
  cellClassName?: string
  rowSpacing?: GridRowSpacing
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

type ColChidren = (r: GridRenderCellParams) => any

export const DataGrid: DataGridComponent = ({
  rowIdKey,
  className = '',
  wrapperClassName = '',
  rowClassName = 'cursor-pointer',
  cellClassName = '',
  rowSpacing,
  children,
  ...props
}) => {
  const columns = (Array.isArray(children) ? children : [children]).map(
    ({ props }) => modifyColProps(props)
  )

  return (
    <div className={`w-full h-[650px] my-4 ${wrapperClassName}`}>
      <MuiDG
        pageSize={10}
        rowsPerPageOptions={[10]}
        getRowId={(row) => row[rowIdKey]}
        getRowClassName={() => rowClassName}
        getCellClassName={() => cellClassName}
        getRowSpacing={rowSpacing ? () => rowSpacing : undefined}
        disableSelectionOnClick
        localeText={skSK.components.MuiDataGrid.defaultProps.localeText}
        {...props}
        className={`border-none font-[Raleway] text-base ${className}`}
        columns={columns}
      />
    </div>
  )
}

export const Col: React.FC<GridColDef & { children?: ColChidren }> = () => null

const modifyColProps = ({
  sortable = false,
  renderCell,
  children,
  ...props
}: GridColDef & {
  children?: ColChidren
}): GridColDef => ({
  ...props,
  sortable,
  renderCell: renderCell || children,
})
