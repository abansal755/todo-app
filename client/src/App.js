import { Fragment, lazy, Suspense, useContext } from 'react';
import {Switch,Route,Redirect} from 'react-router-dom';
import Errors from './components/Errors';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';
import SpinnerCard from './components/ui/SpinnerCard';
const Auth = lazy(() => import('./pages/Auth'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const App = () => {
	const authCtx = useContext(AuthContext);

	return (
		<Fragment>
			<Navbar/>
			<Errors/>
			<div className='container'>
				<Switch>
					<Suspense fallback={<SpinnerCard/>}>
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
					</Suspense>
				</Switch>
			</div>
		</Fragment>
	);
}

export default App;
