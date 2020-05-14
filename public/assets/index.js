'use strict';

window.addEventListener('load', function(wdw){

    (new Tab()).initialize();
    (new XHTTPUniversalCaller()).initialize();

});

class Tab {

    initialize(){
        const tabHeaders = document.querySelectorAll('.tab > .tab-headers > .tab-header');

        tabHeaders.forEach(tabHeader=>{
            tabHeader.addEventListener('click', function(e){
                let headers = tabHeader.parentElement.children;
                for (let i = 0; i < headers.length; i++){
                    if (headers[i] !== tabHeader && headers[i].classList.contains('active')){
                        headers[i].classList.remove('active');
                        let idContent = headers[i].dataset.tabContent;
                        let c = document.querySelector(`.tab .tab-content[data-tab-id-content='${idContent}']`);
                        c.classList.remove('active')
                    }
                }
                tabHeader.classList.add('active')
                let idContent = tabHeader.dataset.tabContent;
                let c = document.querySelector(`.tab .tab-content[data-tab-id-content='${idContent}']`);
                c.classList.add('active')
            })
        })
    }
}

class XHTTPUniversalCaller {

    initialize(){
        const buttonCallers = document.querySelectorAll('.method .call button');

        buttonCallers.forEach((btn)=>{
            btn.addEventListener('click', function(e){
                let url = btn.parentElement.querySelector('input[type="text"]').value;
                let doc = btn.parentElement.querySelector('textarea');
                let call = btn.parentElement.parentElement;
                let method = call.dataset.method;
                let response = call.querySelector('.response')

                if ( (method === 'POST' || method === 'PUT') && doc.value.trim().length === 0){
                    response.innerHTML = "Documento JSON é obrigatório";
                    doc.focus();
                    return;
                }

                try {
                    if (method === 'POST' || method === 'PUT')
                        JSON.parse(doc.value)
                } catch (err) {
                    response.innerHTML = "Formato JSON é inválido";
                    doc.focus();
                    return;
                }

                if ( (method === 'DELETE' || method === 'PUT') && url.endsWith('{_id}')){
                    response.innerHTML = "substitua o {_id} na url por um _id";
                    return;
                }

                const xhttp = new XMLHttpRequest();
        
                xhttp.onreadystatechange = function(e) {
                    if (this.readyState == XMLHttpRequest.DONE ) {
                        if (this.status >= 200 && this.status <= 299)
                            response.innerHTML = this.responseText;
                        else
                            response.innerHTML = this.responseText;
                    }

                };

                xhttp.onerror = function(e) {
                    console.log('erro', this)
                    response.innerHTML = '#Error\n' + this.responseText;
                };
                
                xhttp.open(method, url, true);
                xhttp.setRequestHeader("Content-type", "application/json");

                if ( method === 'POST' || method === 'PUT')
                    xhttp.send(doc.value);
                else 
                    xhttp.send();

                response.innerHTML = 'Solicitação Enviada!';
            })

        })
    }
}