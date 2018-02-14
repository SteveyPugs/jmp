class NavBar extends React.Component {
	render() {
		return (
			<div>
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
					<a className="navbar-brand" href="#">J. Maxwell Properties</a>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarToggle">
						<ul className="navbar-nav">
							<li className="nav-item">
								<a className="nav-link" href="#">Who We Are</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="#">What We Do</a>
							</li>
							<li className="nav-item dropdown">
								<a className="nav-link dropdown-toggle" href="#" id="loginMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Login</a>
								<div className="dropdown-menu" aria-labelledby="loginMenuLink">
									<a className="dropdown-item" href="#">Landlord</a>
									<a className="dropdown-item" href="#">Tenant</a>
								</div>
							</li>
						</ul>
					</div>
				</nav>
				<br/ >
			</div>
		);
	}
};

class Opener extends React.Component {
	render() {
		return (
			<div>
		 		<div className="container">
					<div className="row">
						<div className="col-lg">
							<div className="jumbotron">
								<h1 className="display-4">Property Management. Made Simple.</h1>
								<p className="lead">Managing your property can be as hassle. Let&apos; make it simple.</p>
								<a className="btn btn-primary btn-lg" href="#" role="button">Manage with Us</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};

class Home extends React.Component {
	render() {
		return(
			<div>
				<NavBar />
				<Opener />
			</div>
		);
	}
};

ReactDOM.render(<Home />, document.getElementById('app'));