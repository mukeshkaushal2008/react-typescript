import React from 'react'
import Header from './Header'
import Footer from './Footer'
const Layout: React.FC = (props): JSX.Element => (
     <main>
        <Header />

        <main role="main" className="container">
            {props.children}
        </main>

        {/* <Footer /> */}
    </main>
   
)

export default Layout