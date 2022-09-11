import React, { memo } from 'react'
import twemoji from 'twemoji'
import parse from 'html-react-parser'

type Props = {
  src: string
}

const TwemojiComp = (props: Props): JSX.Element => {
  const { src } = props
  return (
    <span className="mr-[0.05em] ml-[0.1em] align-[-0.1em] inline-block h-[1em] w-[1em] prose-img:block">
      {parse(
        twemoji.parse(src, {
          folder: 'svg',
          ext: '.svg',
        })
      )}
    </span>
  )
}

const Emoji = memo(TwemojiComp)
export default Emoji
