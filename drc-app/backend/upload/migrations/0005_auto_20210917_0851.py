# Generated by Django 3.1.4 on 2021-09-17 08:51

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('upload', '0004_auto_20210917_0649'),
    ]

    operations = [
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Indicator',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('code', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='dataset',
            name='file_type',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='dataset',
            name='number_of_rows',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='dataset',
            name='description',
            field=models.CharField(max_length=255),
        ),
        migrations.CreateModel(
            name='Region',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('region', models.CharField(max_length=255)),
                ('code', models.CharField(max_length=255)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='upload.country')),
            ],
        ),
        migrations.CreateModel(
            name='RawDataset',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('survey_date', models.DateField(default=datetime.datetime.now)),
                ('value', models.DecimalField(decimal_places=15, max_digits=30)),
                ('indicator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='upload.indicator')),
                ('region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='upload.region')),
            ],
        ),
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('area', models.CharField(max_length=255)),
                ('region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='upload.country')),
            ],
        ),
    ]