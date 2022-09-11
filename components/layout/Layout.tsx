import CookieConsent from 'react-cookie-consent'
import LinkTo from '../global/LinkTo'
import Footer from '../page/Footer'
import Nav from '../page/Nav'
import ClientOnly from '../utility/ClientOnly'
type Props = {
  children: React.ReactNode
  showCookieConsent?: boolean // default true
}

const Layout = ({ children, showCookieConsent }: Props): JSX.Element => {
  if (typeof showCookieConsent === 'undefined') {
    showCookieConsent = true
  }
  return (
    <div className="text-gray-900 antialiased flex flex-col min-h-screen">
      <Nav />
      <main>{children}</main>
      <Footer className="mt-auto" />
      <ClientOnly>
        {showCookieConsent && (
          <CookieConsent overlay buttonText="Accept all and close">
            This website uses cookies to enhance the user experience. For full options and more information please read our{' '}
            <LinkTo className="underline" href={'/policies/cookies'}>
              Cookie Policy
            </LinkTo>{' '}
          </CookieConsent>
        )}
      </ClientOnly>
    </div>
  )
}

export default Layout
