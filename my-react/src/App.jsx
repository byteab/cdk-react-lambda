import { useState } from 'react'
import axios from 'axios'
import logo from './logo.svg'
import './App.css'

const SERVICE_URL = 'https://twg9kugp26.execute-api.us-east-1.amazonaws.com/prod/'

function App() {
  const [state, setState] = useState({data: null, status: 'idle'})

  const getData = async () => {
    setState({data: null, status: 'loading'})
    try {
      const res = await axios.get(SERVICE_URL)
      setState({data: res.data, status: 'resolved'})
    } catch (error) {
      setState({data:'Something went wrong!', status: 'error'})  
    }
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{state.data || ''}</p>
        {
          state.status === 'loading' 
            ? <p>loading</p>
            : <button onClick={getData}>call lambda</button>
        }
      </header>
    </div>
  )
}

export default App
