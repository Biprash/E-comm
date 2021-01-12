import React, { Component } from 'react'
import {
	View,
	Text,
	Image,
	ActivityIndicator,
	ScrollView,
	Button,
	Alert,
	StyleSheet,
} from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import { AuthContext } from '../components/context'
import {HostUrl} from '../Setting'

export default class Home extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: true,
			token: null,
			products: [],
			cartItems: null,
		}
	}

	static contextType = AuthContext

	handleAddToCart(productId) {}

	async retrieveSessionToken() {
		try {
			const token = await AsyncStorage.getItem('userToken')
			if (token !== null) {
				// console.log('async token', token)
				return token
			}
		} catch (error) {
			console.log('Error while retriving the token')
		}
	}

	updateOrderItem(productId, action) {
		// console.log('user is authenticated, sending data')
		this.setState({ isLoading: true })

		var url = `http://${HostUrl}/api/update-item/`

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// 'X-CSRFToken': csrftoken,
				Authorization: `Token ${this.state.token}`,
			},
			body: JSON.stringify({ productId: productId, action: action }),
		})
			.then(response => {
				return response.json()
			})

			.then(data => {
				// console.log('data', data)
				if (data == 'Data added') {
					this.renderScreen()
				}
				// location.reload()
			})
			.catch(error => {
				console.log(error)
				this.setState({ isLoading: false })
				// console.log('user error', username, password)
			})
	}

	renderScreen() {
		this.setState({ isLoading: true })
		axios
			.get(`http://${HostUrl}/api`, {
				headers: { Authorization: `Token ${this.state.token}` },
			})
			.then(response => {
				this.setState({
					isLoading: false,
					products: response.data.products,
					cartItems: response.data.cartItems,
				})

				console.log(response.data.cartItems)
			})
			.catch(error => {
				this.setState({ isLoading: false })
				console.log(error)
			})
	}

	componentDidMount() {
		const context = this.context

		this.retrieveSessionToken().then(token => {
			if (token) {
				this.setState({ token: token })
				this.renderScreen()
				// this.props.navigation.setParams({ cart: 6 })
			}
		})
		// this.props.navigation.setParams({ cart: '6' })
		// console.log('navigation home', this.props.navigation)
		// let userToken = AsyncStorage.getItem('userToken')
		// here will not be token because we havent received yet
		// console.log('token', this.state.userToken)

		// fetch('http://127.0.0.1:8000/api/')
		// 	.then(response => response.json())
		// 	.then(data => {
		// 		console.log(data)
		// 		this.setState({
		// 			isLoading: false,
		// 			products: data.products,
		// 			cartItems: data.cartItems,
		// 		})
		// 	})
		// 	.catch(error => console.log(error))
	}

	render() {
		return (
			<View>
				{this.state.isLoading ? (
					<View
						style={{
							marginTop: 50,
						}}>
						<ActivityIndicator size="large" color="#f4511e" />
					</View>
				) : (
					<ScrollView>
						{/* <Button
							title="clidfsafack"
							onPress={() => this.props.navigation.setParams({ cart: 6 })}
						/> */}
						<View style={styles.container}>
							{this.state.products.map(product => (
								<View style={styles.productView} key={product.id}>
									<View style={styles.imageView}>
										<Image
											style={({ height: 200, width: 200 }, styles.image)}
											source={{
												uri: `http://${HostUrl}` + product.image,
											}}
										/>
									</View>
									<Text style={styles.title}>{product.name}</Text>
									<Text style={styles.price}>Rs {product.price}</Text>
									<Button
										style={styles.addToCart}
										title="Add to Cart"
										color="#f4511e"
										onPress={() => this.updateOrderItem(product.id, 'add')}
									/>
								</View>
							))}
						</View>
					</ScrollView>
				)}
			</View>
			// <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			// 	<Text>Home page</Text>
			// </View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 3,
		// padding: '1%',
		padding: 2,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	productView: {
		padding: 5,
		width: '50%',
		marginVertical: 5,
	},
	imageView: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
	},
	image: {
		height: 200,
		// overflow: 'visible',
		resizeMode: 'contain',
	},
	title: {
		fontSize: 16,
	},
	price: {
		fontSize: 20,
		fontWeight: 'bold',
		fontStyle: 'italic',
		color: '#444',
	},
	addToCart: {
		backgroundColor: '#f4511e',
		fontSize: 20,
		color: 'red',
	},
})
