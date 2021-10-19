from rest_framework import serializers
from .models import Dataset

class DatasetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Dataset
        fields = ['description', 'data_type', 'cover']