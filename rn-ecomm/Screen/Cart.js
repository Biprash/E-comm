import React, { Component } from 'react'
import {
	View,
	Text,
	StyleSheet,
	Image,
	ScrollView,
	TouchableOpacity,
	Button,
	ActivityIndicator,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import { color } from 'react-native-reanimated'
import {HostUrl} from '../Setting'

export default class Cart extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading: true,
			token: null,
			Items: [],
			cartItems: null,
			cartTotal: null,
		}
	}

	async retrieveSessionToken() {
		try {
			const token = await AsyncStorage.getItem('userToken')
			// console.log('async token ohhh', token)

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

		let url = `http://${HostUrl}/api/update-item/`

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
					//stackoverflow.com/questions/4689856/how-to-change-value-of-object-which-is-inside-an-array-using-javascript-or-jquer
					https: this.renderScreen()
				}
				// location.reload()
			})
			.catch(error => {
				console.log(error)
				this.setState({ isLoading: false })
				// console.log('user error', username, password)
			})
	}

	componentDidMount() {
		// const context = this.context

		this.retrieveSessionToken().then(token => {
			if (token) {
				this.setState({ token: token })
				this.renderScreen()
			}
		})
	}

	renderScreen() {
		axios
			.get(`http://${HostUrl}/api/cart/`, {
				headers: { Authorization: `Token ${this.state.token}` },
			})
			.then(response => {
				this.setState({
					isLoading: false,
					Items: response.data.items,
					cartItems: response.data.order.get_cart_items,
					cartTotal: response.data.order.get_cart_total,
				})
				// console.log(response.data.cartItems)
			})
			.catch(error => {
				console.log(error)
			})
	}

	render() {
		const { Items, cartItems, cartTotal } = this.state
		const { navigation } = this.props
		return this.state.isLoading ? (
			<View
				style={{
					marginTop: 50,
				}}>
				<ActivityIndicator size="large" color="#f4511e" />
			</View>
		) : (
			<View>
				<ScrollView style={styles.container}>
					{/* <View style={styles.productView}>
						<Image
							style={styles.image}
							source={require('../assets/logo.png')}
						/>
						<View style={styles.productDetail}>
							<Text style={styles.productName}>Product name</Text>
							<View style={styles.innerDetail}>
								<View style={styles.priceView}>
									<Text style={styles.price}>Rs 5,000</Text>
								</View>
								<View style={styles.quantityView}>
									<TouchableOpacity style={styles.changeQuantity}>
										<Text style={{ fontSize: 16 }}>+</Text>
									</TouchableOpacity>
									<Text style={styles.quantity}>0</Text>
									<TouchableOpacity style={styles.changeQuantity}>
										<Text style={{ fontSize: 16 }}>-</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</View> */}

					{Items.map(item => (
						<View style={styles.productView} key={item.id}>
							<Image
								style={styles.image}
								source={{
									uri: `http://${HostUrl}` + item.product.image,
								}}
							/>
							<View style={styles.productDetail}>
								<Text style={styles.productName}>{item.product.name}</Text>
								<View style={styles.innerDetail}>
									<View style={styles.priceView}>
										<Text style={styles.price}>Rs {item.product.price}</Text>
									</View>
									<View style={styles.quantityView}>
										<TouchableOpacity
											style={styles.changeQuantity}
											onPress={() =>
												this.updateOrderItem(item.product.id, 'add')
											}>
											<Text style={{ fontSize: 16 }}>+</Text>
										</TouchableOpacity>
										<Text style={styles.quantity}>{item.quantity}</Text>
										<TouchableOpacity
											style={styles.changeQuantity}
											onPress={() =>
												this.updateOrderItem(item.product.id, 'remove')
											}>
											<Text style={{ fontSize: 16 }}>-</Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						</View>
					))}

					{/*  */}
				</ScrollView>
				<View style={styles.totalView}>
					<View style={{ flexDirection: 'column', width: '60%' }}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Text>shipping: </Text>
							<Text style={{ color: primary }}>Rs 50</Text>
						</View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Text style={styles.total}>Total: </Text>
							<Text style={styles.totalPrice}>Rs {cartTotal}</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => navigation.navigate('Checkout')}
						style={styles.checkout}>
						<Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
							Checkout
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

const primary = '#f4511e'

const styles = StyleSheet.create({
	container: {
		padding: '1%',
		height: '100%',
	},
	productView: {
		padding: 5,
		flex: 1,
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: 'black',
		borderRadius: 5,
		backgroundColor: '#eee',
		marginVertical: 5,
	},
	image: {
		height: 100,
		width: 100,
		resizeMode: 'contain',
	},
	productDetail: {
		flex: 1,
		flexDirection: 'column',
	},
	productName: {
		width: '100%',
		overflow: 'hidden',
		maxHeight: 20,
		fontSize: 18,
	},
	innerDetail: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
	},
	priceView: {
		width: '50%',
		justifyContent: 'center',
	},
	price: {
		fontSize: 16,
		color: primary,
	},
	quantityView: {
		width: '50%',
		justifyContent: 'center',
		alignContent: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	changeQuantity: {
		backgroundColor: '#999',
		borderRadius: 5,
		height: 30,
		width: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	quantity: {
		fontSize: 16,
		height: 30,
		width: 30,
		marginLeft: 10,
	},
	totalView: {
		width: '100%',
		height: 50,
		position: 'absolute',
		backgroundColor: '#eee',
		borderTopWidth: 1,
		padding: 5,
		bottom: 0,
		flexDirection: 'row',
	},
	total: {
		fontSize: 18,
	},
	totalPrice: {
		fontSize: 18,
		fontWeight: 'bold',
		color: primary,
	},
	checkout: {
		backgroundColor: primary,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 10,
		width: '40%',
		borderRadius: 5,
	},
})
