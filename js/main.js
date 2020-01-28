var iron_data
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

//usage:
readTextFile("./data/ironsworn.json", function(text){
    iron_data = JSON.parse(text);
});

function choose(field, desc) {    
    if (field === 'acaoetema'){
        var acao = iron_data['acao'];
        var tema = iron_data['tema'];

        var idx1 = rand_int(acao);
        var idx2 = rand_int(tema);

        insert_data('<strong>Ação -></strong> {0} - <strong>Tema -></strong> {1}'.format(acao[idx1], tema[idx2]));
    }
    else if (field === 'npc_nomes1'){
        if (rand_int(2) === 0){
            var nome = iron_data['npc_nomes1'][rand_int(iron_data['npc_nomes1'])]
        }
        else{
            var nome = iron_data['npc_nomes2'][rand_int(iron_data['npc_nomes2'])]
        }
        insert_data('<strong>{0} -></strong> {1}'.format('NPC-Nome', nome))
    }
    else if (field === 'npc_completo'){
        if (rand_int(2) === 0){
            var nome = iron_data['npc_nomes1'][rand_int(iron_data['npc_nomes1'])]
        }
        else{
            var nome = iron_data['npc_nomes2'][rand_int(iron_data['npc_nomes2'])]
        }
        var background = iron_data['npc_background'][rand_int(iron_data['npc_background'])]
        var objetivo = iron_data['npc_objetivo'][rand_int(iron_data['npc_objetivo'])]
        var descritores = [iron_data['npc_descritor'][rand_int(iron_data['npc_descritor'])], 
                        iron_data['npc_descritor'][rand_int(iron_data['npc_descritor'])], 
                        iron_data['npc_descritor'][rand_int(iron_data['npc_descritor'])]]
        var disposicao = iron_data['npc_disposicao'][rand_int(iron_data['npc_disposicao'])]
        insert_data('<div class="border border-secondary p-1 mb-1 mt-2 rounded">' 
                        + '<div><strong>NPC -></strong>' + nome + '</div>'
                        + '<div><strong>Background -></strong>' + background + '</div>'
                        + '<div><strong>Objetivo -></strong>' + objetivo + '</div>'
                        + '<div><strong>Descritores -></strong>' + descritores + '</div>'
                        + '<div><strong>Disposição -></strong>' + disposicao + '</div>'
                        + '</div>');
    }
    else if (field === 'npc_carac'){
        var background = iron_data['npc_background'][rand_int(iron_data['npc_background'])]
        var objetivo = iron_data['npc_objetivo'][rand_int(iron_data['npc_objetivo'])]
        var descritores = [iron_data['npc_descritor'][rand_int(iron_data['npc_descritor'])], 
                        iron_data['npc_descritor'][rand_int(iron_data['npc_descritor'])], 
                        iron_data['npc_descritor'][rand_int(iron_data['npc_descritor'])]]
        var disposicao = iron_data['npc_disposicao'][rand_int(iron_data['npc_disposicao'])]
        insert_data('<div class="border border-secondary p-1 mb-1 mt-2 rounded">' 
        + '<div><strong>Background -></strong>' + background + '</div>'
        + '<div><strong>Objetivo -></strong>' + objetivo + '</div>'
        + '<div><strong>Descritores -></strong>' + descritores + '</div>'
        + '<div><strong>Disposição -></strong>' + disposicao + '</div>'
        + '</div>');
    }
    else if (field === 'npc_descritor'){
        var choices = iron_data[field]

        var idx1 = rand_int(choices);
        var idx2 = rand_int(choices);
        var idx3 = rand_int(choices);

        insert_data('<strong>{0} -></strong> {1}, {2}, {3}'.format('Descritores', choices[idx1], choices[idx2], choices[idx3]));
    }
    else if (field === 'loc_descritor'){
        var choices = iron_data[field]

        var idx1 = rand_int(choices);
        var idx2 = rand_int(choices);

        insert_data('<strong>{0}</strong> -> {1}, {2}'.format('Descritores', choices[idx1], choices[idx2]));
    }
    else if (field === 'loc_name_gen'){
        var pref = iron_data['loc_name_gen_pref'][rand_int(iron_data['loc_name_gen_pref'])];
        var suf = iron_data['loc_name_gen_suf'][rand_int(iron_data['loc_name_gen_suf'])];
        insert_data('<strong>{0}</strong> -> {1}{2}'.format(desc, pref, suf));
    }
    else if (field === 'loc_name'){
        var loc_var = iron_data['loc_name'][rand_int(iron_data['loc_name'])];
        var nome = iron_data[loc_var[0]][rand_int(iron_data[loc_var[0]])];
        var descricao = loc_var[1];
        var perguntas = loc_var[2];
        insert_data('<div class="border border-secondary p-1 mb-1 mt-2 rounded"><i><div>' + descricao + '</div><div>'+ perguntas +'</div></i><div><strong>Nome -></strong>' + nome + '</div></div>');
    }
    else if (field === 'loc_regiao'){
        var choices = iron_data[field];
        var index = rand_int(choices);
        insert_data('<img src="./data/map.png" class="img-fluid" alt="Responsive image"></img>'
        +'<div><strong>{0} -></strong> {1}</div>'.format(desc, choices[index]))
        
    }
    else{
        var choices = iron_data[field];
        var index = rand_int(choices);
        insert_data('<strong>{0} -></strong> {1}'.format(desc, choices[index]))
    } 
}


function orac(perc, desc){
    var d100 = rand_int(100) +1
    if (d100 >= perc){
        var res = 'SIM'
    }else{
        var res = 'NÃO'
    }
    insert_data('<div class="border border-danger p-1 mb-1 mt-2 rounded">'
                +'<strong>{0} -></strong> {1} -> {2}</div>'.format(desc, d100, res));
}

function insert_data(content){
    document.getElementById('log').innerHTML += '<div>'+content+'</div>'
    if (findBootstrapEnvironment() == 'xs'){
        document.getElementById('ModalLogBody').innerHTML  = content;
        $('#ModalLog').modal('show');
    }
}

function clear_log(){
    document.getElementById('log').innerHTML = ""
}