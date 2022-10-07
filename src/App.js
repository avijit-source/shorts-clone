import './App.css';
import SignUp from './components/SignUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import { AuthProvider } from './Context/AuthContext';
import Feed from './components/Feed';
import PrivateRoute from './PrivateRoute';
import Profile from './components/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <AuthProvider>
        <Switch>
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/profile/:id" component={Profile} />
        <PrivateRoute path="/" component={Feed} />
        </Switch>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
