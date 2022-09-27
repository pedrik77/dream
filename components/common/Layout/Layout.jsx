import cn from 'clsx'
import s from './Layout.module.css'
import dynamic from 'next/dynamic'
import LoginView from '@components/auth/LoginView'
import { useUI } from '@components/ui/context'
import { Navbar, Footer } from '@components/common'
import { useAcceptCookies } from '@lib/hooks/useAcceptCookies'
import { Sidebar, Button, LoadingDots } from '@components/ui'
import { MenuSidebarView } from '@components/common/UserNav'
// @ts-ignore
import { Flasher } from 'react-universal-flash'
import { FlashMessage } from '@components/ui/FlashMessage'
import { AuthProvider } from '@lib/auth'
import { ShopProvider } from '@lib/api/shop'
import { LocaleProvider } from '@lib/locale'
import { useMenu } from '@lib/menu'
import { MuiThemeProvider } from '@lib/mui-theme'
import AdminWidget from '../AdminWidget'

const Loading = () => (
  <div className="w-80 h-80 flex items-center text-center justify-center p-3">
    <LoadingDots />
  </div>
)

const dynamicProps = {
  loading: Loading,
}

const SignUpView = dynamic(() => import('@components/auth/SignUpView'), {
  ...dynamicProps,
})

const ForgotPassword = dynamic(
  () => import('@components/auth/ForgotPassword'),
  {
    ...dynamicProps,
  }
)

const FeatureBar = dynamic(() => import('@components/common/FeatureBar'), {
  ...dynamicProps,
})

const Modal = dynamic(() => import('@components/ui/Modal'), {
  ...dynamicProps,
  ssr: false,
})

const ModalView = ({ modalView, closeModal }) => {
  return (
    <Modal onClose={closeModal}>
      {modalView === 'LOGIN_VIEW' && <LoginView />}
      {modalView === 'SIGNUP_VIEW' && <SignUpView />}
      {modalView === 'FORGOT_VIEW' && <ForgotPassword />}
    </Modal>
  )
}

const ModalUI = () => {
  const { displayModal, closeModal, modalView } = useUI()
  return displayModal ? (
    <ModalView modalView={modalView} closeModal={closeModal} />
  ) : null
}

const SidebarView = ({ sidebarView, closeSidebar, links }) => {
  return (
    <Sidebar onClose={closeSidebar}>
      {sidebarView === 'MOBILE_MENU_VIEW' && <MenuSidebarView links={links} />}
    </Sidebar>
  )
}

const SidebarUI = ({ links }) => {
  const { displaySidebar, closeSidebar, sidebarView } = useUI()
  return displaySidebar ? (
    <SidebarView
      links={links}
      sidebarView={sidebarView}
      closeSidebar={closeSidebar}
    />
  ) : null
}

const Layout = ({ children, pageProps: { ...pageProps } }) => {
  const { acceptedCookies, acceptCookies, rejectCookies } = useAcceptCookies()

  const navBarlinks = useMenu().main

  return (
    <LocaleProvider>
      <AuthProvider>
        <ShopProvider>
          <MuiThemeProvider>
            <div className={cn(s.root)}>
              <Navbar links={navBarlinks} />
              <main className="fit">{children}</main>
              <Footer pages={pageProps.pages} />
              <ModalUI />
              <Flasher
                position="custom"
                customStyles={{ top: 74, width: '100vw' }}
              >
                <FlashMessage />
              </Flasher>
              <SidebarUI links={navBarlinks} />
              <FeatureBar
                title="This site uses cookies to improve your experience. By clicking, you agree to our Privacy Policy."
                hide={acceptedCookies !== undefined}
                action={
                  <>
                    <Button
                      variant="light"
                      className="mx-5"
                      onClick={rejectCookies}
                    >
                      Reject cookies
                    </Button>
                    <Button
                      variant="light"
                      className="mx-5"
                      onClick={acceptCookies}
                    >
                      Accept cookies
                    </Button>
                  </>
                }
              />
              <AdminWidget />
            </div>
          </MuiThemeProvider>
        </ShopProvider>
      </AuthProvider>
    </LocaleProvider>
  )
}

export default Layout
