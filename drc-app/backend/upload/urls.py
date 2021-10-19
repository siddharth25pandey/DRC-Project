from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic.base import RedirectView

from .views import *

app_name = 'upload'


urlpatterns = [
    path('api/v1/upload', DatasetUpload.as_view(), name="dataset-upload"),
    path('api/v1/upload/all', DatasetList.as_view(), name="dataset-list"),
    path('api/v1/upload/delete', DatasetDelete.as_view(), name="dataset-delete"),
    path('api/v1/scenario', ScenarioAdd.as_view(), name="scenario-add"),
    path('api/v1/scenario/all', ScenarioAll.as_view(), name="scenario-all"),
    path('api/v1/scenario/delete', ScenarioDelete.as_view(), name="scenario-delete"),
    path('api/v1/scenario/details', ScenarioDetails.as_view(), name="scenario-details"),
    path('api/v1/country', CountryList.as_view(), name="country-list"),
    path('api/v1/region', RegionList.as_view(), name="region-list"),
    path('api/v1/projection', Projections.as_view(), name="projection-list"),
    path('api/v1/indicator', IndicatorList.as_view(), name="indicator-list"),
    path('api/v1/indicator-value', IndicatorValueList.as_view(), name="indicator-value-list"),
    path('api/v1/what-if', WhatIf.as_view(), name="what-if-list"),
    path('api/v1/what-if-2', WhatIf2.as_view(), name="what-if-list-2"),
    path('api/v1/country-stats', CountryData.as_view(), name="country"),
    path('api/v1/correlation', Correlation.as_view(), name="correlation"),
]
