// React Native Navigation Drawer – Example using Latest Navigation Version //
// https://aboutreact.com/react-native-navigation-drawer //
import 'react-native-gesture-handler'

import * as React from 'react'
import {
	// Button,
	View,
	Text,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import AsyncStorage from '@react-native-community/async-storage'

import { AuthContext } from './components/context'
import axios from 'axios'

import DrawerContent from './components/DrawerContent'
import SplashScreen from './Screen/SplashScreen'
import Home from './Screen/Home'
import Setting from './Screen/Setting'
import Checkout from './Screen/Checkout'
import Cart from './Screen/Cart'
import SignIn from './Screen/SignIn'
import SignUp from './Screen/SignUp'
import {HostUrl} from './Setting'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const NavigationDrawerStructure = props => {
	//Structure for the navigatin Drawer
	const toggleDrawer = () => {
		//Props to open/close the drawer
		props.navigationProps.toggleDrawer()
	}

	return (
		<View style={{ flexDirection: 'row' }}>
			<TouchableOpacity onPress={() => toggleDrawer()}>
				{/*Donute Button Image */}
				<Image
					source={{
						uri:
							'https://raw.githubusercontent.com/AboutReact/sampleresource/master/drawerWhite.png',
					}}
					style={{ width: 25, height: 25, marginLeft: 20 }}
				/>
			</TouchableOpacity>
		</View>
	)
}

const NavigationDrawerStructureR = props => {
	return (
		<View style={{ flexDirection: 'row' }}>
			<TouchableOpacity
				style={{ flexDirection: 'row', marginRight: 20 }}
				onPress={() => props.navigationProps.navigate('Cart')}>
				{/*Donute Button Image */}
				<Image
					source={{
						uri: `http://${HostUrl}/static/images/cart.png`,
					}}
					style={{ width: 25, height: 25 }}
				/>
				<View
					style={{
						flex: 1,
						backgroundColor: 'white',
						borderRadius: 15,
						minWidth: 15,
						height: 15,
						alignItems: 'center',
						justifyContent: 'center',
						padding: 2,
					}}>
					<Text
						style={{
							color: 'red',
							flexWrap: 'wrap',
						}}>
						{props.route.params.cart}
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	)
}

/*
function firstScreenStack({ navigation }) {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen
				name="Home"
				component={Home}
				options={{
					title: 'Home', //Set Header Title
					headerLeft: () => (
						<NavigationDrawerStructure navigationProps={navigation} />
					),
					headerRight: () => (
						<NavigationDrawerStructureR navigationProps={navigation} />
					),
					headerStyle: {
						backgroundColor: '#f4511e', //Set Header color
					},
					headerTintColor: '#fff', //Set Header text color
					headerTitleStyle: {
						fontWeight: 'bold', //Set Header text style
					},
				}}
			/>
		</Stack.Navigator>
	)
}

function secondScreenStack({ navigation, route }) {
	return (
		<Stack.Navigator
			initialRouteName="Setting"
			screenOptions={{
				headerLeft: () => (
					<NavigationDrawerStructure navigationProps={navigation} />
				),
				headerStyle: {
					backgroundColor: '#f4511e', //Set Header color
				},
				headerTintColor: '#fff', //Set Header text color
				headerTitleStyle: {
					fontWeight: 'bold', //Set Header text style
				},
			}}>
			<Stack.Screen
				name="Setting"
				component={Setting}
				options={{
					title: 'Settings', //Set Header Title
				}}
			/>
		</Stack.Navigator>
	)
}
*/

function RouteScreenStack({ navigation, route }) {
	let routes = route.name
	let dyanamic_compoent
	switch (routes) {
		case 'Home':
			dyanamic_compoent = Home
			break
		case 'Cart':
			dyanamic_compoent = Cart
			break
		case 'Checkout':
			dyanamic_compoent = Checkout
			break
		case 'Setting':
			dyanamic_compoent = Setting
			break
		default:
			dyanamic_compoent = Home
	}
	// console.log('navigation', navigation)
	console.log('route', route)
	return (
		<Stack.Navigator
			initialRouteName={route.name}
			screenOptions={{
				headerLeft: () => (
					<NavigationDrawerStructure navigationProps={navigation} />
				),
				headerRight: () => (
					<NavigationDrawerStructureR
						navigationProps={navigation}
						route={route}
					/>
				),
				headerStyle: {
					backgroundColor: '#f4511e', //Set Header color
				},
				headerTintColor: '#fff', //Set Header text color
				headerTitleStyle: {
					fontWeight: 'bold', //Set Header text style
				},
			}}>
			<Stack.Screen
				name={route.name}
				component={dyanamic_compoent}
				// component={
				// 	route.name == 'Cart'
				// 		? Cart
				// 		: route.name == 'Checkout'
				// 		? Checkout
				// 		: Home
				// }
				options={{
					title: route.name, //Set Header Title
				}}
			/>
		</Stack.Navigator>
	)
}

function App() {
	const initialLoginState = {
		isLoading: true,
		userName: null,
		userToken: null,
	}

	const loginReducer = (prevState, action) => {
		switch (action.type) {
			case 'RETRIEVE_TOKEN':
				return {
					...prevState,
					userToken: action.token,
					isLoading: false,
				}
			case 'LOGIN':
				return {
					...prevState,
					userName: action.username,
					userToken: action.token,
					isLoading: false,
				}
			case 'LOGOUT':
				return {
					...prevState,
					userName: null,
					userToken: null,
					isLoading: false,
				}
			case 'REGISTER':
				return {
					...prevState,
					userName: action.username,
					userToken: action.token,
					isLoading: false,
				}
		}
	}

	const [loginState, dispatch] = React.useReducer(
		loginReducer,
		initialLoginState
	)

	const authContext = React.useMemo(
		() => ({
			// signIn: async foundUser => {
			// 	// setUserToken('fgkj');
			// 	// setIsLoading(false);
			// 	const userToken = String(foundUser[0].userToken)
			// 	const userName = foundUser[0].username

			// 	try {
			// 		await AsyncStorage.setItem('userToken', userToken)
			// 	} catch (e) {
			// 		console.log(e)
			// 	}
			// 	// console.log('user token: ', userToken);
			// 	dispatch({ type: 'LOGIN', id: userName, token: userToken })
			// },
			signIn: (username, password) => {
				console.log('user', username, password)
				// axios
				// 	.post('http://192.168.254.7:8000/rest-auth/login/', {
				// 		username: username,
				// 		password: password,
				// 		withCredentials: true,
				// 	})
				// 	.then(response => {
				// 		console.log(response)
				// 		console.log('user enter', username, password)
				// 		dispatch({ type: 'LOGIN', username: username, token: response.key })
				// 	})
				// 	.catch(error => {
				// 		console.log(error)
				// 		console.log('user error', username, password)
				// 	})

				// var axios = require('axios')
				var data = JSON.stringify({
					username: username,
					password: password,
				})

				var config = {
					method: 'post',
					url: `http://${HostUrl}/rest-auth/login/`,
					headers: {
						withCredentials: 'true',
						'Content-Type': 'application/json',
					},
					data: data,
					// withCredentials: true,
				}

				axios(config)
					.then(function (response) {
						console.log(JSON.stringify(response.data))
						console.log('user enter', response.data.key)
						console.log('header', response.headers)
						try {
							AsyncStorage.setItem('userToken', response.data.key)
							AsyncStorage.setItem('username', username)
						} catch (e) {
							// saving error
							console.log('storage error', e)
						}
						dispatch({
							type: 'LOGIN',
							username: username,
							token: response.data.key,
						})
					})
					.catch(function (error) {
						console.log(error)
						console.log('user error', username, password)
					})
			},
			signOut: async () => {
				// setUserToken(null);
				// setIsLoading(false);
				try {
					await AsyncStorage.removeItem('userToken')
					await AsyncStorage.removeItem('username')
				} catch (e) {
					console.log(e)
				}
				dispatch({ type: 'LOGOUT' })
			},
			signUp: (username, email, password1, password2) => {
				var data = JSON.stringify({
					username: username,
					email: email,
					password1: password1,
					password2: password2,
				})

				var config = {
					method: 'post',
					url: `http://${HostUrl}/rest-auth/registration/`,
					headers: {
						withCredentials: 'true',
						'Content-Type': 'application/json',
					},
					data: data,
					// withCredentials: true,
				}

				axios(config)
					.then(function (response) {
						console.log(JSON.stringify(response.data))
						console.log('user enter', response.data.key)
						try {
							AsyncStorage.setItem('userToken', response.data.key)
							AsyncStorage.setItem('username', username)
						} catch (e) {
							// saving error
							console.log('storage error', e)
						}
						dispatch({
							type: 'REGISTER',
							username: username,
							token: response.data.key,
						})
					})
					.catch(error => {
						console.log(error)
						console.log('user error', username, password)
					})
			},
			retrive: async () => {
				// setIsLoading(false);
				let userToken
				userToken = null
				try {
					userToken = await AsyncStorage.getItem('userToken')
				} catch (e) {
					console.log(e)
				}
				// console.log('user token: ', userToken);
				dispatch({ type: 'RETRIEVE_TOKEN', token: userToken })
			},
		}),
		[]
	)

	React.useEffect(() => {
		setTimeout(async () => {
			// setIsLoading(false);
			let userToken
			userToken = null
			try {
				userToken = await AsyncStorage.getItem('userToken')
			} catch (e) {
				console.log(e)
			}
			// console.log('user token: ', userToken);
			dispatch({ type: 'RETRIEVE_TOKEN', token: userToken })
		}, 1000)
	}, [])

	if (loginState.isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		)
	}

	return (
		<AuthContext.Provider value={authContext}>
			<NavigationContainer>
				<View style={{ marginTop: 25 }}></View>
				{loginState.userToken !== null ? (
					<Drawer.Navigator
						drawerContent={props => <DrawerContent {...props} />}
						drawerContentOptions={{
							activeTintColor: '#e91e63',
							itemStyle: { marginVertical: 5 },
						}}>
						{/* <Drawer.Screen name="SplashScreen" component={SplashScreen} /> */}

						<Drawer.Screen
							name="Home"
							options={{ drawerLabel: 'Home' }}
							component={RouteScreenStack}
							// component={firstScreenStack}
							initialParams={{ cart: 3 }}
						/>
						<Drawer.Screen
							name="Setting"
							options={{ drawerLabel: 'Setting' }}
							// component={secondScreenStack}
							component={RouteScreenStack}
							initialParams={{ name: 'Setting' }}
						/>
						<Drawer.Screen
							name="Cart"
							options={{ drawerLabel: 'Cart' }}
							component={RouteScreenStack}
							initialParams={{ cart: 3 }}
						/>
						<Drawer.Screen
							name="Checkout"
							options={{ drawerLabel: 'Checkout' }}
							component={RouteScreenStack}
							initialParams={{ name: 'Checkout',cart: 3 }}
						/>
					</Drawer.Navigator>
				) : (
					<Drawer.Navigator
						drawerContent={props => <DrawerContent {...props} />}
						drawerContentOptions={{
							activeTintColor: '#e91e63',
							itemStyle: { marginVertical: 5 },
						}}>
						<Drawer.Screen name="SplashScreen" component={SplashScreen} />
						<Drawer.Screen name="SignIn" component={SignIn} />
						<Drawer.Screen name="SignUp" component={SignUp} />
					</Drawer.Navigator>
				)}
			</NavigationContainer>
		</AuthContext.Provider>
	)
}

export default App
