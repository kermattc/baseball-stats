import { Route, Routes, BrowserRouter} from 'react-router-dom';
import Home from './components/home'

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;