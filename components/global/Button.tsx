interface IButtonVariant {
  primary: string
  secondary: string
}

interface Props {
  variant: keyof IButtonVariant
  children: React.ReactElement
}

const baseButtonStyles =
  'px-3 py-2 inline-block uppercase transition-colors bold tracking-widest text-lg font-bold focus-visible:ring ring-offset-2  ring-blue'

const buttonVariants = {
  primary: 'bg-blue text-white hover:text-blue hover:bg-white border-2 border-blue',
  secondary: 'bg-white text-blue hover:text-white hover:bg-blue border-2 border-blue',
}

const Button = (props: Props): JSX.Element => {
  const { variant, children } = props
  const { className, ...childProps } = children.props
  return (
    <children.type {...childProps} className={`${baseButtonStyles} ${buttonVariants[variant]} ${className ?? ''}`}>
      {children.props.children}
    </children.type>
  )
}

export default Button
