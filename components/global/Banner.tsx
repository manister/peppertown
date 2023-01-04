import Image from 'next/legacy/image'
import Container from '~/components/layout/Container'
// import Link from './Link'

interface Props {
  className?: string
  backgroundImage?: {
    src: string
    alt: string
  }
  children: React.ReactNode //👈 children prop typr
}

const Banner = ({ children, className, backgroundImage }: Props): JSX.Element => (
  <section className={`relative ${className ? className : ''}`}>
    {backgroundImage ? <Image layout="fill" objectFit="cover" alt={backgroundImage.alt} src={backgroundImage.src} /> : ''}
    <Container className="py-10 md:py-20 relative z-10">
      <div className="prose text-white container prose-h1:text-white prose-h1:bg-green-700 prose-h1:p-4 prose-p:p-4 prose-p:bg-blue-800">
        {children}
      </div>
    </Container>
  </section>
)

export default Banner
