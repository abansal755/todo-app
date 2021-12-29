import { Fragment, Suspense, useContext } from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import Errors from './components/Errors';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';
import SpinnerCard from './components/ui/SpinnerCard';
import lazyWithPreload from './utils/lazyWithPreload';
import NotFound from './pages/NotFound';

const Auth = lazyWithPreload(() => import('./pages/Auth'));
const Dashboard = lazyWithPreload(() => import('./pages/Dashboard'));

const App = () => {
	const authCtx = useContext(AuthContext);

	return (
		<Fragment>
			<Navbar/>
			<Errors/>
			<div className='container'>
				<Suspense fallback={<SpinnerCard/>}>
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
							<NotFound/>
						</Route>
					</Switch>
				</Suspense>
			</div>
		</Fragment>
	);
}

export default App;
