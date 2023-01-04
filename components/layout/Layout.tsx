import Link from 'next/link'
import CookieConsent from 'react-cookie-consent'
import Footer from '~/components/page/Footer'
import Nav from '~/components/page/Nav'
import ClientOnly from '~/components/utility/ClientOnly'
interface Props {
  children: React.ReactNode
  showCookieConsent?: boolean // default true
}

const Layout = ({ children, showCookieConsent }: Props): JSX.Element => {
  if (typeof showCookieConsent === 'undefined') {
    showCookieConsent = true
  }
  return (
    <div className="text-gray-900 antialiased flex flex-col">
      <Nav />
      <main>{children}</main>
      <Footer className="mt-auto" />
      <ClientOnly>
        {showCookieConsent && (
          <CookieConsent overlay buttonText="Accept all and close">
            This website uses cookies to enhance the user experience. For full options and more information please read our{' '}
            <Link className="underline" href={'/policies/cookies'}>
              Cookie Policy
            </Link>{' '}
          </CookieConsent>
        )}
      </ClientOnly>
    </div>
  )
}

export default Layout
