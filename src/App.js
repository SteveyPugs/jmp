import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';
import { Collapse, Navbar, NavbarToggler, Dropdown, NavbarBrand, Nav, NavItem, NavLink, DropdownToggle, DropdownMenu, DropdownItem, Jumbotron, Button, Container, Row, Col, Card, CardText, CardBody, CardTitle, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

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
					<br />
					<Container>
						<Row>
							<Col>
								<Switch>
									<Route exact path="/" component={Home} />
									<Route path="/who-we-are" component={Who} />
									<Route path="/contact" component={Contact} />
									<Route component={NoMatch} />
								</Switch>
							</Col>
						</Row>
					</Container>
				</div>
			</Router>
		);
	}
}

const Home = () => (
	<Jumbotron>
		<h1 className="display-3">Property Management. Made Simple.</h1>
		<p>Managing your property can be as hassle. Let&apos;s make it simple.</p>
		<p className="lead"><Button color="primary" href="/register">Manage with Us</Button></p>
	</Jumbotron>
);

const Who = () => (
	<Card>
		<CardBody>
			<CardTitle>Who We Are</CardTitle>
			<CardText>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</CardText>
		</CardBody>
	</Card>
);

const Contact = () => (
	<Form>
		<Alert color="dark">
			<FormGroup>
				<Label for="ContactEmail">Email</Label>
				<Input type="email" name="email" id="ContactEmail" />
			</FormGroup>
			<FormGroup>
				<Label for="ContactText">What do you need?</Label>
				<Input type="textarea" name="text" id="ContactText" />
			</FormGroup>
			<Button>Submit</Button>
		</Alert>
	</Form>
);

const NoMatch = ({ location }) => (<h1>404</h1>);