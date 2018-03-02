import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';
import { AvForm, AvField, AvRadio, AvRadioGroup } from 'availity-reactstrap-validation';
import { Collapse, Navbar, NavbarToggler, Dropdown, NavbarBrand, Nav, NavItem, NavLink, DropdownToggle, DropdownMenu, DropdownItem, Jumbotron, Button, Container, Row, Col, Card, CardText, CardBody, CardTitle, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody } from 'reactstrap';


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
									<Route path="/register" component={Register} />
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
		<FormGroup>
			<Label for="ContactEmail">Email</Label>
			<Input type="email" name="email" id="ContactEmail" />
		</FormGroup>
		<FormGroup>
			<Label for="ContactText">What do you need?</Label>
			<Input type="textarea" name="text" id="ContactText" />
		</FormGroup>
		<Button>Submit</Button>
	</Form>
);

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.handleValidSubmit = this.handleValidSubmit.bind(this);
		this.state = {
			modal: false
		};
		this.toggle = this.toggle.bind(this);
		console.log(this.toggle)
	}
	handleValidSubmit(event, values) {
		this.setState({values});
		fetch("/user", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values)
		}).then(function(response) {
			return response.json();
		}).then(function(data) {
			if(data.name === "SequelizeUniqueConstraintError"){
				console.log(this)
			}
			else{
				console.log(data)
			}
		});
	}
	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}
	render() {
		const defaultValues = {
			ClientType: "Residential"
		};
		return (
			<div>
				<AvForm model={defaultValues} onValidSubmit={this.handleValidSubmit}>
					<p className="text-muted">Tell us more about who you are and we will get back to you shortly</p>
					<AvField name="Name" label="Full Name" required />
					<AvRadioGroup inline name="ClientType" label="Type of Property">
						<AvRadio label="Residential" value="1" />
						<AvRadio label="Commercial" value="2" />
					</AvRadioGroup>
					<AvField name="Address" label="Street Address" required />
					<AvField name="City" label="City" required />
					<AvField name="State" label="State" required />
					<AvField name="NumberOfUnits" label="Number of Units" required type="number" min="1" max="999" />
					<AvField name="Email" label="E-Mail" required type="email" />
					<FormGroup>
						<Button color="primary" size="lg" block>Register</Button>
					</FormGroup>
				</AvForm>
				<Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
					<ModalHeader toggle={this.toggle}>Email Already Registed</ModalHeader>
					<ModalBody>Please try a different Email</ModalBody>
				</Modal>
			</div>
		);
	}
};
const NoMatch = ({ location }) => (<h1>404</h1>);