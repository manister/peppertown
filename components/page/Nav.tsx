import Emoji from '../global/Emoji'
import LinkTo from '../global/LinkTo'

import Container from '../layout/Container'
import Logo from './Logo'

interface INavLink {
  emoji: string
  text: string
  href: string
  id: string
}

const navLinks: INavLink[] = [
  {
    emoji: '🧶',
    text: 'Nav Item',
    href: '/pages/example',
    id: 'page-1',
  },
]

const Nav = (): JSX.Element => (
  <nav className="bg-gray-900 py-3 sticky top-0 z-50 border-b-2 border-white">
    <Container className="flex justify-between items-center">
      <LinkTo className="block" href="/">
        <Logo />
      </LinkTo>
      <ul className="flex items-center">
        {navLinks.map((link) => (
          <li className="px-2" key={link.id}>
            <LinkTo className="uppercase font-bold text-sm tracking-widest text-white hover:underline " href={link.href}>
              <Emoji src={link.emoji} /> {link.text}
            </LinkTo>
          </li>
        ))}
      </ul>
    </Container>
  </nav>
)
export default Nav
