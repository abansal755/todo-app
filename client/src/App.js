import { Fragment, useContext } from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

const App = () => {
	const authCtx = useContext(AuthContext);

	return (
		<Fragment>
			<Navbar/>
			<div className='container mt-5'>
				<Switch>
					<Route path='/' exact>
						<Redirect to='/dashboard'/>
					</Route>
					<Route path='/auth'>
						{authCtx.isLoggedIn && (
							<Redirect to='/dashboard'/>
						)}
						{!authCtx.isLoggedIn && (
							<Auth/>
						)}
					</Route>
					<Route path='/dashboard'>
						{authCtx.isLoggedIn && (
							<Dashboard/>
						)}
						{!authCtx.isLoggedIn && (
							<Redirect to='/auth'/>
						)}
					</Route>
					<Route path='*'>
						{/* 404 page */}
					</Route>
				</Switch>
			</div>
		</Fragment>
	);
}

export default App;
