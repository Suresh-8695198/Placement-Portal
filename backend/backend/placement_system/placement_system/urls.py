


from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # built-in admin (you can keep it)
    
    path('api/students/', include('students.urls')),  # your existing students APIs
    
    path('admin-panel/', include('admin_app.urls')),  # ← new admin section
    # or: path('dashboard/', include('admin_app.urls')),

    path('companies/',   include('companies.urls')),
    path('coordinator/', include('coordinator.urls')),

]


from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
