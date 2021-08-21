import eel
import time
from mainStockProgram import Company
import json
import yahoo_fin.stock_info as yf
#import requests_html


@eel.expose
def send_ticker_name(ticker_name):
    eel.start_loading()()
    raw_data_and_growth_rate = {}
    comp = Company(ticker_name)
    comp.initiate_params()
    # if ticker name is not exist
    if comp.tickerName == "wrong ticker name":
        eel.stop_loading()()
        return "wrong ticker name"
    # if company not exist at least  years in the market - there will be not enough data to evaluate it
    elif comp.tickerName == "no enough data":

        eel.stop_loading()()
        return "There is no enough data to evaluate the company"
    else:
        comp.get_financials_param(comp.sheet_bs, "Shareholders Equity (Total)")
        comp.get_financials_param(comp.sheet_is, "Revenue")
        comp.get_financials_param(comp.sheet_is, "Operating Income")
        comp.get_financials_param(comp.sheet_is, "Net Income Common")
        comp.get_financials_param(comp.sheet_is, "EPS (Diluted)")
        comp.get_financials_param(comp.sheet_mt, "Free Cash Flow per Share")

        json_raw_Data_cagar = json.dumps(comp.raw_Data_cagar, indent=1)
        json_growth_rate = json.dumps(comp.growthRate, indent=1)
        raw_data_and_growth_rate["raw_Data_cagar"] = comp.raw_Data_cagar
        raw_data_and_growth_rate["growth_rate_cagar"] = comp.growthRate
        json_raw_data_and_growth_rate = json.dumps(raw_data_and_growth_rate, indent=1)
        print(json_raw_data_and_growth_rate)
        comp.close_wb() # close excel work book
        time.sleep(1)
        eel.stop_loading()()
        return json_raw_data_and_growth_rate

# this function get ticker name from user input and return long name company
@eel.expose
def get_company_name(ticker_name):
    try:
        company_name = yf.get_quote_data(ticker_name)['longName']
        return company_name
    except:
        return "wrong ticker name"


@eel.expose
def get_ticker_list(sub_ticker):
    pass

# load nasdaq and dow_jones tickers --> future feature to autocomplete ticker list
"""
def load_list():
    nasdaq_list = yf.tickers_nasdaq()
    dow_jones_list = yf.tickers_dow()
    full_ticker_list = nasdaq_list + dow_jones_list
    global sorted_dict
    for char in list(string.ascii_uppercase):
        sorted_dict[char] = [i for i in full_ticker_list if i.startswith(char)]
    #eel.stop_loading()()
"""
sorted_dict = {}

eel.init('web')
try:
    eel.start('index.html', size=(1200, 900), port=0)   #python will select free ephemeral ports.
except (SystemExit, MemoryError, KeyboardInterrupt):
    print ("Program Exit, Save Logs if Needed")






