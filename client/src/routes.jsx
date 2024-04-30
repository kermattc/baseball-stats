import { Route, Routes, BrowserRouter} from 'react-router-dom';
import Home from './components/home'
import Register from './components/register';
import Favourites from './components/favourites';

const Router = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/favourites' element={<Favourites/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Router;