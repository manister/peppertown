import dynamic from 'next/dynamic'

type Props = {
  children: React.ReactNode
}

const Comp = ({ children }: Props): JSX.Element => <>{children}</>
const ClientOnly = dynamic(() => Promise.resolve(Comp), {
  ssr: false,
})
export default ClientOnly
