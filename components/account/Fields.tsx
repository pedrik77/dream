import s from './Fields.module.css'

export const AccountFieldWrapper: React.FC = ({ children }) => (
  <div className={s.wrapper}>{children}</div>
)

export const AccountField: React.FC = ({ children }) => (
  <div className={s.field}>{children}</div>
)

export const AccountFieldLabel: React.FC = ({ children }) => (
  <span className={s.label}>{children}</span>
)
