import React from 'react'
import {
	View,
	Text,
	ScrollView,
	TextInput,
	Image,
	StyleSheet,
	TouchableOpacity,
	Alert,
} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import {HostUrl} from '../Setting'

export default function Checkout({ navigation }) {
	const [shippingData, setShippingData] = React.useState({
		address: '',
		city: 'Biratnagar',
		state: '1',
		zipcode: '+977',
	})
	const [itemData, setItemData] = React.useState({
		Items: [],
		cartItems: null,
		cartTotal: null,
	})
	const [token, setToken] = React.useState(null)

	const retrieveSessionToken = async () => {
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

	// latitude
	// longitude
	// city
	// address

	const handleAddressChange = val => {
		setShippingData({
			...shippingData,
			address: val,
		})
	}

	const handleShippingSubmit = () => {
		var userFormData = {
			name: '',
			email: '',
			total: itemData.cartTotal,
		}
		var shippingInfo = {
			address: shippingData.address,
			city: shippingData.city,
			state: shippingData.state,
			zipcode: shippingData.zipcode,
		}
		console.log(shippingInfo)
		if (shippingData.address !== null || shippingData.address !== '') {
			let url = `http://${HostUrl}/api/process-order/`
			console.log('token', token)
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// 'X-CSRFToken': csrftoken,
					Authorization: `Token ${token}`,
				},
				body: JSON.stringify({ form: userFormData, shipping: shippingInfo }),
			})
				.then(response => {
					response.json()
				})

				.then(data => {
					console.log('Data', data)
					console.log('Transaction Completed')
					Alert.alert('Transaction Compleated')
					navigation.navigate('Home')
				})
				.catch(error => {
					console.log(error)
					// this.setState({ isLoading: false })
					// console.log('user error', username, password)
				})

			// const options = {
			// 	url: url,
			// 	method: 'POST',
			// 	headers: {
			// 		Accept: 'application/json',
			// 		//   'Content-Type': 'application/json;charset=UTF-8'
			// 		Authorization: `Token ${token}`,
			// 	},
			// 	data: {
			// 		form: userFormData,
			// 		shipping: shippingInfo,
			// 	},
			// }

			// axios(options).then(response => {
			// 	console.log(response.status)
			// 	console.log('Transaction Completed')
			// 	Alert.alert((title = 'Transaction Compleated'))
			// })
		} else {
			Alert.alert((title = 'Empty address'))
		}
	}

	React.useEffect(() => {
		retrieveSessionToken().then(token => {
			if (token) {
				setToken(token)
				axios
					.get(`http://${HostUrl}/api/cart/`, {
						headers: { Authorization: `Token ${token}` },
					})
					.then(response => {
						setItemData({
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
		})
	}, [])
	const { Items, cartItems, cartTotal } = itemData

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text style={styles.heading}>Shipping Info</Text>
				<View style={styles.formGroup}>
					<Text style={styles.text}>Address</Text>
					<TextInput
						style={styles.textInput}
						onChangeText={val => handleAddressChange(val)}
						placeholder="Address"
					/>
				</View>
				<View style={styles.formGroup}>
					<Text style={styles.text}>City</Text>
					<TextInput
						style={styles.textInput}
						editable={false}
						placeholder="Biratnagar"
					/>
				</View>
				<View style={styles.formGroup}>
					<Text style={styles.text}>State</Text>
					<TextInput
						style={styles.textInput}
						editable={false}
						placeholder="1"
					/>
				</View>
				<View style={styles.formGroup}>
					<Text style={styles.text}>Zip Code</Text>
					<TextInput
						style={styles.textInput}
						editable={false}
						placeholder="+977"
					/>
				</View>
				<TouchableOpacity
					style={styles.button}
					onPress={() => handleShippingSubmit()}>
					<Text style={styles.btnText}>Proceed</Text>
				</TouchableOpacity>

				<View style={{ borderWidth: 1, width: '95%', borderColor: '#aaa' }} />

				<Text style={styles.heading}>Order Summary</Text>

				<View style={{ width: '95%' }}>
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
										{/* <TouchableOpacity
											style={styles.changeQuantity}
											onPress={() =>
												this.updateOrderItem(item.product.id, 'add')
											}>
											<Text style={{ fontSize: 16 }}>+</Text>
										</TouchableOpacity> */}
										<Text style={styles.quantity}>
											quantity:{item.quantity}
										</Text>
										{/* <TouchableOpacity
											style={styles.changeQuantity}
											onPress={() =>
												this.updateOrderItem(item.product.id, 'remove')
											}>
											<Text style={{ fontSize: 16 }}>-</Text>
										</TouchableOpacity> */}
									</View>
								</View>
							</View>
						</View>
					))}
					<Text
						style={{
							padding: 20,
							fontSize: 20,
							borderWidth: 1,
							borderColor: primary,
							marginVertical: 10,
							alignItems: 'center',
						}}>
						Total: Rs {cartTotal}
					</Text>
					<Text
						style={{
							padding: 20,
							fontSize: 20,
							borderWidth: 1,
							borderColor: primary,
							marginVertical: 10,
							alignItems: 'center',
						}}>
						Total Items: {cartItems}
					</Text>
				</View>
			</View>
		</ScrollView>
		// <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		// 	<Text>Checkout Page</Text>
		// </View>
	)
}

const primary = '#f4511e'

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginVertical: 5,
	},
	heading: {
		fontSize: 24,
		color: primary,
		marginVertical: 15,
		fontWeight: 'bold',
	},
	formGroup: {
		width: '85%',
		marginVertical: 5,
	},
	text: {
		paddingHorizontal: 5,
		fontSize: 18,
	},
	textInput: {
		width: '100%',
		marginVertical: 2,
		// borderWidth: 1,
		// borderColor: '#aaa',
		borderRadius: 5,
		borderBottomWidth: 2,
		borderBottomColor: primary,
		paddingVertical: 2,
		paddingHorizontal: 5,
		fontSize: 16,
		color: '#555',
	},
	button: {
		backgroundColor: primary,
		width: '40%',
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10,
		borderRadius: 2,
	},
	btnText: {
		color: 'white',
		fontSize: 18,
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
		width: 100,
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
