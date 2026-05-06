import { Layout } from 'antd'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'

export const AppLayout = () => {
  return (
    <Layout className={styles.layout}>
      <Header>HEADER</Header>

      <Content className={styles.main}>
        <Outlet />
      </Content>

      <Footer>FOOTER</Footer>
    </Layout>
  )
}
