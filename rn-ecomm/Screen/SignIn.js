import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Button,
	TouchableOpacity,
	Alert,
} from 'react-native'

import { AuthContext } from '../components/context'

export default function SignIn({ navigation }) {
	const [data, setData] = useState({
		username: '',
		password: '',
		secureTextEntry: true,
	})

	const { signIn } = React.useContext(AuthContext)

	const handleUsernameChange = val => {
		setData({
			...data,
			username: val,
		})
	}
	const handlePasswordChange = val => {
		setData({
			...data,
			password: val,
		})
	}
	const togle_secureTextEntry = val => {
		setData({
			...data,
			secureTextEntry: !data.secureTextEntry,
		})
	}
	const handleLogin = () => {
		if (data.username != '' || data.username != null) {
			if (data.password != '' || data.password != null) {
				signIn(data.username, data.password)
			}
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.heading}>Welcome Back</Text>
			<View style={styles.form_group}>
				<Text style={styles.text}>Username</Text>
				<TextInput
					onChangeText={val => handleUsernameChange(val)}
					style={styles.textInput}
					placeholder="Username"
				/>
			</View>
			<View style={styles.form_group}>
				<Text style={styles.text}>Password</Text>
				<TextInput
					onChangeText={val => handlePasswordChange(val)}
					secureTextEntry={data.secureTextEntry ? true : false}
					autoCapitalize="none"
					style={styles.textInput}
					placeholder="Password"
				/>
			</View>
			<TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
				<Text style={styles.buttonText}>Sign In</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.secButton]}
				onPress={() => navigation.navigate('SignUp')}>
				<Text style={[styles.buttonText, styles.secButtonText]}>Sign Up</Text>
			</TouchableOpacity>
		</View>
	)
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
