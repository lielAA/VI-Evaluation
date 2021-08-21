var date = new Date();
var day = date.getDate();
var month = date.getMonth()+1;
var year = date.getFullYear();
var curr_date = day + "/" + month + "/" + year;
var long_company_name = "";
const company_list = [];
const company_raw_data_table_list = [];

// this function call to python with ticker name, and python returned list of tickers --> future feature
function get_ticker_list(){
    /*var ticker_name = $("#tickerName").val();
    let str_list = "";
    eel.get_ticker_list(ticker_name)(function(json_full_ticker_list){
        console.log(json_full_ticker_list);
        sort_list = JSON.parse(json_full_ticker_list);
        for(var i=0 ; i<sort_list.length ; i++){
            //console.log(sort_list[i]);
            str_list += sort_list[i] + ", ";
            console.log(str_list);
        }
        //$("tickerName").attr("data-autocomplete", str_list);

    });*/
}

// add company ticker to list with validation and info box
$("#btnAddCompany").click(function(){
    var ticker_name = $("#tickerName").val();
    // add only if ticker not in list
    if(!company_list.includes(ticker_name)){
        company_list.push(ticker_name);
        var new_company = Metro.getPlugin('#companyList', 'listview');
        // do not add empty input field
        if(Boolean(ticker_name)){
            eel.get_company_name(ticker_name)(function(com_name){
                window.value = com_name;
                if(com_name == "wrong ticker name"){
                    var message_info = "<h3>Error!</h3>" +
                                   "<p>" + ticker_name + " ticker is not exist, please insert valid company ticker!"
                    Metro.infobox.create(message_info, "alert");
                    delete_unvalid_ticker(ticker_name);
                }
                else{
                    $("#tickerTabs").append(`<li class="page-item" id=${ticker_name}><a id="button_link${ticker_name}"  href=${ticker_name} onclick="show_ticker_result(this)")>${ticker_name}</a></li>`);
                    $("#tabs_result").append(`<div class="page_${ticker_name}"></div>`);
                    new_company.add(null,{
                        caption: ticker_name,
                        icon: '<span class=\'mif-tag\'>',
                        date: curr_date,
                        name: com_name,
                    })
                }
            });
        }
    }
    else{
        company_list.pop(ticker_name);
        var message_info = "<h3>Warning!</h3>" +
                            "<p>" + ticker_name + " ticker is already exist!</p>";
        Metro.infobox.create(message_info, "warning");
    }
});

// show ticker table result --
function show_ticker_result(ticker){
    var ticker_name = $(ticker).attr('href');
    var section_ticker = ".page_" + ticker_name;
    var raw_data_table_id = "raw_table_" +  ticker_name;
    var growth_rate_table_id = "growth_table_" + ticker_name;
    show_only_table("#search_add_list_section", ticker_name);
    // create table only one time
    if(!company_raw_data_table_list.includes(raw_data_table_id)){
        company_raw_data_table_list.push(raw_data_table_id);

        eel.send_ticker_name(ticker_name)(function(json_raw_Data_cagar_and_growth_rate){
            data = json_raw_Data_cagar_and_growth_rate;
            // info box for wrong ticker name
            if(data == "wrong ticker name"){
                var message_info = "<h3>Error!</h3>" +
                                   "<p>" + ticker_name + " ticker is not exist, please insert valid company ticker!"
                Metro.infobox.create(message_info, "alert");
                delete_unvalid_ticker(ticker_name);
            }
            // info box for company with not enough data
            else if(data == "There is no enough data to evaluate the company"){
                var message_info = "<h3>Error!</h3>" +
                                    "<p>There is no enough data to evaluate " + ticker_name + " company ticker!</p>" +
                                    "<p>Please select company with at least 7 years data</p>";
                Metro.infobox.create(message_info, "alert");
                delete_unvalid_ticker(ticker_name);
            }
            // create table result
            else{
                 data = JSON.parse(data);
                 $(section_ticker).append("<h4>" + window.value + "  -  " + ticker_name + " </h4>");
                 $(section_ticker).append("<p style= text-align:center> <u><b>Raw Data<b><u> </p>");
                 create_raw_data_table(data, raw_data_table_id, section_ticker);

                 $(section_ticker).append("<p style=text-align:left> <u><b>Growth Rate %<b><u> </p>");

                 create_growth_rate_table(data, growth_rate_table_id, section_ticker);

            }
        });
    }
}

function create_raw_data_table(data, raw_data_table_id, section_ticker){
    //data = JSON.parse(data);
    // create table result and insert values
    var tbl = document.createElement("table");
    create_rows_in_table_raw(tbl);
    var tblBody = document.createElement("tbody");
    for (const prop in data["raw_Data_cagar"]){
        var i = 0;
        const param_name = prop;
        const parm_value = data["raw_Data_cagar"][prop]
        fill_raw_data_table(tbl, tblBody, param_name, parm_value, "raw_Data_cagar");
    }
    tbl.appendChild(tblBody);
    tbl.setAttribute("class", "table compact row-hover cell-border");
    tbl.setAttribute("id", raw_data_table_id);
    $(section_ticker).append(tbl);
    $(section_ticker).append("<br>");

}

function create_growth_rate_table(data, growth_rate_table_id, section_ticker){
    var div_table = document.createElement("div");
    var tbl = document.createElement("table");
    create_rows_in_table_growth(tbl);
    var tblBody = document.createElement("tbody");
    for (const prop in data["growth_rate_cagar"]){
        var i = 0;
        const param_name = prop;
        const parm_value = data["growth_rate_cagar"][prop]
        //console.log(param_name);
        //console.log(parm_value);
        fill_raw_data_table(tbl, tblBody, param_name, parm_value, "growth_rate_cagar");
    }
    tbl.appendChild(tblBody);
    tbl.setAttribute("class", "table compact row-hover cell-border");
    tbl.setAttribute("id", growth_rate_table_id);
    div_table.append(tbl);
    div_table.setAttribute("class", "grid cell-7");
    $(section_ticker).append(div_table);
}


// create first row of table with years
function create_rows_in_table_raw(tbl){
    var today = new Date();
    var year = today.getFullYear()-1;
    var tblHead= document.createElement("thead");
    var row_years = document.createElement("tr");

    var cell_year = document.createElement("th");
    var cellText_year = document.createTextNode("#");
    cell_year.appendChild(cellText_year);
    row_years.appendChild(cell_year);

    for(num_year = 0 ; num_year<8 ; num_year++)
    {
        cell_year = document.createElement("th");
        cellText_year = document.createTextNode(year);
        cell_year.appendChild(cellText_year);
        row_years.appendChild(cell_year);
        year -= 1
    }
    tbl.appendChild(tblHead);
    tblHead.appendChild(row_years);
}

function create_rows_in_table_growth(tbl){
    //var today = new Date();
    var year = 1;
    var tblHead= document.createElement("thead");
    var row_years = document.createElement("tr");

    var cell_year = document.createElement("th");
    var cellText_year = document.createTextNode("#");
    cell_year.appendChild(cellText_year);
    row_years.appendChild(cell_year);

    for(num_year = 0 ; num_year<4 ; num_year++)
    {
        cell_year = document.createElement("th");
        cellText_year = document.createTextNode(year+"-Years");
        cell_year.appendChild(cellText_year);
        row_years.appendChild(cell_year);
        year += 2;
    }
    tbl.appendChild(tblHead);
    tblHead.appendChild(row_years);

}

// create and add all parameters from excel reports to table
function fill_raw_data_table(tbl,tblBody, param_name, param_value, table_type){
    num_of_param_vlaue = Object.keys(param_value).length;
    var row_num = document.createElement("tr");

    var cell = document.createElement("td");
    var cellText = document.createTextNode(param_name);
    cell.appendChild(cellText);
    cell.setAttribute("style", "padding:8px; font-weight: bold;");
    row_num.appendChild(cell);

    for(val=0; val<num_of_param_vlaue; val++){
        cell = document.createElement("td");
        if(table_type == "growth_rate_cagar"){
            cellText = document.createTextNode(param_value[val] + "%");
            if(param_value[val] < 10){
                cell.setAttribute("class", "warning");
            }
        }
        else if(table_type == "raw_Data_cagar"){
            cellText = document.createTextNode(param_value[val]);
        }
        cell.appendChild(cellText);
        cell.setAttribute("style", "padding:8px;");
        row_num.appendChild(cell);
    }
    tblBody.appendChild(row_num);
}

// toggle between ticker tabs to show only relevant company table
function show_only_table(area_to_hide, ticker_name){
    var area_to_show = ".page_" + ticker_name;
    var button_disabled = "#" + "button_link" + ticker_name;
    $(area_to_hide).hide(700);
    // hide all opened tabs
    for(var i=0; i<company_list.length ; i++){
        var to_hide = ".page_" + company_list[i];
        var to_enabled = "#"+"button_link" + company_list[i];
        $(to_hide).hide(700);
        $(to_enabled).attr("class", "page-item");
    }

    $(area_to_show).show(700);
    // disabled current clicked tab
    $(button_disabled).attr("class", "page-item disabled");
}

// click 'my companies' button from menu, returned to tickers list page
function show_my_companies(){
    for(var i=0; i<company_list.length ; i++){
        var to_hide = ".page_" + company_list[i];
        var to_enabled = "#"+"button_link" + company_list[i];
        $(to_hide).hide(700);
        $(to_enabled).attr("class", "page-item");
    }
    $("#search_add_list_section").show(500);
}

// delete un-valid ticker follow to info box errors
function delete_unvalid_ticker(ticker_name){
    console.log(ticker_name);
    company_list.pop(ticker_name);
    ticker_name_tab_id = "#" + ticker_name;
    $(ticker_name_tab_id).remove();
    var list = Metro.getPlugin('#companyList', 'listview');
    var element = $(".current-select");
    list.del(element.each(function(index, elem){
        var each_element = $(this).find(".current");
    }));
}

// click '-' button to remove selected ticker from list
function remove_ticker(){
    var list = Metro.getPlugin('#companyList', 'listview');
    element = $(".current-select");
    list.del(element.each(function(index, elem){
        var each_element = $(this).find(".current");
    }));
}

// start loading activity
var progress = null;
eel.expose(start_loading);
function start_loading() {
    progress = Metro.activity.open({
        type: 'metro',
        style: 'color',
        overlayClickClose: true
    });
}

// stop loading activity
eel.expose(stop_loading);
function stop_loading(){
    Metro.activity.close(progress);
}
