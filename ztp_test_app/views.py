from django.shortcuts import render
from django.http import JsonResponse

from .util import get_customer_data

import pandas as pd
import json

# Create your views here.


def index(request):

    return render(request, 'ztp_test_app/index.html')


def send_json_data(request):
    # get xl file from root directory and use to get customer data

    xl = pd.ExcelFile('./EnergyConsumptionDetail_updated.xlsx')


    return JsonResponse(json.loads(json.dumps({"results": get_customer_data(xl)})))
