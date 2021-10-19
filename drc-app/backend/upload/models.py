from datetime import datetime
from django.db import models

def upload_path(instance, filename):
    return '/'.join(['covers', filename])

class Dataset(models.Model):
    description = models.CharField(max_length=255, blank=False)
    data_type = models.IntegerField(default=1, blank=False)
    cover = models.FileField(blank=True, null=True, upload_to=upload_path)
    date_created = models.DateTimeField(default=datetime.now)
    file_type = models.CharField(max_length=20, blank=False, null=True)
    number_of_rows = models.IntegerField(default=0, blank=False)

class Country(models.Model):
    country = models.CharField(max_length=255, blank=False)

class Region(models.Model):
    region = models.CharField(max_length=255, blank=False)
    code = models.CharField(max_length=255, blank=False)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    

class Area(models.Model):
    area = models.CharField(max_length=255, blank=False)
    region = models.ForeignKey(Country, on_delete=models.CASCADE)

class Indicator(models.Model):
    name = models.CharField(max_length=255, blank=False)
    code = models.CharField(max_length=255, blank=False)

class Scenario(models.Model):
    scenario = models.CharField(max_length=255, blank=False)
    description = models.CharField(max_length=1000, blank=False)
    date_created = models.DateTimeField(default=datetime.now)


class RawDataset(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    dataset_id = models.ForeignKey(Dataset, on_delete=models.CASCADE, blank=False, default=1)
    indicator = models.ForeignKey(Indicator, on_delete=models.CASCADE)
    survey_date = models.DateField(default=datetime.now)
    value = models.DecimalField(max_digits=30, decimal_places=3)


class ProjectionDataset(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE)
    dataset_id = models.ForeignKey(Dataset, on_delete=models.CASCADE, blank=False, default=1)
    survey_date = models.DateField(default=datetime.now)
    projection_type = models.CharField(max_length=255, blank=False)
    displacement = models.DecimalField(max_digits=30, decimal_places=3, blank=True)
    upper = models.DecimalField(max_digits=30,  decimal_places=3, blank=True,  null=True)
    lower = models.DecimalField(max_digits=30,  decimal_places=3, blank=True,  null=True)
    scenario = models.CharField(max_length=255, blank=False)





    


    


    
