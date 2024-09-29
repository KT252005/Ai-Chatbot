from django.shortcuts import render


def debug_view(request):  # Print template directories
    return render(request,"popup.html")  