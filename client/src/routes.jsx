import { Route, Routes, BrowserRouter} from 'react-router-dom';
import Home from './components/home'
import Register from './components/register';

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/register' element={<Register/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Router;