import React, { Component } from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Button,
	TouchableOpacity,
	Alert,
	ScrollView,
} from 'react-native'

import { AuthContext } from '../components/context'

export default class SignUp extends Component {
	constructor(props) {
		super(props)

		this.state = {
			username: '',
			email: '',
			password1: '',
			password2: '',
			phoneno: '',
			secureTextEntry: true,
			confirmSecureTextEntry: true,
		}
	}

	// https://www.taniarascia.com/using-context-api-in-react/
	// static signUp = React.useContext(AuthContext)
	// static contextType = AuthContext

	static contextType = AuthContext

	handleUsernameChange = val => {
		this.setState({
			username: val,
		})
	}
	handleEmailChange = val => {
		this.setState({
			email: val,
		})
	}
	handlePasswordChange = val => {
		this.setState({
			password1: val,
		})
	}
	handleConfirmPasswordChange = val => {
		this.setState({
			password2: val,
		})
	}
	handlePhonenoChange = val => {
		this.setState({
			phoneno: val,
		})
	}
	togle_secureTextEntry = val => {
		this.setState({
			secureTextEntry: !this.state.secureTextEntry,
		})
	}
	togle_secureTextEntry = val => {
		this.setState({
			confirmSecureTextEntry: !this.state.confirmSecureTextEntry,
		})
	}

	handleSignUp = () => {
		const context = this.context
		if (this.state.username != '' || this.state.username != null) {
			if (this.state.email != '' || this.state.email != null) {
				if (this.state.password1 != '' || this.state.password1 != null) {
					if (this.state.password2 != '' || this.state.password2 != null) {
						if (this.state.password1 === this.state.password2) {
							// const signUp = this.context
							context.signUp(
								this.state.username,
								this.state.email,
								this.state.password1,
								this.state.password2
							)
						}
					}
				}
			}
		}
	}

	render() {
		const { navigation } = this.props
		return (
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.heading}>Create an Account</Text>
					<View style={styles.form_group}>
						<Text style={styles.text}>Username</Text>
						<TextInput
							onChangeText={val => this.handleUsernameChange(val)}
							style={styles.textInput}
							placeholder="Username"
						/>
					</View>
					<View style={styles.form_group}>
						<Text style={styles.text}>Email</Text>
						<TextInput
							onChangeText={val => this.handleEmailChange(val)}
							autoCapitalize="none"
							style={styles.textInput}
							placeholder="Email"
						/>
					</View>
					<View style={styles.form_group}>
						<Text style={styles.text}>Phone Number</Text>
						<TextInput
							onChangeText={val => this.handlePhonenoChange(val)}
							style={styles.textInput}
							placeholder="Phone Number"
							keyboardType="numeric"
						/>
					</View>
					<View style={styles.form_group}>
						<Text style={styles.text}>Password</Text>
						<TextInput
							onChangeText={val => this.handlePasswordChange(val)}
							secureTextEntry={this.state.secureTextEntry ? true : false}
							autoCapitalize="none"
							style={styles.textInput}
							placeholder="Password"
						/>
					</View>
					<View style={styles.form_group}>
						<Text style={styles.text}>Confirm Password</Text>
						<TextInput
							onChangeText={val => this.handleConfirmPasswordChange(val)}
							secureTextEntry={this.state.confirmSecureTextEntry ? true : false}
							style={styles.textInput}
							placeholder="Confirm Password"
							autoCapitalize="none"
						/>
					</View>
					<TouchableOpacity
						style={styles.button}
						onPress={() => this.handleSignUp()}>
						<Text style={styles.buttonText}>Sign Up</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.button, styles.secButton]}
						onPress={() => navigation.navigate('SignIn')}>
						<Text style={[styles.buttonText, styles.secButtonText]}>
							Sign In
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	form_group: {
		width: '80%',
		marginVertical: 5,
	},
	heading: {
		fontSize: 26,
		fontWeight: 'bold',
		color: '#f4511e',
		marginBottom: 20,
		width: '80%',
	},
	text: {
		fontSize: 20,
		marginHorizontal: 20,
		marginBottom: 10,
	},
	textInput: {
		height: 40,
		borderWidth: 1,
		borderColor: '#f4511e',
		borderRadius: 20,
		paddingHorizontal: 20,
		fontSize: 16,
	},
	button: {
		height: 40,
		backgroundColor: '#f4511e',
		borderRadius: 20,
		marginVertical: 10,
		justifyContent: 'center',
		width: '80%',
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: 20,
	},
	secButton: {
		backgroundColor: 'white',
		borderWidth: 2,
		borderColor: '#f4511e',
	},
	secButtonText: {
		color: '#f4511e',
	},
})
