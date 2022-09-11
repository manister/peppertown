import Image from 'next/image'
import parse from 'html-react-parser'
import LinkTo from './LinkTo'
import { useState } from 'react'
import ClientOnly from '~/components/utility/ClientOnly'

type Props = {
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
      {/* {src ? (
        <Image
          height={100}
          width={100}
          alt={alt}
          className="-z-1 absolute top-0 left-0 right-0 bottom-0 blur-xl brightness-75 scale-150"
          objectFit="cover"
          layout="fill"
          src={src}
        />
      ) : (
        <></>
      )} */}
      <Image {...(className ? { className } : {})} width={width} height={height} alt={alt} objectFit="contain" src={src ?? ''} />
    </>
  )
  return (
    <div className="relative">
      {href ? (
        <LinkTo className="block text-[0px]" tabIndex={-1} href={href}>
          <ImageComponent />
        </LinkTo>
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
                  className="p-1 hover:underline bg-green-600 uppercase tracking-wider font-bold"
                  onClick={() => setShowCaption(false)}
                >
                  Hide
                </button>
              </>
            ) : (
              <button
                className="uppercase underline md:no-underline md:hover:underline tracking-wider font-bold"
                onClick={() => setShowCaption(true)}
              >
                Show Attribution
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
