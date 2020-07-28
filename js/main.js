$('#ModalLog').modal({show:false})

function findBootstrapEnvironment() {
    let envs = ['xs', 'sm', 'md', 'lg', 'xl'];

    let el = document.createElement('div');
    document.body.appendChild(el);

    let curEnv = envs.shift();

    for (let env of envs.reverse()) {
        el.classList.add(`d-${env}-none`);

        if (window.getComputedStyle(el).display === 'none') {
            curEnv = env;
            break;
        }
    }

    document.body.removeChild(el);
    return curEnv;
}

function rand_int(size){
    if (typeof(size) != 'number'){
        var x =  Math.floor(Math.random() * Object.keys(size).length);
    }
    else{
        var x = Math.floor(Math.random() * size);
    }
    return x
}

// format string function
if (!String.prototype.format) 
{
    String.prototype.format = function()
    {
        var args = arguments;
        if (typeof args[0] != "object")
        {
            return this.replace(/{\d+}/g, function(m)
            {
                var index = Number(m.replace(/\D/g, ""));
                return (args[index] ? args[index] : m);
            });
        }
        else 
        {
            var obj = args[0],
                keys = Object.keys(obj);

            return this.replace(/{\w+}/g, function(m)
            {
                var key = m.replace(/{|}/g, "");
                return (obj.hasOwnProperty(key) ? obj[key] : m);
            });
        }
    };
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            //callback(rawFile.responseText);
            var allText = rawFile.responseText;
            var value = JSON.stringify;
            callback(allText);
        }
    }
    rawFile.send(null);
}

function create_panel(scheme_data){
    // For each Group
    for (group in scheme_data){
        // if settings group
        if (group == "settings"){            
            var logo_dir = scheme_data["settings"]["logo_dir"]
            var iron_oracle = scheme_data["settings"]["iron_oracle"]

            if (iron_oracle){
                add_iron_oracle();
            }
            add_logo(logo_dir);
            continue;
        }
        else{
            var gp = scheme_data[group]
            var text_group = gp['text'];
            var color_group = gp['color'];
            var column = gp['column'];
            
            // set column to add group
            var attachTo = document.getElementById("col"+column);
            // create border
            var div_g = document.createElement("div");   // Create a <button> element
            div_g.className = 'border border-'+color_group+' p-1 mb-1 rounded';
            div_g.id = group;   
            
            // create label
            var label_g = document.createElement("label");
            label_g.className = 'badge badge-pill badge-'+color_group;
            label_g.innerText = text_group;
            div_g.appendChild(label_g);
                    
            // For each Button
            for (button in gp['buttons']){
                var btn = gp['buttons'][button];
                var text_button = btn['text'];                
                var icon_button = btn['icon'];
                var grouped_button = btn['grouped'];
                var grouped_color = btn['grouped_color'];
                
                // create button
                var temp_btn = document.createElement('button');
                temp_btn.className = 'btn btn-'+color_group+' btn-block btn-sm';
                temp_btn.type = 'button';
                var temp_icon = document.createElement('i');
                temp_icon.className = icon_button;
                temp_icon.setAttribute('aria-hidden', 'true');
                var temp_text = document.createTextNode(' '+text_button);
                // append elements
                temp_btn.appendChild(temp_icon);
                temp_btn.appendChild(temp_text);


                temp_btn.setAttribute("onclick", "table_choose("+JSON.stringify(btn)+")");
                div_g.appendChild(temp_btn);                                    
            }
            attachTo.appendChild(div_g);
        }
    }
    add_delete();  
};

function table_choose(field) {
    //Action function to make a random table value

    var grouped = field['grouped']; // if border in log
    var grouped_color = field['grouped_color']; // color to border in log
    var str_log = ''; // acumulate str to add in log
    // For each table
    for (table in field['tables']){
        var tb = field['tables'][table]; // table select
        var text_table = tb['text']; // value to bold print

        // if random table like many table names
        if (typeof(tb['table']) == 'string'){
            var name_table = tb['table'];
        }else{
            var name_table = tb['table'][rand_int(tb['table'])];
        }

        var repeat_table = tb['repeat']; // how many random values
        
        var str_temp = '';  // accumulate str
        // for each number of repeat      
        for (i of Array(repeat_table).keys()){
            var table_temp = table_data[name_table]; // take the table
            var idx = rand_int(table_temp); // random select index
            
            // if the value table is string
            if (typeof(table_temp[idx]) == 'string'){
                var table_text = table_temp[idx];
                // if special characteres for relationship between tables
                if (table_text.indexOf('##') == 0){
                    table_text = table_choose_recursive(table_text.substr(2))
                }
                str_temp += table_text;
                // if has more repeat, add ,
                if (i+1 < repeat_table){
                    str_temp += ', ';
                }
            }
            // if the value table is a list
            else{
                for (obj in table_temp[idx]){
                    var table_text = table_temp[idx][obj];
                    // if special characteres for relationship between tables
                    if (table_text.indexOf('##') == 0){
                        table_text = table_choose_recursive(table_text.substr(2))
                    }
                    str_temp +=  table_text+'<br/>';                    
                }
                // if has more repeat, add ,
                if (i+1 < repeat_table){
                    str_temp += ', ';
                }                
            }
        }
        // accumulate str_log
        str_log += '<div><strong>{0} -></strong> {1}</div>'.format(text_table, str_temp);
                   
    }
    // if grouped
    if (grouped){        
        str_log = '<div class="border border-{0} p-1 mb-1 mt-2 rounded">{1}</div>'.format(grouped_color, str_log)
    }
    // add in log
    insert_data(str_log);
}

function table_choose_recursive(field) {
    var rec_data = table_data[field];
    var temp_str = rec_data[rand_int(rec_data)];
    if (temp_str.indexOf('##') == 0){
        temp_str = table_choose_recursive(field.substr(2));
    }
    return temp_str;
}

function add_delete(){
    var str = "<div class='border border-danger p-1 mb-1 rounded'> \
        <label class='badge badge-pill badge-danger'>Limpar log</label> \
        <button type='button' class='btn btn-danger btn-block btn-sm' onclick='clear_log()'> \
            <i class='fas fa-trash fa-lg' aria-hidden='true'></i> Limpar</button> \
        </div>"

    document.getElementById('col2').innerHTML += str
}
function add_iron_oracle(){
    var str = " <div> \
            <h5><label class='badge badge-pill badge-dark'>Pergunte ao Oráculo</label></h5>\
        </div>\
        <button type='button' class='btn btn-dark btn-sm' onclick='orac(11, `Quase Certo`)'>\
            <i class='fas fa-thermometer-full fa-lg' aria-hidden='true'></i> Quase Certo</button>\
        <button type='button' class='btn btn-dark btn-sm' onclick='orac(26, `Provável`)'>\
            <i class='fas fa-thermometer-three-quarters fa-lg' aria-hidden='true'></i> Provável</button>\
        <button type='button' class='btn btn-dark btn-sm' onclick='orac(51, `50/50`)'>\
            <i class='fas fa-thermometer-half fa-lg' aria-hidden='true'></i> 50/50</button>\
        <button type='button' class='btn btn-dark btn-sm' onclick='orac(76, `Improvável`)'>\
            <i class='fas fa-thermometer-quarter fa-lg' aria-hidden='true'></i> Improvável</button>\
        <button type='button' class='btn btn-dark btn-sm' onclick='orac(91, `Pequena Chance`)'>\
            <i class='fas fa-thermometer-empty fa-lg' aria-hidden='true'></i> Pequena Chance</button>"
    document.getElementById('iron_oracle').innerHTML += str
}
function add_logo(img_dir){
    document.getElementById("logo").src = img_dir;
}

function reset_storage(){
    alert(':D')
    localStorage.clear();
}

function orac(perc, desc){
    console.log('entrou')
    var d100 = rand_int(100) +1
    if (d100 >= perc){
        var res = 'SIM'
        insert_data('<div class="border border-success p-1 mb-1 mt-2 rounded">'
                +'<strong>{0} -></strong> {1} -> {2}</div>'.format(desc, d100, res));
    }else{
        var res = 'NÃO'
        insert_data('<div class="border border-danger p-1 mb-1 mt-2 rounded">'
                +'<strong>{0} -></strong> {1} -> {2}</div>'.format(desc, d100, res));
    }
    
}

function insert_data(content){
    document.getElementById('log').innerHTML = '<div>'+content+'</div>' + document.getElementById('log').innerHTML;
    if (findBootstrapEnvironment() == 'xs'){
        document.getElementById('ModalLogBody').innerHTML  = content;
        $('#ModalLog').modal('show');
    }
}

function clear_log(){
    document.getElementById('log').innerHTML = ""
}
// https://icons8.com/pricing


async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (e) {
            console.log(`SW registration failed`);
        }
    }
}

window.addEventListener('load', () => {
    readTextFile("./data/ironsworn.json", function(text){
        if (localStorage.getItem("table_data") === null) {
            table_data = JSON.parse(text);
            localStorage.setItem('table_data', JSON.stringify(table_data));
        }
        else{
            table_data = JSON.parse(localStorage.getItem("table_data"));
        }
    });

    // Load scheme and 
    readTextFile("./data/scheme-ironsworn.json", function(text){
        if (localStorage.getItem("scheme_data") === null) {
            scheme_data = JSON.parse(text);
            localStorage.setItem('scheme_data', JSON.stringify(scheme_data));
        }
        else{
            scheme_data = JSON.parse(localStorage.getItem("scheme_data"));
        }
        create_panel(scheme_data);
    }); 

    registerSW();
})