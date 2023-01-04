import Link from 'next/link'

interface Props {
  className?: string
  href?: string
  children: React.ReactNode
}

const HighlightText = (props: Props): JSX.Element => {
  const { className, children, href } = props
  const classNameString = `p-2 text-white font-bold inline-block ${className}`
  const linkClasses = 'focus-visible:ring ring-offset-2 ring-blue underline md:no-underline md:hover:underline'
  if (!href) {
    return <span className={classNameString}>{children}</span>
  } else {
    return (
      <Link href={href} className={`${linkClasses} ${classNameString}`}>
        <>{children}</>
      </Link>
    )
  }
}

export default HighlightText
