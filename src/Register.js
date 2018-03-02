import React from 'react';
import { Redirect } from 'react-router';
import { AvForm, AvField, AvRadio, AvRadioGroup } from 'availity-reactstrap-validation';
import { Button, FormGroup, Alert } from 'reactstrap';

export class RegisterPage extends React.Component {
	constructor(props) {
		super(props);
		this.handleValidSubmit = this.handleValidSubmit.bind(this);
	}
	handleValidSubmit(event, values) {
		fetch("/landlord", {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values)
		}).then(function(response) {
			return response.json();
		}).then(function(data) {
			//go the post the get route for completion
		});
	}
	verifyEmail(value, ctx, input, cb){
		fetch("/landlord/verify?Email=" + value).then(function(response) {
			return response.json();
		}).then(function(data) {
			cb(value.length > 0 ? (data < 1 ? true : "Email already registered") : "This field is invalid");
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
					<AvField name="Email" label="E-Mail" required type="email" validate={{async: this.verifyEmail}} />
					<FormGroup>
						<Button color="primary" size="lg" block>Register</Button>
					</FormGroup>
				</AvForm>
			</div>
		);
	}
};

export class RegisterComplete extends React.Component {
	render() {
		return (
			<div>
				<Alert color="dark">Congrats, you should recieve an email shortly with your auto generated password</Alert>
			</div>
		);
	}
};