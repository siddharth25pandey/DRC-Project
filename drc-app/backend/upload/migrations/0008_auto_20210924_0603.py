# Generated by Django 3.1.4 on 2021-09-24 06:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('upload', '0007_scenario'),
    ]

    operations = [
        migrations.AddField(
            model_name='projectiondataset',
            name='dataset_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='upload.dataset'),
        ),
        migrations.AddField(
            model_name='rawdataset',
            name='dataset_id',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='upload.dataset'),
        ),
    ]