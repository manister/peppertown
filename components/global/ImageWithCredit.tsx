import Image from 'next/legacy/image'
import parse from 'html-react-parser'
import { useState } from 'react'
import ClientOnly from '~/components/utility/ClientOnly'
import Link from 'next/link'

interface Props {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  credit?: string
  href?: string
}

const ImageWithCredit = (props: Props): JSX.Element => {
  const [showCaption, setShowCaption] = useState(false)
  const { src, alt, credit, className, width, height, href } = props
  const ImageComponent = (): JSX.Element => (
    <>
      <Image {...(className ? { className } : {})} width={width} height={height} alt={alt} objectFit="cover" src={src ?? ''} />
    </>
  )
  return (
    <div className="relative">
      {href ? (
        <Link className="block text-[0px]" tabIndex={-1} href={href}>
          <ImageComponent />
        </Link>
      ) : (
        <ImageComponent />
      )}
      <ClientOnly>
        {credit && credit !== 'null' ? (
          <div className="prose prose-a:text-white prose-a:underline bg-blue absolute right-0 top-0 text-white px-3 py-1 w-auto text-center md:text-sm">
            {showCaption ? (
              <>
                {parse(credit)}{' '}
                <button
                  className="p-1 underline md:no-underline md:hover:underline  bg-green-600 font-bold"
                  onClick={() => setShowCaption(false)}
                >
                  Hide
                </button>
              </>
            ) : (
              <button className="underline md:no-underline md:hover:underline font-bold" onClick={() => setShowCaption(true)}>
                Attribution
              </button>
            )}
          </div>
        ) : (
          ''
        )}
      </ClientOnly>
    </div>
  )
}

export default ImageWithCredit
