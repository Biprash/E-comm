from rest_framework import serializers
from store.models import Product, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    # https://stackoverflow.com/questions/40541822/how-to-show-depth-of-a-single-field-in-django-rest-framework
    product = ProductSerializer(many=False, read_only=True)
    class Meta:
        model = OrderItem
        fields = '__all__'
        # depth = 1