from django.contrib import admin
from .models import Dataset, Country, Region, Area, Indicator, RawDataset, Scenario, ProjectionDataset

admin.site.register(Area)
admin.site.register(Country)
admin.site.register(Dataset)
admin.site.register(Indicator)
admin.site.register(RawDataset)
admin.site.register(Region)
admin.site.register(Scenario)
admin.site.register(ProjectionDataset)