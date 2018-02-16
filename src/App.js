import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Collapse, Navbar, NavbarToggler, Dropdown, NavbarBrand, Nav, NavItem, NavLink, DropdownToggle, DropdownMenu, DropdownItem, Jumbotron, Button, Container, Row, Col } from 'reactstrap';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.menuToggle = this.menuToggle.bind(this);
		this.loginToggle = this.loginToggle.bind(this);
		this.state = {
			menu: false,
			login: false
		};
	}
	menuToggle() {
		this.setState({
			menu: !this.state.menu
		});
	}
	loginToggle() {
		this.setState({
			login: !this.state.login
		});
	}
	render() {
		return(
			<Router>
				<div>
					<Navbar color="dark" dark expand="md">
						<NavbarBrand href="/">J. Maxwell Properties</NavbarBrand>
						<NavbarToggler onClick={this.menuToggle} />
						<Collapse isOpen={this.state.menu} navbar>
							<Nav className="ml-auto" navbar>
								<NavItem>
									<NavLink href="/who-we-are">Who We Are</NavLink>
								</NavItem>
								<NavItem>
									<NavLink href="/contact">Contact</NavLink>
								</NavItem>
								<Dropdown isOpen={this.state.login} toggle={this.loginToggle}>
									<DropdownToggle color="primary" nav caret>Login</DropdownToggle>
									<DropdownMenu>
										<DropdownItem>Landlord</DropdownItem>
										<DropdownItem>Tenant</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</Nav>
						</Collapse>
					</Navbar>
					<Route exact path="/" component={Home} />
					<Route path="/who-we-are" component={Who} />
					<Route path="/contact" component={Contact} />
				</div>
			</Router>
		);
	}
}

const Home = () => (
	<Container>
		<Row>
			<Col>
			<br />
				<Jumbotron>
					<h1 className="display-3">Property Management. Made Simple.</h1>
					<p>Managing your property can be as hassle. Let&apos;s make it simple.</p>
					<p className="lead"><Button color="primary">Manage with Us</Button></p>
				</Jumbotron>
			</Col>
		</Row>
	</Container>
);

const Who = () => (<h2>Who</h2>);

const Contact = () => (<h2>Contact</h2>);