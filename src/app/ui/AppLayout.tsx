import { Layout } from 'antd'
import { Footer, Header } from 'antd/es/layout/layout'
import { Outlet } from 'react-router-dom'

export const AppLayout = () => {
  return (
    <Layout>
      <Header>HEADER</Header>

      <Outlet />

      <Footer>FOOTER</Footer>
    </Layout>
  )
}
