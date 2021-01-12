import React, { Component } from 'react'
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native'

import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from '@react-navigation/drawer'

import { AuthContext } from '../components/context'

export default function DrawerContent(props) {
	const { signOut } = React.useContext(AuthContext)

	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView {...props}>
				<View>
					<View>
						<ImageBackground
							style={styles.bgImage}
							source={require('../assets/background-img.jpeg')}>
							<View style={styles.profile}>
								<Image
									style={styles.image}
									source={require('../assets/profile.jpg')}
								/>
								<Text style={styles.username}>Jenny Doe</Text>
							</View>
						</ImageBackground>
					</View>
					<DrawerItem
						label="Store"
						onPress={() => {
							props.navigation.navigate('Home')
						}}
						// activeTintColor="#e91e63"
						// focused="true"
						// activeBackgroundColor="#f9a88e"
					/>
					<DrawerItem
						label="Cart"
						onPress={() => {
							props.navigation.navigate('Cart')
						}}
					/>
					<DrawerItem
						label="Checkout"
						onPress={() => {
							props.navigation.navigate('Checkout')
						}}
					/>
					<DrawerItem
						label="Setting"
						onPress={() => {
							props.navigation.navigate('Setting')
						}}
					/>
				</View>
			</DrawerContentScrollView>
			<View>
				<DrawerItem label="Sign Out" onPress={() => signOut()} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	bgImage: {
		width: '100%',
		height: 150,
		flex: 1,
		justifyContent: 'center',
		// alignItems: 'center',
	},
	profile: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	image: {
		marginRight: 20,
		width: 100,
		height: 100,
		borderRadius: 50,
		borderWidth: 3,
		borderColor: '#fff',
	},
	username: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		alignItems: 'center',
	},
})
