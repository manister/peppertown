type Props = {
  className?: string
  children: React.ReactNode //👈 children prop typr
}

const Container = ({ children, className }: Props): JSX.Element => (
  <div className={`px-2 mx-auto max-w-screen-xl ${className}`}>{children}</div>
)

export default Container
