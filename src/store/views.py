from django.shortcuts import render
from django.http import JsonResponse
from store.models import Product, Customer, Order, OrderItem, ShippingAddress
from store.utils import cookieCart, cartData, guestOrder
#from decimal import Decimal
import json
import datetime

# Create your views here.

def home(request):
    data = cartData(request)
    
    cartItems = data['cartItems']
        
    products = Product.objects.all()
    context = {'products':products, 'cartItems': cartItems}
    return render(request, 'store.html', context)
    
def cart(request):
    data = cartData(request)
    
    items = data['items']
    order = data['order']
    cartItems = data['cartItems']
            
    context = {'items':items, 'order':order, 'cartItems': cartItems}
    return render(request, 'cart.html', context)
    
def checkout(request):
    data = cartData(request)
    
    items = data['items']
    order = data['order']
    cartItems = data['cartItems']
        
    context = {'items':items, 'order':order, 'cartItems': cartItems}
    return render(request, 'checkout.html', context)
    
def updateItem(request):
    data = json.loads(request.body)
    productId = data['productId']
    action = data['action']
    print('Product Id: ' + productId)
    print('Action: ' + action)
    
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
    return JsonResponse('Data added', safe=False)
    
def processOrder(request):
    transaction_id = datetime.datetime.now().timestamp()
    data = json.loads(request.body)
    if request.user.is_authenticated:
        customer= request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)
        
    else:
        customer, order = guestOrder(request, data)
    
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