import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => (
  <div>
    <div><Link to="/login">Login</Link> <Link to="/">Home</Link> <Link to="/query">Query</Link></div>
  </div>
)

export default NavBar
