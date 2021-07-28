import pandas as pd


def get_worksheet_data(xl):
    # determine number of pages and save dataframes in a dictionary.
    # loop through all worksheets in case new customers/worksheets are added
    result = {}
    counter = 0
    for name in xl.sheet_names:
        result[name] = pd.read_excel(xl, counter)
        counter += 1

    return result


def get_rate_prices(worksheet):
    # create a dict of rate types as keys to prices as values from Rate Price sheet
    result = worksheet.set_index(
        'Rate Name').to_dict('dict')['Price (£/kWh)']
    return result


def get_customer_usage(sheet_name, xl):
    # for each customer in each worksheet, produce a dictionary with their required data

    # get table further down the spreadsheet
    readings = pd.read_excel(xl, sheet_name=sheet_name,
                             skiprows=4, index_col='Rate Name').to_dict('index')
    # create a dictionary of the rate type with the difference between the
    # 1st and 2nd reading as a value
    customer_usage = {}
    for reading in readings:
        customer_usage[reading] = readings[reading][
            '2nd Reading (kWh)'] - readings[reading]['1st Reading (kWh)']
    return customer_usage


def get_customer_data(xl):

    # return all required customer data in a dictionary to be serialized as json
    worksheets = get_worksheet_data(xl)
    result = {}
    rate_prices = get_rate_prices(worksheets["Rate Price"])
    

    # loop all customer worksheets and extract necessary data
    for sheet in xl.sheet_names[:-2]:
        # CUSTOMER PERSONAL DATA
        details = worksheets[sheet].iloc[0:2, 0:2]
        name = details.columns[1]
        address = details.values[0][1]
        meter_number = details.values[1][1]

        # CUSTOMER ENERGY DATA
        energy_consumption = get_customer_usage(sheet, xl)
        
        # loop through rate differences and multiply by rates
        total_cost = 0

        for rate_difference in energy_consumption:

            total_cost += energy_consumption[rate_difference] * \
                rate_prices[rate_difference]

        # add all data to result dictionary with customer id as key
        result[sheet] = {"name": name,
                         "address": address, "meter_number": meter_number,
                         "energy_consumption": energy_consumption, "total_cost": total_cost}

    return result

