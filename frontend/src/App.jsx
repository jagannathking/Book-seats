import React from 'react'
import NavBar from './Components/NavBar'
import NavRoutes from './Routes/NavRoutes'

const App = () => {
  return (
    <>
    <div>
      {/* Nav bar */}
       <NavBar />

       {/* Routes */}
        <NavRoutes />

       {/* Footer */}
    </div>
    </>
  )
}

export default App