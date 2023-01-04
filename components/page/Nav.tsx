import Link from 'next/link'
import Emoji from '~/components/global/Emoji'

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
    emoji: '🫑',
    text: 'Cultivars',
    href: '/cultivars',
    id: 'cultivars',
  },
  // {
  //   emoji: '📖',
  //   text: 'About',
  //   href: '/guides',
  //   id: 'guides',
  // },
]

const Nav = (): JSX.Element => (
  <nav className="bg-gray-900 py-3 sticky top-0 z-50 border-b-2 border-white">
    <Container className="flex justify-between items-center">
      <Link className="block" href="/">
        <Logo />
      </Link>
      <ul className="flex items-center">
        {navLinks.map((link) => (
          <li className="px-2" key={link.id}>
            <Link className="uppercase font-bold text-sm tracking-widest text-white hover:underline " href={link.href}>
              <>
                <Emoji src={link.emoji} /> {link.text}
              </>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  </nav>
)
export default Nav
