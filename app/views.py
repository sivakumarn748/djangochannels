from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from . import models, forms

# Create your views here.

@login_required
def chat_view(request) :
    chat_group = get_object_or_404(models.ChatGroup, group_name='public-chat')
    chat_messages = chat_group.chat_messages.all()[:30]
    form = forms.ChatmessageCreateForm()
    
    if request.method == 'POST' :
        data = request.POST
        form = forms.ChatmessageCreateForm(data)
        if form.is_valid :
            message = form.save(commit=False)
            message.author = request.user
            message.group = chat_group
            message.save()
            return redirect('home')
    
    return render(request, 'chat.html', {
        "chat_messages" : chat_messages,
        'form': form
    })