from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.main_view, name='main')
]