import ast
import math
import os
import pandas as pd

from datetime import datetime
from rest_framework import viewsets
from django.http import HttpResponse, JsonResponse
from .serializers import DatasetSerializer
from .models import Dataset, RawDataset, Indicator, Region, Country, ProjectionDataset, Scenario
from rest_framework import generics


class DatasetUpload(generics.ListAPIView):
    """Dataset Upload"""
    
    def post(self, request, *args, **kwargs):
        try:
            message = 'success'
            cover = request.data['cover']
            description = request.data['description']
            data_type = request.data['dataType']
            
            if int(data_type) == 1:
                if cover.content_type == 'text/csv':
                    raw_data = pd.read_csv(cover)
                    if ['country.name', 'country.code', 'region.name', 'region.code', 'year', 'month', 'indicator.name', 'indicator.code', \
                    'value'] == list(raw_data.columns):
                        result = Dataset.objects.create(description=description, data_type=int(data_type), cover=cover)
                        raw_data = pd.read_csv(result.cover)
                        result.number_of_rows = raw_data.shape[0]
                        result.file_type = 'csv'
                        result.save()

                        raw_data = raw_data.fillna(0)
                        for index, row in raw_data.iterrows():
                            try:
                                region = Region.objects.get(region=row['region.name'])
                            except:
                                region = Region()
                                region.region = row['region.name']
                                region.code = row['region.code']
                                region.country = Country.objects.get(country=row['country.name'])
                                region.save()

                            try:
                                indicator = Indicator.objects.get(name=row['indicator.name'])
                            except:
                                indicator = Indicator()
                                indicator.name = row['indicator.name']
                                indicator.code = row['indicator.code']
                                indicator.save()

                            survey_date = datetime.strptime('{}-{:02d}-01'.format(row['year'], row['month']), '%Y-%m-%d')

                            try:
                                raw_dataset = RawDataset.objects.get(region__region=row['region.name'], indicator__name=row['indicator.name'], \
                                    survey_date=survey_date)
                                raw_dataset.dataset_id = result
                                raw_dataset.value = float(row['value'])
                                raw_dataset.save()
                            except Exception as e:
                                raw_dataset = RawDataset()
                                raw_dataset.dataset_id = result
                                raw_dataset.region = region
                                raw_dataset.indicator = indicator
                                raw_dataset.value = float(row['value'])
                                raw_dataset.survey_date = survey_date
                                raw_dataset.save()

                        os.remove('{}/media/{}'.format(os.getcwd(), result.cover.name))

                    else:
                        message = 'Incorrect Header/s'
                else:
                    message = 'Only CSV Data Type is Allowed for Raw Dataset'
            elif int(data_type) == 2:
                if cover.content_type == 'text/csv':
                    raw_data = pd.read_csv(cover)
                    if ['survey_date', 'country.name', 'country.code', 'region.name',
                        'region.code', 'displacement', 'type', '.upper', '.lower', 'scenario'] == list(raw_data.columns):
                        result = Dataset.objects.create(description=description, data_type=int(data_type), cover=cover)
                        
                        projection_data = pd.read_csv(result.cover)
                        result.number_of_rows = projection_data.shape[0]
                        result.file_type = 'csv'
                        result.save()

                        projection_data = projection_data.fillna(0)

                        for index, row in projection_data.iterrows():
                            survey_date = datetime.strptime(row['survey_date'], '%Y-%m-%d')

                            try:
                                region = Region.objects.get(region=row['region.name'])
                            except:
                                region = Region()
                                region.region = row['region.name']
                                region.code = row['region.code']
                                region.country = Country.objects.get(country=row['country.name'])
                                region.save()

                            try:
                                raw_dataset = ProjectionDataset.objects.get(region__region=row['region.name'], \
                                    survey_date=survey_date, scenario=row['scenario'])
                                if row['displacement'] is not None:
                                    projection_dataset.displacement = float(row['displacement'])
                                if row['.upper'] is not None:
                                    projection_dataset.upper = float(row['.upper'])
                                if row['.lower'] is not None:
                                    projection_dataset.lower = float(row['.lower'])
                                if row['scenario'] is not None:
                                    projection_dataset.scenario = row['scenario']
                                projection_dataset.save()
                            except: 
                                projection_dataset = ProjectionDataset()
                                projection_dataset.dataset_id = result
                                projection_dataset.region = region
                                projection_dataset.survey_date = survey_date
                                projection_dataset.projection_type = row['type']
                                if row['displacement'] is not None:
                                    projection_dataset.displacement = float(row['displacement'])
                                if row['.upper'] is not None:
                                    projection_dataset.upper = float(row['.upper'])
                                if row['.lower'] is not None:
                                    projection_dataset.lower = float(row['.lower'])
                                if row['scenario'] is not None:
                                    projection_dataset.scenario = row['scenario']

                                projection_dataset.save()

                    else:
                        message = 'Incorrect Header/s'
                else:
                    message = 'Only CSV Data Type is Allowed for Raw Dataset'

            else:
                result = Dataset.objects.create(description=description, data_type=int(data_type), cover=cover)

            
        except Exception as e:
            message = str(e)
        
        return JsonResponse({"message": message}, safe=False)        

class DatasetList(generics.ListAPIView):
    """Dataset List"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            data_type = ''
            if 'data_type' in request.GET:
                data_type = request.GET['data_type']

            if data_type == '':
                datasets = Dataset.objects.filter(data_type__lte=2, data_type__gte=1)
            else:
                datasets = Dataset.objects.filter(data_type=int(data_type))
                print('example')
                
            for _datasets in datasets:
                data_type = 'Raw'
                if _datasets.data_type == 2:
                    data_type = 'Projection'
                elif _datasets.data_type == 3:
                    data_type = 'Insights'

                result.append({
                    'id': _datasets.id,
                    'data_type': data_type,
                    'date_created':_datasets.date_created.strftime("%Y-%m-%d  %H:%M:%S"), 
                    'description': _datasets.description,
                    'added_by': 'admin',
                    'number_of_rows': _datasets.number_of_rows,
                    'cover': 'http://localhost:8000/media/{}'.format(str(_datasets.cover))
                })

            message = 'success'
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)


class DatasetDelete(generics.ListAPIView):
    """Delete Dataset"""

    def get(self, request, *args, **kwargs):
        try:
            id = request.GET['id']
            data_type = request.GET['data_type']

            delete_dataset = Dataset.objects.get(id=id)
            delete_dataset.delete()

            if data_type == 'Raw':
                raw_dataset = RawDataset.objects.get(dataset_id=id)
                raw_dataset.delete()
            elif data_type == 'Projection':
                projection_dataset = ProjectionDataset.objects.get(dataset_id=id)
                projection_dataset.delete()
            message = 'success'
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message}, safe=False)


class ScenarioAdd(generics.ListAPIView):
    """Add Scenario"""

    def post(self, request, *args, **kwargs):
        try:
            description = request.data['description']
            name = request.data['name']

            scenario_details = Scenario.objects.filter(scenario=name)

            if len(scenario_details) == 0:
                result = Scenario.objects.create(scenario=name, description=description)
            else:
                scenario_details = Scenario.objects.get(scenario=name)
                scenario_details.scenario = name
                scenario_details.description = description
                scenario_details.save()
            message = 'success'
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message}, safe=False)

class ScenarioAll(generics.ListAPIView):
    """All Scenario"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
           
            if 'unique' in request.GET:
                unique = request.GET['unique']
                scenario = ProjectionDataset.objects.values_list('scenario', flat=True)

                for details in set(scenario):
                    if float(details) > 0:
                        result.append(details)

            else:
                scenario = Scenario.objects.all()

                for _scenario in scenario:
                    result.append({
                        'id': _scenario.id,
                        'scenario': _scenario.scenario,
                        'description': _scenario.description,
                        'added_by': 'admin',
                        'date_created': _scenario.date_created.strftime("%Y-%m-%d  %H:%M:%S"),
                    })

            message = 'success'
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)


class ScenarioDelete(generics.ListAPIView):
    """Delete Scenario"""

    def get(self, request, *args, **kwargs):
        try:
            id = request.GET['id']

            scenario = Scenario.objects.get(id=id)
            scenario.delete()

            message = 'success'
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message}, safe=False)



class ScenarioDetails(generics.ListAPIView):
    """Get Scenario Information"""

    def get(self, request, *args, **kwargs):
        name = ""
        description = ''
        try:
            
            id = request.GET['id']

            scenario = Scenario.objects.filter(id=id)

            for _scenario in scenario:
                name = _scenario.scenario
                description = _scenario.description
                break

            message = 'success'
        except Exception as e:
            message = str(e)

        return JsonResponse({"name": name, "description": description, "message": message}, safe=False)


class CountryList(generics.ListAPIView):
    """All Country"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            if 'region' not in request.GET:
                country = Country.objects.all()

                for _country in country:
                    result.append(_country.country)
            else:
                region = Region.objects.all()

                for _region in region:
                    result.append({
                        'label': '{}, {}'.format(_region.region, _region.country.country),
                        'value': '{}'.format(_region.region)
                    })

            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)

class RegionList(generics.ListAPIView):
    """Region List"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            country = request.GET['country']
            region = Region.objects.filter(country__country=country)

            if 'multiple' in request.GET:
                for _region in region:
                    result.append({
                            'label': _region.region, 
                            'value': _region.region
                        })
            else:
                for _region in region:
                    result.append(_region.region)

            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)


class IndicatorList(generics.ListAPIView):
    """Indicators"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            indicator = Indicator.objects.all()

            if 'multiple' not in request.GET:
                for _indicator in indicator:
                    result.append(_indicator.name)
            else:
                for _indicator in indicator:
                    result.append({
                        'label':  _indicator.name, 
                        'value':  _indicator.name
                    })

            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)


class IndicatorValueList(generics.ListAPIView):
    """Indicators"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            country = request.GET['country']
            indicators = Indicator.objects.all()
            indicator_df = pd.DataFrame.from_records(indicators.values())
            raw_dataset = RawDataset.objects.filter(region__country__country=country)
            raw_dataset_df = pd.DataFrame.from_records(raw_dataset.values())

            raw_dataset_df_agg = raw_dataset_df.groupby(['indicator_id'])['value'].sum().reset_index()
            
            merge_data = indicator_df.merge(raw_dataset_df_agg, left_on='id', right_on='indicator_id')
            
            if 'multiple' in request.GET:
                for index, _merge_data in merge_data.iterrows():
                    result.append({
                        'label':  _merge_data['name'], 
                        'value':  _merge_data['name']
                    })
            else:
                for index, _merge_data in merge_data.iterrows():
                    result.append(_merge_data['name'])
            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)


class Projections(generics.ListAPIView):
    """Projection Query"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            region = request.GET['region']
            start_date = request.GET['start_date']
            end_date = request.GET['end_date']

            projection = ProjectionDataset.objects.filter(region__region=region, survey_date__range=[start_date, end_date])
            projection_df = pd.DataFrame.from_records(projection.values())

            details = {}
            details['details'] = {}

            scenario = projection_df['scenario'].unique()

            for _scenario in scenario: 
                details['details'][_scenario] = list()


            for dates in sorted(set(projection_df['survey_date'].unique())):
                current_data = projection_df[projection_df['survey_date']==dates]
                current_data['date'] = pd.to_datetime(dates)                
                current_data['date'] = current_data['date'].astype('int')

                for _scenario in scenario:
                    name = 'data'
                    if _scenario == '1':
                        name = 'scenario_1'
                    elif _scenario == '2':
                        name = 'scenario_2'

                    displacement = None
                    if _scenario in current_data['scenario'].values:
                        current_scenario = current_data[current_data['scenario']==_scenario].reset_index()
                        displacement= float(current_scenario['displacement'][0])

                    details['details'][_scenario].append([int(str(current_scenario['date'][0])[0:13]), displacement])

            for _keys in details['details'].keys():
                if float(_keys) == 0.0:
                    result.append({
                        'name': 'Current Displacement Data',
                        'data':  details['details'][_keys],
                    })
                else:
                    result.append({
                        'name': 'Projection {}'.format(_keys),
                        'data':  details['details'][_keys]
                    })
            result[2]['data'][0][1] = None

            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)


class WhatIf(generics.ListAPIView):
    """Raw Dataset Query"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            country = request.GET['country']
            area = request.GET['area']
            start_date = request.GET['start_date']
            end_date = request.GET['end_date']
            variables = request.GET['variables']
            
            details = dict()
            if 'scenario' not in request.GET:
                raw_dataset = RawDataset.objects.filter(region__region=area, survey_date__range=[start_date, end_date], indicator__name=variables)

                
                for data in raw_dataset:
                    if data.indicator.name not in details.keys():
                        details[data.indicator.name] = list()
                    
                    details[data.indicator.name].append([int(data.survey_date.strftime('%s')+"000"), float(data.value)])
            else:
                raw_dataset = RawDataset.objects.filter(region__region__in=ast.literal_eval(area), survey_date__range=[start_date, end_date], indicator__name=variables)

                for data in raw_dataset:
                    if data.region.region not in details.keys():
                        details[data.region.region] = list()
                    
                    details[data.region.region].append([int(data.survey_date.strftime('%s')+"000"), float(data.value)])


            for _details in details:
                
                result.append({
                    'name':  _details,
                    'data': details[_details]
                })

            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)

class WhatIf2(generics.ListAPIView):
    """Raw Dataset Query"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            country = request.GET['country']
            country = country.split(",")
            start_date = request.GET['start_date']
            end_date = request.GET['end_date']
            variables = request.GET['variables']
            
            details = dict()
            
            raw_dataset = RawDataset.objects.filter(region__region__in=country, survey_date__range=[start_date, end_date], indicator__name=variables)

                
            for data in raw_dataset:
                current_location = '{}, {}'.format(data.region.region,data.region.country.country )
                if current_location not in details.keys():
                    details[current_location] = list()
                    
                details[current_location].append([int(data.survey_date.strftime('%s')+"000"), float(data.value)])
            for _details in details:
                
                result.append({
                    'name':  _details,
                    'data': details[_details]
                })

            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)

class Correlation(generics.ListAPIView):
    """Raw Dataset Query"""

    def get(self, request, *args, **kwargs):
        result = list()
        try:
            indicators= request.GET['indicators']
            indicators = indicators.split(",")
            
            if 'region' not in request.GET:
                survey_date = RawDataset.objects.values('survey_date').distinct()

                indicators_dict = dict()
                indicators = Indicator.objects.filter(name__in=indicators) 
                data = pd.DataFrame()
                for _indicators_dict in indicators:
                    indicators_dict[_indicators_dict.id] = _indicators_dict.name
                    raw_dataset = RawDataset.objects.filter(indicator_id=_indicators_dict.id).values()
                    raw_dataset_df = pd.DataFrame(list(raw_dataset))
                    data[_indicators_dict.name] = raw_dataset_df['value'].astype(float)

                corr = data.corr().to_dict()
                categories = list(data.corr().to_dict().keys())

                for _data in categories:
                    current_index = categories.index(_data)
                    for current_correlation in corr[_data].keys():
                        result.append([current_index, categories.index(current_correlation), round(corr[_data][current_correlation], 2)])
            else:
                region = request.GET['region']
                survey_date = RawDataset.objects.filter(region__region=region).values('survey_date').distinct()
                indicators_dict = dict()
                indicators = Indicator.objects.filter(name__in=indicators) 
                data = pd.DataFrame()
                for _indicators_dict in indicators:
                    indicators_dict[_indicators_dict.id] = _indicators_dict.name
                    if region != 'All':
                        raw_dataset = RawDataset.objects.filter(indicator_id=_indicators_dict.id, region__country__country=region).values()
                    else:
                        raw_dataset = RawDataset.objects.filter(indicator_id=_indicators_dict.id).values()
                    raw_dataset_df = pd.DataFrame(list(raw_dataset))
                    raw_dataset_df = raw_dataset_df.fillna(0)
                    data[_indicators_dict.name] = raw_dataset_df['value'].astype(float)

                corr = data.corr().to_dict()
                categories = list(data.corr().to_dict().keys())

                for _data in categories:
                    current_index = categories.index(_data)
                    for current_correlation in corr[_data].keys():
                        value = 0
                        if math.isnan(corr[_data][current_correlation]) is not True:
                            value = round(corr[_data][current_correlation], 2) 
                        result.append([current_index, categories.index(current_correlation), value])

                    

           
            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)

class CountryData(generics.ListAPIView):
    """Raw Dataset Query"""

    def get(self, request, *args, **kwargs):
        result = dict()
        try:
            start_date = request.GET['start_date']
            variable = request.GET['variable']
            raw_dataset = RawDataset.objects.filter(survey_date=start_date, indicator__name=variable)
 
            for _raw_dataset in raw_dataset:
                result[_raw_dataset.region.region] = _raw_dataset.value
                
            message = 'success' 
        except Exception as e:
            message = str(e)

        return JsonResponse({"message": message, 'result': result}, safe=False)
        