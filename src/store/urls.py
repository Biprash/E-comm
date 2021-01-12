from django.urls import path
from store import views

urlpatterns = [
    path('', views.home, name='store'),
    path('cart/', views.cart, name='cart'),
    path('checkout/', views.checkout, name='checkout'),
    path('update-item/', views.updateItem, name='update-item'),
    path('process-order/', views.processOrder, name='process-order'),
]