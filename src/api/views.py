from django.shortcuts import render
# from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from api.serializers import (
    ProductSerializer,
    OrderSerializer,
    OrderItemSerializer,
)
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from store.models import Product, Order, OrderItem, ShippingAddress
from rest_framework.response import Response
# from django.core import serializers
from store.utils import cartData
import json
import datetime
from django.http import JsonResponse

# Create your views here.

# class ListView(ListAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

#     # def get_queryset(self, *args, **kwargs):
#     #     id = self.kwargs['pk']
#     #     return Product.objects.filter(pk=id)
    
class ListView(APIView):
    authentication_classes = [BasicAuthentication, TokenAuthentication, SessionAuthentication]
    def get(self, request, format=None):
        data = cartData(request)

        # items = OrderItemSerializer(data['items'], many=True).data

        cartItems = data['cartItems']
        products = Product.objects.all()
        products = ProductSerializer(products, many=True).data
        context = {'products':products, 'cartItems': cartItems}
        return Response(context)

class ListCartView(APIView):
    authentication_classes = [BasicAuthentication, TokenAuthentication, SessionAuthentication]
    def get(self, request, format=None):
        data = cartData(request)

        # items = data['items']
        # items = serializers.serialize('json', data['items'])
        # print(data['items'])
        items = OrderItemSerializer(data['items'], many=True).data
        # orders = data['order']
        order = {
            'get_cart_items': data['order'].get_cart_items,
            'get_cart_total': data['order'].get_cart_total
        }
        cartItems = data['cartItems']

        # context = {'items':items, 'order':order}
        context = {'items':items, 'order':order, 'cartItems': cartItems}
        return Response(context)

class UpdateCart(APIView):
    authentication_classes = [BasicAuthentication, TokenAuthentication, SessionAuthentication]
    def post(self, request, format=None):
        data = json.loads(request.body)
        # data = request.body
        productId = data['productId']
        action = data['action']
        # print(productId)
        # print(action)
        
        customer = request.user.customer
        product = Product.objects.get(id=productId)
        
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)
        
        if action == 'add':
            orderItem.quantity = (orderItem.quantity + 1)
        elif action == 'remove':
            orderItem.quantity = (orderItem.quantity - 1)
            
        orderItem.save()
        
        if orderItem.quantity <= 0:
            orderItem.delete()
        return Response('Data added')


class ProcessOrder(APIView):
    authentication_classes = [BasicAuthentication, TokenAuthentication, SessionAuthentication]
    def post(self, request, format=None):
        transaction_id = datetime.datetime.now().timestamp()
        data = json.loads(request.body)
        # data = request.body
        if request.user.is_authenticated:
            print("HEre autheak")
            customer= request.user.customer
            order, created = Order.objects.get_or_create(customer=customer, complete=False)
            
        # else:
        #     customer, order = guestOrder(request, data)
        
        total = data['form']['total']
        order.transaction_id = transaction_id
        
        #yo condition fullfill vayena type le garda
        #if Decimal(total) == order.get_cart_total:
        #    order.complate = True
        order.complete = True
        order.save()
        
        if order.shipping == True:
            ShippingAddress.objects.create(
                customer = customer,
                order = order,
                address = data['shipping']['address'],
                city = data['shipping']['city'],
                state = data['shipping']['state'],
                zipcode = data['shipping']['zipcode'],
            )
                
        return JsonResponse('Payment Complete', safe=False)

def PendingDelivery(self):
    order = Order.objects.filter(delivered=False)
    print(order)
    return JsonResponse('Complete', safe=False)