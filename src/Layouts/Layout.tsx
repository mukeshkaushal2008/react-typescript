import React from 'react'
import Header from './Header'
import Footer from './Footer'

import { Container } from 'react-bootstrap';
import { BrowserRouter, Switch } from 'react-router-dom';

const Layout: React.FC = (props): JSX.Element => (
     <main>
        <Header />

        <main role="main" className="container">
            {props.children}
        </main>

        <Footer />
    </main>
   
)

export default Layout