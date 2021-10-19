# Generated by Django 3.1.4 on 2021-09-17 09:47

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('upload', '0005_auto_20210917_0851'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rawdataset',
            name='value',
            field=models.DecimalField(decimal_places=3, max_digits=30),
        ),
        migrations.CreateModel(
            name='ProjectionDataset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('survey_date', models.DateField(default=datetime.datetime.now)),
                ('projection_type', models.CharField(max_length=255)),
                ('displacement', models.DecimalField(blank=True, decimal_places=3, max_digits=30)),
                ('upper', models.DecimalField(blank=True, decimal_places=3, max_digits=30, null=True)),
                ('lower', models.DecimalField(blank=True, decimal_places=3, max_digits=30, null=True)),
                ('scenario', models.CharField(max_length=255)),
                ('region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='upload.region')),
            ],
        ),
    ]