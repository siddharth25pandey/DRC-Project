from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import url
from django.views.generic import TemplateView
from rest_framework import routers
# from upload.views import DatasetUpload, DatasetList
from django.conf.urls.static import static
from django.conf import settings

# router = routers.DefaultRouter()
# router.register('api/v1/upload', DatasetUpload)
from rest_framework.schemas import get_schema_view

urlpatterns = [
    # path('openapi', get_schema_view(
    #     title="Your Project",
    #     description="API for all things …"
    # )),
    path('dataset/', include('upload.urls')),
    path('admin/web', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('accounts/', include('accounts.urls')),
    path('profile/', include('user_profile.urls')),
    re_path('(^(?!(api|admin|dataset|media)).*$)', TemplateView.as_view(template_name="index.html")),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
