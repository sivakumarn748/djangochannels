from django.forms import ModelForm
from django import forms
from . import models

class ChatmessageCreateForm(ModelForm) :
    class Meta :
        model = models.GroupMessage
        fields = ['body']
        widgets = {
            'body': forms.TextInput(attrs={
                'placeholder': 'Add message here...',
                'maxlength': '300',
                'autofocus': True
            })
        }