import React, { Component } from 'react'
import { View, Image } from 'react-native'

export default class SplashScreen extends Component {
	componentDidMount() {
		setTimeout(async () => {
			// setIsLoading(false);
			let userToken
			userToken = null
			try {
				userToken = await AsyncStorage.getItem('userToken')
			} catch (e) {
				console.log(e)
			}
			console.log('user token: ', userToken)
			// dispatch({ type: 'RETRIEVE_TOKEN', token: userToken })
			if (userToken == null) {
				this.props.navigation.navigate('SignIn')
			}
		}, 1000)
	}
	render() {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Image
					style={{ height: 200, width: 200 }}
					source={require('../assets/logo.png')}
				/>
			</View>
		)
	}
}
