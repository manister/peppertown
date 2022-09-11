import Emoji from '../global/Emoji'
import LinkTo from '../global/LinkTo'

import Container from '../layout/Container'

type Props = {
  className?: string
}

interface INavLink {
  emoji: string
  text: string
  href: string
  id: string
}

const navLinks: INavLink[] = [
  {
    emoji: '🕵️‍♀️',
    text: 'Privacy',
    href: '/policies/privacy',
    id: 'privacy',
  },
  {
    emoji: '📜',
    text: 'Terms',
    href: '/policies/terms',
    id: 'terms',
  },
  {
    emoji: '🍪',
    text: 'Cookies',
    href: '/policies/cookies',
    id: 'cookies',
  },
  // {
  //   emoji: '📖',
  //   text: 'About',
  //   href: '/guides',
  //   id: 'guides',
  // },
]

const Footer = (props: Props): JSX.Element => {
  const { className } = props
  return (
    <footer className={`bg-slate-700 text-white py-2 ${className}`}>
      <Container className="flex justify-center  items-center flex-wrap md:flex-nowrap md:justify-end">
        <ul className="flex items-center">
          {navLinks.map((link) => (
            <li className="px-2" key={link.id}>
              <LinkTo className="whitespace-nowrap text-xs hover:underline" href={link.href}>
                <Emoji src={link.emoji} /> {link.text}
              </LinkTo>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  )
}
export default Footer
