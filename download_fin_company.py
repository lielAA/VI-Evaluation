import os
import urllib.request
import shutil


# download financials excel reports from https://stockrow.com
def download_finnacials(ticker):
    print("start downloads")
    location = "C:/Users/liela/PycharmProjects/valueInvesting/stock/financials/"
    base_url = "https://stockrow.com/api/companies/"
    # create local directory to store reports
    if not os.path.exists(location + ticker):
        os.makedirs(location + ticker)
    try:
        # download income_statement
        income_statemet_src = base_url + ticker +'/financials.xlsx?dimension=A&section=Income%20Statement&sort=desc'
        urllib.request.urlretrieve(income_statemet_src,  location + ticker + '/incomeStatement.xlsx')
        # download balance_sheet
        balance_sheet_src = base_url + ticker + '/financials.xlsx?dimension=A&section=Balance%20Sheet&sort=desc'
        urllib.request.urlretrieve(balance_sheet_src, location + ticker + '/balanceSheet.xlsx')
        # download metrics
        metrics_src = base_url + ticker + '/financials.xlsx?dimension=A&section=Metrics&sort=desc'
        urllib.request.urlretrieve(metrics_src, location + ticker + '/metrics.xlsx')
        print("end downloads")
    except:
        print("downloads failed")
        return "wrong ticker name"


# delete company reports after getting all required data
def delete_company_reports(ticker):
    location = "C:/Users/liela/PycharmProjects/valueInvesting/stock/financials/"
    try:
        shutil.rmtree(location + ticker)
    except OSError as e:
        print("folder not exist")














