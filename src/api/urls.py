from django.urls import path

from api.views import ListView, ListCartView, UpdateCart, ProcessOrder, PendingDelivery

urlpatterns = [
    path('', ListView.as_view()),
    # path('<int:pk>', ListView.as_view()),
    path('cart/', ListCartView.as_view()),
    path('update-item/', UpdateCart.as_view()),
    path('process-order/', ProcessOrder.as_view()),
    path('process-delivery/', PendingDelivery),
]